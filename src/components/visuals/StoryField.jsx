'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const COUNT = 3200;
const SHAPE_COUNT = 5;
const SPECTRUM = ['#8052ff', '#ffb829', '#15846e', '#ffffff', '#5b7cff', '#c86bff'].map((color) => new THREE.Color(color));
const SPECTRUM_WEIGHTS = [0.32, 0.2, 0.1, 0.18, 0.12, 0.08];

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function makeSampler() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 8;
  return canvas.getContext('2d');
}

function setPoint(points, index, x, y, z = 0) {
  const offset = index * 3;
  points[offset] = x;
  points[offset + 1] = y;
  points[offset + 2] = z;
}

function pointOnPolyline(vertices, progress, closed = false) {
  const segments = closed ? vertices.length : vertices.length - 1;
  const scaled = Math.min(segments - 0.000001, Math.max(0, progress * segments));
  const segment = Math.floor(scaled);
  const local = scaled - segment;
  const a = vertices[segment];
  const b = vertices[(segment + 1) % vertices.length];
  return [a[0] + (b[0] - a[0]) * local, a[1] + (b[1] - a[1]) * local];
}

function fillPath(ctx, path, scale, depth, random, interiorKeep = 0.28) {
  const points = new Float32Array(COUNT * 3);
  const probe = 0.032;
  let index = 0;
  let tries = 0;
  while (index < COUNT && tries++ < COUNT * 500) {
    const x = random() * 2 - 1;
    const y = random() * 2 - 1;
    if (!ctx.isPointInPath(path, x, y)) continue;
    const edge = !ctx.isPointInPath(path, x + probe, y) || !ctx.isPointInPath(path, x - probe, y)
      || !ctx.isPointInPath(path, x, y + probe) || !ctx.isPointInPath(path, x, y - probe);
    if (!edge && random() > interiorKeep) continue;
    setPoint(points, index++, x * scale, -y * scale, (random() - 0.5) * scale * depth * (edge ? 0.35 : 1));
  }
  return points;
}

const BRAIN_OUTLINE = [
  [-0.12, -0.94], [-0.32, -0.99], [-0.47, -0.91], [-0.66, -0.9],
  [-0.78, -0.77], [-0.91, -0.69], [-0.93, -0.52], [-1, -0.38],
  [-0.94, -0.22], [-1, -0.05], [-0.91, 0.08], [-0.94, 0.25],
  [-0.82, 0.39], [-0.68, 0.43], [-0.58, 0.55], [-0.4, 0.51],
  [-0.28, 0.62], [-0.13, 0.57], [-0.02, 0.7], [0.02, 0.98],
  [0.17, 0.98], [0.19, 0.7], [0.29, 0.57], [0.43, 0.54],
  [0.54, 0.45], [0.7, 0.42], [0.77, 0.3], [0.9, 0.22],
  [0.9, 0.06], [0.98, -0.07], [0.91, -0.23], [0.96, -0.39],
  [0.84, -0.51], [0.78, -0.67], [0.62, -0.73], [0.49, -0.86],
  [0.31, -0.85], [0.17, -0.96],
];

const BRAIN_FISSURES = [
  [[-0.76, -0.61], [-0.53, -0.72], [-0.29, -0.6], [-0.06, -0.69], [0.16, -0.6]],
  [[-0.82, -0.39], [-0.61, -0.47], [-0.4, -0.35], [-0.17, -0.46], [0.04, -0.35]],
  [[-0.82, -0.13], [-0.59, -0.04], [-0.37, -0.17], [-0.13, -0.05], [0.13, -0.15], [0.39, -0.04], [0.7, -0.12]],
  [[-0.78, 0.16], [-0.55, 0.08], [-0.33, 0.21], [-0.1, 0.1], [0.11, 0.2]],
  [[-0.64, 0.37], [-0.46, 0.29], [-0.28, 0.43], [-0.12, 0.34]],
  [[-0.43, -0.84], [-0.32, -0.65], [-0.38, -0.45], [-0.25, -0.25], [-0.32, -0.06]],
  [[-0.09, -0.87], [0.03, -0.67], [-0.04, -0.48], [0.1, -0.29], [0.04, -0.09]],
  [[0.27, -0.78], [0.38, -0.6], [0.31, -0.42], [0.47, -0.25], [0.39, -0.05]],
  [[0.57, -0.68], [0.68, -0.51], [0.57, -0.34], [0.73, -0.19]],
  [[0.24, 0.08], [0.39, 0.22], [0.57, 0.14], [0.75, 0.24]],
  [[0.12, 0.37], [0.26, 0.28], [0.4, 0.4], [0.56, 0.32]],
  [[-0.04, 0.48], [0.08, 0.39], [0.18, 0.53]],
];

function brainPath() {
  const path = new Path2D();
  path.moveTo(...BRAIN_OUTLINE[0]);
  BRAIN_OUTLINE.slice(1).forEach((point) => path.lineTo(...point));
  path.closePath();
  return path;
}

function buildBrain(ctx) {
  const random = seededRandom(11);
  const path = brainPath();
  const points = new Float32Array(COUNT * 3);
  const scale = 2.92;
  const perimeterEnd = 1240;
  const fissureEnd = 2460;

  // The reference works because its outer shell is almost unbroken. Preserve
  // that silhouette first, including the narrow stem at the bottom.
  for (let i = 0; i < perimeterEnd; i++) {
    const t = i / perimeterEnd;
    const [x, y] = pointOnPolyline(BRAIN_OUTLINE, t, true);
    const depth = Math.sin(t * Math.PI * 8) * 0.035 + (random() - 0.5) * 0.11;
    setPoint(points, i, x * scale, -y * scale, depth);
  }

  // Organic Catmull-Rom fissures form recognizable lobes. They are deliberately
  // non-parallel: repeated horizontal bands made the earlier version look topographic.
  const pointsPerFissure = Math.ceil((fissureEnd - perimeterEnd) / BRAIN_FISSURES.length);
  const fissureCurves = BRAIN_FISSURES.map((fissure) => new THREE.CatmullRomCurve3(
    fissure.map(([x, y]) => new THREE.Vector3(x, y, 0)),
    false,
    'centripetal',
  ));
  for (let i = perimeterEnd; i < fissureEnd; i++) {
    const local = i - perimeterEnd;
    const fissureIndex = local % BRAIN_FISSURES.length;
    const ordinal = Math.floor(local / BRAIN_FISSURES.length);
    const point = fissureCurves[fissureIndex].getPoint(Math.min(1, ordinal / Math.max(1, pointsPerFissure - 1)));
    setPoint(points, i, point.x * scale, -point.y * scale, 0.16 + (random() - 0.5) * 0.1);
  }

  // A quieter interior gives the eye negative space around the fissures while
  // retaining enough depth for the form to breathe as the pointer moves.
  let index = fissureEnd;
  while (index < COUNT) {
    const x = random() * 2 - 1;
    const y = random() * 2 - 1;
    if (!ctx.isPointInPath(path, x, y)) continue;
    const normalized = Math.min(1, x * x * 0.7 + y * y * 0.62);
    const depth = Math.sqrt(1 - normalized) * 0.78;
    setPoint(points, index++, x * scale, -y * scale, (random() - 0.5) * depth);
  }
  return points;
}

const NODES = [[0, 0, 0.38], [-0.83, 0.56, 0.22], [0.79, 0.62, 0.22], [-0.92, -0.42, 0.2], [0.86, -0.38, 0.22], [0, -0.78, 0.19]];
const EDGES = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [2, 4], [3, 5], [4, 5]];

function buildDeployment() {
  const random = seededRandom(23);
  const points = new Float32Array(COUNT * 3);
  const scale = 2.75;
  const nodePoints = 1660;
  for (let i = 0; i < nodePoints; i++) {
    const nodeIndex = i % NODES.length;
    const node = NODES[nodeIndex];
    const angle = random() * Math.PI * 2;
    const radius = node[2] * (0.72 + random() * 0.28) * (random() < 0.72 ? 1 : Math.sqrt(random()));
    setPoint(points, i, (node[0] + Math.cos(angle) * radius) * scale, (node[1] + Math.sin(angle) * radius) * scale, (random() - 0.5) * 0.46 + (nodeIndex === 0 ? 0.18 : 0));
  }
  for (let i = nodePoints; i < COUNT; i++) {
    const edge = EDGES[(i - nodePoints) % EDGES.length];
    const a = NODES[edge[0]];
    const b = NODES[edge[1]];
    const t = random();
    const bend = Math.sin(t * Math.PI) * 0.055 * ((edge[0] + edge[1]) % 2 ? 1 : -1);
    setPoint(points, i, (a[0] + (b[0] - a[0]) * t) * scale, (a[1] + (b[1] - a[1]) * t + bend) * scale, (random() - 0.5) * 0.13);
  }
  return points;
}

const geoPolygon = (coordinates) => coordinates.map(([longitude, latitude]) => [(longitude + 180) / 360, (90 - latitude) / 180]);
const LAND = [
  geoPolygon([[-168, 72], [-142, 70], [-125, 58], [-130, 49], [-124, 39], [-117, 31], [-105, 24], [-97, 18], [-86, 20], [-82, 29], [-75, 40], [-66, 47], [-55, 53], [-64, 62], [-88, 68], [-112, 73]]),
  geoPolygon([[-73, 83], [-18, 82], [-20, 61], [-45, 59], [-62, 69]]),
  geoPolygon([[-81, 12], [-69, 10], [-52, 4], [-35, -8], [-40, -23], [-49, -33], [-54, -52], [-68, -55], [-75, -35], [-80, -10]]),
  geoPolygon([[-11, 71], [10, 72], [35, 69], [62, 72], [95, 76], [140, 66], [165, 59], [145, 48], [128, 43], [121, 25], [107, 17], [101, 3], [91, 22], [78, 8], [68, 24], [52, 27], [42, 38], [28, 41], [20, 55], [4, 58], [-8, 50]]),
  geoPolygon([[-17, 36], [5, 37], [22, 33], [39, 16], [51, 11], [44, -13], [32, -34], [18, -35], [9, -18], [-4, 5]]),
  geoPolygon([[112, -11], [132, -12], [153, -25], [146, -40], [124, -35], [113, -24]]),
  geoPolygon([[130, 33], [143, 46], [146, 41], [138, 31]]),
];

function pointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function spherePoint(u, v, radius) {
  const longitude = (u - 0.5) * Math.PI * 2;
  const latitude = (0.5 - v) * Math.PI;
  return [Math.cos(longitude) * Math.cos(latitude) * radius, Math.sin(latitude) * radius, Math.sin(longitude) * Math.cos(latitude) * radius];
}

function travelArcPoint(progress, radius) {
  const start = spherePoint((103.82 + 180) / 360, (90 - 1.35) / 180, 1);
  const end = spherePoint((54.37 + 180) / 360, (90 - 24.45) / 180, 1);
  const dot = Math.min(1, Math.max(-1, start[0] * end[0] + start[1] * end[1] + start[2] * end[2]));
  const angle = Math.acos(dot);
  const denominator = Math.sin(angle);
  const a = Math.sin((1 - progress) * angle) / denominator;
  const b = Math.sin(progress * angle) / denominator;
  const lift = radius * (1.035 + Math.sin(progress * Math.PI) * 0.12);
  return [(start[0] * a + end[0] * b) * lift, (start[1] * a + end[1] * b) * lift, (start[2] * a + end[2] * b) * lift];
}

function buildGlobe() {
  const random = seededRandom(37);
  const points = new Float32Array(COUNT * 3);
  const radius = 2.72;
  let index = 0;
  while (index < 1680) {
    const u = random();
    const v = random();
    if (!LAND.some((polygon) => pointInPolygon(u, v, polygon))) continue;
    const point = spherePoint(u, v, radius * (0.995 + random() * 0.016));
    setPoint(points, index++, ...point);
  }

  // Coastline-weighted points keep Africa, Asia and the Americas crisp instead
  // of letting them dissolve into a uniformly filled sphere.
  const coastlineStart = index;
  const coastlineEnd = 2420;
  for (; index < coastlineEnd; index++) {
    const coastlineIndex = index - coastlineStart;
    const polygonIndex = coastlineIndex % LAND.length;
    const ordinal = Math.floor(coastlineIndex / LAND.length);
    const total = Math.ceil((coastlineEnd - coastlineStart) / LAND.length);
    const [u, v] = pointOnPolyline(LAND[polygonIndex], (ordinal + random() * 0.25) / total, true);
    setPoint(points, index, ...spherePoint(u, v, radius * 1.012));
  }

  // Latitude/longitude scaffolding preserves the globe reading during rotation.
  const gridStart = index;
  const gridEnd = 2920;
  for (; index < gridEnd; index++) {
    const gridIndex = index - gridStart;
    const latitude = gridIndex % 2 === 0;
    const u = latitude ? random() : (Math.floor(gridIndex / 2) % 10) / 10 + (random() - 0.5) * 0.005;
    const v = latitude ? 0.18 + (Math.floor(gridIndex / 2) % 7) * 0.105 + (random() - 0.5) * 0.006 : 0.1 + random() * 0.8;
    setPoint(points, index, ...spherePoint(u, v, radius));
  }

  // The raised route is personal rather than decorative: Singapore to Abu Dhabi.
  for (; index < COUNT; index++) {
    const t = (index - gridEnd) / Math.max(1, COUNT - gridEnd - 1);
    const point = travelArcPoint(t, radius);
    const jitter = (random() - 0.5) * 0.025;
    setPoint(points, index, point[0] + jitter, point[1] + jitter, point[2] + jitter);
  }
  return points;
}

function bulbOutline() {
  const right = [];
  const segments = 24;
  const ease = (value) => value * value * (3 - 2 * value);
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI / 2;
    right.push([Math.sin(angle) * 0.59, -0.96 + (1 - Math.cos(angle)) * 0.78]);
  }
  for (let i = 1; i <= segments; i++) {
    const u = ease(i / segments);
    right.push([0.59 + (0.21 - 0.59) * u, -0.18 + 0.53 * u]);
  }
  right.push([0.29, 0.45], [0.29, 0.67], [0.2, 0.76]);
  return right.concat(right.slice().reverse().map(([x, y]) => [-x, y]));
}

function buildBulb(ctx) {
  const random = seededRandom(41);
  const outline = bulbOutline();
  const path = new Path2D();
  path.moveTo(...outline[0]);
  outline.slice(1).forEach((point) => path.lineTo(...point));
  path.closePath();
  const points = fillPath(ctx, path, 3.05, 0.18, random, 0.07);
  for (let i = 0; i < 900; i++) {
    const [x, y] = pointOnPolyline(outline, i / 900, true);
    setPoint(points, i, x * 3.05, -y * 3.05, (random() - 0.5) * 0.08);
  }

  // Two lead wires rise from the base into a bright coiled filament.
  const leftLead = [[-0.22, 0.36], [-0.2, 0.14], [-0.17, -0.05]];
  const rightLead = [[0.22, 0.36], [0.2, 0.14], [0.17, -0.05]];
  for (let i = 900; i < 1320; i++) {
    const lead = i % 2 === 0 ? leftLead : rightLead;
    const [x, y] = pointOnPolyline(lead, (i - 900) / 420);
    setPoint(points, i, x * 3.05, -y * 3.05, (random() - 0.5) * 0.1);
  }
  for (let i = 1320; i < 1700; i++) {
    const t = (i - 1320) / 379;
    const x = -0.18 + t * 0.36;
    const y = -0.055 + Math.sin(t * Math.PI * 6) * 0.032;
    setPoint(points, i, x * 3.05, -y * 3.05, (random() - 0.5) * 0.1);
  }

  // Sloped bands and a closed contact foot make the base read as machined metal.
  for (let i = 1700; i < 2300; i++) {
    const thread = (i - 1700) % 6;
    const t = Math.floor((i - 1700) / 6) / 100;
    const x = -0.285 + t * 0.57;
    const y = 0.42 + thread * 0.053 + (t - 0.5) * 0.018;
    setPoint(points, i, x * 3.05, -y * 3.05, (random() - 0.5) * 0.075);
  }
  const foot = [[-0.2, 0.73], [-0.13, 0.79], [0.13, 0.79], [0.2, 0.73]];
  for (let i = 2300; i < 2520; i++) {
    const [x, y] = pointOnPolyline(foot, (i - 2300) / 220);
    setPoint(points, i, x * 3.05, -y * 3.05, (random() - 0.5) * 0.06);
  }

  // Short, broken rays suggest an active idea without turning into a sun icon.
  for (let i = 2520; i < 2800; i++) {
    const ray = (i - 2520) % 7;
    const t = Math.floor((i - 2520) / 7) / 40;
    const angle = Math.PI + (ray / 6) * Math.PI;
    const distance = 0.7 + t * 0.18;
    const x = Math.cos(angle) * distance;
    const y = -0.18 + Math.sin(angle) * distance;
    setPoint(points, i, x * 3.05, -y * 3.05, (random() - 0.5) * 0.07);
  }
  return points;
}

function buildOrbit() {
  const random = seededRandom(59);
  const points = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const ring = i % 4;
    let angle = random() * Math.PI * 2;
    if (Math.abs(Math.atan2(Math.sin(angle), Math.cos(angle))) < 0.18) angle += 0.32;
    const radius = (0.58 + ring * 0.13 + (random() - 0.5) * 0.04) * 2.85;
    setPoint(points, i, Math.cos(angle) * radius, Math.sin(angle) * radius * 0.68, Math.sin(angle * 2 + ring) * 0.34 + (random() - 0.5) * 0.08);
  }
  return points;
}

// Shared screen-space ordering stops particles crossing the entire scene at random.
function orderShape(points) {
  const indices = Array.from({ length: COUNT }, (_, index) => index);
  indices.sort((a, b) => {
    const aBand = Math.floor((points[a * 3 + 1] + 4) / 0.2);
    const bBand = Math.floor((points[b * 3 + 1] + 4) / 0.2);
    if (aBand !== bBand) return aBand - bBand;
    return aBand % 2 === 0 ? points[a * 3] - points[b * 3] : points[b * 3] - points[a * 3];
  });
  const ordered = new Float32Array(points.length);
  indices.forEach((source, target) => {
    ordered[target * 3] = points[source * 3];
    ordered[target * 3 + 1] = points[source * 3 + 1];
    ordered[target * 3 + 2] = points[source * 3 + 2];
  });
  return ordered;
}

function buildBlastField(brain) {
  const random = seededRandom(83);
  const offsets = new Float32Array(COUNT * 3);
  const delays = new Float32Array(COUNT);
  const drift = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const offset = i * 3;
    const x = brain[offset];
    const y = brain[offset + 1];
    const angle = Math.atan2(y, x) + (random() - 0.5) * 0.72;
    const reach = 1.7 + random() * 3.9;
    offsets[offset] = Math.cos(angle) * reach - 1.15 + (random() - 0.5) * 2.2;
    offsets[offset + 1] = Math.sin(angle) * reach + (random() - 0.5) * 1.8;
    // Real Z separation lets size attenuation create the large foreground
    // fragments visible in the reference without a second particle system.
    offsets[offset + 2] = random() < 0.075 ? 5.7 + random() * 1.35 : (random() - 0.52) * 8;
    const radius = Math.min(1, Math.hypot(x / 3, y / 3));
    delays[i] = (1 - radius) * 0.09 + random() * 0.055;
    drift[i] = 0.55 + random() * 0.9;
  }
  return { offsets, delays, drift };
}

function smoothstep(value) {
  const x = Math.min(1, Math.max(0, value));
  return x * x * (3 - 2 * x);
}

function sectionProgress(scrollY, anchors) {
  if (anchors.length < SHAPE_COUNT || scrollY <= anchors[0]) return 0;
  if (scrollY >= anchors[anchors.length - 1]) return 1;
  for (let i = 0; i < anchors.length - 1; i++) {
    if (scrollY <= anchors[i + 1]) {
      const local = (scrollY - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i]);
      // Give the opening blast more runway than the later, quieter morphs.
      const morph = i === 0 ? smoothstep((local - 0.4) / 0.6) : smoothstep((local - 0.64) / 0.36);
      return (i + morph) / (anchors.length - 1);
    }
  }
  return 1;
}

function interpolateStops(values, progress) {
  const scaled = Math.min(values.length - 1, Math.max(0, progress * (values.length - 1)));
  const index = Math.min(values.length - 2, Math.floor(scaled));
  const local = smoothstep(scaled - index);
  return values[index] + (values[index + 1] - values[index]) * local;
}

function buildTriangleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(32, 4);
  ctx.lineTo(60, 57);
  ctx.lineTo(4, 57);
  ctx.closePath();
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

function ParticleSwarm({ progress, pointer, scrollVelocity }) {
  const geometryRef = useRef(null);
  const groupRef = useRef(null);
  const materialRef = useRef(null);
  const current = useRef(null);
  const globeSpin = useRef(0);
  const scaleTarget = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const { viewport } = useThree();
  const shapes = useMemo(() => {
    const ctx = makeSampler();
    return [buildBrain(ctx), buildDeployment(), buildGlobe(), buildBulb(ctx), buildOrbit()].map(orderShape);
  }, []);
  const blast = useMemo(() => buildBlastField(shapes[0]), [shapes]);
  const texture = useMemo(buildTriangleTexture, []);
  const { colors, scatter } = useMemo(() => {
    const random = seededRandom(71);
    const colorArray = new Float32Array(COUNT * 3);
    const scatterArray = new Float32Array(COUNT * 2);
    const cumulative = [];
    SPECTRUM_WEIGHTS.reduce((sum, weight, index) => (cumulative[index] = sum + weight), 0);
    for (let i = 0; i < COUNT; i++) {
      const choice = random();
      let pick = cumulative.findIndex((value) => choice <= value);
      if (pick < 0) pick = SPECTRUM.length - 1;
      const gain = random() < 0.12 ? 1.45 : 0.45 + random() * 0.5;
      colorArray[i * 3] = SPECTRUM[pick].r * gain;
      colorArray[i * 3 + 1] = SPECTRUM[pick].g * gain;
      colorArray[i * 3 + 2] = SPECTRUM[pick].b * gain;
      scatterArray[i * 2] = (random() - 0.5) * 1.8;
      scatterArray[i * 2 + 1] = 0.6 + random() * 0.9;
    }
    return { colors: colorArray, scatter: scatterArray };
  }, []);
  if (!current.current) current.current = new Float32Array(shapes[0]);

  useFrame((state, delta) => {
    if (!geometryRef.current) return;
    const p = Math.min(1, Math.max(0, progress.current));
    const scaled = p * (shapes.length - 1);
    const index = Math.min(shapes.length - 2, Math.floor(scaled));
    const morph = smoothstep(scaled - index);
    const from = shapes[index];
    const to = shapes[index + 1];
    const positions = geometryRef.current.attributes.position.array;
    const buffer = current.current;
    const time = state.clock.elapsedTime;
    const mx = pointer.current.x * viewport.width * 0.5;
    const my = pointer.current.y * viewport.height * 0.5;
    for (let i = 0; i < COUNT; i++) {
      const offset = i * 3;
      for (let axis = 0; axis < 3; axis++) {
        let target;
        if (index === 0) {
          const delayed = Math.min(1, Math.max(0, (morph - blast.delays[i]) / Math.max(0.001, 1 - blast.delays[i])));
          const release = smoothstep(delayed / 0.3);
          const returnHome = smoothstep((delayed - 0.62) / 0.38);
          const suspended = release * (1 - returnHome);
          const assemble = smoothstep((delayed - 0.55) / 0.45);
          const velocityLift = 1 + Math.min(2.4, Math.abs(scrollVelocity.current)) * 0.13;
          target = from[offset + axis] + (to[offset + axis] - from[offset + axis]) * assemble
            + blast.offsets[offset + axis] * suspended * velocityLift;
          if (axis === 1) target -= scrollVelocity.current * blast.drift[i] * suspended * 0.22;
        } else {
          target = from[offset + axis] + (to[offset + axis] - from[offset + axis]) * morph;
        }
        buffer[offset + axis] += (target - buffer[offset + axis]) * Math.min(1, delta * 7.5);
      }
      let x = buffer[offset];
      let y = buffer[offset + 1] + Math.sin(time * 0.82 + i * 0.37) * 0.025;
      const z = buffer[offset + 2];
      if (pointer.current.active) {
        const dx = x - mx;
        const dy = y - my;
        const distance = Math.hypot(dx, dy);
        if (distance < 2.15 && distance > 0.0001) {
          const pull = 1 - distance / 2.15;
          const force = pull * pull * 1.25 * scatter[i * 2 + 1];
          const angle = Math.atan2(dy, dx) + scatter[i * 2] * pull;
          x += Math.cos(angle) * force;
          y += Math.sin(angle) * force;
        }
      }
      positions[offset] = x;
      positions[offset + 1] = y;
      positions[offset + 2] = z;
    }
    geometryRef.current.attributes.position.needsUpdate = true;

    if (groupRef.current) {
      const stage = p * (SHAPE_COUNT - 1);
      const openingTransition = stage < 1 ? Math.sin(stage * Math.PI) : 0;
      const globeWeight = smoothstep(1 - Math.abs(stage - 2) / 0.72);
      globeSpin.current += delta * globeWeight * 0.28;
      const compact = viewport.width < 8;
      const xStops = compact ? [0.42, 0.34, 0.34, 0.32, 0] : [2.08, 1.88, 1.95, 1.86, 0.5];
      const targetX = interpolateStops(xStops, p) - openingTransition * (compact ? 0.28 : 1.12) + pointer.current.x * (compact ? 0.08 : 0.2);
      const targetYRotation = interpolateStops([0.13, 0, 0, 0, 0.12], p) + globeSpin.current * globeWeight + pointer.current.x * 0.035;
      const targetXRotation = interpolateStops([-0.04, 0.03, 0.02, 0, 0.17], p) + pointer.current.y * 0.025;
      const targetScale = compact ? 0.7 : 1;
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * Math.min(1, delta * 5);
      groupRef.current.position.y += (-scrollVelocity.current * openingTransition * 0.09 - groupRef.current.position.y) * Math.min(1, delta * 4);
      groupRef.current.rotation.y += (targetYRotation - groupRef.current.rotation.y) * Math.min(1, delta * 4.5);
      groupRef.current.rotation.x += (targetXRotation - groupRef.current.rotation.x) * Math.min(1, delta * 4.5);
      groupRef.current.rotation.z += (-scrollVelocity.current * openingTransition * 0.012 - groupRef.current.rotation.z) * Math.min(1, delta * 4);
      scaleTarget.setScalar(targetScale);
      groupRef.current.scale.lerp(scaleTarget, Math.min(1, delta * 5));
      if (materialRef.current) {
        materialRef.current.size = 0.085 + openingTransition * (compact ? 0.018 : 0.042);
        materialRef.current.opacity = 0.92 + openingTransition * 0.08;
      }
    }
    scrollVelocity.current *= Math.exp(-delta * 4.2);
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute attach="attributes-position" count={COUNT} array={current.current} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={COUNT} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={materialRef} size={0.085} map={texture} vertexColors transparent alphaTest={0.4} depthWrite={false} sizeAttenuation opacity={0.92} />
      </points>
    </group>
  );
}

export default function StoryField() {
  const [enabled, setEnabled] = useState(false);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const scrollVelocity = useRef(0);
  const lastScroll = useRef({ y: 0, time: 0 });
  const shellRef = useRef(null);
  const anchors = useRef([0, 1, 2, 3, 4]);
  const heroEnd = useRef(0.12);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add('field-active');
    const measure = () => {
      anchors.current = ['#hero', '#projects', '#about', '#skills', '#contact'].map((selector) => {
        const node = document.querySelector(selector);
        return node ? Math.max(0, node.offsetTop - window.innerHeight * 0.42) : 0;
      });
      const documentHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const hero = document.getElementById('hero');
      heroEnd.current = hero ? Math.min(0.3, hero.offsetHeight / documentHeight) : 0.12;
    };
    const onScroll = () => {
      const now = performance.now();
      const elapsed = Math.max(16, now - lastScroll.current.time);
      const rawVelocity = (window.scrollY - lastScroll.current.y) / elapsed;
      scrollVelocity.current = Math.min(2.8, Math.max(-2.8, scrollVelocity.current * 0.55 + rawVelocity * 0.7));
      lastScroll.current = { y: window.scrollY, time: now };
      progress.current = sectionProgress(window.scrollY, anchors.current);
      if (shellRef.current) {
        const documentHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const scrollFraction = Math.min(1, Math.max(0, window.scrollY / documentHeight));
        const fade = 1 - Math.min(1, scrollFraction / Math.max(0.0001, heroEnd.current)) * 0.28;
        shellRef.current.style.opacity = fade.toFixed(3);
      }
    };
    const onPointerMove = (event) => {
      pointer.current.x = event.clientX / window.innerWidth * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight * 2 - 1);
      pointer.current.active = true;
    };
    const onPointerLeave = () => { pointer.current.active = false; };
    const onResize = () => { measure(); onScroll(); };
    measure();
    lastScroll.current = { y: window.scrollY, time: performance.now() };
    onScroll();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    return () => {
      document.documentElement.classList.remove('field-active');
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="story-field" ref={shellRef} aria-hidden="true">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 9], fov: 42 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}>
        <ParticleSwarm progress={progress} pointer={pointer} scrollVelocity={scrollVelocity} />
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={0.5} luminanceSmoothing={0.35} intensity={1.05} radius={0.72} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
