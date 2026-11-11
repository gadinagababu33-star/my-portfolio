import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Stars, Environment } from '@react-three/drei'
import * as THREE from 'three'

function makeStarField(count, radius, seed=1) {
  let s=seed
  const rand=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296 }
  const positions=new Float32Array(count*3)
  const colors=new Float32Array(count*3)
  for(let i=0;i<count;i++){
    const r=radius*(.25+rand()*.75), theta=rand()*Math.PI*2, u=rand()*2-1
    const q=Math.sqrt(1-u*u)
    positions[i*3]=r*q*Math.cos(theta)
    positions[i*3+1]=r*u
    positions[i*3+2]=r*q*Math.sin(theta)
    const tint=rand()
    const c=new THREE.Color(tint>.86?'#b7a4ff':tint>.55?'#74e9ff':'#d8e7ff')
    colors[i*3]=c.r; colors[i*3+1]=c.g; colors[i*3+2]=c.b
  }
  return {positions,colors}
}
function DeepStarfield(){
  const ref=useRef()
  const data=useMemo(()=>makeStarField(5200,48,17),[])
  useFrame((state,delta)=>{if(ref.current){ref.current.rotation.y+=delta*.003;ref.current.rotation.x=Math.sin(state.clock.elapsedTime*.025)*.025}})
  return <points ref={ref}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[data.positions,3]}/><bufferAttribute attach="attributes-color" args={[data.colors,3]}/></bufferGeometry>
    <pointsMaterial size={.035} vertexColors transparent opacity={.9} sizeAttenuation depthWrite={false}/>
  </points>
}
function NebulaCloud({position,scale,color,opacity=.14,seed=1}){
  const ref=useRef()
  const positions=useMemo(()=>{
    let s=seed; const rand=()=>{s=(s*1103515245+12345)>>>0;return s/4294967296}
    const a=new Float32Array(420*3)
    for(let i=0;i<420;i++){const angle=rand()*Math.PI*2, r=Math.sqrt(rand());a[i*3]=Math.cos(angle)*r*1.8;a[i*3+1]=(rand()-.5)*.45;a[i*3+2]=Math.sin(angle)*r*1.2}
    return a
  },[seed])
  useFrame((_,d)=>{if(ref.current)ref.current.rotation.y+=d*.012})
  return <points ref={ref} position={position} scale={scale}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry>
    <pointsMaterial color={color} size={.09} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending}/>
  </points>
}
function PlanetSurface(){
  const material=useMemo(()=>new THREE.ShaderMaterial({
    uniforms:{uTime:{value:0}},
    vertexShader:`varying vec3 vNormal; varying vec3 vPos; varying vec2 vUv; void main(){vNormal=normalize(normalMatrix*normal);vPos=position;vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`
      varying vec3 vNormal; varying vec3 vPos; varying vec2 vUv; uniform float uTime;
      float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
      float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
      void main(){
        vec3 p=normalize(vPos)*3.2; float n=noise(p*2.0)+.48*noise(p*5.0)+.18*noise(p*11.0);
        float bands=sin(vUv.y*52.0+n*3.2+sin(vUv.x*18.0)*.7)*.5+.5;
        float storm=smoothstep(.58,.9,noise(p*4.5+vec3(uTime*.012,0.,0.)));
        vec3 deep=vec3(.025,.075,.20); vec3 ocean=vec3(.08,.32,.48); vec3 ice=vec3(.30,.77,.82);
        vec3 col=mix(deep,ocean,smoothstep(.28,.68,n)); col=mix(col,ice,smoothstep(.72,.93,n)*.62);
        col=mix(col,vec3(.42,.27,.78),storm*.26); col+=bands*.025;
        vec3 lightDir=normalize(vec3(-.65,.5,1.)); float light=max(dot(normalize(vNormal),lightDir),0.);
        float rim=pow(1.-max(dot(normalize(vNormal),vec3(0.,0.,1.)),0.),2.2);
        col*=.18+light*1.25; col+=vec3(.06,.35,.55)*rim*.28;
        gl_FragColor=vec4(col,1.);
      }`,
  }),[])
  useFrame((state)=>{material.uniforms.uTime.value=state.clock.elapsedTime})
  return <primitive object={material} attach="material"/>
}
function Planet(){
  const group=useRef(), ring=useRef(), moon=useRef()
  useFrame((state,delta)=>{
    if(group.current){group.current.rotation.y+=delta*.055;group.current.rotation.z=Math.sin(state.clock.elapsedTime*.15)*.035}
    if(ring.current)ring.current.rotation.z+=delta*.045
    if(moon.current){const t=state.clock.elapsedTime*.22;moon.current.position.set(Math.cos(t)*2.0,Math.sin(t*.8)*.34,Math.sin(t)*1.5)}
  })
  return <group>
    <group ref={group}>
      <mesh castShadow receiveShadow><sphereGeometry args={[1.48,96,96]}/><PlanetSurface/></mesh>
      <mesh scale={1.035}><sphereGeometry args={[1.48,64,64]}/><meshBasicMaterial color="#56d9ff" side={THREE.BackSide} transparent opacity={.075}/></mesh>
      <mesh scale={1.075}><sphereGeometry args={[1.48,64,64]}/><meshBasicMaterial color="#658dff" side={THREE.BackSide} transparent opacity={.045}/></mesh>
      <mesh ref={ring} rotation={[1.18,.2,.18]}>
        <torusGeometry args={[2.05,.018,12,220]}/><meshStandardMaterial color="#8eeaff" metalness={.9} roughness={.22} emissive="#1a698c" emissiveIntensity={.55}/>
      </mesh>
      <mesh rotation={[1.18,.2,.18]}>
        <torusGeometry args={[2.22,.006,8,220]}/><meshBasicMaterial color="#a99aff" transparent opacity={.6}/>
      </mesh>
    </group>
    <mesh ref={moon}>
      <sphereGeometry args={[.22,32,32]}/><meshStandardMaterial color="#a9b7d8" roughness={.8} metalness={.2}/>
    </mesh>
    <mesh position={[1.8,-1.35,-.9]}><sphereGeometry args={[.1,24,24]}/><meshStandardMaterial color="#a98bff" emissive="#6745c9" emissiveIntensity={1.2}/></mesh>
  </group>
}
function UniverseObjects(){
  const ref=useRef()
  useFrame((state,delta)=>{if(ref.current)ref.current.rotation.y+=delta*.018})
  return <group ref={ref}>
    {Array.from({length:12}).map((_,i)=>{
      const a=i/12*Math.PI*2,r=3.0+(i%3)*.35
      return <Float key={i} speed={.5+i*.07} floatIntensity={.18}>
        <mesh position={[Math.cos(a)*r,Math.sin(a*2)*.72,Math.sin(a)*r*.68]} rotation={[a,a*.5,0]}>
          {i%3===0?<octahedronGeometry args={[.11,0]}/>:<dodecahedronGeometry args={[.075,0]}/>}
          <meshStandardMaterial color={i%2?'#a58aff':'#77eaff'} metalness={.85} roughness={.2} emissive={i%2?'#39226e':'#124d64'} emissiveIntensity={.8}/>
        </mesh>
      </Float>
    })}
  </group>
}
function World(){
  const root=useRef()
  useFrame((state,delta)=>{
    const p=state.pointer
    if(root.current){
      root.current.rotation.y=THREE.MathUtils.lerp(root.current.rotation.y,p.x*.055,.025)
      root.current.rotation.x=THREE.MathUtils.lerp(root.current.rotation.x,-p.y*.035,.025)
      root.current.position.y=Math.sin(state.clock.elapsedTime*.22)*.05
    }
  })
  return <group ref={root}>
    <DeepStarfield/>
    <NebulaCloud position={[-7,3,-12]} scale={[3.5,2.2,2]} color="#7254ce" opacity={.25} seed={3}/>
    <NebulaCloud position={[7,-2,-15]} scale={[4,2.5,2]} color="#1c9fc4" opacity={.2} seed={8}/>
    <NebulaCloud position={[-2,-5,-18]} scale={[5,2,2]} color="#a04b9e" opacity={.12} seed={12}/>
    <Planet/>
    <UniverseObjects/>
    <Stars radius={65} depth={45} count={1600} factor={3} saturation={.35} fade speed={.25}/>
    <Sparkles count={130} scale={13} size={2.2} speed={.18} color="#b9eaff" opacity={.6}/>
  </group>
}
export default function UniverseScene(){
  return <div className="universe-canvas" aria-hidden="true">
    <Canvas dpr={[1,1.45]} camera={{position:[0,0,8.2],fov:43}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}}>
      <color attach="background" args={['#050711']}/>
      <fog attach="fog" args={['#050711',13,35]}/>
      <ambientLight intensity={.42}/>
      <hemisphereLight args={['#a9dfff','#0b1027',.8]}/>
      <directionalLight position={[-5,4,7]} intensity={2.5} color="#d5eaff"/>
      <pointLight position={[4,1,2]} intensity={38} distance={14} color="#27c8ff"/>
      <pointLight position={[-4,-3,-2]} intensity={22} distance={12} color="#8e5bff"/>
      <World/>
    </Canvas>
    <div className="universe-vignette"/>
  </div>
}
