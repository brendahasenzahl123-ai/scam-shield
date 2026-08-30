import React, { useState, useRef, useEffect, useCallback } from "react";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";

// FIPS code → state abbreviation
const FIPS_TO_ABBR = {
  "01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT","10":"DE","11":"DC",
  "12":"FL","13":"GA","15":"HI","16":"ID","17":"IL","18":"IN","19":"IA","20":"KS","21":"KY",
  "22":"LA","23":"ME","24":"MD","25":"MA","26":"MI","27":"MN","28":"MS","29":"MO","30":"MT",
  "31":"NE","32":"NV","33":"NH","34":"NJ","35":"NM","36":"NY","37":"NC","38":"ND","39":"OH",
  "40":"OK","41":"OR","42":"PA","44":"RI","45":"SC","46":"SD","47":"TN","48":"TX","49":"UT",
  "50":"VT","51":"VA","53":"WA","54":"WV","55":"WI","56":"WY",
};

// Heat color: green (low) → yellow → orange → dark red (high)
function getHeatColor(reports) {
  if (reports >= 4000) return "#7f1d1d";
  if (reports >= 3000) return "#b91c1c";
  if (reports >= 2000) return "#dc2626";
  if (reports >= 1500) return "#ea580c";
  if (reports >= 1000) return "#d97706";
  if (reports >= 700)  return "#ca8a04";
  if (reports >= 400)  return "#65a30d";
  return "#15803d";
}

function getThreatLevel(reports) {
  if (reports >= 3000) return "Critical";
  if (reports >= 1500) return "High";
  if (reports >= 700)  return "Moderate";
  return "Low";
}

export default function USChoroplethMap({ stateData, onStateClick, selectedState }) {
  const svgRef = useRef(null);
  const [topology, setTopology] = useState(null);
  const [tooltip, setTooltip] = useState(null); // { x, y, abbr }
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef(null);

  // Load us-atlas topology
  useEffect(() => {
    import("us-atlas/states-10m.json").then((mod) => {
      setTopology(mod.default || mod);
    });
  }, []);

  const WIDTH = 960;
  const HEIGHT = 600;

  const projection = geoAlbersUsa().scale(1280).translate([WIDTH / 2, HEIGHT / 2]);
  const pathGenerator = geoPath().projection(projection);

  const states = topology ? feature(topology, topology.objects.states).features : [];

  // Centroid for state label placement
  const getCentroid = useCallback((feature) => {
    return pathGenerator.centroid(feature);
  }, [pathGenerator]);

  // Zoom handlers
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.85 : 1.18;
    setTransform(t => {
      const newK = Math.min(8, Math.max(1, t.k * delta));
      return { ...t, k: newK };
    });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning || !panStart.current) return;
    setTransform(t => ({
      ...t,
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    }));
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    panStart.current = null;
  };

  const handleReset = () => setTransform({ x: 0, y: 0, k: 1 });

  // Small states that can't show labels
  const SMALL_STATES = new Set(["CT","DE","DC","HI","MA","MD","NH","NJ","RI","VT"]);

  return (
    <div className="relative w-full select-none">
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => setTransform(t => ({ ...t, k: Math.min(8, t.k * 1.3) }))}
          className="w-8 h-8 bg-white border border-border rounded-lg shadow-sm flex items-center justify-center text-sm font-bold hover:bg-muted transition-colors"
        >+</button>
        <button
          onClick={() => setTransform(t => ({ ...t, k: Math.max(1, t.k * 0.77) }))}
          className="w-8 h-8 bg-white border border-border rounded-lg shadow-sm flex items-center justify-center text-sm font-bold hover:bg-muted transition-colors"
        >−</button>
        <button
          onClick={handleReset}
          className="w-8 h-8 bg-white border border-border rounded-lg shadow-sm flex items-center justify-center text-xs hover:bg-muted transition-colors"
          title="Reset view"
        >⊙</button>
      </div>

      {/* Tooltip */}
      {tooltip && stateData[tooltip.abbr] && (
        <div
          className="absolute z-20 pointer-events-none bg-popover border border-border rounded-xl shadow-xl px-3 py-2.5 text-xs max-w-[200px]"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <p className="font-bold text-sm mb-1">{stateData[tooltip.abbr].name}</p>
          <p className="text-muted-foreground mb-0.5">
            <span className="font-semibold text-foreground">{stateData[tooltip.abbr].reports.toLocaleString()}</span> reports
          </p>
          <p className="text-muted-foreground mb-0.5">
            Top scam: <span className="font-medium text-foreground">{stateData[tooltip.abbr].topScam}</span>
          </p>
          <p>
            <span
              className="inline-block px-1.5 py-0.5 rounded-md text-[10px] font-bold"
              style={{ background: getHeatColor(stateData[tooltip.abbr].reports) + "22", color: getHeatColor(stateData[tooltip.abbr].reports) }}
            >
              {getThreatLevel(stateData[tooltip.abbr].reports)} Threat
            </span>
          </p>
        </div>
      )}

      {/* SVG Map */}
      <div
        className="w-full overflow-hidden rounded-xl bg-slate-50 border border-border"
        style={{ cursor: isPanning ? "grabbing" : "grab", aspectRatio: "960/620" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT + 20}`}
          className="w-full h-full"
          style={{ display: "block" }}
        >
          {/* Ocean background */}
          <rect width={WIDTH} height={HEIGHT + 20} fill="#e8f4f8" />

          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}
             style={{ transformOrigin: `${WIDTH / 2}px ${HEIGHT / 2}px` }}>
            {/* State fills */}
            {states.map((s) => {
              const fips = String(s.id).padStart(2, "0");
              const abbr = FIPS_TO_ABBR[fips];
              if (!abbr || !stateData[abbr]) return null;
              const data = stateData[abbr];
              const color = getHeatColor(data.reports);
              const isSelected = selectedState === abbr;
              const d = pathGenerator(s);
              const [cx, cy] = getCentroid(s);

              return (
                <g key={fips}>
                  <path
                    d={d}
                    fill={isSelected ? "#1e40af" : color}
                    fillOpacity={isSelected ? 0.9 : 0.82}
                    stroke="white"
                    strokeWidth={0.8 / transform.k}
                    style={{ cursor: "pointer", transition: "fill 0.15s, fill-opacity 0.15s" }}
                    onClick={() => onStateClick(abbr)}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.closest("div, svg").getBoundingClientRect
                        ? e.currentTarget.closest(".overflow-hidden").getBoundingClientRect()
                        : { left: 0, top: 0 };
                      const svgEl = svgRef.current;
                      const svgRect = svgEl.getBoundingClientRect();
                      setTooltip({ x: e.clientX - svgRect.left, y: e.clientY - svgRect.top, abbr });
                    }}
                    onMouseMove={(e) => {
                      const svgEl = svgRef.current;
                      const svgRect = svgEl.getBoundingClientRect();
                      setTooltip(t => t ? { ...t, x: e.clientX - svgRect.left, y: e.clientY - svgRect.top } : null);
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                  {/* State label */}
                  {cx && cy && !SMALL_STATES.has(abbr) && (
                    <text
                      x={cx} y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={Math.max(6, 11 / transform.k)}
                      fontWeight="600"
                      fill="white"
                      fillOpacity={0.92}
                      style={{ pointerEvents: "none", userSelect: "none", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {abbr}
                    </text>
                  )}
                </g>
              );
            })}

            {/* State borders (nation outline) */}
            {topology && (
              <path
                d={pathGenerator(feature(topology, topology.objects.nation))}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={1.2 / transform.k}
                style={{ pointerEvents: "none" }}
              />
            )}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] mt-3">
        <span className="text-muted-foreground font-semibold">Report Volume:</span>
        {[
          { label: "4000+", color: "#7f1d1d" },
          { label: "3000+", color: "#b91c1c" },
          { label: "2000+", color: "#dc2626" },
          { label: "1500+", color: "#ea580c" },
          { label: "1000+", color: "#d97706" },
          { label: "700+",  color: "#ca8a04" },
          { label: "400+",  color: "#65a30d" },
          { label: "< 400", color: "#15803d" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
        <span className="text-muted-foreground ml-auto hidden sm:block">Scroll to zoom · Drag to pan</span>
      </div>
    </div>
  );
}