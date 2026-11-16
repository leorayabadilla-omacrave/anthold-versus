// ANTHOLD knight rig: one shared skeleton, a skin per class knight, a proportion set per species,
// and animations as bone-angle keyframes.
//
//   KnightRig.draw(ctx, "ants", "walk", t, {scale, showBones})       a class knight, feet at the ctx origin, facing right
//   KnightRig.draw(ctx, "bullet", "walk", t)                          a species: its class knight in that species' proportions
//   KnightRig.CLIPS.myMove = {dur, loop, keys:[{at:0, thighF:.3}, {at:1, ...}]}   a new animation: no drawing code needed
//
// Angles are radians. 0 points a bone straight down; a positive angle swings it forward (toward +x).
// A bone's animated angle is added to its rest angle and, unless the bone is "abs", to its parent's angle.
(function(){
const K="#17110e",B="#f6eed3",S="#b9bcc4";

// ================================================================ the skeleton (shared by every knight)
// parent: the bone it hangs from; at: "end" or "origin" of the parent; off: offset in the parent's space;
// len: bone length (negative points up); rest: resting angle; abs: ignores the parent's rotation (weapon, shield, cape);
// grp: which species proportion stretches it ("leg" or "arm")
const SKELETON=[
  {id:"root"},
  {id:"pelvis",   parent:"root",      at:"origin", off:[0,-46]},                    // raised or lowered to suit the leg length
  {id:"spine",    parent:"pelvis",    at:"origin", len:-38},
  {id:"neck",     parent:"spine",     at:"end",    len:-6},
  {id:"head",     parent:"neck",      at:"end"},
  {id:"cape",     parent:"spine",     at:"end",    off:[-4,4], abs:true},          // scarf, wing cape, tail
  {id:"upperArmB",parent:"spine",     at:"end",    off:[-16,4], len:14, grp:"arm"}, // far shoulder: holds the weapon
  {id:"forearmB", parent:"upperArmB", at:"end",    len:12, grp:"arm"},
  {id:"weapon",   parent:"forearmB",  at:"end",    abs:true, rest:2.69},          // points up and forward at rest
  {id:"thighB",   parent:"pelvis",    at:"origin", off:[-5,0], len:25, grp:"leg"},
  {id:"shinB",    parent:"thighB",    at:"end",    len:25, grp:"leg"},
  {id:"thighF",   parent:"pelvis",    at:"origin", off:[5,0],  len:25, grp:"leg"},
  {id:"shinF",    parent:"thighF",    at:"end",    len:25, grp:"leg"},
  {id:"upperArmF",parent:"spine",     at:"end",    off:[16,4], len:14, rest:.9, grp:"arm"},   // near shoulder: holds the shield
  {id:"forearmF", parent:"upperArmF", at:"end",    len:12, rest:-1.1, grp:"arm"},
  {id:"shield",   parent:"forearmF",  at:"end",    abs:true},
];
const ORDER=["cape","thighB","shinB","upperArmB","forearmB","weapon","spine","thighF","shinF","pelvis","head","upperArmF","forearmF","shield"];

// ================================================================ the class knights (skins)
// col: class colour; weapon / offhand; cape; bulk: armour width; legs:"jump" bends the knees forward; restOff: extra rest angles
const SKINS={
  ants:       {name:"Ant Knight",       col:"#cf3d26", weapon:"halberd", cape:"scarf"},
  beetles:    {name:"Beetle Knight",    col:"#2f7a4f", weapon:"hammer",  bulk:1.25, horn:"rhino"},
  butterflies:{name:"Butterfly Knight", col:"#2a62c9", weapon:"lance",   cape:"wings"},
  flies:      {name:"Fly Knight",       col:"#7c6fae", weapon:"dagger",  cape:"flywings", offhand:"dagger"},
  crickets:   {name:"Cricket Knight",   col:"#7fa32a", weapon:"sword",   legs:"jump", restOff:{thighF:-.55,thighB:-.55,shinF:1.05,shinB:1.05}},
  scorpions:  {name:"Scorpion Knight",  col:"#a0582a", weapon:"claw",    offhand:"claw", cape:"tail"},
  bees:       {name:"Bee Knight",       col:"#e2b33c", weapon:"spear",   cape:"beewings", stripes:true},
  termites:   {name:"Termite Knight",   col:"#c98a4a", weapon:"mattock", jaws:true},
};

// ================================================================ species: human knights, different builds and gear
// Every knight is a person in armour: limbs and head stay human. A species changes the knight's height, build and gear.
// Height follows the real insect's size, squeezed into a human range: scale = clamp(0.85, 1.2, 0.8 + 0.06*log2(mm/2)).
// The class still reads from the sigil, visor, pauldron, belt buckle and cape (class colour).
// mm: real body length; bulk: armour width; tint: armour colour taken from the real insect; pat: breastplate pattern
// (plates stripes bands spots veins eyes sheen fuzz pack); weapon; crest (plume fin spikes crown); cape; wing: cape/tail size.
const SPECIES={
  // ants
  worker:     {cls:"ants", mm:4,  bulk:.9, tint:"#8a5a3c", pat:"plates", weapon:"halberd", note:"Brown-plated footsoldier, halberd"},
  fire:       {cls:"ants", mm:4,  bulk:.9, tint:"#e8742a", pat:"bands", weapon:"spear", crest:"plume", note:"Fire-orange armour, spear, flame plume"},
  leafcutter: {cls:"ants", mm:9,  tint:"#6f8f3a", pat:"veins", weapon:"scythe", leaf:true, note:"Leaf-green armour, scythe, leaf banner"},
  army:       {cls:"ants", mm:10, tint:"#7a3b22", pat:"plates", weapon:"axe", crest:"spikes", jaws:true, note:"Rust armour, axe, spiked helm, hooked faceguard"},
  wingedant:  {cls:"ants", mm:10, bulk:.85, tint:"#3a3a4a", pat:"sheen", weapon:"lance", cape:"flywings", note:"Dark slate armour, lance, wing cape"},
  bullet:     {cls:"ants", mm:25, bulk:1.2, tint:"#2a1a12", pat:"sheen", weapon:"greatsword", crest:"fin", cape:"cloak", note:"Black-lacquer heavy armour, greatsword, cloak"},
  // beetles
  ladybug:    {cls:"beetles", mm:7,  bulk:1.2, tint:"#d6322a", pat:"spots", weapon:"mace", horn:null, dome:true, note:"Red domed breastplate with black spots, mace"},
  bombardier: {cls:"beetles", mm:15, bulk:1.1, tint:"#e08a2a", pat:"bands", weapon:"axe", horn:null, crest:"fin", note:"Orange banded armour, axe"},
  stag:       {cls:"beetles", mm:60, bulk:1.15, tint:"#5a3320", pat:"sheen", weapon:"greatsword", horn:"stag", note:"Chestnut armour, greatsword, antler helm"},
  rhino:      {cls:"beetles", mm:55, bulk:1.3, tint:"#3b2a20", pat:"sheen", weapon:"hammer", horn:"rhino", hornScale:1.3, note:"Heaviest beetle: dark glossy plate, war hammer, great horn"},
  dung:       {cls:"beetles", mm:20, bulk:1.25, tint:"#2f6a5a", pat:"sheen", weapon:"pick", horn:"nub", note:"Teal metallic armour, pick"},
  // butterflies (wing = wingspan relative to the monarch)
  monarch:    {cls:"butterflies", mm:25, wing:1,    tint:"#e8862a", pat:"veins", weapon:"lance", note:"Orange armour with black veins, lance; wingspan 100 mm"},
  swallowtail:{cls:"butterflies", mm:28, wing:1,    tint:"#f0d040", pat:"stripes", weapon:"spear", tails:true, note:"Yellow and black stripes, spear, tailed cape; 90 mm"},
  morpho:     {cls:"butterflies", mm:35, wing:1.35, tint:"#3fa0ff", pat:"sheen", weapon:"sword", crest:"plume", note:"Bright blue sheen, sword, plume; 140 mm"},
  hawkmoth:   {cls:"butterflies", mm:45, wing:.8,  bulk:1.2, tint:"#8a7a6a", pat:"bands", weapon:"axe", note:"Grey-brown banded, axe, narrow cape"},
  atlas:      {cls:"butterflies", mm:50, wing:1.8, bulk:1.1, tint:"#a8452a", pat:"eyes", weapon:"halberd", crest:"crown", note:"Russet with eye-spot, halberd, crown; up to 250 mm"},
  // flies
  fruitfly:   {cls:"flies", mm:3,  bulk:.85, tint:"#d8a060", pat:"bands", eye:"#d23a2a", note:"Smallest knight: tan armour, red eye-visor"},
  housefly:   {cls:"flies", mm:7,  tint:"#6a6a72", pat:"stripes", note:"Grey striped armour"},
  horsefly:   {cls:"flies", mm:20, bulk:1.15, tint:"#5a6a4a", pat:"plates", eye:"#3fae6a", weapon:"axe", note:"Olive armour, green eye-visor, axe"},
  botfly:     {cls:"flies", mm:15, bulk:1.2, tint:"#c8a040", pat:"fuzz", weapon:"mace", note:"Fuzzy yellow armour, mace"},
  robberfly:  {cls:"flies", mm:28, bulk:.85, tint:"#4a4038", pat:"bands", weapon:"spear", crest:"plume", note:"Lean hunter: dark armour, spear, plume"},
  // crickets
  camel:      {cls:"crickets", mm:20, bulk:.85, tint:"#c9a46a", pat:"bands", cape:"cloak", note:"Tan banded armour, cloak"},
  field:      {cls:"crickets", mm:22, tint:"#2a2420", pat:"sheen", note:"Black glossy armour, sword"},
  katydid:    {cls:"crickets", mm:50, bulk:.85, tint:"#5fae4a", pat:"veins", weapon:"scythe", note:"Leaf-green with veins, scythe"},
  mole:       {cls:"crickets", mm:40, bulk:1.25, tint:"#7a5a3c", pat:"fuzz", weapon:"pick", digger:true, note:"Velvet-brown, pick, digging gauntlet"},
  weta:       {cls:"crickets", mm:75, bulk:1.3, tint:"#8a5a30", pat:"bands", weapon:"mace", crest:"spikes", note:"Heaviest cricket: banded, mace, spiked helm"},
  // scorpions
  pseudo:     {cls:"scorpions", mm:3,   bulk:.85, wing:0, tint:"#9a4a2a", pat:"plates", note:"Smallest scorpion: no tail"},
  bark:       {cls:"scorpions", mm:70,  bulk:.85, wing:1.1, tint:"#d8b060", pat:"bands", note:"Pale straw armour, slim tail"},
  vinegaroon: {cls:"scorpions", mm:60,  tint:"#4a1a1a", pat:"sheen", whip:true, crest:"fin", note:"Dark maroon, whip tail"},
  deathstalker:{cls:"scorpions",mm:80,  bulk:.85, wing:1.2, tint:"#e8d080", pat:"plates", crest:"spikes", note:"Pale yellow, longest tail, spiked helm"},
  emperor:    {cls:"scorpions", mm:180, bulk:1.3, wing:1.1, clawScale:1.3, tint:"#1c2030", pat:"sheen", crest:"crown", note:"Biggest of all: blue-black, heavy claws, crown"},
  // bees
  honeybee:   {cls:"bees", mm:13, tint:"#c88a20", pat:"stripes", weapon:"spear", note:"Amber and black stripes, spear"},
  killer:     {cls:"bees", mm:12, bulk:.9, tint:"#7a5a20", pat:"stripes", weapon:"sword", crest:"spikes", note:"Dark amber stripes, sword, spiked helm"},
  forager:    {cls:"bees", mm:13, bulk:.95, tint:"#e8c040", pat:"stripes", weapon:"lance", pollen:true, note:"Pale gold stripes, lance, pollen pouch"},
  carpenter:  {cls:"bees", mm:22, bulk:1.2, tint:"#222230", pat:"sheen", weapon:"axe", note:"Glossy black armour, axe"},
  bumble:     {cls:"bees", mm:20, bulk:1.3, tint:"#f0c030", pat:"fuzz", weapon:"hammer", crest:"plume", note:"Round and fuzzy, hammer, plume"},
  // termites
  alate:      {cls:"termites", mm:10, bulk:.85, tint:"#4a3020", pat:"sheen", weapon:"spear", cape:"flywings", note:"Dark brown, spear, wing cape"},
  tworker:    {cls:"termites", mm:5,  bulk:.9, tint:"#e8dcc0", pat:"bands", weapon:"pick", note:"Pale cream armour, pick"},
  nasute:     {cls:"termites", mm:5,  tint:"#7a4a2a", pat:"plates", weapon:"sword", nozzle:true, note:"Brown, sword, nozzle helm"},
  kamikaze:   {cls:"termites", mm:6,  bulk:1.3, tint:"#3a7ac8", pat:"pack", weapon:"mace", note:"Blue crystal backpack, mace"},
  major:      {cls:"termites", mm:14, tint:"#d87a30", pat:"plates", bigJaws:true, crest:"crown", note:"Orange soldier: mattock, big mandible faceguard"},
};
const scaleOf=mm=>Math.max(.85,Math.min(1.2,.8+.06*Math.log2(mm/2)));
for(const id in SPECIES)SPECIES[id].scale=+scaleOf(SPECIES[id].mm).toFixed(2);

// ================================================================ animations: keyframes of bone angles
// at: 0..1 through the clip. Channels: any bone id, plus rootX / rootY (pixels). Missing channels hold their last value.
const CLIPS={
  idle:  {dur:2, loop:true, keys:[
    {at:0,  rootY:0, spine:0,     upperArmB:-.35, forearmB:.6, weapon:.7, cape:.03},
    {at:.5, rootY:-1,spine:-.03,  upperArmB:-.32,forearmB:.62,weapon:.7, cape:-.03},
    {at:1,  rootY:0, spine:0,     upperArmB:-.35, forearmB:.6, weapon:.7, cape:.03}]},
  walk:  {dur:.7, loop:true, keys:[
    {at:0,   thighF:.45, shinF:-.15, thighB:-.45, shinB:.35, upperArmB:-.3, forearmB:.6, weapon:.7, rootY:0,  spine:-.04, cape:.06},
    {at:.25, thighF:0,   shinF:.4,   thighB:0,    shinB:.1,  upperArmB:-.3,                rootY:-2,              cape:-.06},
    {at:.5,  thighF:-.45,shinF:.35,  thighB:.45,  shinB:-.15,upperArmB:-.3,                rootY:0,               cape:.06},
    {at:.75, thighF:0,   shinF:.1,   thighB:0,    shinB:.4,  upperArmB:-.3,                rootY:-2,              cape:-.06},
    {at:1,   thighF:.45, shinF:-.15, thighB:-.45, shinB:.35, upperArmB:.5,                rootY:0,               cape:.06}]},
  windup:{dur:.35, loop:false, keys:[
    {at:0, upperArmB:.5,  forearmB:-.4, weapon:0,    spine:0,   upperArmF:0,  forearmF:0,   thighF:0,  thighB:0,   cape:0},
    {at:1, upperArmB:-2.4,forearmB:-.4, weapon:1.75, spine:.1,  upperArmF:.2, forearmF:-.3, thighF:.2, thighB:-.2, cape:.15}]},
  strike:{dur:.25, loop:false, keys:[
    {at:0, upperArmB:-2.4,forearmB:-.4, weapon:1.75, spine:.1,   upperArmF:.2, forearmF:-.3, thighF:.2,  shinF:0,   thighB:-.2, shinB:0,  cape:.15},
    {at:1, upperArmB:1.4, forearmB:.2,  weapon:-1.2, spine:-.18, upperArmF:.3, forearmF:-.3, thighF:.55, shinF:-.2, thighB:-.45,shinB:.3, cape:-.2}]},
};

const ease=x=>x*x*(3-2*x);
function sample(name,t){ // the pose (channel -> value) of a clip at time t seconds
  const c=CLIPS[name]||CLIPS.idle,u=c.loop?((t%c.dur)+c.dur)%c.dur/c.dur:Math.min(1,Math.max(0,t/c.dur)),pose={},all={},held={};
  let i=0;while(i<c.keys.length-1&&c.keys[i+1].at<u)i++;
  for(const key of c.keys)Object.assign(all,key);
  for(let j=0;j<=i;j++)Object.assign(held,c.keys[j]);
  const a=c.keys[i],b=c.keys[Math.min(i+1,c.keys.length-1)],k=b.at>a.at?ease((u-a.at)/(b.at-a.at)):0;
  for(const ch in all){if(ch==="at")continue;const va=held[ch]??all[ch],vb=b[ch]??va;pose[ch]=va+(vb-va)*k;}
  return pose;
}
function solve(look,pose){ // forward kinematics: every bone's origin, end and world angle
  const W={},ro=look.restOff||{},mul={leg:look.leg||1,arm:look.arm||1};
  for(const b of SKELETON){
    const p=b.parent?W[b.parent]:null,ox=p?(b.at==="end"?p.ex:p.x):(pose.rootX||0),oy=p?(b.at==="end"?p.ey:p.y):(pose.rootY||0),
      pa=p?p.a:0,c=Math.cos(pa),s=Math.sin(pa),off=b.id==="pelvis"?[0,-(50*mul.leg+4)]:(b.off||[0,0]),
      x=ox+off[0]*c+off[1]*s,y=oy-off[0]*s+off[1]*c,
      a=(b.abs?0:pa)+(b.rest||0)+(ro[b.id]||0)+(pose[b.id]||0),len=(b.len||0)*(b.grp?mul[b.grp]:1);
    W[b.id]={x,y,a,len,ex:x+Math.sin(a)*len,ey:y+Math.cos(a)*len};
  }
  return W;
}

// ================================================================ drawing helpers
function L(g,pts,c,w){g.strokeStyle=c;g.lineWidth=w;g.lineCap="round";g.lineJoin="round";g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
function F(g,d,c,e=K,ew=1.5){const p=new Path2D(d);if(c!=="none"){g.fillStyle=c;g.fill(p);}if(e){g.strokeStyle=e;g.lineWidth=ew;g.stroke(p);}}
function C(g,x,y,r,c,e,ew=1.5){g.beginPath();g.arc(x,y,r,0,7);if(c!=="none"){g.fillStyle=c;g.fill();}if(e){g.strokeStyle=e;g.lineWidth=ew;g.stroke();}}
// ================================================================ class sigils: same shapes as SIG_FR / SIGIL / sigilSVG in versus.html (keep in sync)
// drawn upright in a -70..70 frame centred on the ctx origin
const SIG_FR={heater:"M0 -62 L50 -42 L46 18 Q34 52 0 68 Q-34 52 -46 18 L-50 -42 Z",kite:"M0 -66 L42 -46 L40 -6 Q30 40 0 78 Q-30 40 -40 -6 L-42 -46 Z",hex:"M0 -62 L54 -31 L54 31 L0 62 L-54 31 L-54 -31 Z"};
const SIGIL={
  ants:{fr:"heater",d:"M-7 -6 C-38 -8 -46 28 -18 46 C-27 30 -25 12 -7 6 Z M7 -6 C38 -8 46 28 18 46 C27 30 25 12 7 6 Z M0 -38 A13 13 0 1 0 0 -12 A13 13 0 1 0 0 -38 Z",x:"ant"},
  beetles:{fr:"heater",tr:"rim",d:"",x:"spots"},
  butterflies:{fr:"heater",d:"M-3 -28 C-30 -60 -52 -40 -42 -12 C-36 4 -14 6 -3 0 Z M3 -28 C30 -60 52 -40 42 -12 C36 4 14 6 3 0 Z M-3 4 C-26 8 -42 30 -26 44 C-14 50 -4 36 -3 20 Z M3 4 C26 8 42 30 26 44 C14 50 4 36 3 20 Z",x:"rings"},
  flies:{fr:"kite",tr:"rim",d:"M-38 -14 A18 22 0 1 0 -2 -14 A18 22 0 1 0 -38 -14 Z M2 -14 A18 22 0 1 0 38 -14 A18 22 0 1 0 2 -14 Z M-5 10 L5 10 L4 40 L10 50 L-10 50 L-4 40 Z",x:"facets"},
  crickets:{fr:"hex",tr:"rim",d:"M-4 34 C-18 4 -30 -24 -34 -40 L-22 -40 C-18 -22 -12 -4 -2 12 Z M-24 -40 L-14 50 L-21 50 L-34 -36 Z M4 34 C18 4 30 -24 34 -40 L22 -40 C18 -22 12 -4 2 12 Z M24 -40 L14 50 L21 50 L34 -36 Z"},
  scorpions:{fr:"hex",tr:"rim",d:"M-36 44 A12 12 0 1 0 -12 44 A12 12 0 1 0 -36 44 Z M-49 12 A11 11 0 1 0 -27 12 A11 11 0 1 0 -49 12 Z M-40 -20 A10 10 0 1 0 -20 -20 A10 10 0 1 0 -40 -20 Z M-18 -40 A9 9 0 1 0 0 -40 A9 9 0 1 0 -18 -40 Z M6 -44 A8 8 0 1 0 22 -44 A8 8 0 1 0 6 -44 Z M22 -48 C42 -46 42 -20 26 -14 L30 -28 Z M8 30 C28 18 46 28 42 46 C36 38 26 38 18 44 Z"},
  bees:{fr:"heater",tr:"studs",d:"M-12 -22 L0 -29 L12 -22 L12 -8 L0 -1 L-12 -8 Z M-38 -22 L-26 -29 L-14 -22 L-14 -8 L-26 -1 L-38 -8 Z M14 -22 L26 -29 L38 -22 L38 -8 L26 -1 L14 -8 Z M-25 2 L-13 -5 L-1 2 L-1 16 L-13 23 L-25 16 Z M1 2 L13 -5 L25 2 L25 16 L13 23 L1 16 Z M-12 26 L0 19 L12 26 L12 40 L0 47 L-12 40 Z"},
  termites:{fr:"hex",d:"M-18 -40 A18 16 0 1 0 18 -40 A18 16 0 1 0 -18 -40 Z M-10 -26 C-30 0 -26 30 -6 52 C-14 28 -14 6 -2 -22 Z M10 -26 C30 0 26 30 6 52 C14 28 14 6 2 -22 Z"}};
function sigil(g,cls){const c=SIGIL[cls],A=SKINS[cls].col,S=new Path2D(SIG_FR[c.fr]),D=c.d&&new Path2D(c.d),half=(side,fn)=>{g.save();g.beginPath();g.rect(side<0?-90:0,-100,90,200);g.clip();fn();g.restore();};
  if(c.x==="ant"){L(g,[[-9,-44],[-15,-60],[-30,-70]],K,5.5);L(g,[[9,-44],[15,-60],[30,-70]],K,5.5);}
  g.fillStyle=K;g.fill(S);half(1,()=>{g.fillStyle=A;g.fill(S);});   // split field: ink left, class colour right
  g.save();if(c.tr)g.scale(.86,.86);
  if(D){g.strokeStyle=B;g.lineWidth=2.5;half(-1,()=>{g.fillStyle=A;g.fill(D);g.stroke(D);});half(1,()=>{g.fillStyle=K;g.fill(D);g.stroke(D);});}
  if(c.x==="rings")for(const x of[-26,26])C(g,x,-22,7,"none",B,3);
  if(c.x==="facets")for(const[x,y] of[[-28,-22],[-18,-26],[-14,-14],[-26,-8],[28,-22],[18,-26],[14,-14],[26,-8]])C(g,x,y,2.2,B);
  if(c.x==="ant")C(g,0,-25,4,B);
  if(c.x==="spots"){C(g,-24,2,15,B);C(g,24,2,15,B);}
  g.restore();
  if(c.tr==="rim"){g.save();g.scale(.86,.86);g.strokeStyle=B;g.lineWidth=2;g.stroke(S);g.restore();}
  if(c.tr==="studs")for(const[x,y] of[[-44,-36],[44,-36],[-42,-6],[42,-6],[-36,26],[36,26],[0,-56],[0,60]])C(g,x,y,3,B,K,1);
  g.strokeStyle=K;g.lineWidth=3;g.stroke(S);}
function claw(g,A,s){g.save();g.scale(s,s);F(g,"M0 0 C10 -2 18 6 16 16 C12 10 8 8 4 9 Z",A,K,1.4);F(g,"M0 2 C6 8 6 16 0 20 C2 14 0 9 -2 6 Z",K);g.restore();}

// ================================================================ parts: drawn in each bone's own space (+y runs along the bone)
const PART={
  thighB:(g,b,k)=>leg(g,b,k,"#3a3230",true), thighF:(g,b,k)=>leg(g,b,k,K,true),
  shinB:(g,b,k)=>leg(g,b,k,"#3a3230",false), shinF:(g,b,k)=>leg(g,b,k,K,false),
  // ---- torso: ink chest plate, class-colour side panels, species-colour plackart, cream piping (the Beetle Knight template)
  spine(g,b,k){const q=k.bk,lk=k.look,T=k.T,A=k.A,pat=lk.pat||(lk.stripes?"stripes":"plates");
    if(pat==="pack"){g.save();g.translate(-16*q,-26);for(const[a,c] of[[0,-8],[-6,2],[2,6]]){g.save();g.translate(a,c);F(g,"M0 -7 L6 -3 L6 4 L0 8 L-6 4 L-6 -3 Z",T,K,1.3);g.restore();}g.restore();}
    if(pat==="fuzz"){for(let i=0;i<16;i++){const a=i/16*Math.PI*2;C(g,Math.cos(a)*17*q,-26+Math.sin(a)*15,3.2,T);}}
    F(g,`M${-9*q} 0 L${9*q} 0 L${11*q} -17 L${-11*q} -17 Z`,K,K,1);                                     // waist
    const chest=lk.dome?`M${-18*q} -14 Q${-21*q} -44 0 -46 Q${21*q} -44 ${18*q} -14 Q0 -9 ${-18*q} -14 Z`
                       :`M${-18*q} -37 Q0 -43 ${18*q} -37 L${13*q} -15 Q0 -11 ${-13*q} -15 Z`;
    F(g,chest,K,K,1.6);
    g.save();g.clip(new Path2D(chest));g.fillStyle=A;g.fillRect(-22*q,-50,7*q,44);g.fillRect(15*q,-50,7*q,44);g.restore();   // side panels
    const pl=`M${-10*q} -35 Q0 -39 ${10*q} -35 L${8*q} -18 Q0 -15 ${-8*q} -18 Z`;F(g,pl,T,K,1.4);          // plackart
    g.save();g.clip(new Path2D(pl));
    if(pat==="plates"){L(g,[[-8*q,-31],[0,-26],[8*q,-31]],K,2.4);L(g,[[-7*q,-23],[0,-19],[7*q,-23]],K,2);}
    if(pat==="stripes")for(const y of[-33,-26,-19])L(g,[[-12*q,y],[12*q,y]],K,3.2);
    if(pat==="bands")for(const y of[-32,-28,-24,-20])L(g,[[-12*q,y],[12*q,y]],K,1.2);
    if(pat==="spots")for(const[a,c] of[[-5,-31],[5,-28],[-3,-22],[6,-20]])C(g,a*q,c,2.6,K);
    if(pat==="veins"){for(const y of[-30,-23]){L(g,[[0,y+4],[-9*q,y-3]],K,1.1);L(g,[[0,y+4],[9*q,y-3]],K,1.1);}}
    if(pat==="eyes"){C(g,0,-27,5.5,B,K,1.6);C(g,0,-27,2.2,K);}
    if(pat==="sheen"){g.globalAlpha=.5;L(g,[[-7*q,-35],[5*q,-17]],B,3);g.globalAlpha=1;}
    if(pat==="fuzz")for(let i=0;i<6;i++)C(g,-5+(i%3)*5,-31+Math.floor(i/3)*8,1,K);
    g.restore();
    g.save();g.translate(0,-26);g.scale(.86,.88);g.translate(0,26);g.strokeStyle=B;g.lineWidth=1.3;g.stroke(new Path2D(chest));g.restore();   // piping
    if(!lk.dome)L(g,[[0,-41],[0,-14]],B,1.2);},                                                          // centre seam
  // ---- belt with the round buckle and banded faulds; painted over the thighs
  pelvis(g,b,k){const q=k.bk,A=k.A;
    F(g,`M${-12*q} 0 L${12*q} 0 L${11*q} 10 Q0 13 ${-11*q} 10 Z`,K,K,1);
    for(const y of[3.5,7])L(g,[[-11*q,y],[11*q,y]],B,1.1);
    F(g,`M${-13*q} -9 L${13*q} -9 L${13*q} 0 L${-13*q} 0 Z`,K,K,1);L(g,[[-13*q,-8],[13*q,-8]],B,1);L(g,[[-13*q,-1],[13*q,-1]],B,1);
    C(g,0,-4.5,5.6,B,K,1.2);C(g,0,-4.5,3.7,A);C(g,0,-4.5,1.6,K);
    if(k.look.pollen)C(g,-11*q,4,4.5,"#f0c838",K,1.2);},
  // ---- helmet: crest, angular class-colour visor eyes, cream barred mouthguard
  head(g,b,k){const id=k.cls,A=k.A,lk=k.look,T=k.T,hs=Math.min(1.12,k.bk);g.scale(hs,hs);
    if(id==="ants"){L(g,[[-2,-22],[-6,-36],[-16,-42]],K,3.2);L(g,[[8,-22],[12,-36],[22,-42]],K,3.2);C(g,-16,-42,2.8,A);C(g,22,-42,2.8,A);}
    if(id==="butterflies")for(const s of[-1,1]){g.strokeStyle=K;g.lineWidth=2.6;g.beginPath();g.moveTo(3+s*3,-23);g.quadraticCurveTo(3+s*8,-42,3+s*18,-50);g.stroke();C(g,3+s*18,-50,3.4,K);}
    if(id==="crickets")for(const s of[-1,1]){g.strokeStyle=K;g.lineWidth=2.2;g.beginPath();g.moveTo(3+s*3,-23);g.quadraticCurveTo(3+s*10,-70,3+s*44,-58);g.stroke();}
    if(id==="bees")for(const s of[-1,1])L(g,[[3+s*3,-23],[3+s*6,-33],[3+s*12,-37]],K,2.6);
    if(id==="termites"&&!lk.nozzle)L(g,[[3,-24],[3,-31]],K,2.4);
    const cr=lk.crest;
    if(cr==="plume")F(g,"M1 -24 C-3 -46 -22 -54 -34 -44 C-21 -44 -12 -36 -6 -21 Z",T,K,1.4);
    if(cr==="fin")F(g,"M-10 -18 Q0 -42 18 -24 L14 -20 Q2 -32 -6 -16 Z",T,K,1.4);
    if(cr==="spikes")for(const[a,c,r] of[[-6,-21,-.6],[3,-25,0],[12,-21,.6]]){g.save();g.translate(a,c);g.rotate(r);F(g,"M-4 0 L0 -13 L4 0 Z",T,K,1.2);g.restore();}
    if(cr==="crown")F(g,"M-8 -20 L-8 -32 L-3 -26 L3 -35 L9 -26 L14 -32 L14 -20 Z",T,K,1.4);
    const horn=lk.horn===undefined?k.skin.horn:lk.horn;
    if(horn==="stag")for(const s of[-1,1]){g.save();g.translate(3+s*9,-19);g.scale(s,1);F(g,"M0 0 C6 -8 12 -18 8 -30 L5 -24 L2 -27 C4 -16 0 -8 -4 -2 Z",A,K,1.4);g.restore();}
    F(g,"M-11 2 C-15 -10 -11 -25 3 -26 C17 -25 21 -10 17 2 L12 7 L-6 7 Z",K,K,1);                  // helmet shell
    F(g,"M1 -26 L5 -26 L4.5 -16 L1.5 -16 Z",A,0);                                                // crown stripe
    if(horn==="rhino"){g.save();g.translate(3,-24);g.scale(lk.hornScale||1,lk.hornScale||1);F(g,"M-4 2 Q-6 -20 -1 -38 L1 -29 L4 -40 Q8 -18 6 2 Z",A,K,1.4);L(g,[[1,0],[1,-27]],K,1.2);g.restore();}
    if(horn==="nub")F(g,"M0 -24 Q2 -34 3 -38 Q5 -34 7 -24 Z",A,K,1.2);
    const E=lk.eye||A;
    if(id==="flies"){for(const x of[-3,10]){C(g,x,-11,7,E,B,1.4);for(const[a,c] of[[-2,-3],[2,-2],[0,1],[-2,3],[2,3]])C(g,x+a,-11+c,1,B);}}
    else{F(g,"M2 -10 L-9 -17 L-11 -10 L0 -6 Z",E,B,1.3);F(g,"M4 -10 L15 -17 L17 -10 L6 -6 Z",E,B,1.3);
      g.globalAlpha=.35;for(const x of[-6,10])L(g,[[x-2,-9],[x+2,-14]],K,1);g.globalAlpha=1;}
    if(id==="scorpions")for(const x of[-1,3,7])C(g,x,-20,1.4,A);
    F(g,"M-3 -3 L9 -3 L8 4 L-2 4 Z",B,K,1.2);for(const x of[.5,3,5.5])L(g,[[x,-2],[x,3]],K,1.1);       // mouthguard
    g.globalAlpha=.35;g.strokeStyle=B;g.lineWidth=2.2;g.beginPath();g.arc(1,-12,11,3.6,4.5);g.stroke();g.globalAlpha=1;
    if(id==="ants"&&lk.jaws||id==="termites"&&k.skin.jaws&&!lk.nozzle){const big=lk.bigJaws?1.4:1;for(const s of[-1,1]){g.save();g.translate(3+s*8,4);g.scale(s*big,big);F(g,"M0 0 C5 3 5 10 -2 13 C0 8 -1 4 -3 2 Z",A,K,1.2);g.restore();}}
    if(lk.nozzle){F(g,"M14 -12 L34 -16 L34 -10 L14 -4 Z",K,A,1.2);C(g,34,-13,2.5,A);}},
  // ---- arms: big round pauldrons, ink sleeves with a species-colour panel, chunky gloves
  upperArmB(g,b,k){L(g,[[0,0],[0,b.len]],K,9*k.bk);pauldron(g,b,k,.9);},
  forearmB(g,b,k){L(g,[[0,0],[0,b.len]],K,9*k.bk);L(g,[[0,4],[0,b.len-4]],k.T,4*k.bk);glove(g,b.len,k);},
  upperArmF(g,b,k){L(g,[[0,0],[0,b.len]],K,9*k.bk);pauldron(g,b,k,1);
    if(k.skin.offhand){g.save();g.translate(0,1);g.rotate(b.a);g.scale(.13,.13);sigil(g,k.cls);g.restore();}},   // no shield: the sigil rides on the pauldron
  forearmF(g,b,k){const dg=k.look.digger;L(g,[[0,0],[0,b.len]],K,(dg?12:9)*k.bk);L(g,[[0,4],[0,b.len-4]],k.T,4*k.bk);glove(g,b.len,k);
    if(dg){g.save();g.translate(0,b.len);for(let i=-1;i<=1;i++)L(g,[[0,2],[i*5,10]],k.A,3);g.restore();}},
  weapon(g,b,k){const A=k.A,w=k.look.weapon,WD="#5a4030";
    if(w==="axe"){L(g,[[0,-6],[0,46]],WD,5);F(g,"M0 26 Q18 18 24 34 Q18 52 0 46 Z",S,K,1.5);L(g,[[2,28],[2,44]],A,3);}
    if(w==="scythe"){L(g,[[0,-20],[0,62]],WD,4.5);F(g,"M0 60 C20 62 38 50 46 28 C34 44 18 52 0 52 Z",S,K,1.5);}
    if(w==="mace"){L(g,[[0,-4],[0,36]],WD,5);for(let i=0;i<8;i++){const a=i*Math.PI/4;L(g,[[0,44],[Math.sin(a)*15,44+Math.cos(a)*15]],K,3);}C(g,0,44,10,A,K,1.6);}
    if(w==="greatsword"){L(g,[[0,-10],[0,4]],WD,5);L(g,[[-9,4],[9,4]],A,4);F(g,"M-5 6 L5 6 L4 64 L0 74 L-4 64 Z",S,K,1.4);L(g,[[0,8],[0,62]],"rgba(23,17,14,.4)",1);}
    if(w==="pick"){L(g,[[0,-6],[0,44]],WD,5);F(g,"M-26 44 Q0 32 24 42 Q0 38 -26 44 Z",S,K,1.5);C(g,0,40,3.5,A,K,1);}
    if(w==="halberd"){L(g,[[0,-24],[0,56]],K,4.5);for(const s of[1,-1])F(g,`M0 52 q ${24*s} 6 ${6*s} 22 q ${-10*s} 0 0 -16 Z`,A,K,1.8);L(g,[[0,52],[0,72]],S,3.5);}
    if(w==="hammer"){L(g,[[0,-14],[0,40]],K,5.5);for(const y of[-8,8,24])L(g,[[-3,y],[3,y]],B,1.4);
      const hd="M-19 31 L19 31 L21 42 L19 54 L-19 54 L-21 42 Z";F(g,hd,K,K,1.5);g.save();g.clip(new Path2D(hd));g.fillStyle=A;g.fillRect(0,28,24,30);g.restore();
      L(g,[[0,31],[0,54]],B,1.3);C(g,-10,42.5,5,"none",B,2);C(g,-10,42.5,1.8,B);F(g,hd,"none",K,1.8);}
    if(w==="lance"){L(g,[[0,-28],[0,66]],K,4);F(g,"M7 66 L0 88 L-7 66 Z",S);}
    if(w==="spear"){L(g,[[0,-24],[0,60]],K,4);F(g,"M5 60 L0 86 L-5 60 Z",A,K,1.4);for(const y of[66,72])L(g,[[-3,y],[3,y]],K,2);}
    if(w==="mattock"){L(g,[[0,-6],[0,40]],"#5a4030",5);F(g,"M-22 34 Q0 30 18 36 L22 44 Q0 38 -24 42 Z",K,A,1.5);}
    if(w==="sword"||w==="dagger"){const len=w==="sword"?44:22;L(g,[[0,0],[0,len]],S,w==="sword"?6:4.5);L(g,[[0,0],[0,len]],K,1);L(g,[[-5,0],[5,0]],A,3);}
    if(w==="claw"){g.rotate(-2.69);claw(g,A,1.2*(k.look.clawScale||1));}},
  shield(g,b,k){const A=k.A,id=k.cls,lk=k.look;
    if(k.skin.offhand==="dagger"){g.rotate(-2.5);L(g,[[0,0],[0,20]],S,4.5);L(g,[[0,0],[0,20]],K,1);L(g,[[-5,0],[5,0]],A,3);C(g,0,0,4,A,K,1.2);return;}
    if(k.skin.offhand==="claw"){g.translate(4,0);g.rotate(-1.6);claw(g,A,1.2*(lk.clawScale||1));return;}
    if(lk.leaf){g.save();g.translate(4,-22);F(g,"M0 -18 Q16 -2 0 18 Q-16 -2 0 -18 Z","#5c7a32",K,1.4);L(g,[[0,-16],[0,16]],K,1);g.restore();}
    const s=k.bk>1?.37:.32;g.translate(6,2);g.scale(s,s);sigil(g,id);},
  cape(g,b,k){const A=k.A,t=k.t,lk=k.look,c=lk.cape||k.skin.cape,ws=lk.wing??1;if(!c||ws===0)return;g.scale(ws,ws);
    if(c==="cloak"){const wv=Math.sin(t*4)*3;F(g,`M2 -6 C-10 0 -18 28 ${-24+wv} 56 L${-4+wv*.5} 56 C-4 32 -2 10 6 0 Z`,A);}
    if(c==="scarf"){const wv=Math.sin(t*8);F(g,`M0 -8 C-14 -10 -28 ${-6+wv*3} -48 ${-4+wv*6} C-38 ${2+wv*5} -24 2 -2 0 Z`,A);}
    if(c==="wings"){const f=.8+.2*Math.sin(t*5);g.save();g.translate(-2,0);g.scale(1,f);F(g,"M0 0 C-30 -40 -62 -30 -54 4 C-48 20 -20 14 0 6 Z",A);F(g,"M0 6 C-22 14 -44 34 -30 48 C-18 56 -6 34 0 14 Z",A);if(lk.tails)F(g,"M-24 44 L-30 64 L-20 46 Z",A);C(g,-34,-6,6,"none",B,2.5);g.restore();}
    if(c==="flywings"||c==="beewings"){const a=Math.sin(t*40)*.25,col=c==="beewings"?"rgba(240,232,200,.6)":"rgba(205,205,225,.55)";for(const o of[0,.35]){g.save();g.translate(-2,0);g.rotate(-.5-o+a);g.fillStyle=col;g.beginPath();g.ellipse(-26,0,28,8,0,0,7);g.fill();g.strokeStyle=K;g.lineWidth=1.2;g.stroke();L(g,[[-2,0],[-50,0]],"rgba(23,17,14,.5)",.8);g.restore();}}
    if(c==="tail"){g.translate(0,30);g.rotate(Math.sin(t*3)*.06);   // rooted at the hip, curls up over the back
      const pts=[[-6,0],[-18,-8],[-27,-22],[-30,-38],[-26,-54],[-15,-66],[0,-71]];
      L(g,pts,K,9);pts.forEach(([x,y],i)=>C(g,x,y,7-i*.5,i%2?A:K,K,1.2));
      if(lk.whip)L(g,[[0,-71],[20,-66],[36,-76]],K,2);
      else F(g,"M0 -77 C16 -80 22 -64 12 -56 L12 -66 Z",A,K,1.4);}},
};
function pauldron(g,b,k,s){const q=k.bk*s,r=10*q;g.save();g.rotate(b.a);           // upright, whatever the arm does
  C(g,0,2,r,k.A,K,1.8);g.save();g.beginPath();g.arc(0,2,r,0,7);g.clip();g.fillStyle=K;g.fillRect(-r,2+r*.45,2*r,r);g.restore();
  L(g,[[-r*.9,2+r*.45],[r*.9,2+r*.45]],B,1.2);g.globalAlpha=.45;g.strokeStyle=B;g.lineWidth=2;g.beginPath();g.arc(0,2,r*.65,3.7,4.9);g.stroke();g.globalAlpha=1;
  C(g,0,2,r,"none",K,1.8);g.restore();}
function glove(g,y,k){const q=k.bk;C(g,0,y+1,5.5*q,K,K,1);L(g,[[-4.5*q,y-3],[4.5*q,y-3]],B,1.2);}
// ---- legs: ink with a class-colour stripe, round knee pads with a cream ring, species-colour greaves, chunky boots
function leg(g,b,k,shade,thigh){const jump=k.skin.legs==="jump",q=k.bk;
  if(thigh){L(g,[[0,0],[0,b.len]],shade,(jump?15:12.5)*q);L(g,[[-3.2*q,3],[-3.2*q,b.len-5]],k.A,3.2*q);
}
  else{L(g,[[0,0],[0,b.len]],shade,11.5*q);L(g,[[0,7],[0,b.len-9]],k.T,4.2*q);
    C(g,0,0,6.5*q,K,K,1);C(g,0,0,4.2*q,"none",B,1.5);C(g,0,0,1.4*q,B);                                // knee pad, over the shin
    g.translate(0,b.len);g.rotate(b.a);
    F(g,`M${-8*q} -10 L${8*q} -10 L${8*q} -3 Q${17*q} -2 ${17*q} 4 L${-8*q} 4 Z`,shade,K,1);
    L(g,[[-8*q,-9],[8*q,-9]],B,1.3);L(g,[[-8*q,4],[17*q,4]],k.A,1.8);}}

// ================================================================ draw one knight at the ctx origin (its feet), facing right
// id: a class ("ants") or a species ("bullet"). opt: {scale, flip, showBones, showNames, ignoreSpeciesScale}
function draw(g,id,clip,t,opt={}){
  const sp=SPECIES[id],cls=sp?sp.cls:id,skin=SKINS[cls];if(!skin)return;
  const look=Object.assign({},skin,sp||{}),pose=typeof clip==="string"?sample(clip,t):clip,W=solve(look,pose),
    k={cls,skin,look,A:skin.col,T:look.tint||"#3a3230",bk:look.bulk||1,t:opt.t??t};
  const sc=(opt.scale||1)*(sp&&!opt.ignoreSpeciesScale?sp.scale:1);
  g.save();g.scale(sc,sc);if(opt.flip)g.scale(-1,1);
  if(!opt.noShadow){g.fillStyle="rgba(23,17,14,.2)";g.beginPath();g.ellipse(4,2,24*k.bk,4.5,0,0,7);g.fill();}   // ground shadow
  for(const name of ORDER){const b=W[name],fn=PART[name];if(!fn)continue;g.save();g.translate(b.x,b.y);g.rotate(-b.a);fn(g,b,k);g.restore();}
  if(opt.showBones){g.lineWidth=1.5/sc;for(const bn of SKELETON){const b=W[bn.id];if(!bn.parent)continue;g.strokeStyle="#e0218a";g.beginPath();g.moveTo(b.x,b.y);g.lineTo(b.ex,b.ey);g.stroke();g.fillStyle="#e0218a";g.beginPath();g.arc(b.x,b.y,2.2,0,7);g.fill();
    if(opt.showNames){g.font="9px sans-serif";g.fillStyle="#7a0f4a";g.fillText(bn.id,b.x+3,b.y-3);}}}
  g.restore();
}

const KnightRig={SKELETON,ORDER,SKINS,SPECIES,CLIPS,PART,sample,solve,draw,scaleOf};
if(typeof module!=="undefined")module.exports=KnightRig;else (typeof window!=="undefined"?window:globalThis).KnightRig=KnightRig;
})();
