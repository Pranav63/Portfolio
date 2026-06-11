'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '@/hooks/useScrollProgress';

// Fixed Gulf blue hour. One mood, no day-night cycle.
const NIGHT = '#070B16';

const WAYPOINTS = [
  { pos: [0,   2.8, 14],  target: [0, 0.8,  0]  },
  { pos: [-2,  3.5, 10],  target: [0, 1.2,  0]  },
  { pos: [2,   5,   6],   target: [0, 0.8, -3]  },
  { pos: [0,   2.8, 1],   target: [0, 1.2,-12]  },
  { pos: [3,   4,  -3],   target: [0, 2,  -10]  },
  { pos: [0,   7,  -1],   target: [0, 0,   -6]  },
];

function lV(a, b, t) {
  return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
}

function getIdx(progress) {
  const total  = WAYPOINTS.length - 1;
  const scaled = progress * total;
  const idx    = Math.min(Math.floor(scaled), total - 1);
  return { idx, t: scaled - idx, next: Math.min(idx + 1, total) };
}

// Camera still travels through the scene with scroll, palette stays fixed
const CameraRig = ({ progress }) => {
  const { camera } = useThree();
  const tp = useRef(new THREE.Vector3());
  const tl = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    const { idx, t, next } = getIdx(progress);
    tp.current.set(...lV(WAYPOINTS[idx].pos,    WAYPOINTS[next].pos,    t));
    tl.current.set(...lV(WAYPOINTS[idx].target, WAYPOINTS[next].target, t));

    // Idle drift on hero only
    const idle = Math.max(0, 1 - progress * 8);
    const time = clock.getElapsedTime();
    tp.current.x += Math.sin(time * 0.18) * 0.35 * idle;
    tp.current.y += Math.sin(time * 0.12) * 0.12 * idle;

    camera.position.lerp(tp.current, 0.045);
    camera.lookAt(tl.current);
  });
  return null;
};

// Static sky: deep navy zenith, thin warm afterglow band at the horizon
const SkyDome = () => {
  const vert = `
    varying float vY;
    void main() {
      vY = normalize(position).y;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const frag = `
    varying float vY;
    void main() {
      vec3 horizon = vec3(0.34, 0.22, 0.10);
      vec3 mid     = vec3(0.055, 0.085, 0.190);
      vec3 zenith  = vec3(0.012, 0.018, 0.045);
      float t  = clamp(vY, 0.0, 1.0);
      vec3 col = mix(horizon, mid,   smoothstep(0.0, 0.16, t));
      col      = mix(col,     zenith, smoothstep(0.12, 0.65, t));
      col      = mix(vec3(0.045, 0.045, 0.055), col, smoothstep(-0.06, 0.05, vY));
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  return (
    <mesh>
      <sphereGeometry args={[280, 32, 16]} />
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
};

// Low static glow where the sun went down, replaces the moving sun
const Afterglow = () => {
  const vert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
  const frag = `
    varying vec2 vUv;
    void main(){
      vec2 c   = vec2(0.5, 0.0);
      float d  = length((vUv - c) * vec2(1.0, 2.4));
      float g1 = (1.0 - smoothstep(0.0,  0.45, d)) * 0.45;
      float g2 = (1.0 - smoothstep(0.3,  1.0,  d)) * 0.12;
      vec3 col = vec3(1.0, 0.62, 0.24) * (g1 + g2);
      gl_FragColor = vec4(col, (g1 + g2));
    }
  `;

  return (
    <mesh position={[0, 8, -200]}>
      <planeGeometry args={[260, 70]} />
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Static moon, no fade logic
const Moon = () => (
  <mesh position={[-48, 46, -110]}>
    <sphereGeometry args={[4.5, 32, 32]} />
    <meshStandardMaterial
      color="#D8D4C4"
      emissive="#A89E8C"
      emissiveIntensity={0.4}
      roughness={0.95}
      transparent
      opacity={0.8}
    />
  </mesh>
);

// Dunes, fixed dusk grade: navy shadow valleys, gold-lit crests
const Terrain = () => {
  const matRef = useRef();

  const vert = `
    varying vec3  vPos;
    varying float vH;

    vec3 m3(vec3 x){return x-floor(x*(1./289.))*289.;}
    vec4 m4(vec4 x){return x-floor(x*(1./289.))*289.;}
    vec4 perm(vec4 x){return m4(((x*34.)+1.)*x);}
    vec4 tis(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float sn(vec3 v){
      const vec2 C=vec2(1./6.,1./3.);
      const vec4 D=vec4(0.,.5,1.,2.);
      vec3 i=floor(v+dot(v,C.yyy));
      vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);
      vec3 l=1.-g;
      vec3 i1=min(g.xyz,l.zxy);
      vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;
      vec3 x2=x0-i2+C.yyy;
      vec3 x3=x0-D.yyy;
      i=m3(i);
      vec4 p=perm(perm(perm(
        i.z+vec4(0.,i1.z,i2.z,1.))
        +i.y+vec4(0.,i1.y,i2.y,1.))
        +i.x+vec4(0.,i1.x,i2.x,1.));
      float n_=.142857142857;
      vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);
      vec4 y_=floor(j-7.*x_);
      vec4 x=x_*ns.x+ns.yyyy;
      vec4 y=y_*ns.x+ns.yyyy;
      vec4 h=1.-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);
      vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.+1.;
      vec4 s1=floor(b1)*2.+1.;
      vec4 sh=-step(h,vec4(0.));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
      vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);
      vec3 p1=vec3(a0.zw,h.y);
      vec3 p2=vec3(a1.xy,h.z);
      vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
      m=m*m;
      return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    uniform float uTime;
    void main(){
      float n =
        sn(vec3(position.x*.20, 0., position.z*.13)) * 2.2 +
        sn(vec3(position.x*.40 + uTime*.02, 0., position.z*.30)) * 0.85 +
        sn(vec3(position.x*.80, 0., position.z*.60)) * 0.30;
      float h = n * smoothstep(0., 5., -position.z - 2.);
      vH   = h;
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, h, position.z, 1.0);
    }
  `;

  const frag = `
    varying vec3  vPos;
    varying float vH;
    void main(){
      vec3 shadowSand = vec3(0.060, 0.072, 0.125);
      vec3 litSand    = vec3(0.205, 0.180, 0.140);
      float t   = clamp(vH * 0.36 + 0.52, 0., 1.);
      vec3 sand = mix(shadowSand, litSand, t);
      // crests catch the last of the horizon light
      float crest = smoothstep(0.9, 2.4, vH);
      float facing = smoothstep(-30., -90., vPos.z);
      sand += vec3(0.22, 0.13, 0.05) * crest * (0.4 + facing * 0.6);
      gl_FragColor = vec4(sand, 1.0);
    }
  `;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -8]}>
      <planeGeometry args={[80, 140, 160, 200]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
      />
    </mesh>
  );
};

// Faint drifting sand, fixed low opacity
const Sand = () => {
  const ref   = useRef();
  const COUNT = 1600;

  const { pos, vel, rnd } = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    const v = new Float32Array(COUNT * 3);
    const r = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      p[i*3]   = (Math.random()-.5) * 55;
      p[i*3+1] = Math.random() * 4.5;
      p[i*3+2] = (Math.random()-.5) * 45;
      v[i*3]   = (Math.random()-.25) * 0.018;
      v[i*3+1] = (Math.random()-.5)  * 0.003;
      v[i*3+2] = -(Math.random() * 0.012 + 0.004);
      r[i]     = Math.random();
    }
    return { pos: p, vel: v, rnd: r };
  }, []);

  const vert = `
    attribute float aRnd;
    varying float vOp;
    void main(){
      vOp = 0.14 * (0.3 + aRnd * 0.5);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = (1.0 + aRnd * 1.5) * (100. / -mv.z);
      gl_Position  = projectionMatrix * mv;
    }
  `;
  const frag = `
    varying float vOp;
    void main(){
      float d = distance(gl_PointCoord, vec2(0.5));
      float a = (1. - smoothstep(0.3, 0.5, d)) * vOp;
      gl_FragColor = vec4(0.72, 0.64, 0.50, a);
    }
  `;

  useFrame(() => {
    if (!ref.current) return;
    const p = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      p[i*3]   += vel[i*3]   * 0.5;
      p[i*3+1] += vel[i*3+1];
      p[i*3+2] += vel[i*3+2];
      if (p[i*3+2] < -22) {
        p[i*3+2] = 22;
        p[i*3]   = (Math.random()-.5) * 55;
        p[i*3+1] = Math.random() * 4;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={pos} itemSize={3} />
        <bufferAttribute attach="attributes-aRnd"     count={COUNT} array={rnd} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

// Stars, always on, restrained
const Stars = () => {
  const ref   = useRef();
  const COUNT = 1800;

  const { pos, rnd } = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    const r = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI * 0.48;
      p[i*3]   = Math.sin(phi) * Math.cos(theta) * 160;
      p[i*3+1] = Math.abs(Math.cos(phi)) * 160 + 10;
      p[i*3+2] = Math.sin(phi) * Math.sin(theta) * 160;
      r[i]     = Math.random();
    }
    return { pos: p, rnd: r };
  }, []);

  const vert = `
    attribute float aRnd;
    uniform float uTime;
    varying float vOp;
    void main(){
      float twinkle = sin(uTime * 1.4 + aRnd * 12.56) * 0.2 + 0.8;
      vOp = 0.42 * twinkle * (0.25 + aRnd * 0.55);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = (0.5 + aRnd * 1.0) * (280. / -mv.z);
      gl_Position  = projectionMatrix * mv;
    }
  `;
  const frag = `
    varying float vOp;
    void main(){
      float d = distance(gl_PointCoord, vec2(0.5));
      float a = (1. - smoothstep(0.18, 0.5, d)) * vOp;
      gl_FragColor = vec4(0.88, 0.90, 1.0, a);
    }
  `;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={pos} itemSize={3} />
        <bufferAttribute attach="attributes-aRnd"     count={COUNT} array={rnd} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

const SceneContent = () => {
  const { progress } = useScrollProgress();
  return (
    <>
      <fogExp2 attach="fog" args={[NIGHT, 0.018]} />
      <ambientLight intensity={0.4} color="#2A3450" />
      <SkyDome />
      <Afterglow />
      <Moon />
      <Terrain />
      <Sand />
      <Stars />
      <CameraRig progress={progress} />
    </>
  );
};

export default function Scene() {
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      camera={{ position: [0, 2.8, 14], fov: 58, near: 0.1, far: 500 }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color(NIGHT);
        scene.fog = new THREE.FogExp2(NIGHT, 0.018);
      }}
      dpr={[1, 1.5]}
    >
      <SceneContent />
    </Canvas>
  );
}