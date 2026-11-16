// matchup matrix for versus.html: how often each class beats each other class (rows win against columns)
// usage: node versus-matrix.js [matchesPerPair]
const fs=require("fs"),vm=require("vm");
const src=fs.readFileSync(__dirname+"/versus.html","utf8").split("<script>")[1].split("</script>")[0].replace("resize();menu();frame();","");
const el=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>"":k==="getContext"?()=>el:k==="clientWidth"||k==="clientHeight"?800:k==="offsetHeight"?60:el,set:()=>true,apply:()=>el});
Object.assign(globalThis,{document:{getElementById:()=>el,createElement:()=>el},addEventListener(){},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},
  localStorage:{getItem:()=>null,setItem(){}},devicePixelRatio:1,matchMedia:()=>({matches:false}),performance:{now:()=>0}});
vm.runInThisContext(src);
vm.runInThisContext(`globalThis.playMatch=(a,b)=>{newMatch(a,"normal");M.pl[1].cls=b;M.pl[0].bot=true;
  while(M.score[0]<2&&M.score[1]<2){(globalThis.botPrep||botDraft)(M.pl[0]);(globalThis.botPrep||botDraft)(M.pl[1]);startRound();let n=0;while(!R.over&&n<60*400){update();n++;}M.round++;}
  return M.score[0]>=2?0:1;};`);
const per=+(process.argv[2]||6),cls=Object.keys(vm.runInThisContext("CLASSES")),W={};
for(const a of cls){W[a]={};for(const b of cls)W[a][b]=a===b?null:0;}
// play each unordered pair from both sides so seat order cancels out
for(let i=0;i<cls.length;i++)for(let j=i+1;j<cls.length;j++){const a=cls[i],b=cls[j];
  for(let k=0;k<per;k++){const w1=playMatch(a,b);W[w1?b:a][w1?a:b]++;const w2=playMatch(b,a);W[w2?a:b][w2?b:a]++;}}
const n=per*2,short=c=>c.slice(0,5);
console.log("row beats column, % of "+n+" matches\n       "+cls.map(c=>short(c).padStart(6)).join(""));
const lop=[];
for(const a of cls){console.log(short(a).padEnd(7)+cls.map(b=>W[a][b]==null?"     -":String(Math.round(W[a][b]/n*100)).padStart(6)).join("")+"   overall "+Math.round(cls.filter(b=>b!==a).reduce((s,b)=>s+W[a][b],0)/(n*7)*100)+"%");
  for(const b of cls)if(b!==a&&W[a][b]/n>=.75)lop.push(a+" > "+b+" ("+Math.round(W[a][b]/n*100)+"%)");}
console.log("lopsided matchups (75%+): "+(lop.join(", ")||"none"));
