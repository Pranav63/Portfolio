'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NEURAL_NETWORK, randomSequence } from '@/data/network';

const vertexShader = `
  uniform float uTime, uBurst, uDpr, uDrift, uTravel;
  attribute float aSeed, aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vSeed;
  vec3 disperse(vec3 p, float seed) {
    float burst = pow(uBurst, 1.25);
    vec3 direction = normalize(p + vec3(sin(seed * 63.0), cos(seed * 41.0), sin(seed * 29.0)) * .7);
    p *= 1.0 + sin(uTime * .55 + p.y * 1.8) * .015 * (1.0 - uBurst);
    p += direction * burst * (5.0 + seed * 14.0);
    float twist = burst * (seed - .5) * 1.6;
    p.xy = mat2(cos(twist), -sin(twist), sin(twist), cos(twist)) * p.xy;
    return p;
  }
  void main() {
    vColor = aColor;
    vSeed = aSeed;
    vec3 p = disperse(position, aSeed);
    if (uDrift > .0) {
      p.x += sin(uTime * .08 + aSeed * 6.28) * .35;
      p.y = mod(p.y + uTime * .045 + uTravel * .3 + 12.0, 24.0) - 12.0;
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(aSize * uDpr * 30.0 * (1.0 + uBurst * 1.8 + uDrift * .65) / max(2.0, -mv.z), 1.0, 38.0);
  }
`;

const particleShader = `
  uniform float uTime, uBurst, uOpacity;
  varying vec3 vColor;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - .5;
    float radius = length(uv);
    if (radius > .5) discard;
    float core = exp(-radius * radius * 95.0);
    float halo = exp(-radius * radius * 14.0) * .24;
    float rays = (exp(-abs(uv.x) * 100.0) + exp(-abs(uv.y) * 100.0)) * pow(1.0 - radius * 2.0, 3.0) * .3;
    float pulse = .8 + .2 * sin(uTime * 1.3 + vSeed * 70.0);
    gl_FragColor = vec4(vColor * (1.8 + uBurst), (core + halo + rays) * pulse * uOpacity);
  }
`;

const lineShader = `
  uniform float uTime, uBurst, uOpacity;
  varying vec3 vColor;
  varying float vSeed;
  void main() {
    float signal = pow(.5 + .5 * sin(vSeed * 28.0 - uTime * 1.8), 12.0);
    gl_FragColor = vec4(vColor * (1.0 + signal), (.12 + signal * .48) * pow(1.0 - uBurst, 4.0) * uOpacity);
  }
`;

const shardVertex = `
  uniform float uBurst, uTime;
  attribute vec3 aCenter, aColor;
  attribute float aSeed;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    float burst = pow(uBurst, 1.25);
    vec3 p = position - aCenter;
    float angle = uTime * .1 + burst * (4.0 + aSeed * 12.0);
    p.xy = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p.xy;
    p *= .2 + sin(uBurst * 3.14159) * .8;
    p += aCenter + normalize(aCenter) * burst * (6.0 + aSeed * 12.0);
    p.z = min(p.z, 4.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const shardFragment = `
  uniform float uBurst, uOpacity;
  varying vec3 vColor;
  void main() { gl_FragColor = vec4(vColor * 1.5, sin(uBurst * 3.14159) * .4 * uOpacity); }
`;

function buildGeometry(compact) {
  const random = randomSequence(119);
  const { nodes, edges } = NEURAL_NETWORK;
  const palette = ['#ad85ff', '#6f83ff', '#82d8f7', '#f1d9ff', '#ffc58d'].map(color => new THREE.Color(color));
  const make = () => ({ position: [], aSeed: [], aSize: [], aColor: [] });
  const dust = make(), threads = make(), stars = make(), streaks = make();
  const shards = { position: [], aCenter: [], aSeed: [], aColor: [] };
  const add = (data, point, seed, size, color) => {
    data.position.push(...point); data.aSeed.push(seed); data.aSize.push(size); data.aColor.push(...color);
  };
  const colorAt = point => palette[point[0] > 1 && point[1] < .5 ? 4 : Math.floor(random() * 4)].toArray();
  nodes.forEach((point, i) => add(dust, point, i / nodes.length, 3 + random() * 3, colorAt(point)));
  edges.forEach(([a, b]) => {
    const color = colorAt(nodes[a]);
    for (let j = 0; j < 8; j++) {
      for (const t of [j / 8, (j + 1) / 8]) {
        const p = nodes[a].map((v, axis) => v * (1 - t) + nodes[b][axis] * t);
        add(threads, p, a / nodes.length * (1 - t) + b / nodes.length * t, 1, color);
      }
    }
  });
  for (let i = 0; i < (compact ? 2800 : 8500); i++) {
    const [a, b] = edges[Math.floor(random() * edges.length)];
    const t = random(), scatter = random() < .8 ? .045 : .4;
    const p = nodes[a].map((v, axis) => v * (1 - t) + nodes[b][axis] * t + (random() - .5) * scatter);
    add(dust, p, random(), .45 + random() * 1.8, colorAt(p));
  }
  for (let i = 0; i < 650; i++) add(stars, [(random() - .5) * 38, (random() - .5) * 23, -3 - random() * 16], random(), .4 + random() * 1.2, palette[i % 4].toArray());
  for (let i = 0; i < 160; i++) {
    const p = nodes[Math.floor(random() * nodes.length)];
    const seed = random(), color = colorAt(p);
    add(streaks, p, seed, 1, color);
    add(streaks, p.map(v => v * (1.01 + seed * .04)), seed + .025, 1, color);
    const size = .025 + random() * .09;
    for (const offset of [[-size * .3, -size * .2, 0], [size * .3, 0, size * .3], [0, size * 2.4, 0]]) {
      shards.position.push(...p.map((v, axis) => v + offset[axis]));
      shards.aCenter.push(...p); shards.aSeed.push(seed); shards.aColor.push(...color);
    }
  }
  const geometry = data => {
    const buffer = new THREE.BufferGeometry();
    Object.entries(data).forEach(([name, values]) => buffer.setAttribute(name, new THREE.Float32BufferAttribute(values, ['aSeed', 'aSize'].includes(name) ? 1 : 3)));
    return buffer;
  };
  return { dust: geometry(dust), threads: geometry(threads), stars: geometry(stars), streaks: geometry(streaks), shards: geometry(shards) };
}

function NeuralField({ progress, ambient, travel, compact, onReady, onContextLost }) {
  const group = useRef();
  const { gl, viewport } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const geometry = useMemo(() => buildGeometry(compact), [compact]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uBurst: { value: progress.current }, uDpr: { value: 1 }, uOpacity: { value: 1 }, uDrift: { value: 0 }, uTravel: { value: 0 } }), [progress]);
  const starUniforms = useMemo(() => ({ ...uniforms, uBurst: { value: 0 }, uOpacity: { value: .8 }, uDrift: { value: 1 } }), [uniforms]);
  const ambience = useRef(ambient.current);

  useEffect(() => {
    onReady();
    const lost = event => { event.preventDefault(); onContextLost(); };
    const move = event => { pointer.current = { x: event.clientX / innerWidth - .5, y: event.clientY / innerHeight - .5 }; };
    gl.domElement.addEventListener('webglcontextlost', lost);
    window.addEventListener('pointermove', move, { passive: true });
    return () => { gl.domElement.removeEventListener('webglcontextlost', lost); window.removeEventListener('pointermove', move); };
  }, [gl, onReady, onContextLost]);
  useEffect(() => () => Object.values(geometry).forEach(value => value.dispose()), [geometry]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, .05);
    uniforms.uTime.value += dt;
    uniforms.uBurst.value = THREE.MathUtils.damp(uniforms.uBurst.value, progress.current, 7, dt);
    uniforms.uTravel.value = THREE.MathUtils.damp(uniforms.uTravel.value, travel.current, 3, dt);
    ambience.current = THREE.MathUtils.damp(ambience.current, ambient.current, 5, dt);
    const burst = uniforms.uBurst.value;
    uniforms.uDpr.value = gl.getPixelRatio();
    uniforms.uOpacity.value = THREE.MathUtils.lerp(1 - THREE.MathUtils.smoothstep(burst, .75, 1), .2, ambience.current);
    group.current.position.set(viewport.width * (compact ? .22 : .255) * (1 - burst * .65), compact ? .65 : .15, 0);
    group.current.scale.setScalar(compact ? .78 : 1.12);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -.18 + Math.sin(uniforms.uTime.value * .12) * .1 + pointer.current.x * .16 + burst * .6, 3, dt);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, .1 + pointer.current.y * .12, 3, dt);
    group.current.rotation.z = -.08 + burst * .3;
  });

  const material = { vertexShader, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };
  return <>
    <points geometry={geometry.stars} frustumCulled={false}><shaderMaterial {...material} uniforms={starUniforms} fragmentShader={particleShader} /></points>
    <group ref={group}>
      <lineSegments geometry={geometry.threads} frustumCulled={false}><shaderMaterial {...material} fragmentShader={lineShader} /></lineSegments>
      <points geometry={geometry.dust} frustumCulled={false}><shaderMaterial {...material} fragmentShader={particleShader} /></points>
      <lineSegments geometry={geometry.streaks} frustumCulled={false}><shaderMaterial {...material} fragmentShader={'uniform float uBurst, uOpacity; varying vec3 vColor; void main() { gl_FragColor = vec4(vColor, sin(uBurst * 3.14159) * .6 * uOpacity); }'} /></lineSegments>
      <mesh geometry={geometry.shards} frustumCulled={false}><shaderMaterial {...material} vertexShader={shardVertex} fragmentShader={shardFragment} side={THREE.DoubleSide} /></mesh>
    </group>
  </>;
}

export default function StoryField(props) {
  return <Canvas aria-hidden="true" dpr={[1, props.compact ? 1 : 1.5]} camera={{ position: [0, 0, 11], fov: 48, near: .1, far: 70 }} frameloop={props.visible ? 'always' : 'never'} gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}>
    <NeuralField {...props} />
  </Canvas>;
}
