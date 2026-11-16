/* ANTHOLD disaster gameplay; seconds and world pixels, no browser dependencies. */
(function (root) {
  'use strict';
  const RULES = Object.freeze({
    hail: {name:'Hailstorm',duration:4,recharge:60,cost:4,base:.03},
    rain: {name:'Downpour',duration:6,recharge:64,cost:3,base:0},
    gale: {name:'Gale',duration:3,recharge:52,cost:3,base:0},
    boulder: {name:'Boulder',duration:9,recharge:92,cost:5,base:.08},
    quake: {name:'Earthquake',duration:.1,recharge:116,cost:5,base:.06},
    sun: {name:'Sunbeam',duration:6,recharge:92,cost:4,base:.05},
    tornado: {name:'Tornado',duration:8,recharge:104,cost:5,base:.04},
    fire: {name:'Wildfire',duration:5,recharge:68,cost:4,base:0}
  });
  class DisasterEngine {
    constructor(host) { this.host=host; this.time=0; this.active=null; this.queue=[]; this.ready=[{},{}]; this.nextId=0; }
    canCast(team,type) { return (team===0||team===1)&&Object.hasOwn(RULES,type)&&!this.host.over()&&this.host.started()&&(this.ready[team][type]||0)<=this.time&&this.queue.length<2; }
    cast(team,type) {
      if(!this.canCast(team,type)) return false;
      this.ready[team][type]=this.time+RULES[type].recharge;
      const e={id:++this.nextId,type,c:team,t:0,dur:RULES[type].duration,x:this.host.bases()[team].x,hit:new Set(),baseSpent:0};
      if(type==='rain'&&this.active?.type==='fire'){this.host.event('end',this.active);this.active=null;}
      if(this.active) this.queue.push(e); else this.begin(e);
      return true;
    }
    begin(e) { e.phase='warning';e.warning=1;this.active=e;this.host.event('warning',e); }
    remaining(team,type) { return Math.max(0,(this.ready[team][type]||0)-this.time); }
    speed(u) { const e=this.active; return e&&e.phase==='active'&&e.type==='rain'&&u.team!==e.c&&!this.host.air(u)&&!this.host.high(u)? .6:1; }
    baseDamage(e) {
      const b=this.host.bases()[1-e.c],r=RULES[e.type];
      // A cast cannot remove more than 25% max HP or destroy a nest; all attacks share one per-cast budget.
      const amount=Math.max(0,Math.min(b.max*r.base*this.host.resistance(1-e.c),b.max*.25-e.baseSpent,b.hp-1));
      if(amount>0) {this.host.damageBase(1-e.c,amount);e.baseSpent+=amount;}
    }
    advance(dt) {
      if(!Number.isFinite(dt)||dt<=0||this.host.over()||!this.host.started())return;
      // Fixed substeps prevent swept hazards skipping targets on a slow frame.
      for(let left=dt;left>1e-8;left-=1/60){this.step(Math.min(left,1/60));if(this.host.over())break;}
    }
    step(dt) {
      this.time+=dt;const e=this.active;if(!e)return;
      if(e.phase==='warning') {
        e.warning-=dt;if(e.warning>1e-8)return;
        e.phase='active';this.host.event('impact',e);return;
      }
      dt=Math.min(dt,Math.max(0,e.dur-e.t));
      const h=this.host,dir=e.c===0?1:-1,foe=1-e.c;
      const enemies=h.units().filter(u=>u.team===foe&&!u.dead&&!u.under);
      const hurt=(u,a)=>h.damage(u,a);
      if(e.type==='hail') {
        for(const u of enemies)if((e.c===0?u.x>=h.width/2:u.x<=h.width/2)&&!h.roof(u))hurt(u,8*dt*(h.air(u)?1.5:1));
      } else if(e.type==='rain') {
        for(const u of enemies){if(h.air(u))h.land(u);if(!h.high(u)&&u.maxHp<70)hurt(u,4*dt);}
      } else if(e.type==='gale') {
        for(const u of enemies){const heavy=['beetles','termites'].includes(u.sp.cls)||u.sp.steady;u.x=h.clamp(u.x+dir*72*dt*(h.air(u)?2:1)*(heavy?.5:1));}
      } else if(e.type==='quake') {
        if(!e.applied){e.applied=true;for(const u of enemies)if(!h.air(u)&&!(u.hop>0)){hurt(u,10);u.st.stun=Math.max(u.st.stun||0,2);}this.baseDamage(e);}
      } else if(['boulder','sun','tornado'].includes(e.type)) {
        const speed={boulder:252,sun:288,tornado:234}[e.type];e.x+=dir*speed*dt;
        for(const u of enemies)if(Math.abs(u.x-e.x)<(e.type==='tornado'?70:40)){
          if(e.type==='boulder'){if(!h.air(u)&&!(u.hop>0)&&!e.hit.has(u.id)){e.hit.add(u.id);hurt(u,45);u.x=h.clamp(u.x+dir*30);}}
          else if(e.type==='sun'){if(!h.shadow(u))hurt(u,24*dt);}
          else{hurt(u,12*dt);u.x=h.clamp(u.x+dir*100*dt);u.st.stun=Math.max(u.st.stun||0,.2);}
        }
        if(Math.abs(e.x-h.bases()[foe].x)<50&&!e.arrived){e.arrived=true;this.baseDamage(e);e.t=e.dur;}
      } else if(e.type==='fire') {
        for(const u of enemies)if(!h.air(u)&&!h.water(u))hurt(u,4*dt);
      }
      e.t+=dt;if(e.t>=e.dur-1e-8){if(e.type==='hail')this.baseDamage(e);h.event('end',e);this.active=null;const next=this.queue.shift();if(next)this.begin(next);}
    }
  }
  root.ANTHOLDDisasters={RULES,DisasterEngine};
})(typeof globalThis==='undefined'?this:globalThis);
