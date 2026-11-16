/* Load after versus.html's classic game script. No replacement of repo files required. */
(function(){
  'use strict';
  const {DisasterEngine,RULES}=globalThis.ANTHOLDDisasters;
  let round=null,engine=null;
  const originals={cast,stepEffects,stepUnits,drawDisasters,playCard,hud};
  const roof=u=>Math.abs(u.x-R.bases[u.team].x)<110;
  const high=u=>R.map.name==='The Garden Bed'&&u.x>=400&&u.x<=1000;
  const water=u=>R.map.name==='The Creek'&&u.x>=580&&u.x<=820;
  function current(){
    if(round!==R){round=R;engine=new DisasterEngine({
      width:WW,over:()=>!R||R.over,started:()=>R&&R.count<=0,
      bases:()=>R.bases,units:()=>R.units,air:isAir,roof,high,water,
      shadow:u=>roof(u)||(R.map.name==='The Garden Bed'&&(u.x>=330&&u.x<400||u.x>1000&&u.x<=1070)),
      resistance:t=>mods(M.pl[t]).hardy,
      clamp:x=>Math.max(20,Math.min(WW-20,x)),damage:(u,n)=>hurt(u,n,null,'dis'),
      damageBase:(t,n)=>hurtBase(t,n/mods(M.pl[t]).hardy,'dis'),
      land:u=>{u.alt=0;u.restT=Math.max(u.restT||0,.1);u.st.stun=Math.max(u.st.stun||0,.2);},
      event:(kind,e)=>{if(kind==='warning'){sfx('count');toast(`${RULES[e.type].name} incoming — 1 second!`);}if(kind==='impact'){disIntro(e);sfx('dis',{type:e.type});}}
    });}
    return engine;
  }
  // Preserve the game's food payment / deck cycling and bot decisions, but prevent its cooldown reset bypass.
  playCard=function(team,i){const c=M?.pl[team]?.hand?.[i];if(c?.startsWith('dis:')&&!current().canCast(team,c.slice(4)))return false;return originals.playCard(team,i);};
  cast=function(team,type){if(!R||NET.role==='g')return false;const ok=current().cast(team,type);if(ok){R.disCd[team][type]=RULES[type].recharge;aim=null;}return ok;};
  stepEffects=function(){const e=current();e.advance(DT);R.effects=e.active?.phase==='active'?[e.active]:[];for(const t of[0,1])for(const k of Object.keys(RULES))R.disCd[t][k]=e.remaining(t,k);};
  stepUnits=function(){
    const e=current(),effects=R.effects,changed=[];
    // Legacy rain multiplies speed by .4; suppress just that path and use the shared counter-aware multiplier.
    R.effects=effects.filter(x=>x.type!=='rain');
    for(const u of R.units){const k=e.speed(u);if(k!==1){changed.push([u,u.sp]);u.sp={...u.sp,speed:u.sp.speed*k};}}
    try{originals.stepUnits();}finally{for(const[u,sp]of changed)u.sp=sp;R.effects=effects;}
  };
  hud=function(){originals.hud();if(!R||!M?.pl[0]?.hand)return;const e=current();M.pl[0].hand.forEach((c,i)=>{if(!c.startsWith('dis:'))return;const k=c.slice(4),el=$('h_'+i);if(!el)return;const left=e.remaining(0,k);el.disabled=el.disabled||!e.canCast(0,k);const label=el.querySelector('span');if(label)label.textContent=left>0?`Recharge ${Math.ceil(left)}s`:`${cardCost(0,c)} food · disaster`;if(left>0)el.querySelector('.cd').style.width=left/RULES[k].recharge*100+'%';});};
  drawDisasters=function(clock){
    const effects=R.effects;
    if(globalThis.ANTHOLDWeather)R.effects=effects.filter(e=>!['hail','rain','gale'].includes(e.type));
    try{originals.drawDisasters(clock);}finally{R.effects=effects;}
    const e=current().active;
    globalThis.ANTHOLDWeather?.draw(ctx,e,{width:WW,height:WH,ground:groundY,palette:{ink:INK,cloud:INK,ice:BONE,rain:LINE,water:LINE,leaf:PAL.leaf[0],dust:SOIL},reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches});
    if(!e||e.phase!=='warning')return;
    ctx.save();ctx.strokeStyle=EMBER;ctx.fillStyle=BONE;ctx.lineWidth=4;ctx.setLineDash([12,8]);
    const lo=['hail','fire','rain','gale','quake'].includes(e.type)?(e.c===0?WW/2:0):e.x-45;
    const width=['hail','fire','rain','gale','quake'].includes(e.type)?WW/2:90;
    ctx.strokeRect(lo,80,width,WH-160);ctx.setLineDash([]);ctx.font='bold 24px sans-serif';ctx.textAlign='center';
    ctx.fillText(`${RULES[e.type].name.toUpperCase()} · ${Math.max(0,e.warning).toFixed(1)}s`,WW/2,110);ctx.restore();
  };
  for(const k of Object.keys(RULES))DIS[k].desc=({hail:'Enemy-half hail for 4s. Nest roofs protect units; flyers take 50% more. Nest: 3%.',rain:'Flood for 6s. Ground speed 60%; high ground protects. Flyers forced to land.',gale:'3s push toward enemy nest; flyers 2×, Beetles and Termites ½.',boulder:'Rolling impact: 45 damage once per walker. Jump or fly clear. Nest: 8%.',quake:'Ground impact: 10 damage, 2s stun. Jumping and flying avoid it. Nest: 6%.',sun:'Sweeping heat: 24 damage/sec. Nest roofs and plateau-edge shadows protect. Nest: 5%.',tornado:'Straight twister: 12 damage/sec and push. Move out of its path. Nest: 4%.',fire:'5s ground fire, 4 damage/sec. Creek water and flight protect.'})[k]+' 1s warning; recharge '+RULES[k].recharge+'s.';
  globalThis.ANTHOLDDisasterDebug={get engine(){return current();},originals};
})();
