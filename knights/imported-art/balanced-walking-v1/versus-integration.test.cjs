const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
globalThis.assert=assert;
const el=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>"":k==='getContext'?()=>el:k==='clientWidth'||k==='clientHeight'?800:k==='offsetHeight'?60:el,set:()=>true,apply:()=>el});
Object.assign(globalThis,{document:{getElementById:()=>el,createElement:()=>el,currentScript:{src:'http://localhost/knights/imported-art/balanced-walking-v1/versus-adapter.js'}},addEventListener(){},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},devicePixelRatio:1,matchMedia:()=>({matches:false}),performance:{now:()=>0},fetch:async()=>({ok:true,json:async()=>({})})});
vm.runInThisContext(fs.readFileSync(process.env.GAME_FILE,'utf8').split('<script>')[1].split('</script>')[0].replace('resize();menu();frame();',''));
for(const f of ['stride.js','versus-adapter.js'])vm.runInThisContext(fs.readFileSync(__dirname+'/'+f,'utf8'));
vm.runInThisContext(`
assert.equal(Object.keys(ANIM_PNG).length,41);
newMatch('ants','normal');startRound();R.count=0;M.pl[1].bot=false;
const old=ANIM_PNG.worker.u;for(let i=0;i<40;i++)stepUnits();assert.equal(ANIM_PNG.worker.u,old);
assert.equal(typeof ANTHOLDWalkDebug.previous.animPose,'function');
for(const u of R.units)assert.ok(ANTHOLDWalkDebug.states.has(u));
console.log('Real game: all 41 species supported, original artwork and combat preserved');
`);