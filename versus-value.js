// unit value report for versus.html: what each species is worth (effective health x damage per second) against its food cost
// usage: node versus-value.js
const fs=require("fs"),vm=require("vm");
const src=fs.readFileSync(__dirname+"/versus.html","utf8").split("<script>")[1].split("</script>")[0].replace("resize();menu();frame();","");
const el=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>"":k==="getContext"?()=>el:k==="clientWidth"||k==="clientHeight"?800:k==="offsetHeight"?60:el,set:()=>true,apply:()=>el});
Object.assign(globalThis,{document:{getElementById:()=>el,createElement:()=>el},addEventListener(){},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},
  localStorage:{getItem:()=>null,setItem(){}},devicePixelRatio:1,matchMedia:()=>({matches:false}),performance:{now:()=>0}});
vm.runInThisContext(src);
const {SP,CLASSES,valueOf}=vm.runInThisContext("({SP,CLASSES,valueOf:typeof unitValue==='function'?unitValue:null})");
const raw=sp=>{const ehp=sp.hp/(1-Math.min(.5,.12*(sp.armor||0))),dps=sp.dmg*sp.rate*(sp.sting?.6:1);return(sp.n||1)*Math.sqrt(ehp*Math.max(.5,dps));};
for(const[k,c]of Object.entries(CLASSES)){
  console.log(c.name.toUpperCase());
  for(const id of c.species){const sp=SP[id],v=raw(sp);console.log("  "+sp.name.padEnd(18)+" cost "+String(sp.cost).padStart(3)+"  raw value "+v.toFixed(1).padStart(5)+"  food per value "+(sp.cost/v).toFixed(2)+(valueOf?"  formula cost "+valueOf(sp):""));}
}
