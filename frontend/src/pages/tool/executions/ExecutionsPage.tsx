import './ExecutionsPage.css';
import {
  CheckCircle2,
  Clock3,
  Loader2,
  PauseCircle,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../../../context/ProjectContext';
import projectsService from '../../../services/projects.service';
import ModeSwitcher from '../../../components/common/ModeSwitcher';

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

type ExecutionNodeStatus = 'idle' | 'running' | 'success' | 'error' | 'waiting';

type ExecutionStatus = 'running' | 'success' | 'error' | 'cancelled';

type ExecutionNodeState = {
  cardId: string;
  status: ExecutionNodeStatus;
  message?: string;
  durationMs?: number;
};

type WorkflowExecution = {
  id: string;
  status: ExecutionStatus;
  startedAt: string;
  finishedAt?: string;
  triggerType: 'manual' | 'webhook' | 'schedule';
  totalDurationMs?: number;
  nodeStates: ExecutionNodeState[];
};

const defaultCanvasState: CanvasState = {
  cards: [
    {
      id: '1',
      title: '1° Conexiones #1',
      subtitle: 'Connection block',
      x: 480,
      y: 120,
      kind: 'connection',
    },
    {
      id: '2',
      title: '2° Parts',
      subtitle: 'Action block',
      x: 480,
      y: 250,
      kind: 'action',
    },
  ],
  edges: [{ id: 'edge-1-2', from: '1', to: '2' }],
};

const mockExecutions: WorkflowExecution[] = [
  {
    id: 'exec-001',
    status: 'running',
    startedAt: '2026-04-13T09:10:00Z',
    triggerType: 'manual',
    nodeStates: [
      { cardId: '1', status: 'success', message: 'Trigger recibido', durationMs: 200 },
      { cardId: '2', status: 'running', message: 'Procesando acción actual...' },
    ],
  },
  {
    id: 'exec-002',
    status: 'success',
    startedAt: '2026-04-13T08:55:00Z',
    finishedAt: '2026-04-13T08:55:04Z',
    triggerType: 'webhook',
    totalDurationMs: 4200,
    nodeStates: [
      { cardId: '1', status: 'success', message: 'Trigger ejecutado', durationMs: 300 },
      { cardId: '2', status: 'success', message: 'Acción completada', durationMs: 1800 },
    ],
  },
  {
    id: 'exec-003',
    status: 'error',
    startedAt: '2026-04-13T08:30:00Z',
    finishedAt: '2026-04-13T08:30:02Z',
    triggerType: 'schedule',
    totalDurationMs: 2100,
    nodeStates: [
      { cardId: '1', status: 'success', message: 'Trigger ejecutado', durationMs: 180 },
      { cardId: '2', status: 'error', message: 'La acción falló por timeout', durationMs: 1500 },
    ],
  },
];

const formatDateTime = (value?: string) => {
  if (!value) return '-';

  try {
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const formatDuration = (ms?: number) => {
  if (!ms && ms !== 0) return '-';
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
};

const ExecutionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, activeProject, setActiveProject } = useProject();

  const [viewport] = useState({ x: 0, y: 0 });
  const [canvasZoom] = useState(1);

  const [cards, setCards] = useState<CanvasCard[]>(defaultCanvasState.cards);
  const [edges, setEdges] = useState<CanvasEdge[]>(defaultCanvasState.edges);
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);

  const [executions] = useState<WorkflowExecution[]>(mockExecutions);
  const [selectedExecutionId, setSelectedExecutionId] = useState<string>(mockExecutions[0]?.id ?? '');

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
        } else {
          setCards(defaultCanvasState.cards);
          setEdges(defaultCanvasState.edges);
        }
      } catch {
        if (cancelled) return;
        setCards(defaultCanvasState.cards);
        setEdges(defaultCanvasState.edges);
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

  const selectedExecution = useMemo(
    () => executions.find((execution) => execution.id === selectedExecutionId) ?? null,
    [executions, selectedExecutionId],
  );

  const executionNodeMap = useMemo(() => {
    if (!selectedExecution) return new Map<string, ExecutionNodeState>();
    return new Map(selectedExecution.nodeStates.map((node) => [node.cardId, node]));
  }, [selectedExecution]);

  const getExecutionBadge = (status: ExecutionStatus) => {
    if (status === 'running') return 'execution-badge execution-badge--running';
    if (status === 'success') return 'execution-badge execution-badge--success';
    if (status === 'error') return 'execution-badge execution-badge--error';
    return 'execution-badge execution-badge--idle';
  };

  const getNodeTheme = (card: CanvasCard, nodeState?: ExecutionNodeState | null) => {
    const status = nodeState?.status ?? 'idle';

    if (status === 'running') {
      return card.kind === 'action'
        ? 'canvas-node canvas-node--action canvas-node--running'
        : 'canvas-node canvas-node--running';
    }

    if (status === 'success') {
      return card.kind === 'action'
        ? 'canvas-node canvas-node--action canvas-node--success'
        : 'canvas-node canvas-node--success';
    }

    if (status === 'error') {
      return card.kind === 'action'
        ? 'canvas-node canvas-node--action canvas-node--error'
        : 'canvas-node canvas-node--error';
    }

    if (status === 'waiting') {
      return card.kind === 'action'
        ? 'canvas-node canvas-node--action canvas-node--waiting'
        : 'canvas-node canvas-node--waiting';
    }

    if (card.kind === 'action') return 'canvas-node canvas-node--action';
    if (card.kind === 'trigger') return 'canvas-node canvas-node--trigger';
    return 'canvas-node canvas-node--connection';
  };

  const getNodeStatusLabel = (status?: ExecutionNodeStatus) => {
    if (status === 'running') return 'Running';
    if (status === 'success') return 'Success';
    if (status === 'error') return 'Error';
    if (status === 'waiting') return 'Waiting';
    return 'Idle';
  };

  const getNodeStatusDot = (status?: ExecutionNodeStatus) => {
    if (status === 'running') return 'status-dot status-dot--running';
    if (status === 'success') return 'status-dot status-dot--success';
    if (status === 'error') return 'status-dot status-dot--error';
    if (status === 'waiting') return 'status-dot status-dot--waiting';
    return 'status-dot status-dot--idle';
  };

  const getEdgeColor = (edge: CanvasEdge) => {
    const fromState = executionNodeMap.get(edge.from)?.status;
    const toState = executionNodeMap.get(edge.to)?.status;

    if (fromState === 'error' || toState === 'error') return '#ef4444';
    if (fromState === 'running' || toState === 'running') return '#3b82f6';
    if (fromState === 'success' && toState === 'success') return '#10b981';
    if (fromState === 'waiting' || toState === 'waiting') return '#f59e0b';
    return '#9ca3af';
  };

  const getExecutionStatusIcon = (status: ExecutionStatus) => {
    if (status === 'running') return <Loader2 className="w-4 h-4 execution-spin" />;
    if (status === 'success') return <CheckCircle2 className="w-4 h-4" />;
    if (status === 'error') return <XCircle className="w-4 h-4" />;
    return <PauseCircle className="w-4 h-4" />;
  };

  return (
    <div className="executions-page">
      <div className="executions-layout">
        {/* --- Columna Izquierda: Historial --- */}
        <aside className="executions-history-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Ejecuciones</h2>
            <p className="sidebar-subtitle">Historial de runs del workflow</p>
          </div>

          <div className="history-list">
            {executions.map((execution) => {
              const isActive = execution.id === selectedExecutionId;
              return (
                <button
                  key={execution.id}
                  onClick={() => setSelectedExecutionId(execution.id)}
                  className={`history-card ${isActive ? 'active' : ''}`}
                >
                  <div className="history-card-top">
                    <span className="execution-id">{execution.id}</span>
                    <span className={getExecutionBadge(execution.status)}>
                      {getExecutionStatusIcon(execution.status)}
                    </span>
                  </div>
                  <div className="history-card-meta">
                    <span>{formatDateTime(execution.startedAt)}</span>
                    <span className="dot" />
                    <span>{formatDuration(execution.totalDurationMs)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* --- Columna Central: Canvas y Header --- */}
        <main className="executions-main relative">
          {id && <ModeSwitcher activeMode="executions" projectId={id} />}

          <div className="executions-content">
            {selectedExecution && (
              <div className="execution-status-header">
                <div className="status-main">
                  <div className={`status-icon-wrapper ${selectedExecution.status}`}>
                    {getExecutionStatusIcon(selectedExecution.status)}
                  </div>
                  <div>
                    <h1 className="status-title">
                      Ejecución {selectedExecution.status === 'running' ? 'en curso' : selectedExecution.status === 'success' ? 'completada' : 'fallida'}
                    </h1>
                    <p className="status-meta">
                      ID: {selectedExecution.id} • {selectedExecution.triggerType} • {formatDateTime(selectedExecution.startedAt)}
                    </p>
                  </div>
                </div>

                <div className="status-stats">
                  <div className="stat-item">
                    <span className="stat-label">Duración</span>
                    <span className="stat-value">{formatDuration(selectedExecution.totalDurationMs)}</span>
                  </div>
                  <div className="stat-actions">
                    <button className="btn-secondary">Logs</button>
                    <button className="btn-primary">Relanzar</button>
                  </div>
                </div>
              </div>
            )}

            <div className="executions-canvas-container">
              <div className="executions-canvas-wrapper">
                <div className="executions-canvas-label">
                  <span className="dot" />
                  Workflow Map
                </div>

                <div
                  className="executions-canvas-grid"
                  style={{
                    transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${canvasZoom})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <svg className="executions-svg-layer">
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
                      const stroke = getEdgeColor(edge);

                      return (
                        <g key={edge.id}>
                          <path d={path} stroke={stroke} strokeWidth="2" fill="none" />
                          <circle cx={endX} cy={endY} r="4" fill="#fff" stroke={stroke} strokeWidth="1.5" />
                        </g>
                      );
                    })}
                  </svg>

                  {cards.map((card) => {
                    const nodeState = executionNodeMap.get(card.id);
                    return (
                      <div
                        key={card.id}
                        className={getNodeTheme(card, nodeState)}
                        style={{ left: card.x, top: card.y }}
                      >
                        <div className="canvas-node__header">
                          <div className="canvas-node__title-group">
                            <span
                              className={`canvas-node__kind-dot ${card.kind === 'action'
                                  ? 'canvas-node__kind-dot--action'
                                  : card.kind === 'trigger'
                                    ? 'canvas-node__kind-dot--trigger'
                                    : 'canvas-node__kind-dot--connection'
                                }`}
                            />
                            <span className="canvas-node__title">{card.title}</span>
                          </div>
                          <div>
                            {nodeState?.status === 'running' ? (
                              <Loader2 className="w-3 h-3 execution-spin node-icon node-icon--running" />
                            ) : nodeState?.status === 'success' ? (
                              <CheckCircle2 className="w-3 h-3 node-icon node-icon--success" />
                            ) : nodeState?.status === 'error' ? (
                              <XCircle className="w-3 h-3 node-icon node-icon--error" />
                            ) : nodeState?.status === 'waiting' ? (
                              <Clock3 className="w-3 h-3 node-icon node-icon--waiting" />
                            ) : (
                              <PauseCircle className="w-3 h-3 node-icon node-icon--idle" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* --- Columna Derecha: Timeline y Detalle --- */}
        <aside className="executions-detail-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Traza de Ejecución</h2>
            <p className="sidebar-subtitle">Cronograma y detalles de nodos</p>
          </div>

          <div className="timeline-container">
            {selectedExecution ? (
              <div className="timeline-list">
                {cards.map((card, index) => {
                  const nodeState = executionNodeMap.get(card.id);
                  const isLast = index === cards.length - 1;

                  return (
                    <div key={card.id} className="timeline-item">
                      <div className="timeline-visual">
                        <div className={`timeline-dot ${nodeState?.status ?? 'idle'}`}>
                          {index + 1}
                        </div>
                        {!isLast && <div className="timeline-line" />}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-card">
                          <div className="timeline-card-header">
                            <span className="timeline-card-title">{card.title}</span>
                            <span className="timeline-card-duration">
                              {formatDuration(nodeState?.durationMs)}
                            </span>
                          </div>
                          <p className="timeline-card-msg">{nodeState?.message || 'Pendiente...'}</p>
                          {nodeState?.status && (
                            <div className={`timeline-card-status ${nodeState.status}`}>
                              {nodeState.status}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">Selecciona una ejecución para ver el detalle.</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExecutionsPage;