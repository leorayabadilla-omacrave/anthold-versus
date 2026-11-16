// snowball check for versus.html: 50s into each bot-vs-bot round, who is behind (nest health + army on the field), and how often do they still win?
// usage: node versus-comeback.js [matchesPerPair]   (SIMFILE=path to test another build)
const fs=require("fs"),vm=require("vm");
const src=fs.readFileSync(process.env.SIMFILE||__dirname+"/versus.html","utf8").split("<script>")[1].split("</script>")[0].replace("resize();menu();frame();","");
const el=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>"":k==="getContext"?()=>el:k==="clientWidth"||k==="clientHeight"?800:k==="offsetHeight"?60:el,set:()=>true,apply:()=>el});
Object.assign(globalThis,{document:{getElementById:()=>el,createElement:()=>el},addEventListener(){},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},
  localStorage:{getItem:()=>null,setItem(){}},devicePixelRatio:1,matchMedia:()=>({matches:false}),performance:{now:()=>0}});
vm.runInThisContext(src);
const r=vm.runInThisContext(`(()=>{const per=${+(process.argv[2]||1)},cls=Object.keys(CLASSES);let rounds=0,behind=0,back=0,lens=[];
  const score=i=>R.bases[i].hp/R.bases[i].max+R.units.filter(u=>u.team===i&&!u.dead).reduce((n,u)=>n+(u.sp.cost||0)/(u.sp.n||1),0)/400;
  for(const a of cls)for(const b of cls){if(a===b)continue;for(let k=0;k<per;k++){newMatch(a,"normal");M.pl[1].cls=b;M.pl[0].bot=true;
    while(M.score[0]<2&&M.score[1]<2){botDraft(M.pl[0]);botDraft(M.pl[1]);startRound();let n=0,trail=-1;
      while(!R.over&&n<60*420){update();n++;if(trail<0&&R.t>=50){const d=score(0)-score(1);if(Math.abs(d)>.15)trail=d<0?0:1;else trail=2;}}
      rounds++;lens.push(R.t);if(trail===0||trail===1){behind++;if(R.winner===trail)back++;}M.round++;}}}
  lens.sort((x,y)=>x-y);return{rounds,clearLeads:behind,comebacks:back,comebackRate:Math.round(back/behind*100)+"%",medianRound:Math.round(lens[lens.length>>1])+"s"};})()`);
console.log(r);
