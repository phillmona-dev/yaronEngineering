"use client";

import { useEffect, useRef } from "react";

/* ── Infrastructure nodes (lat/lon of key cities) ───────────────────────── */
const NODES: { lat: number; lon: number; label: string }[] = [
  { lat: 9.03, lon: 38.74, label: "Addis Ababa" }, // HQ
  { lat: 1.28, lon: 103.85, label: "Singapore" },
  { lat: 51.5, lon: -0.12, label: "London" },
  { lat: 40.71, lon: -74.0, label: "New York" },
  { lat: 25.2, lon: 55.27, label: "Dubai" },
  { lat: -1.29, lon: 36.82, label: "Nairobi" },
  { lat: 37.77, lon: -122.4, label: "San Francisco" },
  { lat: 35.68, lon: 139.69, label: "Tokyo" },
  { lat: 48.85, lon: 2.35, label: "Paris" },
  { lat: -33.86, lon: 151.2, label: "Sydney" },
  { lat: 6.45, lon: 3.39, label: "Lagos" },
  { lat: 55.75, lon: 37.62, label: "Moscow" },
];

/* ── Edges to animate connections ───────────────────────────────────────── */
const EDGES: [number, number][] = [
  [0, 4],
  [0, 5],
  [0, 1],
  [0, 8],
  [1, 7],
  [1, 9],
  [2, 3],
  [2, 8],
  [3, 6],
  [4, 8],
  [4, 11],
  [5, 10],
  [6, 3],
  [7, 9],
  [0, 3],
];

function latLonToXY(
  lat: number,
  lon: number,
  rotY: number,
  cx: number,
  cy: number,
  R: number,
): { x: number; y: number; visible: boolean } {
  const phi = (lat * Math.PI) / 180;
  const lam = ((lon + rotY * (180 / Math.PI)) * Math.PI) / 180;
  const x3 = Math.cos(phi) * Math.cos(lam);
  const y3 = Math.sin(phi);
  const z3 = Math.cos(phi) * Math.sin(lam);
  return {
    x: cx + R * x3,
    y: cy - R * y3,
    visible: z3 > -0.2,
  };
}

export function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rotY = 0;
    // Pulse state per edge
    const pulses = EDGES.map(() => ({
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      active: Math.random() > 0.4,
    }));
    // Node pulse state
    const nodePulse = NODES.map(() => ({
      t: Math.random() * Math.PI * 2,
    }));

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width / devicePixelRatio;
      const H = canvas.height / devicePixelRatio;
      ctx.clearRect(0, 0, W, H);

      const cx = W * 0.72;
      const cy = H * 0.5;
      const R = Math.min(W, H) * 0.38;

      // ── Globe base ────────────────────────────────────────────────────────
      const grad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.2, R * 0.05, cx, cy, R);
      grad.addColorStop(0, "rgba(245,197,24,0.08)");
      grad.addColorStop(0.55, "rgba(63,130,220,0.14)");
      grad.addColorStop(1, "rgba(21,64,166,0.0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // ── Latitude/longitude grid ───────────────────────────────────────────
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 0.8;
      // Lat lines
      for (let lat = -75; lat <= 75; lat += 15) {
        const points: { x: number; y: number; vis: boolean }[] = [];
        for (let lon = -180; lon <= 180; lon += 4) {
          const p = latLonToXY(lat, lon, rotY, cx, cy, R);
          points.push({ x: p.x, y: p.y, vis: p.visible });
        }
        drawLine(ctx, points);
      }
      // Lon lines
      for (let lon = -180; lon < 180; lon += 20) {
        const points: { x: number; y: number; vis: boolean }[] = [];
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = latLonToXY(lat, lon, rotY, cx, cy, R);
          points.push({ x: p.x, y: p.y, vis: p.visible });
        }
        drawLine(ctx, points);
      }
      ctx.restore();

      // ── Globe outline ─────────────────────────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(245,197,24,0.18)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // ── Edges / connection arcs ───────────────────────────────────────────
      EDGES.forEach(([ai, bi], idx) => {
        const a = latLonToXY(NODES[ai].lat, NODES[ai].lon, rotY, cx, cy, R);
        const b = latLonToXY(NODES[bi].lat, NODES[bi].lon, rotY, cx, cy, R);
        if (!a.visible && !b.visible) return;
        const alpha = Math.min(a.visible ? 1 : 0.2, b.visible ? 1 : 0.2);

        // Static dim line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cx, cy - R * 0.1, b.x, b.y);
        ctx.strokeStyle = `rgba(245,197,24,${0.1 * alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();

        // Animated pulse dot
        if (pulses[idx].active) {
          pulses[idx].t += pulses[idx].speed;
          if (pulses[idx].t > 1) {
            pulses[idx].t = 0;
            pulses[idx].active = Math.random() > 0.3;
          }
          const t = pulses[idx].t;
          // Quadratic bezier interpolation
          const mx = cx;
          const my = cy - R * 0.1;
          const px = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x;
          const py = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y;

          const glow = ctx.createRadialGradient(px, py, 0, px, py, 6);
          glow.addColorStop(0, `rgba(255,233,138,${0.95 * alpha})`);
          glow.addColorStop(1, "rgba(245,197,24,0)");
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        } else {
          // randomly restart
          if (Math.random() < 0.004) pulses[idx].active = true;
        }
      });

      // ── Nodes ────────────────────────────────────────────────────────────
      NODES.forEach((node, i) => {
        const p = latLonToXY(node.lat, node.lon, rotY, cx, cy, R);
        if (!p.visible) return;
        nodePulse[i].t += 0.04;
        const pulse = 0.5 + 0.5 * Math.sin(nodePulse[i].t);
        const isHQ = i === 0;

        // Outer ring (pulsing)
        const outerR = isHQ ? 10 + pulse * 5 : 6 + pulse * 3;
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, outerR, 0, Math.PI * 2);
        ctx.strokeStyle = isHQ
          ? `rgba(245,197,24,${0.5 * pulse})`
          : `rgba(251,216,74,${0.35 * pulse})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // Inner dot
        const innerR = isHQ ? 4 : 2.5;
        const dotGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, innerR * 2.5);
        dotGrad.addColorStop(0, isHQ ? "#f5c518" : "#ffe98a");
        dotGrad.addColorStop(1, "rgba(245,197,24,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, innerR * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = dotGrad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, innerR, 0, Math.PI * 2);
        ctx.fillStyle = isHQ ? "#f5c518" : "#ffe98a";
        ctx.fill();
      });

      rotY += 0.0012;
      raf.current = requestAnimationFrame(draw);
    }

    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

/* helper: draw a segmented polyline, breaking at visibility seams */
function drawLine(ctx: CanvasRenderingContext2D, pts: { x: number; y: number; vis: boolean }[]) {
  let pen = false;
  ctx.beginPath();
  for (const p of pts) {
    if (!p.vis) {
      pen = false;
      continue;
    }
    if (!pen) {
      ctx.moveTo(p.x, p.y);
      pen = true;
    } else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}
