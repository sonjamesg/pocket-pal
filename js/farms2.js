// ===== farms2.js — v68 specialty farms out on the far east roads (stubs: walk in, farmer not open yet). MOO MEADOW stays the working cow shop. =====
INT.chickfarm={name:'CLUCKY HOLLOW',floor:'straw',rows:INT.coop.rows};
INT.pigfarm={name:'MUDDY TROTTERS',floor:'mud',rows:INT.sty.rows};
INT.horsefarm={name:'GALLOP RIDGE',floor:'straw',rows:INT.stable.rows};
const FARM_SOON={chickfarm:'CLUCKY HOLLOW chicken farm — "Cluck cluck! We\'re not open yet. Come back soon for CHICKENS!"',
  pigfarm:'MUDDY TROTTERS pig farm — "Oink! The piggies are still having their mud bath. Opening soon!"',
  horsefarm:'GALLOP RIDGE horse farm — "Whoa there! The horses are still being brushed. Opening soon!"'};
Object.assign(BARN_MSG,{chickfarm:'CLUCKY HOLLOW chicken farm — coming soon!',pigfarm:'MUDDY TROTTERS pig farm — coming soon!',horsefarm:'GALLOP RIDGE horse farm — coming soon!',
  cowfarm:'MOO MEADOW FARM — Farmer ROSIE sells cows and a BULL! Walk in to say hi.'});
{const _ie=intEnter;intEnter=function(id,fx,fy){const r=_ie(id,fx,fy);if(FARM_SOON[id])say(FARM_SOON[id],260);return r}}
// signposts: east-road signs point to the farms; ranch signs point to the PET SHOP
function farmSign(x,y){if(CUR!=='ranch')return null;if(x>=100)return 'N: CLUCKY HOLLOW (chickens)  S: MUDDY TROTTERS (pigs)  E: MOO MEADOW (cows), GALLOP RIDGE (horses)';
  return 'N: Homes  E: Barns + road to the FARMS  S: Gate to the WILD WOODS — the PET SHOP is just past the gate!'}
