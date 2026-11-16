// headless render check: the full journal renderer across new disasters, errands and menus must not throw
const fs=require("fs");
const src=fs.readFileSync(__dirname+"/anthold.html","utf8").split("<script>")[1].split("</script>")[0].replace("resize();menu();frame();","");
const el=new Proxy(function(){},{get:(t,k)=>k==="getContext"?()=>el:k==="clientWidth"||k==="clientHeight"?800:el,set:()=>true,apply:()=>el});
global.document={getElementById:()=>el,createElement:()=>el};global.addEventListener=()=>{};global.requestAnimationFrame=()=>{};
global.localStorage={getItem:()=>null,setItem(){}};global.devicePixelRatio=1;global.matchMedia=()=>({matches:false});
eval(src+`
const startLevel0=startLevel;startLevel=spec=>{startLevel0(spec);if(!globalThis.MANUAL)s.ready=true;}; // tests press Ready immediately

sprite2=(img,x,y)=>{if(!isFinite(x)||!isFinite(y))throw new Error("bad sprite position");antQ.push(1);};
ctx=new Proxy({},{get:(o,k)=>k==="canvas"?{width:1200,height:700}:typeof k==="string"&&k.startsWith("create")?()=>({addColorStop(){}}):()=>{},set:()=>true});
const out=[];
for(const[i,obj,t]of[[0,"royal",9],[2,"royal",14],[7,"rescue",8.6],[8,"twin",12],[9,"forage",14],[10,"rescue",16],[5,"twin",14],[1,null,10]]){
  run=newRun();run.sk=Object.fromEntries(SKILLS.map(k=>[k.id,1]));startLevel({i,muts:["rain"],food:0,obj});s.ants=999;
  run.tool="auto";buildFrom([[s.L.hx-60,s.hy],[s.L.hx-60,s.hy-80]]);
  run.tool="bp:dome";buildFrom([[s.L.hx+40,s.hy],[s.L.hx+160,s.hy]]);
  run.tool="block";buildFrom([[200,300],[250,300],[250,350],[200,350],[200,300]]);
  while(s.t<t&&!s.over)update();
  baked=null;antQ=[];draw();const n=antQ.length;stroke=[[300,500],[400,450]];draw();stroke=null;
  out.push(LEVELS[i].name+": sprites="+n+" special="+(s.sp?s.sp.type+(s.sp.on===false?"(off)":""):"-")+" | "+objectiveText()+(s.over?" (wave over)":""));
}
console.log(out.join("\\n"));
scene=preview(3);s=null;draw();
run=newRun();run.wave=4;choosePath();briefWave(genWave(4,-1));draft("x");menu();
console.log("menus, map and briefing ok");
`);
