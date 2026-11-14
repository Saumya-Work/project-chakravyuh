"use client";

import React, { useState } from 'react';
import {
  Share2,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Link2,
} from 'lucide-react';
import { useChakravyuh } from '@/context/ChakravyuhContext';
import { GraphNode, GraphEdge } from '@/types/chakravyuh';

function getNodeColor(type: GraphNode['type']): { bg: string; border: string; text: string } {
  switch (type) {
    case 'Case':
      return { bg: '#1E293B', border: '#38BDF8', text: '#38BDF8' };
    case 'Person':
      return { bg: '#31102F', border: '#F43F5E', text: '#FDA4AF' };
    case 'Device':
      return { bg: '#0F292A', border: '#14B8A6', text: '#5EEAD4' };
    case 'Vehicle':
      return { bg: '#2A1F0D', border: '#F59E0B', text: '#FDE68A' };
    case 'Camera':
      return { bg: '#112240', border: '#60A5FA', text: '#93C5FD' };
    case 'Location':
      return { bg: '#1F1B38', border: '#A78BFA', text: '#DDD6FE' };
    case 'Witness':
      return { bg: '#14291E', border: '#10B981', text: '#6EE7B7' };
    default:
      return { bg: '#1E293B', border: '#94A3B8', text: '#E2E8F0' };
  }
}

function getEdgeStyle(classification: GraphEdge['classification']) {
  switch (classification) {
    case 'Verified relationship':
      return { stroke: '#10B981', dash: 'none', width: 2.5 };
    case 'Observed association':
      return { stroke: '#0EA5E9', dash: 'none', width: 2 };
    case 'AI-suggested relationship':
      return { stroke: '#F59E0B', dash: '7 5', width: 2.2 };
    case 'Rejected relationship':
      return { stroke: '#EF4444', dash: '3 5', width: 2 };
  }
}

export const RelationshipExplorerModule: React.FC = () => {
  const { graphNodes, graphEdges, setActiveModule } = useChakravyuh();

  const [nodes, setNodes] = useState<GraphNode[]>(graphNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('CASE-CKV-2026-0042');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>('EDGE-06');
  const [filterClassification, setFilterClassification] = useState<string>('ALL');
  const [zoom, setZoom] = useState<number>(1);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const selectedEdge = graphEdges.find((e) => e.id === selectedEdgeId) || null;

  const visibleEdges = graphEdges.filter(
    (e) => filterClassification === 'ALL' || e.classification === filterClassification
  );

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingNodeId) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 960;
    const y = ((e.clientY - rect.top) / rect.height) * 540;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === draggingNodeId
          ? { ...n, x: Math.max(70, Math.min(890, x)), y: Math.max(45, Math.min(495, y)) }
          : n
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
            <Share2 className="w-4 h-4" />
            <span>Part 7 Capability • Interactive Relationship Explorer & Provenance Graph</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Multi-Entity Investigative Link & Contradiction Graph
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore verified links, observed associations, AI-suggested leads, and rejected hypotheses. A graph connection must never imply guilt by association.
          </p>
        </div>

        {/* Relationship Classification Filter */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#090D16] p-1.5 rounded-xl border border-[#22314E] text-xs">
          {[
            { id: 'ALL', label: 'All Links (13)' },
            { id: 'Verified relationship', label: 'Verified' },
            { id: 'Observed association', label: 'Observed' },
            { id: 'AI-suggested relationship', label: 'AI-Suggested' },
            { id: 'Rejected relationship', label: 'Rejected / Contradicted' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterClassification(f.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                filterClassification === f.id
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Safeguard Callout */}
      <div className="bg-[#10192B] border border-amber-500/40 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>
            <b>Investigative Safeguard:</b> A graph connection represents a documented observation or analytical hypothesis—never guilt by association. Click any node or edge to inspect source evidence and limitations.
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-400 shrink-0 hidden md:inline">
          Drag nodes to rearrange layout
        </span>
      </div>

      {/* MAIN GRAPH + INSPECTOR SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive SVG Force/Tactical Graph Canvas */}
        <div className="lg:col-span-8 bg-[#090D16] border border-[#22314E] rounded-xl overflow-hidden relative flex flex-col">
          {/* Top Canvas Controls */}
          <div className="bg-[#0F1624] border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 bg-emerald-400 inline-block" />
                <span className="text-emerald-300">Verified Relationship</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 bg-sky-400 inline-block" />
                <span className="text-sky-300">Observed Association</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 border-b-2 border-dashed border-amber-400 inline-block" />
                <span className="text-amber-300">AI-Suggested Lead</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 border-b-2 border-dotted border-rose-500 inline-block" />
                <span className="text-rose-300">Rejected / Contradicted</span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
                className="p-1.5 rounded bg-[#090D16] hover:bg-slate-800 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
                className="p-1.5 rounded bg-[#090D16] hover:bg-slate-800 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setNodes(graphNodes);
                  setZoom(1);
                }}
                className="p-1.5 rounded bg-[#090D16] hover:bg-slate-800 text-slate-300"
                title="Reset Layout"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive SVG Graph */}
          <div className="relative h-[530px] w-full overflow-hidden select-none">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#38BDF8 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <svg
              viewBox="0 0 960 540"
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onMouseMove={handleSvgMouseMove}
              onMouseUp={() => setDraggingNodeId(null)}
              onMouseLeave={() => setDraggingNodeId(null)}
            >
              <g transform={`scale(${zoom})`}>
                {/* Render Edges */}
                {visibleEdges.map((edge) => {
                  const src = nodes.find((n) => n.id === edge.source);
                  const tgt = nodes.find((n) => n.id === edge.target);
                  if (!src || !tgt) return null;

                  const style = getEdgeStyle(edge.classification);
                  const isEdgeSelected = selectedEdgeId === edge.id;
                  const midX = (src.x + tgt.x) / 2;
                  const midY = (src.y + tgt.y) / 2;

                  return (
                    <g
                      key={edge.id}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setSelectedEdgeId(edge.id);
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Invisible wider hit line for easy clicking */}
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={tgt.x}
                        y2={tgt.y}
                        stroke="transparent"
                        strokeWidth="16"
                      />
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={tgt.x}
                        y2={tgt.y}
                        stroke={style.stroke}
                        strokeWidth={isEdgeSelected ? style.width + 1.8 : style.width}
                        strokeDasharray={style.dash}
                        opacity={isEdgeSelected ? 1 : 0.8}
                      />
                      {/* Edge Label Pill */}
                      <rect
                        x={midX - 58}
                        y={midY - 10}
                        width="116"
                        height="20"
                        rx="5"
                        fill={isEdgeSelected ? '#0EA5E9' : '#0F172A'}
                        stroke={style.stroke}
                        strokeWidth={isEdgeSelected ? '1.5' : '1'}
                      />
                      <text
                        x={midX}
                        y={midY + 3.5}
                        textAnchor="middle"
                        fill={isEdgeSelected ? '#090D16' : '#E2E8F0'}
                        fontSize="9.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {edge.relationshipType}
                      </text>
                    </g>
                  );
                })}

                {/* Render Nodes */}
                {nodes.map((node) => {
                  const colors = getNodeColor(node.type);
                  const isSelected = node.id === selectedNodeId;
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onMouseDown={(ev) => {
                        ev.stopPropagation();
                        setSelectedNodeId(node.id);
                        setDraggingNodeId(node.id);
                      }}
                      className="cursor-pointer"
                    >
                      <rect
                        x="-72"
                        y="-24"
                        width="144"
                        height="48"
                        rx="10"
                        fill={colors.bg}
                        stroke={isSelected ? '#FFFFFF' : colors.border}
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                      />
                      <text
                        x="0"
                        y="-6"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {node.label}
                      </text>
                      <text
                        x="0"
                        y="9"
                        textAnchor="middle"
                        fill={colors.text}
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        [{node.type}] {node.subLabel.slice(0, 18)}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>

        {/* Right 4 Cols: Selected Node & Selected Edge Provenance Panels */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Node Details */}
          <div className="bg-[#141D2F] border border-sky-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <div className="text-[10px] font-mono text-sky-400 uppercase">
                  SELECTED ENTITY NODE
                </div>
                <h3 className="text-base font-bold text-white">{selectedNode.label}</h3>
                <div className="text-xs text-slate-400">{selectedNode.subLabel}</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#090D16] border border-slate-700 text-xs font-mono text-teal-300">
                {selectedNode.type}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Current Status</div>
                <div className="text-white font-semibold mt-0.5">{selectedNode.status}</div>
              </div>

              <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Documented Details</div>
                <p className="text-slate-200 mt-0.5 leading-relaxed">{selectedNode.details}</p>
              </div>

              <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30">
                <div className="text-[10px] font-mono text-amber-300 uppercase">
                  Entity Limitations
                </div>
                <p className="text-slate-200 mt-0.5 leading-relaxed">{selectedNode.limitations}</p>
              </div>
            </div>
          </div>

          {/* Selected Edge / Relationship Details */}
          {selectedEdge ? (
            <div className="bg-[#141D2F] border border-teal-500/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <div className="text-[10px] font-mono text-teal-400 uppercase flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5" />
                    <span>SELECTED RELATIONSHIP EDGE</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    {selectedEdge.source} → [{selectedEdge.relationshipType}] → {selectedEdge.target}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400">Classification:</span>
                  <span
                    className={`font-mono font-bold ${
                      selectedEdge.classification === 'Verified relationship'
                        ? 'text-emerald-400'
                        : selectedEdge.classification === 'AI-suggested relationship'
                        ? 'text-amber-400'
                        : selectedEdge.classification === 'Rejected relationship'
                        ? 'text-rose-400'
                        : 'text-sky-400'
                    }`}
                  >
                    {selectedEdge.classification}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400">Source Evidence:</span>
                  <span className="font-mono text-sky-300">{selectedEdge.sourceEvidence}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400">Observation Time:</span>
                  <span className="font-mono text-white">{selectedEdge.observationTime}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400">Reliability Tier:</span>
                  <span className="text-teal-300 font-medium">{selectedEdge.reliability}</span>
                </div>

                <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30">
                  <div className="text-[10px] font-mono text-amber-300 uppercase mb-0.5">
                    Relationship Limitations
                  </div>
                  <p className="text-slate-200 leading-relaxed">{selectedEdge.limitations}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4 text-xs text-slate-400 text-center">
              Click any relationship edge line on the graph to inspect its evidence provenance and limitations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


