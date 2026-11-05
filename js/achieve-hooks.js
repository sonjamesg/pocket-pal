// ===== achieve-hooks.js — v120 split from achieve.js: gameplay counters feeding the achievements board =====
// ---- event hooks ----
{const _j=owJump;owJump=function(){const o=ui.ow,b=o&&o.jt;_j();if(o&&!b&&o.jt>0)achInc('jump')}}
{const _s=say;say=function(m,t){_s(m,t);if(typeof TREE_LINES!=='undefined'&&typeof treeStreak!=='undefined'&&(TREE_LINES.includes(m)||/apple tree/.test(m))){const A=achD();A.c.treeMax=Math.max(A.c.treeMax||0,treeStreak);achCheck()}}}
{const _f=feed;feed=function(f){const h=S.hunger;_f(f);if(S.hunger!==h)achInc('feed')}}
{const _o=openAct;openAct=function(i){if(ACTIONS[i]==='BRUSH')achInc('brush');return _o(i)}}
{const _e=endGame;endGame=function(){const m=ui.mg;if(m&&m.id==='fetch'&&_sp(S)==='dog'){const A=achD();A.c.fetchBest=Math.max(A.c.fetchBest||0,m.score)}return _e()}}
{const _t=toggleFollow;toggleFollow=function(){_t();if(DB.follow)achInc('follow')}}
{const _oi=owInput;owInput=function(k){const n=CUR==='ranch'&&typeof ragL==='function'?ragL().length:0;const r=_oi(k);if(n&&ragL().length<n)achInc('rag');return r}}
{const _ie=intEnter;intEnter=function(id,fx,fy){const r=_ie(id,fx,fy);if(id==='cowfarm')achInc('moo');if(FARM_CYC[id]){const c=woolCycles();setTimeout(()=>{const F=typeof FARM_SELL==='object'&&FARM_SELL[id],nm=F?F[1]:null,label=FARM_NM[id]||id;
  const body=farmOpen(id)?(label+' is OPEN in your achievements! Shop coming soon.'):(label+' opens after '+FARM_CYC[id]+' WOOL CYCLES — you have '+c+'. Shear sheep (1 cycle = 6h fleece regrow) and check the 🏆 board!');
  say(nm?('Farmer '+nm+': "'+body+'"'):body,300)},50)}return r}}
{const _ou=owUpdate;let ls=-1,lm='';owUpdate=function(){_ou();const o=ui.ow;if(!o)return;if(lm!==CUR){if(CUR==='outer'&&!achC('woods'))achInc('woods');lm=CUR}
  if(ls>=0&&o.step>ls&&typeof nightNow==='function'&&nightNow()&&S.scene==='map')achInc('night',o.step-ls);ls=o.step;
  if(CUR==='ranch'&&DB.follow&&DB.pets[DB.follow]&&_sp(DB.pets[DB.follow])==='dog'&&!achC('herd')&&o.x>=46&&o.x<=58&&o.y>=46&&o.y<=54&&(typeof fieldSheep!=='function'||fieldSheep().length))achInc('herd')}}
// v117 extra counters: salon visits, trick performs, follow-walk steps, chore day streaks
{let ps='';setInterval(()=>{try{if(!S||!DB||!DB.avatar)return;const sc=S.scene;if(sc!==ps){if(sc==='groom')achInc('salon');ps=sc}
  const A=achD(),j=DB.jobsDone||0;if(j>(A.c.lastJobs||0)){A.c.lastJobs=j;const d=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);if(A.c.jobDay!==d){A.c.streak=A.c.jobDay===d-1?(A.c.streak||0)+1:1;A.c.jobDay=d;A.c.streakMax=Math.max(A.c.streakMax||0,A.c.streak);saveDB()}}}catch(e){}},700)}
{const _p=perform;perform=function(tr){_p(tr);achInc('perform')}}
{const _ou=owUpdate;let ls=-1;owUpdate=function(){_ou();const o=ui.ow;if(!o)return;if(ls>=0&&o.step>ls&&DB.follow&&DB.pets[DB.follow]&&S.scene==='map')achInc('followSteps',o.step-ls);ls=o.step}}
