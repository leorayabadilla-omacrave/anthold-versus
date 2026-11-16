const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
globalThis.assert=assert;
const el=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>"":k==='getContext'?()=>el:k==='clientWidth'||k==='clientHeight'?800:k==='offsetHeight'?60:el,set:()=>true,apply:()=>el});
Object.assign(globalThis,{document:{getElementById:()=>el,createElement:()=>el},addEventListener(){},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},devicePixelRatio:1,matchMedia:()=>({matches:false}),performance:{now:()=>0}});
vm.runInThisContext(fs.readFileSync(process.env.GAME_FILE||new URL('../../../versus.html', 'file://'+__filename).pathname,'utf8').split('<script>')[1].split('</script>')[0].replace('resize();menu();frame();',''));
for(const f of ['disaster-engine.js','versus-adapter.js'])vm.runInThisContext(fs.readFileSync(__dirname+'/'+f,'utf8'));
vm.runInThisContext(`
for(const type of Object.keys(ANTHOLDDisasters.RULES)){
 newMatch('ants','normal');startRound();R.count=0;M.pl[1].bot=false;M.pl[0].food=10;M.pl[0].hand=['dis:'+type,'worker','fire','leafcutter'];
 const start=R.bases[1].hp,cost=DIS_ELIX[type];assert.equal(playCard(0,0),true);assert.equal(M.pl[0].food,10-cost);
 for(let i=0;i<59;i++)stepEffects();assert.equal(R.bases[1].hp,start);
 for(let i=0;i<620;i++)stepEffects();const pct=ANTHOLDDisasters.RULES[type].base;assert.ok(Math.abs(R.bases[1].hp-(start-R.bases[1].max*pct*mods(M.pl[1]).hardy))<1e-6,type);
 M.pl[0].hand[0]='dis:'+type;M.pl[0].food=10;assert.equal(playCard(0,0),false,type+' recharge bypass');assert.equal(M.pl[0].food,10);console.log(type+' passed real game adapter');
}`);
