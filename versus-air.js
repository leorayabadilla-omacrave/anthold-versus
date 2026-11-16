// vertical interaction check: how much damage each grounded class's walkers deal to flyers, matchup by matchup
// usage: node versus-air.js
const fs=require("fs"),vm=require("vm");
const src=fs.readFileSync(__dirname+"/versus.html","utf8").split("<script>")[1].split("</script>")[0].replace("resize();menu();frame();","");
const el=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>"":k==="getContext"?()=>el:k==="clientWidth"||k==="clientHeight"?800:k==="offsetHeight"?60:el,set:()=>true,apply:()=>el});
Object.assign(globalThis,{document:{getElementById:()=>el,createElement:()=>el},addEventListener(){},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},
  localStorage:{getItem:()=>null,setItem(){}},devicePixelRatio:1,matchMedia:()=>({matches:false}),performance:{now:()=>0}});
vm.runInThisContext(src);
vm.runInThisContext(`
const hurt0=hurt;let tally=null;
hurt=(t,amt,src,kind)=>{ // count damage walkers deal to flyers, split by how they reached
  if(tally&&src&&src.sp&&!src.sp.fly&&t.sp&&t.sp.fly&&t.team!==src.team){
    const how=t.restT>0?"landed":t.dive>0?"diving":src.sp.cls==="ants"&&src.ladder>0?"ladder":src.sp.cls==="crickets"?"pounce":(src.sp.reach||22)>22?"tall reach":src.sp.range>40?"ranged":src.onWall?"mound":"other";
    tally[how]=(tally[how]||0)+amt;tally.total+=amt;}
  return hurt0(t,amt,src,kind);};
globalThis.airCheck=(a,b,rounds)=>{tally={total:0};let won=0;
  for(let r=0;r<rounds;r++){newMatch(a,"normal");M.pl[1].cls=b;M.pl[0].bot=true;botDraft(M.pl[0]);botDraft(M.pl[1]);startRound();let n=0;while(!R.over&&n<60*400){update();n++;}if(R.winner===0)won++;}
  const t=tally;tally=null;return{won,t};};
`);
const ground=["ants","crickets","beetles","scorpions","termites"],flying=["butterflies","flies","bees"];
for(const a of ground){const parts=[];for(const b of flying){const r=airCheck(a,b,6);
  const how=Object.entries(r.t).filter(([k])=>k!=="total").sort((x,y)=>y[1]-x[1]).map(([k,v])=>k+" "+Math.round(v)).join(", ");
  parts.push(b+": walkers hit flyers for "+Math.round(r.t.total/6)+"/round ("+how+"), won "+r.won+"/6");}
  console.log(a.toUpperCase()+"\n  "+parts.join("\n  "));}
