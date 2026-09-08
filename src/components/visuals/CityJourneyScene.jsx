'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { randomSequence } from '@/data/network';

const CITY_DISTANCE = 74;
const smooth = (start, end, value) => THREE.MathUtils.smoothstep(value, start, end);
const DUBAI_DISTANCE = 100;
const SG_TOWERS = [-4, -.5, 3].map(x => ({ x, z: -1, height: 9, width: 2.15, depth: 2.1, lean: -.12 }));
const AD_TOWERS = [[-4.5,8.5,-1],[-2.1,11.5,-2],[.6,10,0],[3.2,8.3,-1],[5.6,6.7,.5]].map(([x,height,z], i) => ({ x, z, height, width: 1.7, depth: 1.5, lean: (i - 2) * -.28, round: true }));

function skyline(seed) {
  const random = randomSequence(seed);
  return Array.from({ length: 32 }, (_, i) => ({ x: (i - 15.5) * 1.5, z: -7 - random() * 7, height: 1.2 + random() * 4.7, width: .6 + random() * .75, depth: .7 + random(), lean: 0 }));
}
const SG_BUILDINGS = skyline(45), AD_BUILDINGS = skyline(91);

const facadeVertex = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying float vDistance;
  void main() {
    vUv = uv; vNormal = normalize(normalMatrix * normal);
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDistance = length(mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const facadeFragment = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying float vDistance;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  void main() {
    vec2 grid = vec2(vUv.x * 22.0, vWorld.y * 6.5);
    vec2 cell = fract(grid);
    float window = step(.17,cell.x) * step(cell.x,.82) * step(.18,cell.y) * step(cell.y,.72);
    float on = step(.72,hash(floor(grid) + floor(vWorld.x * .2)));
    float rim = pow(1.0 - abs(vNormal.z), 2.0);
    float reflection = pow(.5 + .5 * sin(vUv.x * 18.0 + vNormal.x * 2.0), 10.0);
    vec3 glass = vec3(.006,.018,.028) + vec3(.12,.23,.3) * reflection * .32 + uColor * rim * .06;
    float frame = smoothstep(.89,.96,cell.y);
    float fin = smoothstep(.9,.99,cell.x);
    vec3 color = glass + mix(uColor,vec3(1.0,.74,.4),.5) * window * on * .48 + vec3(.11,.17,.2) * frame * .5 + uColor * fin * .09;
    color = mix(color,vec3(.0024,.0033,.0052),smoothstep(45.0,120.0,vDistance));
    gl_FragColor = vec4(color, uOpacity);
    #include <colorspace_fragment>
  }
`;

function towerGeometry(building) {
  const { width, height, depth, lean, round } = building;
  const geometry = round ? new THREE.CylinderGeometry(width * .43, width * .57, height, 48, 32) : new THREE.BoxGeometry(width, height, depth, 1, 32, 1);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = (p.getY(i) + height / 2) / height;
    p.setX(i, p.getX(i) * (1 - t * .06 + (round ? Math.sin(t*Math.PI)*.12 : 0)) + lean * t * t);
    if (round) { p.setY(i, p.getY(i) + p.getZ(i) * 1.15 * Math.pow(t,8)); p.setZ(i,p.getZ(i)*.78); }
    else p.setZ(i, p.getZ(i) + Math.sign(p.getZ(i)) * Math.pow(1-t,3) * .7);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function Building({ building, material, accent, base = false }) {
  const geometry = useMemo(() => towerGeometry(building), [building]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 25), [geometry]);
  useEffect(() => () => { geometry.dispose(); edges.dispose(); }, [geometry, edges]);
  return <group position={[building.x, building.height / 2, building.z]}>
    <mesh geometry={geometry} material={material} />
    {!base && <lineSegments geometry={edges}><lineBasicMaterial color={accent} transparent opacity={.55} /></lineSegments>}
  </group>;
}

function combine(parts) {
  const geometry = mergeGeometries(parts);
  parts.forEach(part => part.dispose());
  return geometry;
}

function Curves({ paths, color, opacity = 1 }) {
  const geometry = useMemo(() => {
    const points = [];
    paths.forEach(path => { for(let i=1;i<path.length;i++) points.push(...path[i-1],...path[i]); });
    return new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(points,3));
  }, [paths]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <lineSegments geometry={geometry}><lineBasicMaterial color={color} transparent opacity={opacity} /></lineSegments>;
}

function Palm({ position, scale = 1 }) {
  const fronds = useMemo(() => {
    const points = [];
    for (let a = 0; a < 7; a++) {
      const angle = a / 7 * Math.PI * 2;
      for (let i = 0; i < 6; i++) {
        for (const t of [i / 6, (i + 1) / 6]) points.push(Math.cos(angle) * t * 1.25, 2.1 + Math.sin(t * Math.PI) * .6 - t * .4, Math.sin(angle) * t * 1.25);
      }
    }
    return new Float32Array(points);
  }, []);
  const leaves = useMemo(() => {
    const p = [];
    for(let a=0;a<9;a++) for(let i=0;i<8;i++) {
      const angle=a/9*Math.PI*2, t=i/8, n=(i+1)/8;
      const point=(r,w)=>[Math.cos(angle)*r*1.3-Math.sin(angle)*w,2.15+Math.sin(r*Math.PI)*.6-r*.45,Math.sin(angle)*r*1.3+Math.cos(angle)*w];
      p.push(...point(t,-.1*(1-t)),...point(t,.1*(1-t)),...point(n,0));
    }
    const geometry=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(p,3));
    geometry.computeVertexNormals(); return geometry;
  }, []);
  useEffect(() => () => leaves.dispose(), [leaves]);
  return <group position={position} scale={scale}>
    <mesh position={[0,1.05,0]}><cylinderGeometry args={[.06,.1,2.1,5]} /><meshStandardMaterial color="#66503b" /></mesh>
    <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" array={fronds} count={fronds.length / 3} itemSize={3} /></bufferGeometry><lineBasicMaterial color="#47725a" /></lineSegments>
    <mesh geometry={leaves}><meshStandardMaterial color="#34715b" side={THREE.DoubleSide} roughness={.8} /></mesh>
  </group>;
}

function SuperTree({ position, scale = 1 }) {
  const planting=useMemo(()=>combine(Array.from({length:96},(_,i)=>{
    const a=i*2.4,y=.2+(i%24)*.13;
    return new THREE.IcosahedronGeometry(.12,1).scale(.8,1.7,.7).translate(Math.cos(a)*.28,y,Math.sin(a)*.28);
  })),[]);
  useEffect(()=>()=>planting.dispose(),[planting]);
  const { branches, rings, lights } = useMemo(() => {
    const branches=[], rings=[], lights=[];
    for(let a=0;a<36;a++) {
      const angle=a/36*Math.PI*2, path=[];
      for(let i=0;i<=24;i++) {
        const t=i/24, r=.24+Math.pow(t,4)*2.05;
        path.push([Math.cos(angle+t*.18)*r,t*4.8,Math.sin(angle+t*.18)*r]);
        if(i>16 && (i+a)%3===0) lights.push(...path[path.length-1]);
      }
      branches.push(path);
    }
    for(const [r,y] of [[.35,1.5],[.5,2.8],[.85,3.5],[1.4,4.05],[1.85,4.5],[2.3,4.8],[1.85,4.92]]) {
      rings.push(Array.from({length:73},(_,i)=>[Math.cos(i/72*Math.PI*2)*r,y,Math.sin(i/72*Math.PI*2)*r]));
    }
    return {branches,rings,lights:new Float32Array(lights)};
  }, []);
  return <group position={position} scale={scale}>
    <mesh position={[0,1.7,0]}><cylinderGeometry args={[.26,.4,3.4,16]} /><meshStandardMaterial color="#284b36" roughness={.9} /></mesh>
    <mesh geometry={planting}><meshStandardMaterial color="#2b4833" roughness={.95} /></mesh>
    <Curves paths={branches} color="#c172b3" opacity={.8} /><Curves paths={rings} color="#e8a0dc" opacity={.8} />
    <mesh position={[0,4.8,0]}><cylinderGeometry args={[1.85,2.3,.07,48]} /><meshStandardMaterial color="#4d294d" metalness={.4} roughness={.45} /></mesh>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" array={lights} count={lights.length/3} itemSize={3} /></bufferGeometry><pointsMaterial color="#ffc8ef" size={.065} transparent opacity={.9} depthWrite={false} /></points>
  </group>;
}

function Conservatory({ position, scale }) {
  const ribs=useMemo(()=>Array.from({length:19},(_,j)=>{
    const z=(j/18-.5)*2, r=Math.sqrt(1-z*z);
    return Array.from({length:49},(_,i)=>[Math.cos(i/48*Math.PI)*r,Math.sin(i/48*Math.PI)*r,z]);
  }),[]);
  return <group position={position} scale={scale}>
    <mesh><sphereGeometry args={[1,40,20,0,Math.PI*2,0,Math.PI/2]} /><meshStandardMaterial color="#285a65" metalness={.5} roughness={.2} transparent opacity={.48} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    <Curves paths={ribs} color="#a6c4c2" opacity={.65} />
    <mesh position={[0,.04,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.98,40]} /><meshStandardMaterial color="#163f32" /></mesh>
  </group>;
}

function Gardens() {
  const skyway=useMemo(()=>{
    const path=new THREE.CatmullRomCurve3([[7,3.65,1],[8.4,3.45,2.4],[10.5,3.25,1.5],[11.3,3.25,-1.4]].map(p=>new THREE.Vector3(...p)));
    return {geometry:new THREE.TubeGeometry(path,48,.07,5,false),rails:[0,.18].map(h=>path.getPoints(64).map(p=>[p.x,p.y+h,p.z]))};
  },[]);
  const beds=useMemo(()=>combine([[7,0,1,2.6],[11.3,0,-1.4,2.2],[14.5,0,1,1.8],[8.8,0,-4,1.7]].map(([x,y,z,s])=>new THREE.SphereGeometry(1,16,8).scale(s,.22,s).translate(x,y,z))),[]);
  useEffect(()=>()=>{skyway.geometry.dispose();beds.dispose();},[skyway,beds]);
  return <group name="Gardens by the Bay">
    <mesh geometry={beds}><meshStandardMaterial color="#173b2d" roughness={.95} /></mesh>
    <SuperTree position={[7,0,1]} /><SuperTree position={[11.3,0,-1.4]} scale={.85} /><SuperTree position={[14.5,0,1]} scale={.65} /><SuperTree position={[8.8,0,-4]} scale={.65} />
    <mesh geometry={skyway.geometry}><meshStandardMaterial color="#bb9862" emissive="#b78641" emissiveIntensity={.15} metalness={.55} roughness={.4} /></mesh>
    <Curves paths={skyway.rails} color="#f8cd87" />
    <Conservatory position={[15,0,-6]} scale={[3.1,2.5,2]} /><Conservatory position={[9.5,0,-8]} scale={[3.7,1.7,2.2]} />
  </group>;
}

function GrandMosque() {
  const geometry=useMemo(()=>{
    const parts=[new THREE.BoxGeometry(7,.9,3.5).translate(0,.45,0)];
    for(const x of [-3,-2.4,-1.8,-1.2,-.6,0,.6,1.2,1.8,2.4,3]) parts.push(new THREE.CylinderGeometry(.055,.075,1.2,8).translate(x,.6,1.85));
    for(const x of [-3.4,3.4]) for(const z of [-1.5,1.5]) {
      parts.push(new THREE.CylinderGeometry(.1,.17,3.4,12).translate(x,1.7,z),new THREE.ConeGeometry(.14,.6,12).translate(x,3.7,z),new THREE.CylinderGeometry(.24,.24,.08,16).translate(x,2.8,z));
    }
    for(const [x,z,r] of [[0,0,1.1],[-1.9,0,.65],[1.9,0,.65],[-2.8,1,.32],[2.8,1,.32]]) {
      parts.push(new THREE.SphereGeometry(r,24,16,0,Math.PI*2,0,Math.PI/2).scale(1,1.2,1).translate(x,.9,z),new THREE.ConeGeometry(.055,.35,8).translate(x,.9+r*1.2+.12,z));
    }
    return combine(parts);
  },[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <group name="Sheikh Zayed Grand Mosque" position={[-10,0,1]}>
    <mesh geometry={geometry}><meshStandardMaterial color="#d2c5ae" roughness={.4} metalness={.1} emissive="#ad8d5d" emissiveIntensity={.08} /></mesh>
    <mesh position={[0,.025,2.5]}><boxGeometry args={[7,.04,.8]} /><meshStandardMaterial color="#287b89" metalness={.5} roughness={.15} /></mesh>
  </group>;
}

function Dubai({ material }) {
  const khalifa=useMemo(()=>{
    const parts=[];
    for(let tier=0;tier<12;tier++) {
      const y=tier*1.12, r=1.05*(1-tier/14);
      parts.push(new THREE.CylinderGeometry(r*.8,r,1.14,18).translate(0,y+.57,0));
      for(let wing=0;wing<3;wing++) {
        const angle=wing/3*Math.PI*2;
        if(tier+wing<12) parts.push(new THREE.CylinderGeometry(r*.47,r*.55,1.12,12).translate(Math.cos(angle)*r*.8,y+.56,Math.sin(angle)*r*.8));
      }
    }
    parts.push(new THREE.CylinderGeometry(.025,.16,2.5,12).translate(0,14.6,0),new THREE.ConeGeometry(.035,1.5,8).translate(0,16.6,0));
    return combine(parts);
  },[]);
  const sail=useMemo(()=>{
    const shape=new THREE.Shape();shape.moveTo(-1.2,0);shape.lineTo(-1.2,6.5);shape.bezierCurveTo(2.2,4.8,2.6,1.4,1.4,0);shape.closePath();
    const geometry=new THREE.ExtrudeGeometry(shape,{depth:.7,bevelEnabled:true,bevelThickness:.06,bevelSize:.08,bevelSegments:2,steps:1});
    const outline=shape.getPoints(48).map(p=>[p.x,p.y,.82]);
    const floors=Array.from({length:22},(_,i)=>{const y=.25+i*.25;return [[-1.05,y,.84],[1.7*(1-Math.pow(y/6.7,2)),y,.84]];});
    return {geometry,lines:[outline,...floors]};
  },[]);
  useEffect(()=>()=>{khalifa.dispose();sail.geometry.dispose();},[khalifa,sail]);
  return <group name="Dubai skyline">
    <mesh name="Burj Khalifa" geometry={khalifa} position={[0,0,-2]} material={material} />
    <group name="Burj Al Arab" position={[7,0,1]} rotation={[0,-.15,0]}>
      <mesh geometry={sail.geometry}><meshStandardMaterial color="#8eadbd" metalness={.45} roughness={.28} emissive="#4b7886" emissiveIntensity={.1} /></mesh>
      <Curves paths={sail.lines} color="#d9e8ec" opacity={.7} />
      <mesh position={[-1.25,3.4,.4]}><cylinderGeometry args={[.08,.13,7,12]} /><meshStandardMaterial color="#c6d4d8" /></mesh>
      <mesh position={[-1.5,5.3,1]}><cylinderGeometry args={[.55,.55,.1,32]} /><meshStandardMaterial color="#90a6a8" /></mesh>
    </group>
    <group name="Dubai Frame" position={[-6,0,-1]}>
      {[-1.15,1.15].map(x=><mesh key={x} position={[x,1.85,0]}><boxGeometry args={[.25,3.7,.3]} /><meshStandardMaterial color="#bda15d" metalness={.6} roughness={.3} emissive="#c29e41" emissiveIntensity={.15} /></mesh>)}
      <mesh position={[0,3.65,0]}><boxGeometry args={[2.55,.28,.3]} /><meshStandardMaterial color="#d4b971" metalness={.6} roughness={.3} /></mesh>
    </group>
  </group>;
}

function City({ kind, groupRef }) {
  const singapore = kind === 'singapore';
  const dubai = kind === 'dubai';
  const accent = singapore ? '#9ddbf1' : '#f3ca8d';
  const material = useMemo(() => new THREE.ShaderMaterial({ vertexShader: facadeVertex, fragmentShader: facadeFragment, uniforms: { uColor: { value: new THREE.Color(accent) }, uOpacity: { value: 1 } }, transparent: true }), [accent]);
  const boat = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-6.6,-1); shape.quadraticCurveTo(-1,-1.8,7.4,-.75); shape.quadraticCurveTo(8.2,.1,6.7,1); shape.quadraticCurveTo(-1,1.55,-6.1,.95); shape.quadraticCurveTo(-7,.5,-6.6,-1);
    const railPoints=shape.getPoints(100), lift=x=>Math.pow(Math.max(0,x-4)/4,2)*.4;
    const geometry=new THREE.ExtrudeGeometry(shape, { depth: .26, bevelEnabled: true, bevelThickness: .08, bevelSize: .12, bevelSegments: 4, steps: 1 });
    const vertices=geometry.attributes.position;
    for(let i=0;i<vertices.count;i++) vertices.setZ(i,vertices.getZ(i)+lift(vertices.getX(i)));
    geometry.computeVertexNormals();
    return {geometry,rails:[...([.13,.32].map(h=>railPoints.map(p=>[p.x,9.38+h+lift(p.x),-p.y-1]))),...railPoints.filter((_,i)=>i%4===0).map(p=>[[p.x,9.44+lift(p.x),-p.y-1],[p.x,9.7+lift(p.x),-p.y-1]])]};
  }, []);
  useEffect(() => () => { material.dispose(); boat.geometry.dispose(); }, [material, boat]);
  const towers = singapore ? SG_TOWERS : AD_TOWERS;
  const buildings = singapore ? SG_BUILDINGS : AD_BUILDINGS;
  return <group ref={groupRef} name={kind} position={[singapore ? 0 : dubai ? DUBAI_DISTANCE : CITY_DISTANCE,0,0]}>
    <mesh position={[0,-.12,-4]}><boxGeometry args={[48,.3,14]} /><meshStandardMaterial color="#080d13" /></mesh>
    <mesh position={[0,.035,3.1]}><boxGeometry args={[46,.035,.035]} /><meshBasicMaterial color={accent} /></mesh>
    <mesh position={[0,.04,2.6]}><boxGeometry args={[46,.08,.5]} /><meshStandardMaterial color="#354351" /></mesh>
    {buildings.map((building, i) => <Building key={'background'+i} building={building} material={material} accent={accent} base />)}
    {!dubai && towers.map((building, i) => <Building key={i} building={building} material={material} accent={accent} />)}
    {singapore ? <>
      <mesh name="Marina Bay Sands SkyPark" geometry={boat.geometry} position={[0,9.08,-1]} rotation={[-Math.PI/2,0,0]}><meshStandardMaterial color="#bcc8cb" metalness={.45} roughness={.3} /></mesh>
      <mesh position={[-.3,9.44,-1]}><boxGeometry args={[11.5,.045,1.8]} /><meshStandardMaterial color="#645d44" roughness={.7} /></mesh>
      <mesh name="Infinity pool" position={[-.7,9.47,-.35]}><boxGeometry args={[9.6,.02,.65]} /><meshStandardMaterial color="#239bb0" emissive="#39b6ce" emissiveIntensity={.45} metalness={.6} roughness={.12} /></mesh>
      <mesh position={[-.7,9.48,0]}><boxGeometry args={[9.6,.025,.025]} /><meshBasicMaterial color="#b9f2f2" /></mesh>
      <Curves paths={boat.rails} color="#c7d9dc" opacity={.7} />
      {[-4.8,-3.5,-2.2,-.9,.4,1.7,3,4.3,5.6].map(x => <Palm key={x} position={[x,9.48,-1.85]} scale={.23} />)}
      <Gardens />
    </> : dubai ? <Dubai material={material} /> : <GrandMosque />}
    {[-16,-12,-8,8,12,16].map(x => <Palm key={x} position={[x,0,2.3]} scale={singapore ? .6 : .85} />)}
  </group>;
}

function Waterfront({ compact }) {
  const water=useMemo(()=>{
    const geometry=new THREE.PlaneGeometry(240,180);
    const reflector=new Reflector(geometry,{textureWidth:compact?256:768,textureHeight:compact?256:768,multisample:0,clipBias:.003,shader:{
      uniforms:{tDiffuse:{value:null},color:{value:null},textureMatrix:{value:null},uTime:{value:0}},
      vertexShader:`uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vWorld;
        void main(){vUv=textureMatrix*vec4(position,1.0);vWorld=(modelMatrix*vec4(position,1.0)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader:`uniform sampler2D tDiffuse; uniform float uTime; varying vec4 vUv; varying vec3 vWorld;
        void main(){
          vec2 uv=vUv.xy/vUv.w;
          float wave=sin(vWorld.z*5.0+uTime*.8+sin(vWorld.x*1.8))*sin(vWorld.z*2.3-uTime*.4);
          uv.x+=wave*.0025;uv.y+=sin(vWorld.z*7.0+vWorld.x*.8+uTime)*.0012;
          vec3 reflection=texture2D(tDiffuse,uv).rgb*.4;
          reflection+=(texture2D(tDiffuse,uv+vec2(.0015,.001)).rgb+texture2D(tDiffuse,uv-vec2(.0015,.001)).rgb)*.3;
          float fresnel=pow(1.0-abs(normalize(cameraPosition-vWorld).y),2.0);
          vec3 color=mix(vec3(.0024,.004,.006),reflection, (.25+fresnel*.5)*(.82+wave*.18));
          color=mix(color,vec3(.0024,.0033,.0052),smoothstep(40.0,100.0,length(cameraPosition.xz-vWorld.xz)));
          gl_FragColor=vec4(color,1.0);
          #include <colorspace_fragment>
        }`,
    }});
    reflector.rotation.x=-Math.PI/2;reflector.position.set(50,-.3,20);
    return reflector;
  },[compact]);
  useEffect(()=>()=>{water.geometry.dispose();water.dispose();},[water]);
  useFrame((_,delta)=>{water.material.uniforms.uTime.value+=Math.min(delta,.05);});
  return <primitive object={water} />;
}
const flightVertex = `
  uniform float uProgress, uTime, uDpr;
  attribute vec3 aEnd;
  attribute float aSeed;
  varying vec3 vColor;
  void main() {
    float leave = smoothstep(.19 + aSeed * .035, .43, uProgress);
    float arrive = smoothstep(.45, .66 + aSeed * .035, uProgress);
    float t = fract(aSeed + uTime * .025);
    float spread = .4 + sin(t * 3.14159) * .9;
    vec3 route = vec3(t * 74.0, 7.0 + sin(t * 3.14159) * 12.0 + sin(aSeed*1471.0)*spread, cos(aSeed*1771.0)*spread*2.8);
    route.y += sin(uTime * .7 + aSeed * 110.0) * .25;
    vec3 p = mix(mix(position,route,leave),aEnd,arrive);
    float finish = smoothstep(.97,1.0,uProgress);
    p += vec3(sin(aSeed*91.0),cos(aSeed*62.0),sin(aSeed*41.0)) * finish * 9.0;
    vColor = mix(vec3(.45,.78,1.0),vec3(1.0,.72,.38),mix(t,smoothstep(.32,.72,uProgress),.6));
    vec4 mv = modelViewMatrix * vec4(p,1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((1.5 + aSeed * 2.0) * (1.0 + leave * (1.0-arrive) * 3.5) * uDpr * 32.0 / max(3.0,-mv.z),1.0,18.0);
  }
`;
const flightFragment = `
  varying vec3 vColor;
  void main() {
    vec2 p = gl_PointCoord - .5; float d = length(p); if(d > .5) discard;
    float light = exp(-d*d*75.0) + exp(-d*d*18.0)*.22;
    gl_FragColor = vec4(vColor,light * .85);
  }
`;

function flightGeometry(compact) {
  const random = randomSequence(67), start = [], end = [], seed = [];
  const sample = (buildings, offset) => {
    const b = buildings[Math.floor(random()*buildings.length)], t = random();
    return [offset + b.x + (random()-.5)*b.width + b.lean*t*t, t*b.height, b.z + b.depth*.51];
  };
  for (let i=0; i<(compact ? 1400 : 3400); i++) { start.push(...sample(SG_TOWERS,0)); end.push(...sample(AD_TOWERS,CITY_DISTANCE)); seed.push(random()); }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(start,3)); geometry.setAttribute('aEnd',new THREE.Float32BufferAttribute(end,3)); geometry.setAttribute('aSeed',new THREE.Float32BufferAttribute(seed,1));
  return geometry;
}

function World({ progress, compact, onReady, onFailure }) {
  const sg = useRef(), ad = useRef(), dubai = useRef();
  const materials = useRef([[],[],[]]);
  const elapsed = useRef(0), position = useRef(progress.current);
  const { camera, gl } = useThree();
  const flight = useMemo(() => flightGeometry(compact), [compact]);
  const uniforms = useMemo(() => ({ uProgress:{value:progress.current},uTime:{value:0},uDpr:{value:1} }), [progress]);
  const stars = useMemo(() => {
    const random = randomSequence(8), points = [];
    for(let i=0;i<600;i++) points.push((random()-.5)*170+37,8+random()*55,-20-random()*70);
    return new Float32Array(points);
  }, []);
  const paths = useMemo(() => ({
    camera: new THREE.CatmullRomCurve3([[10,18,33],[12,20,40],[37,25,65],[65,16,40],[84,8,32]].map(p=>new THREE.Vector3(...p))),
    target: new THREE.CatmullRomCurve3([[2,3.8,0],[12,4,0],[37,4,0],[62,4,0],[71,4,0]].map(p=>new THREE.Vector3(...p))),
    eye: new THREE.Vector3(), look: new THREE.Vector3(),
  }), []);

  useEffect(() => {
    [sg.current,ad.current,dubai.current].forEach((group,index) => {
      const unique = new Set();
      group.traverse(object => { if(object.material) unique.add(object.material); });
      materials.current[index] = [...unique].map(material => { const opacity=material.opacity; material.transparent=true; return {material,opacity}; });
    });
    onReady();
    const lost = event => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost',lost);
    return () => gl.domElement.removeEventListener('webglcontextlost',lost);
  }, [gl,onReady,onFailure]);
  useEffect(() => () => flight.dispose(),[flight]);

  useFrame((_,delta) => {
    const dt = Math.min(delta,.05); elapsed.current += dt;
    position.current = THREE.MathUtils.damp(position.current,progress.current,6,dt);
    const p = position.current;
    uniforms.uProgress.value=p; uniforms.uTime.value=elapsed.current; uniforms.uDpr.value=gl.getPixelRatio();
    const fades=[1-smooth(.23,.43,p),smooth(.46,.65,p)*(1-smooth(.98,1,p)),smooth(.75,.86,p)*(1-smooth(.98,1,p))];
    [sg.current,ad.current,dubai.current].forEach((group,i) => {
      group.visible=fades[i]>.005;
      materials.current[i].forEach(({material,opacity}) => { if(material.uniforms?.uOpacity) material.uniforms.uOpacity.value=fades[i]; else material.opacity=opacity*fades[i]; });
    });
    if(p<.25){const t=smooth(0,.25,p);paths.eye.set(14-4*t,15+3*t,36-3*t);paths.look.set(-2+4*t,3.8,0);}
    else if(p<.65){const t=smooth(.25,.65,p);paths.camera.getPoint(t,paths.eye);paths.target.getPoint(t,paths.look);}
    else if(p<.8){const t=smooth(.65,.8,p);paths.eye.set(84-3*t,8+t,32+2*t);paths.look.set(71+t,4,0);}
    else {const t=smooth(.8,.96,p);paths.eye.set(81+20*t,9+5*t,34+22*t);paths.look.set(72+12*t,4+2*t,0);}
    if(compact) {
      paths.eye.z+=10;paths.look.y+=4;
      if(p<.25) paths.look.x+=smooth(0,.25,p)*4;
      if(p>.8) {const t=smooth(.8,.94,p);paths.look.x+=18*t;paths.eye.x+=6*t;paths.eye.z-=18*t;}
    }
    camera.position.copy(paths.eye); camera.lookAt(paths.look);
    const fov=compact?55:45+smooth(.28,.43,p)*(1-smooth(.5,.65,p))*10;
    if(Math.abs(camera.fov-fov)>.01){camera.fov=fov;camera.updateProjectionMatrix();}
  });

  return <>
    <color attach="background" args={['#080b10']} />
    <fog attach="fog" args={['#080b10',45,110]} />
    <ambientLight intensity={.8} /><hemisphereLight args={['#9ac4eb','#171a2a',1.2]} />
    <directionalLight position={[8,20,12]} color="#c5e5fa" intensity={3} /><directionalLight position={[-10,12,-8]} color="#eab985" intensity={2} />
    <City kind="singapore" groupRef={sg} /><City kind="abudhabi" groupRef={ad} /><City kind="dubai" groupRef={dubai} />
    <Waterfront compact={compact} />
    <points frustumCulled={false} geometry={flight}><shaderMaterial vertexShader={flightVertex} fragmentShader={flightFragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} /></points>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" array={stars} count={stars.length/3} itemSize={3} /></bufferGeometry><pointsMaterial color="#b1c6e5" size={.065} transparent opacity={.65} depthWrite={false} /></points>
  </>;
}

export default function CityJourneyScene(props) {
  return <Canvas dpr={[1,props.compact?1:1.5]} camera={{position:[11,5.5,24],fov:43,near:.1,far:220}} frameloop={props.visible?'always':'never'} gl={{alpha:false,antialias:true,powerPreference:'high-performance'}} aria-hidden="true"><World {...props} /></Canvas>;
}
