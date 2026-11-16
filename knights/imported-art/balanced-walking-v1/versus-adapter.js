/* Load after the game's script. Opt-in; original game files stay untouched. */
(function(){
  'use strict';
  const base=new URL('./sheets/',document.currentScript.src);
  const images={},frames={},states=new WeakMap();
  let manifest={};
  const previous={stepUnits,animPose,animSprite};
  fetch(new URL('manifest.json',base)).then(r=>{if(!r.ok)throw Error('Walk manifest unavailable');return r.json();}).then(data=>{
    manifest=data;
    for(const [key,a]of Object.entries(data)){const im=new Image();im.src=new URL(a.file,base).href;images[key]=im;}
  }).catch(e=>console.error('ANTHOLD walking:',e));
  function getFrame(sp,i){
    const im=images[sp.id],a=manifest[sp.id];if(!ready(im)||!a)return null;
    const key=sp.id+'|'+i;if(frames[key])return frames[key];
    const c=document.createElement('canvas'),foot=Math.min(112,a.y+2),s=KC.size*Math.pow(sp.size||1,.6)/a.h;
    c.width=144;c.height=foot;c.getContext('2d').drawImage(im,i*144,0,144,foot,0,0,144,foot);c.k=2.4/s;
    return frames[key]=c;
  }
  stepUnits=function(){
    const before=new Map(R.units.map(u=>[u,u.x]));
    previous.stepUnits();
    for(const u of R.units){let s=states.get(u);if(!s){s={phase:0,time:R.t-DT,moving:false};states.set(u,s);}
      ANTHOLDStride.advance(s,u,before.get(u)??u.x,DT);}
  };
  // Menu previews also show the new full eight-frame cycle.
  animSprite=function(sp,row,i){return row===0?(getFrame(sp,i)||previous.animSprite(sp,row,i)):previous.animSprite(sp,row,i);};
  animPose=function(u,spr,eng,kk,wind,lunge,clock){
    const existing=previous.animPose(u,spr,eng,kk,wind,lunge,clock),s=states.get(u);
    // Combat, hit, jump and flying poses remain under the game's control.
    if(!s||u.atk||eng||u.flash>0||u.hop>0||u.toss>0||(u.sp.fly&&altOf(u)>4)||(u.pushT!=null&&R.t-u.pushT<.2))return existing;
    return getFrame(u.sp,ANTHOLDStride.frame(s))||existing;
  };
  globalThis.ANTHOLDWalkDebug={states,images,previous,getFrame};
})();