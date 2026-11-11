import { useEffect } from 'react'
export default function CustomCursor(){
 useEffect(()=>{
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches
  if(!fine||reduce)return
  const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring')
  let frame=0,x=innerWidth/2,y=innerHeight/2
  const move=e=>{x=e.clientX;y=e.clientY;document.documentElement.style.setProperty('--mx',`${x}px`);document.documentElement.style.setProperty('--my',`${y}px`);if(!frame)frame=requestAnimationFrame(()=>{dot.style.transform=`translate3d(${x}px,${y}px,0)`;ring.style.transform=`translate3d(${x}px,${y}px,0)`;frame=0})}
  const hover=()=>document.body.classList.add('cursor-hover'),out=()=>document.body.classList.remove('cursor-hover')
  const els=document.querySelectorAll('a,button,.tilt-card')
  window.addEventListener('pointermove',move,{passive:true})
  els.forEach(el=>{el.addEventListener('pointerenter',hover);el.addEventListener('pointerleave',out)})
  document.body.classList.add('cursor-active')
  return()=>{window.removeEventListener('pointermove',move);els.forEach(el=>{el.removeEventListener('pointerenter',hover);el.removeEventListener('pointerleave',out)});cancelAnimationFrame(frame);document.body.classList.remove('cursor-active','cursor-hover')}
 },[])
 return <><div className="cursor-dot"/><div className="cursor-ring"/></>
}
