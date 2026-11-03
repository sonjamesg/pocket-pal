// ===== care.js — real-time care tick, growth, fx =====
// ---- real-time care ----
function timeTick(){const n=now();if(!S.last){S.last=n;return}const hrs=Math.min(n-S.last,3*DAY)/HOUR;S.last=n;if(hrs<=0)return;
  if(S.sleep&&(new Date().getHours()>=7&&new Date().getHours()<20)&&hrs>8)S.sleep=false;
  const sen=S.stage==='senior'?1.15:1;S.hunger=clamp(S.hunger-RATE.hunger*hrs*(S.sleep?.4:1)*sen);
  let hd=RATE.happy*(S.sleep?.3:1);if(S.hunger<30)hd+=3;if(S.coat>=TUNE.matAt)hd+=6;if(S.plaque>=TUNE.plaqueBad)hd+=3;
  if(S.species==='sheep'){const fed=S.hunger>=WOOL.need&&S.happy>=WOOL.need;S.wool=Math.min(100,(S.wool||0)+woolRate(fed)*hrs*(S.sleep?.5:1));S.hunger=clamp(S.hunger-(WOOL.hunger-RATE.hunger)*hrs*(S.sleep?.4:1));hd+=WOOL.happy-RATE.happy}
  S.happy=clamp(S.happy-hd*hrs);if(S.species==='dog')S.coat=Math.min(100,S.coat+RATE.coat*hrs*(BREEDS[S.breed].curly?1.3:1));else S.coat=5;if(S.species==='dog'||S.species==='cat')S.plaque=Math.min(100,S.plaque+RATE.plaque*hrs);else S.plaque=0}
setInterval(()=>{if(S.stage&&!['title','list','species','breed','egg','map'].includes(S.scene)){timeTick();checkGrow();if(ui.anim%10===0)save(true)}},1000);
setInterval(()=>{if(S.stage)save(true)},30000);
function addXP(n){const d=new Date().toDateString();if(S.xpDay!==d){S.xpDay=d;S.xpToday=0}const a=Math.min(n,TUNE.xpPerDay-(S.xpToday||0));if(a>0){S.xp+=a;S.xpToday+=a}}
function growProg(){const r=GROW[S.stage];if(!r)return 1;return Math.min(1,(now()-S.stageStart)/DAY/r.days,S.xp/r.xp)}
function daysLeft(){const r=GROW[S.stage];if(!r)return 0;const a=r.days-(now()-S.stageStart)/DAY,b=(r.xp-S.xp)/TUNE.xpPerDay;return Math.max(0,Math.ceil(Math.max(a,b)))}
function checkGrow(){const r=GROW[S.stage];if(!r)return;
  if((now()-S.stageStart)/DAY>=r.days&&S.xp>=r.xp&&S.hunger>30&&S.happy>40){S.stage=STAGES[STAGES.indexOf(S.stage)+1];S.xp=0;S.stageStart=now();
    say(S.name+' is now '+(S.stage==='adult'?'an ':'a ')+stageName(S.stage,S.species)+'!',200);sparkle(30);save()}}
function sparkle(n,x=W/2,y=110){for(let i=0;i<n;i++)ui.fx.push({x:x+Math.random()*60-30,y,vx:Math.random()*3-1.5,vy:-Math.random()*3-.5,t:50,ch:'star'})}
function hearts(n,x=ui.dx,y=120){for(let j=0;j<n;j++)ui.fx.push({x:x-20+j*10,y,vx:Math.random()-.5,vy:-.8,t:50,ch:'heart'})}
function setPose(p,t){ui.pose=p;ui.poseT=t}
