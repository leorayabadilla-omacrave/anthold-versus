// headless check: each disaster lost undefended, won with a sensible defense; then skills and late waves
const fs=require("fs");
const src=fs.readFileSync(__dirname+"/anthold.html","utf8").split("<script>")[1].split("</script>")[0].replace("resize();menu();frame();","");
const el=new Proxy(function(){},{get:(t,k)=>k==="getContext"?()=>el:k==="clientWidth"||k==="clientHeight"?800:el,set:()=>true,apply:()=>el});
global.document={getElementById:()=>el,createElement:()=>el};global.addEventListener=()=>{};global.requestAnimationFrame=()=>{};
global.localStorage={getItem:()=>null,setItem(){}};global.devicePixelRatio=1;global.matchMedia=()=>({matches:false});
const DEF=[
  [["chain",600,563,700,515]],
  [["chain",620,556,620,452],["chain",540,470,700,440]],
  [["chain",565,566,565,500],["chain",635,566,635,500],["chain",545,495,655,495]],
  [["chain",380,475,380,375],["chain",820,475,820,375]],
  [["chain",720,555,720,420],["chain",720,420,860,450]],
  [["chain",700,556,700,470]],
  [["chain",600,570,600,330]],
  [["arch",570,557,710,557]],
  [["chain",715,545,805,545]],
  [["arch",640,560,760,560]],
  [["arch",490,558,630,558]],
];
eval(src+`
const startLevel0=startLevel;startLevel=spec=>{startLevel0(spec);if(!globalThis.MANUAL)s.ready=true;}; // tests press Ready immediately

let result;finish=((f)=>(w,m)=>{result=w;f(w,m)})(finish);
function sim(i,cons,wave=1,sk={},muts=[],mode="colony"){
  run=newRun(mode);run.wave=wave;run.sk=sk;result=null;startLevel({i,muts,food:0});
  for(const[t,ax,ay,bx,by]of cons){const pts=t==="chain"?[[ax,ay],[bx,by]]:arc(ax,ay,bx,by,t==="arch");s.cons.push({...mkCons(t,pts,0),p:1});restrength();}
  let n=0;while(!s.over&&n<60*60){update();n++}
  return (result===null?"TIMEOUT":result?"WIN ":"lose")+" hp="+(s.hp|0)+" fell="+s.lost+" cons="+s.cons.length;
}
LEVELS.forEach((L,i)=>console.log((i+1)+". "+L.name.padEnd(16),"undefended:",sim(i,[]).padEnd(14),"| defended w1:",sim(i,DEF[i]).padEnd(14),"| defended w6:",sim(i,DEF[i],6)));
console.log("Monsoon, arch roof + 2 sponge mats:",sim(2,[["arch",530,530,670,530],["sponge",420,540,500,560],["sponge",700,560,780,540]],1,{arch:1,spongemat:1}));
console.log("Ice Storm, floating roof only (should crack):",sim(1,[["chain",540,470,700,440]]));
console.log("Ice Storm, guard squad only:",sim(1,[],1,{guard:1}));
console.log("Ice Storm, guard + ice crackers:",sim(1,[],1,{guard:1,crack:1}));
console.log("Boulder, net catches it on the slope:",sim(0,[["cup",360,380,520,500]],1,{net:1}));
console.log("Boulder, spring pad before hole:",sim(0,[["spring",640,560,720,540]],1,{springpad:1}));
console.log("Monsoon + Gale + Downpour (defended):",sim(2,DEF[2],3,{},["gale","rain"]));
console.log("Boulder + Rockfall + Long Storm (defended):",sim(0,DEF[0],3,{},["rocks","long"]));
console.log("Ice Storm + Aftershock (defended):",sim(1,DEF[1],3,{},["quake"]));
console.log("Tsunami Tempest w6 (defended):",sim(6,DEF[6],6,{},[],"tempest"));
console.log("Earthquake Seedling w6 (defended):",sim(3,DEF[3],6,{},[],"seedling"));
run=newRun("tempest");const g=[];for(let n=1;n<=10;n++){const w=genWave(n,-1),r=genWave(n,w.i,1);g.push(n+": "+w.muts.join("+")+" | risky "+r.muts.join("+")+" ("+w.food+"/"+r.food+")");}console.log(g.join(" / "));
{
// ---- draw-to-build: recognizer and physics objects
{
  run=newRun();startLevel({i:0,muts:[],food:0});
  const J=()=>(Math.random()-.5)*3; // hand wobble
  const line=(a,b,n=20)=>Array.from({length:n+1},(_,i)=>[a[0]+(b[0]-a[0])*i/n+J(),a[1]+(b[1]-a[1])*i/n+J()]);
  const poly=v=>v.slice(1).flatMap((q,i)=>line(v[i],q,12)).concat([v[0]]);
  const G={
    line:line([100,300],[300,260]),
    square:poly([[100,100],[180,100],[180,180],[100,180],[100,100]]),
    triangle:poly([[100,200],[200,200],[150,110],[100,200]]),
    circle:Array.from({length:41},(_,i)=>[150+40*Math.cos(i/40*6.283)+J(),150+40*Math.sin(i/40*6.283)+J()]),
    hump:Array.from({length:31},(_,i)=>[100+i*6,300-Math.sin(i/30*Math.PI)*60+J()]),
    dip:Array.from({length:31},(_,i)=>[100+i*6,300+Math.sin(i/30*Math.PI)*60+J()]),
    zigzag:Array.from({length:41},(_,i)=>[100+i*3,300+(i%10<5?(i%5)*6:(5-i%5)*6)-15+J()]),
    scribble:Array.from({length:80},(_,i)=>[150+30*Math.cos(i*.9)+i*.3+J(),150+25*Math.sin(i*1.3)+J()]),
  };
  const want={line:"chain",square:"block",triangle:"wedge",circle:"ball",hump:"arch",dip:"cup",zigzag:"spring",scribble:"sponge"};
  let ok=0,out=[];for(let trial=0;trial<20;trial++)for(const[k,p]of Object.entries(G)){const g=classify(p);if(g===want[k])ok++;else if(trial===0)out.push(k+"->"+g);}
  console.log("gestures:",ok+"/"+20*Object.keys(G).length,"correct",out.length?"misses: "+out.join(" "):"");
  run.sk={};run.tool="auto";const pl=planBuild(G.circle);console.log("locked circle builds:",pl.kind,"("+pl.note+")");
}

// ---- grounded building
{
  run=newRun();startLevel({i:0,muts:[],food:0});s.t=-99;run.tool="auto";
  const gy=groundY(900);
  let pl=planBuild([[850,200],[950,200]]);console.log("plank in mid-air:",pl.why||"ALLOWED (bad)");
  pl=planBuild([[850,200],[880,gy-2]]);console.log("plank from sky down to ground: allowed="+!pl.why+", builds from ground end first="+(Math.abs(pl.poly[0][1]-gy)<16));
  run.tool="block";pl=planBuild([[880,150],[940,150],[940,210],[880,210],[880,150]]);console.log("block drawn in the air forms on ground: bottom="+(pl.y+pl.r|0)+" ground="+(groundY(910)|0));
  run.tool="auto";buildFrom([[900,gy],[900,gy-120]]);s.cons[0].p=1;buildFrom([[900,gy-118],[1040,gy-118]]);s.cons[1].p=1;
  console.log("pillar + plank on top:",s.cons.length,"constructs");
  recall(900,gy-60);console.log("recall the pillar -> plank resting on it collapses:",s.cons.length,"left, ants falling:",s.fx.length>0);
  run.tool="block";buildFrom([[700,gy-60],[760,gy-60],[760,gy],[700,gy],[700,gy-60]]);const blk=s.objs[0];blk.p=1;
  run.tool="auto";buildFrom([[740,blk.y-blk.r-2],[860,blk.y-blk.r-2]]);s.cons[0].p=1;console.log("plank resting on a block: supported="+(s.cons.length===1));
  blk.x=200;blk.y=groundY(200)-blk.r;restrength();console.log("block shoved away -> plank falls:",s.cons.length===0);
  run.sk={ballskill:1};run.tool="ball";buildFrom([[300,gy-200],[340,gy-200],[340,gy-160],[300,gy-160],[300,gy-200]]);const b=s.objs[1]||s.objs[0];b.p=1;
  s.held=b;mouse.x=b.x+300;mouse.y=b.y-300;const y0=b.y;for(let i=0;i<60;i++)update();s.held=null;
  console.log("push a ball: moved right="+(b.x>320)+", never lifted="+(b.y>=y0-3));
}

// ---- blueprints and floods
function bpSim(i,builds,sk={},wave=1,muts=[]){
  run=newRun();run.wave=wave;run.sk={...sk};result=null;startLevel({i,muts,food:0});s.ants=999;
  for(const[tool,a,b]of builds){run.tool=tool;buildFrom([a,b]);for(const c of s.cons)c.p=1;for(const o of s.objs)o.p=1;restrength();}
  const parts=s.cons.length,objs=s.objs.length,plug=!!s.plug;
  let n=0;while(!s.over&&n<60*60){update();n++}
  return (result?"WIN ":"lose")+" hp="+(s.hp|0)+" built parts="+parts+" objs="+objs+(plug?" plug":"");
}
{
  const gy=x=>{run=newRun();startLevel({i:5,muts:[],food:0});return groundY(x);};const g700=gy(700),g520=gy(520);
  console.log("Flash Flood, wall right of the entrance:",bpSim(5,[["chain",[700,g700],[700,470]]]));
  console.log("Flash Flood, dam blueprint:",bpSim(5,[["bp:dam",[640,g700],[800,g700]]],{bp_dam:1}));
  console.log("Flash Flood, raft only (colony shelters):",bpSim(5,[["bp:raft",[560,g520-5],[700,g520-5]]],{bp_raft:1}));
  console.log("Flash Flood, plug only:",bpSim(5,[["bp:plug",[520,g520],[520,g520]]],{bp_plug:1}));
  console.log("Flash Flood, undefended:",bpSim(5,[]));
  console.log("Boulder, plug only:",bpSim(0,[["bp:plug",[760,565],[760,565]]],{bp_plug:1}));
  console.log("Boulder, tower on the slope:",bpSim(0,[["bp:tower",[400,300],[400,150]]]));
  console.log("Boulder, stairs before the entrance:",bpSim(0,[["bp:stairs",[560,565],[700,480]]],{bp_stairs:1}));
  console.log("Ice Storm, dome over the entrance:",bpSim(1,[["bp:dome",[540,500],[700,500]]],{bp_dome:1}));
  console.log("Ice Storm, bivouac beside the entrance:",bpSim(1,[["bp:bivouac",[680,540],[680,540]]],{bp_bivouac:1}));
  console.log("Hurricane, buttress windbreak:",bpSim(4,[["bp:buttress",[720,555],[720,420]]],{bp_buttress:1}));
  console.log("Boulder + Rising River, undefended vs dam:",bpSim(0,[],{},1,["river"]).split(" ")[0],"vs",bpSim(0,[["bp:dam",[880,565],[1000,565]],["chain",[600,563],[700,515]]],{bp_dam:1},1,["river"]));
  console.log("river reachable on:",LEVELS.map(L=>L.name+"="+floodSide(L)).join(", "));
  run=newRun();startLevel({i:0,muts:[],food:0});s.ants=999;run.tool="bp:bridge";
  let pl=planBuild([[800,300],[1000,300]]);console.log("bridge in mid-air:",pl.why);
  pl=planBuild([[700,565],[900,565]]);console.log("bridge ground to ground:",pl.why||"ok",pl.parts.length,"part,",pl.cost,"ants");
  run.tool="bp:tower";buildFrom([[900,565],[900,400]]);console.log("tower parts:",s.cons.length,"share one id:",new Set(s.cons.map(c=>c.id)).size===1);
  recall(891,500);console.log("recall one rail removes the whole tower:",s.cons.length===0);
  run.sk={bp_raft:1};run.tool="auto";const boat=[[600,500],[760,500],[760,530],[600,530],[600,500]];console.log("draw a long flat loop ->",planBuild(boat).kind);
}

// ---- curves follow the drawing, even before Arch/Net are unlocked
{
  run=newRun();startLevel({i:4,muts:[],food:0});s.t=-99;s.ants=999;run.tool="auto";const g=555;
  const J=()=>(Math.random()-.5)*3;
  const bow=(amp,n=30)=>Array.from({length:n+1},(_,i)=>[300+i*8+J(),g-Math.sin(i/n*Math.PI)*amp+J()]); // starts and ends on the ground
  const sCurve=Array.from({length:31},(_,i)=>[300+i*8,g-i*3-Math.sin(i/30*Math.PI*2)*30]);
  const wobblyLine=Array.from({length:31},(_,i)=>[300+i*8+J(),g-i*4+J()]);
  const zig=Array.from({length:41},(_,i)=>[300+i*4,g-(i%10<5?(i%5)*7:(5-i%5)*7)]);
  const show=(name,p,sk)=>{run.sk=sk||{};const pl=planBuild(p);return name+": "+(pl.why||((pl.label||TOOLS[pl.kind].name)+" with "+(pl.poly?pl.poly.length:"-")+" joints"));};
  let curved=0;for(let k=0;k<20;k++){run.sk={};const pl=planBuild(bow(60));if(pl.poly.length>2)curved++;}
  console.log("big hump, nothing unlocked: curved "+curved+"/20 |",show("example",bow(60)));
  console.log(show("gentle bend (10% of length)",bow(24)));
  console.log(show("big hump with Arch Weavers",bow(60),{arch:1}));
  console.log(show("dip with Net Spinners",bow(-50),{net:1}));
  console.log(show("S-curve",sCurve));
  let straight=0;for(let k=0;k<20;k++){if(planBuild(wobblyLine).poly.length===2)straight++;}
  console.log("shaky straight line stays straight: "+straight+"/20");
  console.log(show("zigzag (Spring locked)",zig),"| with Spring Pads:",show("zigzag",zig,{springpad:1}));
  run.sk={};buildFrom(bow(60));const c=s.cons.at(-1);console.log("built curve: type="+c.type+" joints="+c.pts.length+" grounded="+(s.cons.includes(c)));
}

// ---- new disasters and errands
{
  const sp=(i,cons,muts=[],obj)=>{run=newRun();result=null;startLevel({i,muts,food:0,obj});for(const[t,ax,ay,bx,by]of cons){const pts=t==="chain"?[[ax,ay],[bx,by]]:arc(ax,ay,bx,by,t==="arch");s.cons.push({...mkCons(t,pts,0),p:1});restrength();}
    let n=0;while(!s.over&&n<60*70){update();n++}return (result?"WIN ":"lose")+" hp="+(s.hp|0)+" t="+(s.t|0)+(obj?" | "+objectiveText():"");};
  console.log("Footsteps: stomps planned",(run=newRun(),startLevel({i:7,muts:[],food:0}),s.sp.steps.length),"| on the nest:",s.sp.steps.filter(q=>Math.abs(q.x-s.L.hx)<70).length);
  console.log("Lawnmower + ramps both sides + low roof:",sp(8,[["chain",715,545,805,545],["chain",560,553,650,520],["chain",960,550,870,515]]));
  console.log("Lens, sponge-free shade only:",sp(9,[["arch",640,560,760,560]]));
  console.log("Rescue errand on Monsoon (roofed + dammed):",sp(2,DEF[2],[],"rescue"));
  console.log("Rescue errand on Tipping Boulder (ramp):",sp(0,DEF[0],[],"rescue"));
  console.log("Twin errand on Hurricane (defended):",sp(4,DEF[4],[],"twin"));
  console.log("Forage errand text:",(run=newRun(),startLevel({i:0,muts:[],food:0,obj:"forage"}),objectiveText()));
  run=newRun();run.wave=3;const routes=[];for(let k=0;k<200;k++){const w=genWave(3,-1);routes.push(w.obj||"-");}console.log("errand rate at wave 3:",(routes.filter(r=>r!=="-").length/2)+"%");
}
{ // planning phase: no clock until Ready
  globalThis.MANUAL=1;run=newRun();startLevel({i:0,muts:[],food:0});s.ants=999;run.tool="auto";buildFrom([[600,563],[700,515]]);
  const b=s.bodies[0],x0=b.x;for(let n=0;n<600;n++)update();
  console.log("before Ready: clock="+s.t.toFixed(1)+" boulder moved="+(b.x!==x0)+" plank built="+(s.cons[0].p>=1));
  ready();let n=0;while(!s.over&&n<3000){update();n++;}console.log("after Ready: wave finished, win="+(state==="draft"));globalThis.MANUAL=0;
}
{ // royal move errand
  const rm=(i,cons,wave=1)=>{run=newRun();run.wave=wave;result=null;startLevel({i,muts:[],food:0,obj:"royal"});
    for(const[t,ax,ay,bx,by]of cons){const pts=t==="chain"?[[ax,ay],[bx,by]]:arc(ax,ay,bx,by,t==="arch");s.cons.push({...mkCons(t,pts,0),p:1});restrength();}
    const from=s.royal.x,to=s.royal.tx;let n=0;while(!s.over&&n<60*80){update();n++}
    return (result?"WIN ":"lose")+" | route "+from+"->"+to+" | "+(s.royal.done?"arrived":s.royal.dead?"queen lost":"still walking")+" hp="+Math.ceil(s.royal.hp);};
  console.log("Royal move, Tipping Boulder, ramp:",rm(0,DEF[0]));
  console.log("Royal move, Monsoon, defended:",rm(2,DEF[2]));
  console.log("Royal move, Ice Storm, unprotected route:",rm(1,DEF[1],3));
  console.log("Royal move, Hurricane, defended:",rm(4,DEF[4]));
  console.log("Royal move, Ice Storm, route under a row of arches:",rm(1,[...DEF[1],["arch",190,555,340,555],["arch",330,555,480,555],["arch",470,555,625,555]],1));
  console.log("Royal move, Lawnmower, low roof:",rm(8,DEF[8]));
  const kinds={};run=newRun();for(let k=0;k<400;k++){const w=genWave(4,-1);if(w.obj)kinds[w.obj]=(kinds[w.obj]||0)+1;}console.log("errand mix:",JSON.stringify(kinds));
}
function objSim(i,objs,cons=[],wave=1){
  run=newRun();run.wave=wave;result=null;startLevel({i,muts:[],food:0});
  for(const[kind,x,y,r]of objs)s.objs.push({...mkObj(kind,x,y,r,0),p:1});
  for(const[t,ax,ay,bx,by]of cons)s.cons.push({...mkCons(t,[[ax,ay],[bx,by]],0),p:1});
  restrength();let n=0;while(!s.over&&n<60*60){update();n++}
  return (result?"WIN ":"lose")+" hp="+(s.hp|0)+" objs="+s.objs.length+(s.objs[0]?" first at "+(s.objs[0].x|0)+","+(s.objs[0].y|0):"");
}
console.log("Boulder, ant block on the slope:",objSim(0,[["block",420,0,30]]));
console.log("Boulder, block on the hole as a lid:",objSim(0,[["block",760,500,30]]));
console.log("Ice Storm, block lid on the hole:",objSim(1,[["block",620,500,32]]));
console.log("Ice Storm, two stacked blocks + plank roof:",objSim(1,[["block",540,520,22],["block",540,470,22]],[["chain",530,440,710,440]]));
run=newRun();startLevel({i:2,muts:[],food:0});s.objs.push({...mkObj("block",300,200,25,0),p:1},{...mkObj("block",300,140,25,0),p:1},{...mkObj("block",300,80,25,0),p:1});
for(let n=0;n<240;n++){s.t=-99;update();}console.log("3-block stack after 4s:",s.objs.map(o=>(o.x|0)+","+(o.y|0)).join(" | "));
}
run=newRun();run.food=20;draft("ok");renderShop("ok");choosePath();console.log("draft/shop/path ok");
`);
