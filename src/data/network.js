// Two folded hemispheres and a tapered stem, shared by WebGL and the still SVG.
export function randomSequence(seed = 73) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}

export function buildNetwork(count = 420) {
  const random = randomSequence();
  const hemisphereCount = Math.floor((count - 32) / 2);
  const nodes = Array.from({ length: count }, (_, i) => {
    if (i >= hemisphereCount * 2) {
      const t = (i - hemisphereCount * 2) / 31;
      const angle = i * 2.4;
      return [Math.cos(angle) * (.32 - t * .14), -1.8 - t * 1.05, Math.sin(angle) * .28 - .12];
    }
    const side = i < hemisphereCount ? -1 : 1;
    const ordinal = i % hemisphereCount;
    const y = 1 - 2 * (ordinal + .5) / hemisphereCount;
    const angle = ordinal * Math.PI * (3 - Math.sqrt(5));
    const radius = Math.sqrt(1 - y * y);
    const fold = 1 + .1 * Math.sin(angle * 4 + y * 14) + .045 * Math.cos(y * 25);
    const width = 1.1 + y * .12;
    return [side * (.16 + (1 + Math.cos(angle)) * radius * width * fold), y * 2.15 + .35, Math.sin(angle) * radius * 1.45 * fold];
  });
  const edges = [];
  nodes.forEach((node, i) => {
    const neighbors = nodes.map((other, j) => ({ j, distance: node.reduce((sum, v, k) => sum + (v - other[k]) ** 2, 0) }))
      .filter(other => other.j !== i).sort((a, b) => a.distance - b.distance).slice(0, 4);
    neighbors.forEach(({ j }) => { if (j > i) edges.push([i, j]); });
    if (i % 9 === 0 && i < hemisphereCount * 2) {
      const start = i < hemisphereCount ? 0 : hemisphereCount;
      edges.push([i, start + Math.floor(random() * hemisphereCount)]);
    }
  });
  return { nodes, edges };
}

export const NEURAL_NETWORK = buildNetwork();
