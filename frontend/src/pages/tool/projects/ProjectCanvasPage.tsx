import { Plus, Link2, MoreHorizontal, MessageCircle, X, Trash2, Hand, MousePointer2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';

type CardKind = 'trigger' | 'action' | 'connection';

type CanvasCard = {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  kind: CardKind;
};

type CanvasEdge = {
  id: string;
  from: string;
  to: string;
};

type CanvasState = {
  cards: CanvasCard[];
  edges: CanvasEdge[];
};

const defaultCanvasState: CanvasState = {
  cards: [
    { id: '1', title: '1° Conexiones #1', subtitle: 'Connection block', x: 480, y: 120, kind: 'connection' },
    { id: '2', title: '2° Parts', subtitle: 'Action block', x: 480, y: 250, kind: 'action' },
  ],
  edges: [{ id: 'edge-1-2', from: '1', to: '2' }],
};

const ProjectCanvasPage = () => {
  const { id } = useParams();
  const { projects, activeProject, setActiveProject } = useProject();
  const containerRef = useRef<HTMLDivElement>(null);
  const storageKey = useMemo(() => (id ? `fluxa:project-canvas:${id}` : null), [id]);

  const [viewport, setViewport] = useState({ x: 0, y: 0 });
  const [cards, setCards] = useState<CanvasCard[]>(defaultCanvasState.cards);
  const [edges, setEdges] = useState<CanvasEdge[]>(defaultCanvasState.edges);
  const [selectedCardId, setSelectedCardId] = useState<string | null>('2');
  const [panelMode, setPanelMode] = useState<'create' | 'edit' | null>(null);
  const [panelTab, setPanelTab] = useState<'content' | 'actions'>('actions');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardType, setNewCardType] = useState<CardKind>('trigger');
  const [newCardTrigger, setNewCardTrigger] = useState('Cuando un boton es clicado...');
  const [linkSource, setLinkSource] = useState('');
  const [linkTarget, setLinkTarget] = useState('');
  const [activeTool, setActiveTool] = useState<'pan' | 'select'>('pan');

  const [panStart, setPanStart] = useState<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [draggingCard, setDraggingCard] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    if (!id) return;
    const projectInList = projects.find((project) => project.id === id);
    if (projectInList && activeProject?.id !== projectInList.id) {
      setActiveProject(projectInList);
    }
  }, [id, projects, activeProject?.id, setActiveProject]);

  useEffect(() => {
    if (!storageKey) return;

    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      setCards(defaultCanvasState.cards);
      setEdges(defaultCanvasState.edges);
      setSelectedCardId(defaultCanvasState.cards[1]?.id ?? defaultCanvasState.cards[0]?.id ?? null);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as CanvasState;
      const nextCards = Array.isArray(parsed.cards) && parsed.cards.length > 0 ? parsed.cards : defaultCanvasState.cards;
      const nextEdges = Array.isArray(parsed.edges) ? parsed.edges : [];
      setCards(nextCards);
      setEdges(nextEdges);
      setSelectedCardId(nextCards[0]?.id ?? null);
    } catch {
      setCards(defaultCanvasState.cards);
      setEdges(defaultCanvasState.edges);
      setSelectedCardId(defaultCanvasState.cards[0]?.id ?? null);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    const state: CanvasState = { cards, edges };
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [cards, edges, storageKey]);

  useEffect(() => {
    if (panelMode !== 'edit') return;
    const cardToEdit = cards.find((card) => card.id === selectedCardId);
    if (!cardToEdit) return;
    setNewCardTitle(cardToEdit.title);
    setNewCardType(cardToEdit.kind);
  }, [panelMode, cards, selectedCardId]);

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedCardId) ?? null,
    [cards, selectedCardId],
  );
  const isPanelOpen = panelMode !== null;
  const bottomCard = useMemo(() => {
    if (cards.length === 0) return null;
    return [...cards].sort((a, b) => b.y - a.y)[0];
  }, [cards]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (panStart) {
        setViewport({
          x: panStart.originX + event.clientX - panStart.startX,
          y: panStart.originY + event.clientY - panStart.startY,
        });
      }

      if (draggingCard && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - rect.left - viewport.x;
        const mouseY = event.clientY - rect.top - viewport.y;
        setCards((previous) =>
          previous.map((card) =>
            card.id === draggingCard.id
              ? { ...card, x: mouseX - draggingCard.offsetX, y: mouseY - draggingCard.offsetY }
              : card,
          ),
        );
      }
    };

    const handleMouseUp = () => {
      setPanStart(null);
      setDraggingCard(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingCard, panStart, viewport.x, viewport.y]);

  const createCard = () => {
    const normalizedTitle = newCardTitle.trim();
    const nextIndex = cards.length + 1;
    const titleByType = newCardType === 'trigger' ? 'Trigger' : newCardType === 'action' ? 'Action' : 'Connection';
    const subtitleByType =
      newCardType === 'trigger' ? 'Trigger block' : newCardType === 'action' ? 'Action block' : 'Connection block';
    const createdId = crypto.randomUUID();

    setCards((previous) => [
      ...previous,
      {
        id: createdId,
        title: normalizedTitle || `${nextIndex}° ${titleByType}`,
        subtitle: subtitleByType,
        x: 520 - viewport.x,
        y: 160 - viewport.y + nextIndex * 30,
        kind: newCardType,
      },
    ]);
    setSelectedCardId(createdId);
    setNewCardTitle('');
    setPanelMode('edit');
  };

  const saveSelectedCard = () => {
    if (!selectedCard) return;
    const normalizedTitle = newCardTitle.trim();
    setCards((previous) =>
      previous.map((card) =>
        card.id === selectedCard.id
          ? {
              ...card,
              title: normalizedTitle || card.title,
              kind: newCardType,
            }
          : card,
      ),
    );
  };

  const createConnection = () => {
    if (!linkSource || !linkTarget || linkSource === linkTarget) return;
    const duplicated = edges.some((edge) => edge.from === linkSource && edge.to === linkTarget);
    if (duplicated) return;

    setEdges((previous) => [...previous, { id: crypto.randomUUID(), from: linkSource, to: linkTarget }]);
    setLinkSource('');
    setLinkTarget('');
  };

  const removeSelectedCard = () => {
    if (!selectedCardId) return;
    setCards((previous) => previous.filter((card) => card.id !== selectedCardId));
    setEdges((previous) => previous.filter((edge) => edge.from !== selectedCardId && edge.to !== selectedCardId));
    setSelectedCardId(null);
  };

  const getCardTheme = (kind: CardKind, selected: boolean) => {
    if (kind === 'action') {
      return selected
        ? 'border-[#6366F1] bg-[#2E3138] text-gray-100 ring-2 ring-[#6366F1]/20'
        : 'border-gray-800 bg-[#2E3138] text-gray-100';
    }

    if (kind === 'trigger') {
      return selected
        ? 'border-[#6366F1] bg-white text-gray-800 ring-2 ring-[#6366F1]/20'
        : 'border-gray-300 bg-white text-gray-800';
    }

    return selected
      ? 'border-[#6366F1] bg-[#EEF0FF] text-[#4B4EDB] ring-2 ring-[#6366F1]/20'
      : 'border-[#D8D8FB] bg-[#F5F5FF] text-[#4B4EDB]';
  };

  return (
    <div className="h-full bg-[#F6F6F8]">
      <div
        ref={containerRef}
        className="relative h-full overflow-hidden bg-[#F3F3F5]"
        onMouseDown={(event) => {
          if (event.button !== 0) return;
          if (activeTool !== 'pan') {
            setSelectedCardId(null);
            return;
          }
          setPanStart({
            startX: event.clientX,
            startY: event.clientY,
            originX: viewport.x,
            originY: viewport.y,
          });
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(107,114,128,0.08) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            transform: `translate(${viewport.x}px, ${viewport.y}px)`,
            transformOrigin: 'top left',
          }}
        >
          {isPanelOpen && (
            <aside className="absolute right-0 top-0 z-30 h-full w-[320px] border-l border-gray-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <p className="text-sm font-semibold text-gray-700">
                  {panelMode === 'create' ? 'Nueva tarjeta' : 'Editar tarjeta'}
                </p>
                <button
                  className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
                  onClick={() => setPanelMode(null)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 border-b border-gray-200 text-sm">
                <button
                  onClick={() => setPanelTab('content')}
                  className={`px-4 py-2.5 font-medium ${panelTab === 'content' ? 'border-b-2 border-[#6366F1] text-[#6366F1]' : 'text-gray-500'}`}
                >
                  Contenido
                </button>
                <button
                  onClick={() => setPanelTab('actions')}
                  className={`px-4 py-2.5 font-medium ${panelTab === 'actions' ? 'border-b-2 border-[#6366F1] text-[#6366F1]' : 'text-gray-500'}`}
                >
                  Acciones
                </button>
              </div>

              <div className="space-y-4 px-4 py-4">
                {panelTab === 'content' ? (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500">* Titulo de tarjeta</label>
                      <input
                        value={newCardTitle}
                        onChange={(event) => setNewCardTitle(event.target.value)}
                        placeholder="Anadir titulo"
                        className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#6366F1]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500">* Tipo de tarjeta</label>
                      <select
                        value={newCardType}
                        onChange={(event) => setNewCardType(event.target.value as CardKind)}
                        className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#6366F1]"
                      >
                        <option value="trigger">Trigger</option>
                        <option value="action">Accion</option>
                        <option value="connection">Conexion</option>
                      </select>
                    </div>
                    {panelMode === 'create' ? (
                      <button
                        onClick={createCard}
                        className="h-10 w-full rounded-md bg-[#6366F1] text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Crear tarjeta
                      </button>
                    ) : (
                      <button
                        onClick={saveSelectedCard}
                        disabled={!selectedCard}
                        className="h-10 w-full rounded-md bg-[#6366F1] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Guardar cambios
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500">* Accion (requerida)</label>
                      <select
                        value={newCardType}
                        onChange={(event) => setNewCardType(event.target.value as CardKind)}
                        className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#6366F1]"
                      >
                        <option value="trigger">Anadir un Trigger</option>
                        <option value="action">Anadir una Accion</option>
                        <option value="connection">Anadir una Conexion</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500">* Trigger (requerida)</label>
                      <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                        <span className="text-xs text-gray-600">{newCardTrigger}</span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">On</span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500">Conectar desde</label>
                      <select
                        value={linkSource}
                        onChange={(event) => setLinkSource(event.target.value)}
                        className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#6366F1]"
                      >
                        <option value="">Seleccionar origen</option>
                        {cards.map((card) => (
                          <option key={card.id} value={card.id}>
                            {card.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500">Conectar hacia</label>
                      <select
                        value={linkTarget}
                        onChange={(event) => setLinkTarget(event.target.value)}
                        className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#6366F1]"
                      >
                        <option value="">Seleccionar destino</option>
                        {cards.map((card) => (
                          <option key={card.id} value={card.id}>
                            {card.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={createConnection}
                      disabled={!linkSource || !linkTarget || linkSource === linkTarget}
                      className="h-10 w-full rounded-md border border-[#6366F1] text-sm font-semibold text-[#6366F1] transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Conectar tarjetas
                    </button>

                    <button
                      onClick={removeSelectedCard}
                      disabled={!selectedCard}
                      className="h-10 w-full rounded-md bg-[#6366F1] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Borrar Accion
                    </button>
                  </>
                )}
              </div>
            </aside>
          )}

          <svg className="absolute left-0 top-0 h-[2400px] w-[2400px] pointer-events-none">
            {edges.map((edge) => {
              const from = cards.find((card) => card.id === edge.from);
              const to = cards.find((card) => card.id === edge.to);
              if (!from || !to) return null;

              const startX = from.x + 95;
              const startY = from.y + 56;
              const endX = to.x + 95;
              const endY = to.y;
              const midY = (startY + endY) / 2;
              const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

              return (
                <g key={edge.id}>
                  <path d={path} stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
                  <circle cx={endX} cy={endY} r="4" fill="#fff" stroke="#111827" strokeWidth="1.5" />
                </g>
              );
            })}
          </svg>

          {cards.map((card) => (
            <div
              key={card.id}
              className={`absolute w-[190px] cursor-grab rounded-sm border p-2 shadow-sm ${getCardTheme(
                card.kind,
                selectedCardId === card.id,
              )}`}
              style={{ left: card.x, top: card.y }}
              onClick={(event) => {
                event.stopPropagation();
                setSelectedCardId(card.id);
                setPanelMode('edit');
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
                if (!containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                const localX = event.clientX - rect.left - viewport.x;
                const localY = event.clientY - rect.top - viewport.y;
                setDraggingCard({
                  id: card.id,
                  offsetX: localX - card.x,
                  offsetY: localY - card.y,
                });
              }}
            >
              <div className="flex items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-1">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      card.kind === 'action' ? 'bg-emerald-400' : card.kind === 'trigger' ? 'bg-indigo-500' : 'bg-indigo-400'
                    }`}
                  />
                  <span className="truncate font-semibold">{card.title}</span>
                </div>
                <div className="flex items-center gap-1 opacity-70">
                  <MessageCircle className="h-3 w-3" />
                  <MoreHorizontal className="h-3 w-3" />
                </div>
              </div>
              <p className={`mt-1 text-[9px] ${card.kind === 'action' ? 'text-gray-300' : 'text-gray-500'}`}>{card.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2">
          <div className="pointer-events-auto rounded-lg border border-gray-200 bg-white p-1 text-xs shadow-sm">
            <button className="rounded-md bg-[#EEF0FF] px-4 py-1.5 font-semibold text-[#4B4EDB] shadow-inner">
              Editor
            </button>
            <button className="rounded-md px-4 py-1.5 text-gray-500 hover:bg-gray-50">Ejecuciones</button>
          </div>
          <div className="mt-2 flex items-center justify-center gap-1 text-[11px] font-semibold text-[#4B4EDB]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
            Modo edicion activo
          </div>
        </div>

        {bottomCard && (
          <button
            onClick={() => {
              setPanelTab('content');
              setPanelMode('create');
            }}
            className="absolute inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#6366F1] bg-white text-[#6366F1] shadow transition hover:bg-indigo-50"
            title="Add connection card"
            style={{
              left: bottomCard.x + viewport.x + 95 - 16,
              top: bottomCard.y + viewport.y + 78,
            }}
          >
            <Plus className="h-4 w-4" />
          </button>
        )}

        <div className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2">
          <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
            <button
              onClick={() => setActiveTool('pan')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                activeTool === 'pan' ? 'bg-[#EEF0FF] text-[#4B4EDB]' : 'text-gray-600 hover:bg-gray-50'
              }`}
              title="Mover canvas"
            >
              <Hand className="h-3.5 w-3.5" />
              Mover
            </button>

            <button
              onClick={() => setActiveTool('select')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                activeTool === 'select' ? 'bg-[#EEF0FF] text-[#4B4EDB]' : 'text-gray-600 hover:bg-gray-50'
              }`}
              title="Seleccionar tarjeta"
            >
              <MousePointer2 className="h-3.5 w-3.5" />
              Seleccion
            </button>

            <div className="mx-1 h-5 w-px bg-gray-200" />

            <button
              onClick={() => {
                setPanelTab('content');
                setPanelMode('create');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
              title="Crear tarjeta"
            >
              <Plus className="h-3.5 w-3.5" />
              Tarjeta
            </button>

            <button
              onClick={() => {
                setPanelTab('actions');
                setPanelMode(selectedCard ? 'edit' : 'create');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
              title="Conectar tarjetas"
            >
              <Link2 className="h-3.5 w-3.5" />
              Conectar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCanvasPage;
