/* Shared movement-driven walk timing. No changes to combat or movement rules. */
(function(root){
  'use strict';
  const FRAMES=8;
  function blocked(u){return u.dead||u.atk||u.under||u.pupa>0||u.cocoon>0||u.hop>0||u.st?.stun>0||u.st?.root>0||u.toss>0;}
  function strideLength(size=1){return 32*Math.pow(size,.6);}
  function advance(state,u,before,dt){
    const distance=Math.abs(u.x-before);
    const moving=Number.isFinite(distance)&&distance>1e-5&&!blocked(u)&&!(u.sp.fly&&u.alt>4)&&!(u.pushT!=null&&u.pushT>=state.time-.2);
    state.time+=dt;
    state.moving=moving;
    if(moving)state.phase=(state.phase+distance/strideLength(u.sp.size||1))%1;
    else state.phase=0;
    return state;
  }
  function frame(state){return state.moving?Math.floor(state.phase*FRAMES)%FRAMES:0;}
  // Identical trajectories half a cycle apart: planted feet move backwards,
  // returning feet lift clear of the floor. Left and right have equal reach.
  function foot(phase,reach=11,lift=7){
    const p=((phase%1)+1)%1;
    if(p<.5)return{x:reach*(1-4*p),y:0};
    const t=(p-.5)*2;
    return{x:-reach+2*reach*t,y:-lift*Math.sin(Math.PI*t)};
  }
  root.ANTHOLDStride={FRAMES,advance,frame,foot,strideLength};
})(globalThis);