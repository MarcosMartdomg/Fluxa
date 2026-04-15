import { Plus, Link2, MoreHorizontal, MessageCircle, X, Hand, MousePointer2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';
import projectsService from '../../../services/projects.service';

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

const CARD_WIDTH = 190;
const CARD_HEIGHT = 70;

const defaultCanvasState: CanvasState = {
  cards: [
    { id: '1', title: '1° Conexiones #1', subtitle: 'Connection block', x: 480, y: 120, kind: 'connection' },
    { id: '2', title: '2° Parts', subtitle: 'Action block', x: 480, y: 250, kind: 'action' },
  ],
  edges: [{ id: 'edge-1-2', from: '1', to: '2' }],
};

const ProjectCanvasPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, activeProject, setActiveProject } = useProject();

  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [viewport, setViewport] = useState({ x: 0, y: 0 });
  const [canvasZoom, setCanvasZoom] = useState(1);

  const [cards, setCards] = useState<CanvasCard[]>(defaultCanvasState.cards);
  const [edges, setEdges] = useState<CanvasEdge[]>(defaultCanvasState.edges);

  const [selectedCardIds, setSelectedCardIds] = useState<string[]>(['2']);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);

  const [panelMode, setPanelMode] = useState<'create' | 'edit' | null>(null);
  const [panelTab, setPanelTab] = useState<'content' | 'actions'>('actions');

  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardType, setNewCardType] = useState<CardKind>('trigger');
  const [newCardTrigger] = useState('Cuando un boton es clicado...');
  const [linkSource, setLinkSource] = useState('');
  const [linkTarget, setLinkTarget] = useState('');
  const [panelError, setPanelError] = useState('');

  const [activeTool, setActiveTool] = useState<'pan' | 'select'>('select');
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);

  const [mouseCanvasPosition, setMouseCanvasPosition] = useState({ x: 0, y: 0 });

  const selectedCardId =
    selectedCardIds.length > 0 ? selectedCardIds[selectedCardIds.length - 1] : null;

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedCardId) ?? null,
    [cards, selectedCardId],
  );

  const [panStart, setPanStart] = useState<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const [draggingCard, setDraggingCard] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [selectionRect, setSelectionRect] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    const projectInList = projects.find((project) => project.id === id);
    if (projectInList && activeProject?.id !== projectInList.id) {
      setActiveProject(projectInList);
    }
  }, [id, projects, activeProject?.id, setActiveProject]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const loadCanvas = async () => {
      try {
        const data = await projectsService.getCanvas(id);
        if (cancelled) return;

        const loadedCards = Array.isArray(data?.cards) ? (data.cards as CanvasCard[]) : [];
        const loadedEdges = Array.isArray(data?.edges) ? (data.edges as CanvasEdge[]) : [];

        if (loadedCards.length > 0) {
          setCards(loadedCards);
          setEdges(loadedEdges);

          const firstId = loadedCards[0]?.id;
          setSelectedCardIds(firstId ? [firstId] : []);
          setSelectedEdgeIds([]);
        } else {
          setCards(defaultCanvasState.cards);
          setEdges(defaultCanvasState.edges);

          const defaultId =
            defaultCanvasState.cards[1]?.id ?? defaultCanvasState.cards[0]?.id;
          setSelectedCardIds(defaultId ? [defaultId] : []);
          setSelectedEdgeIds([]);
        }
      } catch {
        if (cancelled) return;

        setCards(defaultCanvasState.cards);
        setEdges(defaultCanvasState.edges);

        const defaultId =
          defaultCanvasState.cards[1]?.id ?? defaultCanvasState.cards[0]?.id;
        setSelectedCardIds(defaultId ? [defaultId] : []);
        setSelectedEdgeIds([]);
      } finally {
        if (!cancelled) setIsCanvasLoaded(true);
      }
    };

    setIsCanvasLoaded(false);
    loadCanvas();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id || !isCanvasLoaded) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      projectsService.updateCanvas(id, { cards, edges }).catch(() => undefined);
    }, 450);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [id, cards, edges, isCanvasLoaded]);

  useEffect(() => {
    if (panelMode !== 'edit') return;

    const lastSelectedId = selectedCardIds[selectedCardIds.length - 1];
    const cardToEdit = cards.find((card) => card.id === lastSelectedId);
    if (!cardToEdit) return;

    setNewCardTitle(cardToEdit.title);
    setNewCardType(cardToEdit.kind);
    setPanelError('');
  }, [panelMode, cards, selectedCardIds]);

  const isPanelOpen = panelMode !== null;

  const bottomCard = useMemo(() => {
    if (cards.length === 0) return null;
    return [...cards].sort((a, b) => b.y - a.y)[0];
  }, [cards]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left - viewport.x) / canvasZoom;
        const mouseY = (event.clientY - rect.top - viewport.y) / canvasZoom;
        setMouseCanvasPosition({ x: mouseX, y: mouseY });
      }

      if (panStart) {
        setViewport({
          x: panStart.originX + event.clientX - panStart.startX,
          y: panStart.originY + event.clientY - panStart.startY,
        });
      }

      if (draggingCard && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left - viewport.x) / canvasZoom;
        const mouseY = (event.clientY - rect.top - viewport.y) / canvasZoom;

        setCards((previous) =>
          previous.map((card) =>
            card.id === draggingCard.id
              ? {
                ...card,
                x: mouseX - draggingCard.offsetX,
                y: mouseY - draggingCard.offsetY,
              }
              : card,
          ),
        );
      }

      if (selectionRect && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSelectionRect((prev) =>
          prev
            ? {
              ...prev,
              currentX: event.clientX - rect.left,
              currentY: event.clientY - rect.top,
            }
            : null,
        );
      }
    };

    const handleMouseUp = () => {
      if (selectionRect) {
        const width = Math.abs(selectionRect.currentX - selectionRect.startX);
        const height = Math.abs(selectionRect.currentY - selectionRect.startY);

        // Si apenas se ha movido, lo tratamos como click vacío, no como selección
        if (width < 4 && height < 4) {
          setSelectionRect(null);
          setPanStart(null);
          setDraggingCard(null);
          return;
        }

        const x1 = Math.min(selectionRect.startX, selectionRect.currentX);
        const y1 = Math.min(selectionRect.startY, selectionRect.currentY);
        const x2 = Math.max(selectionRect.startX, selectionRect.currentX);
        const y2 = Math.max(selectionRect.startY, selectionRect.currentY);

        const canvasX1 = (x1 - viewport.x) / canvasZoom;
        const canvasY1 = (y1 - viewport.y) / canvasZoom;
        const canvasX2 = (x2 - viewport.x) / canvasZoom;
        const canvasY2 = (y2 - viewport.y) / canvasZoom;

        const newlySelected = cards
          .filter((card) => {
            const cardX2 = card.x + CARD_WIDTH;
            const cardY2 = card.y + CARD_HEIGHT;

            return (
              card.x < canvasX2 &&
              cardX2 > canvasX1 &&
              card.y < canvasY2 &&
              cardY2 > canvasY1
            );
          })
          .map((c) => c.id);

        const newlySelectedEdges = edges
          .filter(
            (edge) =>
              newlySelected.includes(edge.from) && newlySelected.includes(edge.to),
          )
          .map((e) => e.id);

        setSelectedCardIds(newlySelected);
        setSelectedEdgeIds(newlySelectedEdges);
        setSelectionRect(null);
      }

      setPanStart(null);
      setDraggingCard(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    canvasZoom,
    draggingCard,
    panStart,
    viewport.x,
    viewport.y,
    selectionRect,
    cards,
    edges,
  ]);

  useEffect(() => {
    const blockBackMouseButton = (event: MouseEvent) => {
      if (event.button === 3) {
        event.preventDefault();
      }
    };

    window.addEventListener('mouseup', blockBackMouseButton, true);
    window.addEventListener('auxclick', blockBackMouseButton, true);

    return () => {
      window.removeEventListener('mouseup', blockBackMouseButton, true);
      window.removeEventListener('auxclick', blockBackMouseButton, true);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      const next = Math.min(
        2,
        Math.max(0.5, canvasZoom + (event.deltaY > 0 ? -0.08 : 0.08)),
      );
      setCanvasZoom(next);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel as EventListener);
  }, [canvasZoom]);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      const isControl = event.ctrlKey || event.metaKey;

      if (event.key === 'Delete' || event.key === 'Backspace') {
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName === 'INPUT' ||
          activeElement?.tagName === 'TEXTAREA'
        ) {
          return;
        }

        if (selectedCardIds.length > 0 || selectedEdgeIds.length > 0) {
          setCards((prev) => prev.filter((card) => !selectedCardIds.includes(card.id)));
          setEdges((prev) =>
            prev.filter(
              (edge) =>
                !selectedCardIds.includes(edge.from) &&
                !selectedCardIds.includes(edge.to) &&
                !selectedEdgeIds.includes(edge.id),
            ),
          );
          setSelectedCardIds([]);
          setSelectedEdgeIds([]);
        }
        return;
      }

      if (isControl && event.key.toLowerCase() === 'c') {
        if (selectedCardIds.length === 0) return;

        const selectedCards = cards.filter((c) => selectedCardIds.includes(c.id));
        const selectedEdges = edges.filter(
          (e) =>
            selectedEdgeIds.includes(e.id) ||
            (selectedCardIds.includes(e.from) && selectedCardIds.includes(e.to)),
        );

        if (selectedCards.length === 0) return;

        const minX = Math.min(...selectedCards.map((c) => c.x));
        const minY = Math.min(...selectedCards.map((c) => c.y));

        const payload = {
          type: 'fluxa-canvas-fragment',
          version: 1,
          origin: { x: minX, y: minY },
          cards: selectedCards,
          edges: selectedEdges,
        };

        try {
          await navigator.clipboard.writeText(JSON.stringify(payload));
        } catch (err) {
          console.error('Failed to copy to clipboard', err);
        }
        return;
      }

      if (isControl && event.key.toLowerCase() === 'v') {
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName === 'INPUT' ||
          activeElement?.tagName === 'TEXTAREA'
        ) {
          return;
        }

        try {
          const text = await navigator.clipboard.readText();
          const data = JSON.parse(text);

          if (data?.type === 'fluxa-canvas-fragment') {
            const pastedCards = data.cards as CanvasCard[];
            const pastedEdges = data.edges as CanvasEdge[];
            const origin = data.origin as { x: number; y: number };

            const idMap: Record<string, string> = {};

            const newCards: CanvasCard[] = pastedCards.map((card) => {
              const newId = crypto.randomUUID();
              idMap[card.id] = newId;

              return {
                ...card,
                id: newId,
                x: mouseCanvasPosition.x + (card.x - origin.x),
                y: mouseCanvasPosition.y + (card.y - origin.y),
              };
            });

            const newEdges: CanvasEdge[] = pastedEdges
              .filter((edge) => idMap[edge.from] && idMap[edge.to])
              .map((edge) => ({
                ...edge,
                id: crypto.randomUUID(),
                from: idMap[edge.from],
                to: idMap[edge.to],
              }));

            setCards((prev) => [...prev, ...newCards]);
            setEdges((prev) => [...prev, ...newEdges]);
            setSelectedCardIds(newCards.map((c) => c.id));
            setSelectedEdgeIds(newEdges.map((e) => e.id));
          }
        } catch (err) {
          console.error('Failed to paste from clipboard', err);
        }
        return;
      }

      if (isControl) {
        if (event.key === '+' || event.key === '=') {
          event.preventDefault();
          setCanvasZoom((previous) => Math.min(2, previous + 0.08));
        } else if (event.key === '-') {
          event.preventDefault();
          setCanvasZoom((previous) => Math.max(0.5, previous - 0.08));
        } else if (event.key === '0') {
          event.preventDefault();
          setCanvasZoom(1);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') setIsSpaceDown(false);
    };

    const handleBlur = () => setIsSpaceDown(false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [selectedCardIds, selectedEdgeIds, cards, edges, mouseCanvasPosition]);

  useEffect(() => {
    const handleGlobalSpace = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName === 'INPUT' ||
          activeElement?.tagName === 'TEXTAREA'
        ) {
          return;
        }
        event.preventDefault();
        setIsSpaceDown(true);
      }
    };

    window.addEventListener('keydown', handleGlobalSpace);
    return () => window.removeEventListener('keydown', handleGlobalSpace);
  }, []);

  const createCard = () => {
    const normalizedTitle = newCardTitle.trim();

    if (!normalizedTitle) {
      setPanelError('El titulo de la tarjeta es obligatorio.');
      return;
    }

    const nextIndex = cards.length + 1;
    const titleByType =
      newCardType === 'trigger'
        ? 'Trigger'
        : newCardType === 'action'
          ? 'Action'
          : 'Connection';

    const subtitleByType =
      newCardType === 'trigger'
        ? 'Trigger block'
        : newCardType === 'action'
          ? 'Action block'
          : 'Connection block';

    const createdId = crypto.randomUUID();

    setCards((previous) => [
      ...previous,
      {
        id: createdId,
        title: normalizedTitle || `${nextIndex}° ${titleByType}`,
        subtitle: subtitleByType,
        x: (520 - viewport.x) / canvasZoom,
        y: (160 - viewport.y) / canvasZoom + nextIndex * 30,
        kind: newCardType,
      },
    ]);

    setSelectedCardIds([createdId]);
    setSelectedEdgeIds([]);
    setNewCardTitle('');
    setPanelError('');
    setPanelMode('edit');
  };

  const saveSelectedCard = () => {
    if (!selectedCard) return;

    const normalizedTitle = newCardTitle.trim();
    if (!normalizedTitle) {
      setPanelError('El titulo de la tarjeta es obligatorio.');
      return;
    }

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

    setPanelError('');
  };

  const createConnection = () => {
    if (!linkSource || !linkTarget) {
      setPanelError('Debes elegir origen y destino para crear una conexion.');
      return;
    }

    if (linkSource === linkTarget) {
      setPanelError('El origen y destino no pueden ser la misma tarjeta.');
      return;
    }

    const duplicated = edges.some(
      (edge) => edge.from === linkSource && edge.to === linkTarget,
    );

    if (duplicated) {
      setPanelError('Esa conexion ya existe.');
      return;
    }

    const newEdgeId = crypto.randomUUID();

    setEdges((previous) => [
      ...previous,
      { id: newEdgeId, from: linkSource, to: linkTarget },
    ]);

    setSelectedEdgeIds([newEdgeId]);
    setLinkSource('');
    setLinkTarget('');
    setPanelError('');
  };

  const removeSelectedCard = () => {
    if (!selectedCardId) return;

    setCards((previous) => previous.filter((card) => card.id !== selectedCardId));
    setEdges((previous) =>
      previous.filter(
        (edge) => edge.from !== selectedCardId && edge.to !== selectedCardId,
      ),
    );

    setSelectedCardIds([]);
    setSelectedEdgeIds([]);
  };

  const getCardTheme = (
    kind: CardKind,
    isSelected: boolean,
    isPrimary: boolean,
  ) => {
    const activeBorder = isPrimary ? 'border-[#6366F1]' : 'border-indigo-400/60';
    const activeRing = isPrimary ? 'ring-2 ring-[#6366F1]/20' : 'ring-1 ring-indigo-400/20';

    if (kind === 'action') {
      return isSelected
        ? `${activeBorder} bg-[#2E3138] text-gray-100 ${activeRing}`
        : 'border-gray-800 bg-[#2E3138] text-gray-100';
    }

    if (kind === 'trigger') {
      return isSelected
        ? `${activeBorder} bg-white text-gray-800 ${activeRing}`
        : 'border-gray-300 bg-white text-gray-800';
    }

    return isSelected
      ? `${activeBorder} bg-[#EEF0FF] text-[#4B4EDB] ${activeRing}`
      : 'border-[#D8D8FB] bg-[#F5F5FF] text-[#4B4EDB]';
  };

  return (
    <div className="h-full bg-[#F6F6F8]">
      <div
        ref={containerRef}
        className={`relative h-full overflow-hidden bg-[#F3F3F5] ${panStart || isSpaceDown
            ? 'cursor-grabbing'
            : activeTool === 'pan'
              ? 'cursor-grab'
              : 'cursor-default'
          }`}
        onMouseDown={(event) => {
          const isPanning =
            event.button === 1 ||
            event.button === 3 ||
            isSpaceDown ||
            (event.button === 0 && activeTool === 'pan');

          if (isPanning) {
            if (event.button === 1 || event.button === 3 || isSpaceDown) {
              event.preventDefault();
            }

            setPanStart({
              startX: event.clientX,
              startY: event.clientY,
              originX: viewport.x,
              originY: viewport.y,
            });
            return;
          }

          if (event.button === 0) {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const startX = event.clientX - rect.left;
            const startY = event.clientY - rect.top;

            setSelectionRect({
              startX,
              startY,
              currentX: startX,
              currentY: startY,
            });

            if (!event.shiftKey) {
              setSelectedCardIds([]);
              setSelectedEdgeIds([]);
            }
          }
        }}
        onMouseMove={(event) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;

          const x = (event.clientX - rect.left - viewport.x) / canvasZoom;
          const y = (event.clientY - rect.top - viewport.y) / canvasZoom;
          setMouseCanvasPosition({ x, y });
        }}
        onAuxClick={(event) => {
          if (event.button === 1 || event.button === 3) {
            event.preventDefault();
          }
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(107,114,128,0.08) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${canvasZoom})`,
            transformOrigin: 'top left',
          }}
        >
          <svg className="pointer-events-none absolute left-0 top-0 h-[2400px] w-[2400px]">
            {edges.map((edge) => {
              const from = cards.find((card) => card.id === edge.from);
              const to = cards.find((card) => card.id === edge.to);
              if (!from || !to) return null;

              const isSelected = selectedEdgeIds.includes(edge.id);
              const startX = from.x + 95;
              const startY = from.y + 56;
              const endX = to.x + 95;
              const endY = to.y;
              const midY = (startY + endY) / 2;
              const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

              return (
                <g key={edge.id} className="pointer-events-auto cursor-pointer">
                  <path
                    d={path}
                    stroke={isSelected ? '#4B4EDB' : '#9CA3AF'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    fill="none"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (e.shiftKey) {
                        setSelectedEdgeIds((prev) =>
                          prev.includes(edge.id)
                            ? prev.filter((id) => id !== edge.id)
                            : [...prev, edge.id],
                        );
                      } else {
                        setSelectedCardIds([]);
                        setSelectedEdgeIds([edge.id]);
                      }
                    }}
                  />
                  <circle
                    cx={endX}
                    cy={endY}
                    r="4"
                    fill="#fff"
                    stroke={isSelected ? '#4B4EDB' : '#111827'}
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}
          </svg>

          {cards.map((card) => (
            <div
              key={card.id}
              className={`absolute w-[190px] cursor-grab rounded-sm border p-2 shadow-sm ${getCardTheme(
                card.kind,
                selectedCardIds.includes(card.id),
                selectedCardId === card.id,
              )}`}
              style={{ left: card.x, top: card.y }}
              onClick={(event) => {
                event.stopPropagation();

                if (event.shiftKey) {
                  setSelectedCardIds((prev) =>
                    prev.includes(card.id)
                      ? prev.filter((id) => id !== card.id)
                      : [...prev, card.id],
                  );
                } else {
                  setSelectedCardIds([card.id]);
                  setSelectedEdgeIds([]);
                }

                setPanelMode('edit');
              }}
              onMouseDown={(event) => {
                if (activeTool === 'pan' && event.button === 0) return;

                event.stopPropagation();
                if (!containerRef.current) return;

                const rect = containerRef.current.getBoundingClientRect();
                const localX = (event.clientX - rect.left - viewport.x) / canvasZoom;
                const localY = (event.clientY - rect.top - viewport.y) / canvasZoom;

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
                    className={`h-2 w-2 rounded-full ${card.kind === 'action'
                        ? 'bg-emerald-400'
                        : card.kind === 'trigger'
                          ? 'bg-indigo-500'
                          : 'bg-indigo-400'
                      }`}
                  />
                  <span className="truncate font-semibold">{card.title}</span>
                </div>
                <div className="flex items-center gap-1 opacity-70">
                  <MessageCircle className="h-3 w-3" />
                  <MoreHorizontal className="h-3 w-3" />
                </div>
              </div>
              <p
                className={`mt-1 text-[9px] ${card.kind === 'action' ? 'text-gray-300' : 'text-gray-500'
                  }`}
              >
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {selectionRect && (
          <div
            className="pointer-events-none absolute z-50 border border-[#6366F1] bg-[#6366F1]/10"
            style={{
              left: Math.min(selectionRect.startX, selectionRect.currentX),
              top: Math.min(selectionRect.startY, selectionRect.currentY),
              width: Math.abs(selectionRect.currentX - selectionRect.startX),
              height: Math.abs(selectionRect.currentY - selectionRect.startY),
            }}
          />
        )}

        {isPanelOpen && (
          <aside className="absolute right-0 top-0 z-30 h-full w-[320px] border-l border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <p className="text-sm font-semibold text-gray-700">
                {panelMode === 'create' ? 'Nueva tarjeta' : 'Editar tarjeta'}
              </p>
              <button
                className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
                onClick={() => {
                  setPanelMode(null);
                  setPanelError('');
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 border-b border-gray-200 text-sm">
              <button
                onClick={() => setPanelTab('content')}
                className={`px-4 py-2.5 font-medium ${panelTab === 'content'
                    ? 'border-b-2 border-[#6366F1] text-[#6366F1]'
                    : 'text-gray-500'
                  }`}
              >
                Contenido
              </button>
              <button
                onClick={() => setPanelTab('actions')}
                className={`px-4 py-2.5 font-medium ${panelTab === 'actions'
                    ? 'border-b-2 border-[#6366F1] text-[#6366F1]'
                    : 'text-gray-500'
                  }`}
              >
                Acciones
              </button>
            </div>

            <div className="space-y-4 px-4 py-4">
              <p className="text-[11px] leading-relaxed text-gray-400">
                {panelMode === 'create'
                  ? 'Define tipo y nombre para crear una nueva tarjeta en el flujo.'
                  : 'Edita el bloque seleccionado para ajustar su estructura visual.'}
              </p>

              {panelTab === 'content' ? (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      * Titulo de tarjeta
                    </label>
                    <input
                      value={newCardTitle}
                      onChange={(event) => {
                        setNewCardTitle(event.target.value);
                        if (panelError) setPanelError('');
                      }}
                      placeholder="Anadir titulo"
                      className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#6366F1]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      * Tipo de tarjeta
                    </label>
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
                      disabled={!newCardTitle.trim()}
                      className="h-10 w-full rounded-md bg-[#6366F1] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Crear tarjeta
                    </button>
                  ) : (
                    <button
                      onClick={saveSelectedCard}
                      disabled={!selectedCard || !newCardTitle.trim()}
                      className="h-10 w-full rounded-md bg-[#6366F1] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Guardar cambios
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      * Accion (requerida)
                    </label>
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
                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      * Trigger (requerida)
                    </label>
                    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                      <span className="text-xs text-gray-600">{newCardTrigger}</span>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        On
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      Conectar desde
                    </label>
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
                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      Conectar hacia
                    </label>
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

              {panelError && (
                <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  {panelError}
                </p>
              )}
            </div>
          </aside>
        )}

        <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2">
          <div className="pointer-events-auto rounded-lg border border-gray-200 bg-white p-1 text-xs shadow-sm">
            <button className="rounded-md bg-[#EEF0FF] px-4 py-1.5 font-semibold text-[#4B4EDB] shadow-inner">
              Editor
            </button>
            <button
              onClick={() => {
                if (!id) return;
                navigate(`/tool/projects/${id}/executions`);
              }}
              className="rounded-md px-4 py-1.5 text-gray-500 hover:bg-gray-50"
            >
              Ejecuciones
            </button>
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
              left: bottomCard.x * canvasZoom + viewport.x + 95 * canvasZoom - 16,
              top: bottomCard.y * canvasZoom + viewport.y + 78 * canvasZoom,
            }}
          >
            <Plus className="h-4 w-4" />
          </button>
        )}

        <div className="pointer-events-none absolute left-4 top-1/2 z-30 -translate-y-1/2">
          <div className="pointer-events-auto flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
            <button
              onClick={() => setActiveTool('pan')}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${activeTool === 'pan'
                  ? 'bg-[#EEF0FF] text-[#4B4EDB]'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              title="Mover canvas"
            >
              <Hand className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTool('select')}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${activeTool === 'select'
                  ? 'bg-[#EEF0FF] text-[#4B4EDB]'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              title="Seleccionar tarjeta"
            >
              <MousePointer2 className="h-4 w-4" />
            </button>

            <div className="h-px w-8 bg-gray-200" />

            <button
              onClick={() => {
                setPanelTab('content');
                setPanelMode('create');
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-50"
              title="Crear tarjeta"
            >
              <Plus className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                setPanelTab('actions');
                setPanelMode(selectedCard ? 'edit' : 'create');
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-50"
              title="Conectar tarjetas"
            >
              <Link2 className="h-4 w-4" />
            </button>

            <div className="mt-1 rounded-md bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">
              {Math.round(canvasZoom * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCanvasPage;