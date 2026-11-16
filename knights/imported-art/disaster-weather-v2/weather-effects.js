/* Procedural weather in world coordinates; no video overlays or gameplay mutation. */
(function(){
  'use strict';
  const mod=(n,m)=>((n%m)+m)%m;
  function draw(c,e,world){
    if(!e||!['hail','rain','gale'].includes(e.type))return;
    const {width:W,height:H,ground,palette:p,reducedMotion}=world;
    const warning=e.phase==='warning',t=warning?1-e.warning:e.t;
    const fade=warning?(.2+.3*t):Math.min(1,.4+t*2,(e.dur-t)*3);
    const motion=reducedMotion?0:t,dir=e.c===0?1:-1;
    const left=e.type==='hail'?(e.c===0?W/2:0):0,right=e.type==='hail'?left+W/2:W;
    c.save();c.beginPath();c.rect(left,0,right-left,H);c.clip();
    // The clouds build during the warning; no camera shakes or flashing lightning.
    c.globalAlpha=fade*.18;c.fillStyle=p.ink;c.fillRect(left,0,right-left,H);
    if(e.type!=='gale'){
      for(let i=0;i<12;i++){
        const x=left+mod(i*167+motion*20,right-left+180)-90,y=22+(i%3)*27;
        c.globalAlpha=fade*.65;c.fillStyle=p.cloud;
        c.beginPath();c.ellipse(x,y,110,38,0,0,Math.PI*2);c.ellipse(x+65,y+12,84,31,0,0,Math.PI*2);c.fill();
      }
    }
    if(!warning&&e.type==='hail'){
      // Each seeded stone travels down to the terrain, bounces, then breaks into shards.
      for(let i=0;i<100;i++){
        const x0=left+mod(i*113.71,right-left),gy=ground(x0),cycle=mod(motion*1.35+i*.618,1);
        const r=3+i%4,fall=cycle<.76,y=fall?-30+(gy+30)*cycle/.76:gy-18*Math.sin((cycle-.76)/.24*Math.PI);
        const x=x0-dir*(fall?cycle*45:34+(cycle-.76)*55);
        c.globalAlpha=fade*(fall?.95:1-(cycle-.76)/.24);c.strokeStyle=p.ice;c.lineWidth=2;
        if(fall){c.beginPath();c.moveTo(x+dir*5,y-18);c.lineTo(x,y);c.stroke();}
        c.fillStyle=p.ice;c.strokeStyle=p.ink;c.lineWidth=1.2;c.beginPath();c.arc(x,y-r,r,0,7);c.fill();c.stroke();
        if(!fall){c.strokeStyle=p.ice;c.beginPath();c.moveTo(x-7,gy-2);c.lineTo(x-12,gy-8);c.moveTo(x+7,gy-2);c.lineTo(x+13,gy-6);c.stroke();}
      }
    }else if(!warning&&e.type==='rain'){
      // Rain stops at the lane; pools sit below ground so bodies stay inspectable.
      c.globalAlpha=fade*.3;c.fillStyle=p.water;c.beginPath();c.moveTo(0,H);
      for(let x=0;x<=W;x+=20)c.lineTo(x,ground(x)-8-Math.sin(x*.03+motion*4)*2);
      c.lineTo(W,H);c.fill();
      for(let i=0;i<210;i++){
        const x0=mod(i*71.39,W+90)-45,gy=ground(Math.max(0,Math.min(W,x0))),cycle=mod(motion*1.7+i*.3819,1);
        const x=x0-dir*cycle*52,y=-24+cycle*(gy+24);
        c.globalAlpha=fade*(.4+(i%3)*.2);c.strokeStyle=p.rain;c.lineWidth=1+i%2*.5;
        c.beginPath();c.moveTo(x+dir*6,y-19);c.lineTo(x,y);c.stroke();
        if(i%3===0){const k=mod(motion*2+i*.147,1);c.globalAlpha=fade*(1-k)*.7;c.strokeStyle=p.ice;c.beginPath();c.ellipse(x0,gy,3+k*13,1+k*3,0,0,7);c.stroke();}
      }
      c.globalAlpha=fade*.65;c.strokeStyle=p.rain;c.lineWidth=2;c.beginPath();
      for(let x=0;x<=W;x+=12){const y=ground(x)-8+Math.sin(x*.035+motion*5)*2;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
    }else if(e.type==='gale'){
      // Gust fronts and tumbling debris show the SAME direction as gameplay push.
      for(let i=0;i<28;i++){
        const phase=mod(motion*(.65+i%3*.12)+i*.137,1),x=dir>0?-200+phase*(W+400):W+200-phase*(W+400);
        const y=100+(i*61)%(H*.6),len=90+i%4*45;
        c.globalAlpha=fade*.6*Math.sin(phase*Math.PI);c.strokeStyle=i%3?p.ink:p.ice;c.lineWidth=i%3?1.8:3;
        c.beginPath();for(let j=0;j<=12;j++){const xx=x-dir*j*len/12,yy=y+Math.sin(j*.7+motion*6+i)*9;j?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();
      }
      for(let i=0;i<45;i++){
        const phase=mod(motion*.8+i*.618,1),x=dir>0?phase*(W+100)-50:W+50-phase*(W+100);
        const y=ground(Math.max(0,Math.min(W,x)))-18-i%6*48+Math.sin(motion*8+i)*18;
        c.save();c.translate(x,y);c.rotate(motion*dir*7+i);c.globalAlpha=fade*.8;c.fillStyle=i%3?p.leaf:p.dust;c.strokeStyle=p.ink;c.lineWidth=1;
        c.beginPath();c.ellipse(0,0,i%3?7:3,i%3?3:2,0,0,7);c.fill();c.stroke();c.restore();
      }
    }
    c.restore();
  }
  globalThis.ANTHOLDWeather={draw};
})();