// bot-vs-bot balance check for versus.html (Knight Command rules): every class against every other, one round per match
// usage: node versus-sim.js [matchesPerPair]
const fs=require("fs"),vm=require("vm");
const src=fs.readFileSync(process.env.SIMFILE||__dirname+"/versus.html","utf8").split("<script>")[1].split("</script>")[0].replace("resize();menu();frame();","");
const el=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>"":k==="getContext"?()=>el:k==="clientWidth"||k==="clientHeight"?800:k==="offsetHeight"?60:el,set:()=>true,apply:()=>el});
Object.assign(globalThis,{document:{getElementById:()=>el,createElement:()=>el},addEventListener(){},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},
  localStorage:{getItem:()=>null,setItem(){}},devicePixelRatio:1,matchMedia:()=>({matches:false}),performance:{now:()=>0}});
vm.runInThisContext(src);if(process.env.SIMEXTRA)vm.runInThisContext(process.env.SIMEXTRA); // e.g. SIMEXTRA="KC.cap=16" to try a tweak
vm.runInThisContext(`
function playMatch(a,b){ // both sides are bots
  newMatch(a,"normal");M.pl[1].cls=b;M.pl[0].bot=true;const rounds=[];
  startRound();
  let n=0;while(!R.over&&n<60*400){update();n++;}
  rounds.push({w:R.winner,t:R.t,units:R.nid});
  return{winner:R.winner,rounds};
}
globalThis.playMatch=playMatch;
`);
const per=+(process.argv[2]||2),cls=Object.keys(vm.runInThisContext("CLASSES")),wins={},games={},times=[];
for(const c of cls){wins[c]=0;games[c]=0;}
const t0=Date.now();
for(const a of cls)for(const b of cls){if(a===b)continue;for(let k=0;k<per;k++){
  const r=playMatch(a,b);wins[r.winner?b:a]++;games[a]++;games[b]++;for(const x of r.rounds)times.push(x.t);}}
times.sort((x,y)=>x-y);
console.log("class win rates ("+per+" matches per ordered pair):");
for(const c of cls.sort((x,y)=>wins[y]/games[y]-wins[x]/games[x]))console.log("  "+c.padEnd(12)+(wins[c]/games[c]*100).toFixed(0).padStart(3)+"%");
console.log("round length: median "+times[times.length>>1].toFixed(0)+"s, shortest "+times[0].toFixed(0)+"s, longest "+times[times.length-1].toFixed(0)+"s, timeouts "+times.filter(t=>t>=240).length+" went past 4:00 (nests crumbling), "+times.filter(t=>t>=359).length+" timeouts, of "+times.length);
console.log("ran in "+((Date.now()-t0)/1000).toFixed(1)+"s");
