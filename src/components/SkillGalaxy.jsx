import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Text, Stars } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

const skillData=[
 {name:'Java',type:'PROGRAMMING',detail:'A core programming language in my learning toolkit. Exploring object-oriented programming and application fundamentals.',color:'#f0a45b'},
 {name:'Python',type:'PROGRAMMING',detail:'Using Python to strengthen programming logic, problem-solving and scripting fundamentals.',color:'#72c9ff'},
 {name:'HTML & CSS',type:'WEB',detail:'Building structured web pages and responsive interfaces with semantic HTML and modern CSS.',color:'#ff8c72'},
 {name:'JavaScript',type:'WEB',detail:'Learning the language of the web to create interactive interfaces and dynamic experiences.',color:'#f2db6b'},
 {name:'DSA',type:'COMPUTER SCIENCE',detail:'Developing foundational understanding of data structures, algorithms and efficient problem-solving.',color:'#a995ff'},
 {name:'SQL',type:'DATA',detail:'Learning relational data concepts and querying structured information with SQL.',color:'#79e5d3'},
]
function SkillOrb({item,index,onSelect,active}){
 const angle=index/skillData.length*Math.PI*2
 const pos=[Math.cos(angle)*2.45,Math.sin(angle)*1.25,Math.sin(angle*2)*.45]
 return <Float speed={.7+index*.12} floatIntensity={.2}>
   <group position={pos} onClick={onSelect} onPointerOver={e=>{e.stopPropagation();document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}>
    <mesh scale={active?1.18:1}>
      <sphereGeometry args={[.48,48,48]}/>
      <meshPhysicalMaterial color={item.color} roughness={.22} metalness={.35} emissive={item.color} emissiveIntensity={active ? .55 : .22} clearcoat={1}/>
    </mesh>
    <mesh scale={1.09}><sphereGeometry args={[.48,32,32]}/><meshBasicMaterial color={item.color} transparent opacity={.12} side={THREE.BackSide}/></mesh>
    <mesh rotation={[.6,index*.35,0]}><torusGeometry args={[.64,.009,8,80]}/><meshBasicMaterial color={item.color} transparent opacity={.7}/></mesh>
    <Text position={[0,-.78,0]} fontSize={.17} color="#eaf6ff" anchorX="center" anchorY="middle">{item.name}</Text>
    <mesh onClick={onSelect} visible={false}><sphereGeometry args={[.8,16,16]}/><meshBasicMaterial transparent opacity={0}/></mesh>
   </group>
 </Float>
}
function Orbs({selected,setSelected}){
 return <group>
  <Stars radius={12} depth={8} count={450} factor={2} fade/>
  {skillData.map((item,i)=><SkillOrb key={item.name} item={item} index={i} active={selected===i} onSelect={()=>setSelected(i)}/>)}
 </group>
}
export default function SkillGalaxy(){
 const [selected,setSelected]=useState(0)
 return <div className="skill-galaxy">
  <div className="skill-canvas"><Canvas camera={{position:[0,0,8],fov:45}} dpr={[1,1.4]} gl={{alpha:true,antialias:true}}>
   <ambientLight intensity={1.2}/><pointLight position={[2,3,4]} intensity={25} color="#8cecff"/><pointLight position={[-3,-2,2]} intensity={12} color="#9870ff"/>
   <Orbs selected={selected} setSelected={setSelected}/>
  </Canvas></div>
  <div className="skill-selector">{skillData.map((s,i)=><button key={s.name} className={selected===i?'selected':''} onClick={()=>setSelected(i)}><span style={{background:s.color}}/>{s.name}</button>)}</div>
  <AnimatePresence mode="wait"><motion.div key={selected} className="skill-detail" initial={{opacity:0,y:12,filter:'blur(5px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} exit={{opacity:0,y:-8}} transition={{duration:.3}}>
    <span className="mono-label">SKILL NODE / {String(selected+1).padStart(2,'0')} · {skillData[selected].type}</span>
    <h3>{skillData[selected].name}</h3><p>{skillData[selected].detail}</p>
  </motion.div></AnimatePresence>
 </div>
}
