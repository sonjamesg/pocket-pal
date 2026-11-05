// v116: "Are you sure?" before any animal purchase (Pet Shop, Hattie/Percy/Grace farms, Rosie's cows, sheep)
{const _pn=pickName;pickName=function(L){
  let n=null,p=0;
  if(ui.buy&&typeof BREEDS!=='undefined'){n=(BREEDS[ui.buy]||{}).n||'PUP';p=priceOf(ui.buy)}
  else if(ui.nameType){n=ui.nameType.n;p=ui.nameType.p}
  else if(ui.nameSheep===2){const t=SHEEP_TYPES.find(x=>x.id===ui.sheepType)||{n:'SHEEP',p:SPECIES_PRICE.sheep};n=t.n||'SHEEP';p=t.p}
  if(!n||ui._buyOk)return _pn(L);
  const keep={buy:ui.buy,nameType:ui.nameType,nameSheep:ui.nameSheep,sheepType:ui.sheepType};
  askConfirm('Buy '+n+' for '+p+' coins?',()=>{Object.assign(ui,keep);ui._buyOk=1;try{_pn(L)}finally{ui._buyOk=0}});
  // cancelling (B / NO) drops the pending purchase so nothing is bought by mistake
  ui.buy=null;ui.nameType=null;if(ui.nameSheep===2)ui.nameSheep=0;
}}
