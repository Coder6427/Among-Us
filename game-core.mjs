export function buildMaps(base){
 const copy=value=>JSON.parse(JSON.stringify(value));
 const scale=1.3,skeld=copy(base);
 skeld.id='skeld';skeld.name='The Skeld';skeld.subtitle='Expanded deep-space cruiser';skeld.theme='cruiser';
 skeld.world={w:Math.round(base.world.w*scale),h:Math.round(base.world.h*scale)};
 for(const item of [...skeld.rooms,...skeld.halls,...skeld.tasks,...skeld.vents,...Object.values(skeld.systems).flatMap(s=>s.terminals)])for(const key of ['x','y','w','h'])if(key in item)item[key]=Math.round(item[key]*scale);
 const aurora=copy(base);aurora.id='aurora';aurora.name='Aurora Station';aurora.subtitle='A spacious orbital research outpost';aurora.theme='aurora';aurora.world={w:2650,h:1650};
 const layout={
  upper:['Engine Bay',220,170,360,300,'#3e545f'],
  cafeteria:['Atrium',1000,450,520,360,'#3c5c62'],
  weapons:['Observatory',1700,70,390,270,'#3c5069'],
  security:['Security',180,600,330,260,'#3c555b'],
  medbay:['MedBay',650,180,330,270,'#3c6261'],
  admin:['Admin',1650,420,360,280,'#53546b'],
  o2:['O₂ Garden',1120,60,390,290,'#426754'],
  navigation:['Navigation',2140,780,330,300,'#3c596d'],
  reactor:['Reactor',130,980,400,310,'#4f4f72'],
  electrical:['Electrical',650,1030,360,300,'#625f45'],
  storage:['Cargo Deck',1160,1120,500,320,'#4e6057'],
  shields:['Shield Array',1760,1210,370,290,'#3e6267']
 };
 aurora.rooms=base.rooms.map(r=>{const [name,x,y,w,h,tint]=layout[r.id];return {id:r.id,name,x,y,w,h,tint};});
 aurora.halls=[
  {x:440,y:680,w:1800,h:110},{x:420,y:280,w:1420,h:100},
  {x:1210,y:330,w:110,h:150},{x:440,y:350,w:105,h:720},
  {x:440,y:1230,w:1380,h:110},{x:1240,y:790,w:110,h:450},
  {x:1850,y:330,w:110,h:920},{x:1930,y:900,w:250,h:100}
 ];
 const relocate=item=>{const before=base.rooms.find(r=>r.id===item.room),after=aurora.rooms.find(r=>r.id===item.room);return {...item,x:Math.round(after.x+(item.x-before.x)/before.w*after.w),y:Math.round(after.y+(item.y-before.y)/before.h*after.h)};};
 aurora.tasks=base.tasks.map(relocate);aurora.vents=base.vents.map(relocate);
 for(const system of Object.values(aurora.systems))system.terminals=system.terminals.map(relocate);
 aurora.systems.reactor.duration=80;aurora.systems.reactor.description='Start an 80-second meltdown.';aurora.systems.oxygen.duration=90;aurora.systems.oxygen.description='90 seconds. Two keypads to reset.';
 for(const map of [skeld,aurora]){
  const cafe=map.rooms.find(r=>r.id==='cafeteria');
  map.spawn={x:Math.round(cafe.x+cafe.w*.5),y:Math.round(cafe.y+cafe.h*.88)};
  map.emergency={x:Math.round(cafe.x+cafe.w*.5),y:Math.round(cafe.y+cafe.h*118/245)};
  const security=map.rooms.find(r=>r.id==='security');map.cameraConsole={x:Math.round(security.x+security.w*.48),y:Math.round(security.y+security.h*.25),room:'security'};
  map.cameras=(map.id==='skeld'?[['West Hall',481,637],['East Passage',1640,637],['Cargo Junction',1008,1053]]:[['West Spine',480,700],['East Junction',1905,735],['Cargo Crossing',1295,1260]]).map(([name,x,y],id)=>({id,name,x,y,width:480,height:320}));
 }
 return {skeld,aurora};
}

export const HATS=[{id:'none',name:'None'},{id:'sprout',name:'Sprout'},{id:'cap',name:'Crew cap'},{id:'beanie',name:'Beanie'},{id:'crown',name:'Crown'},{id:'party',name:'Party hat'},{id:'chef',name:'Chef'},{id:'antenna',name:'Antenna'}];
export const ACCESSORIES=[{id:'none',name:'None'},{id:'scarf',name:'Scarf'},{id:'tie',name:'Crew tie'},{id:'hockey',name:'Jason mask'},{id:'dum',name:'DUM note'}];
export function outfitSVG(hat='none',accessory='none'){
 const hats={
  sprout:'<path d="M30 8V-6" stroke="#4e9b6b" stroke-width="3"/><path d="M30-4Q13-16 14-4Q19 3 30-4ZM30-4Q45-17 46-7Q43 0 30-4Z" fill="#a0d278" stroke="#325847" stroke-width="1.5"/>',
  cap:'<path d="M16 9V5Q18-6 31-6Q43-6 45 8Z" fill="#5e8fba" stroke="#162b42" stroke-width="2.5"/><path d="M15 8h37v6H22Z" fill="#8cb7cb" stroke="#162b42" stroke-width="2.5"/>',
  beanie:'<path d="M17 7Q18-9 31-9Q45-8 46 7Z" fill="#bd738a" stroke="#35283c" stroke-width="2.5"/><rect x="14" y="5" width="34" height="8" rx="3" fill="#e9a7ae" stroke="#35283c" stroke-width="2.5"/><circle cx="31" cy="-10" r="5" fill="#f1c5bc" stroke="#583c50" stroke-width="2"/>',
  crown:'<path d="m15-5 9 7 7-13 8 13 9-7-4 17H19Z" fill="#edc86d" stroke="#755134" stroke-width="2"/><path d="M20 8h22" stroke="#fff0b5" stroke-width="2"/><circle cx="31" cy="4" r="2" fill="#d36b72"/>',
  party:'<path d="M17 10 31-15 46 10Z" fill="#9b83c5" stroke="#3a3555" stroke-width="2"/><path d="m23 0 17 4m-21 2 24 3" stroke="#e4b28e" stroke-width="3"/><circle cx="31" cy="-15" r="3" fill="#ead6a1"/>',
  chef:'<path d="M19 7V-1Q10-7 17-12Q24-18 30-11Q38-19 45-12Q52-4 43 0V8Z" fill="#e8ebd9" stroke="#728d92" stroke-width="2"/><rect x="18" y="4" width="26" height="9" rx="3" fill="#f4f0dc" stroke="#728d92" stroke-width="2"/>',
  antenna:'<path d="M31 5V-4l4-5" fill="none" stroke="#233b53" stroke-width="5" stroke-linejoin="round"/><path d="M31 5V-4l4-5" fill="none" stroke="#b4cbd0" stroke-width="2.5"/><circle cx="35" cy="-12" r="3.7" fill="#e8ae71" stroke="#3f4c63" stroke-width="1.8"/><circle cx="34" cy="-13" r="1.1" fill="#ffe4a2"/><path d="M21 10q1-6 10-6t10 6Z" fill="#628197" stroke="#233b53" stroke-width="2"/><path d="M27 8h8" stroke="#a2bdc7" stroke-width="1.5"/>'
 };
 const accessories={
  scarf:'<path d="M16 34q14 7 30-1l-1 8q-17 4-29-1Z" fill="#d47679" stroke="#633f50" stroke-width="2"/><path d="m22 39 2 14 7-2-2-11" fill="#e29387" stroke="#633f50" stroke-width="2"/>',
  tie:'<path d="m21 34 10 2-5 4-5-3Zm10 2 12-2-2 3-5 3Z" fill="#e4ece3" stroke="#345067" stroke-width="1.3"/><path d="m29 36 4 0 1 2-3 2-3-2Zm2 3 3 3-3 2-3-2Z" fill="#be5767" stroke="#542f46" stroke-width="1.3"/><path d="m31 40 1 2" stroke="#ef9b99" stroke-width="1.2"/>',
  hockey:'<path d="M16 19h13m-12 9h12" stroke="#263644" stroke-width="4"/><path d="M27 13q13-6 23 2l2 13q-2 9-14 11-12-4-13-12Z" fill="#e4dfbf" stroke="#354656" stroke-width="2"/><path d="m29 21 7-2 1 6-8 1Zm13-2 7 2-1 5-7-1Z" fill="#23323e"/><path d="m36 15 3 3 3-3m-13 14 4 2m12 0 4-2" fill="none" stroke="#b95b60" stroke-width="1.8"/><g fill="#607071"><circle cx="36" cy="30" r="1"/><circle cx="41" cy="30" r="1"/><circle cx="38.5" cy="34" r="1"/></g>',
  dum:'<g transform="rotate(8 38 24)"><path d="M27 15h22v19H27Z" fill="#000" opacity=".18" transform="translate(1 2)"/><path d="M27 15h22v15l-4 4H27Z" fill="#f4dfa1" stroke="#8a784f" stroke-width="1.1"/><path d="M45 30h4l-4 4Z" fill="#c6ad72"/><path d="M33 13h10v5H33Z" fill="#d8e5db" opacity=".72"/><text x="38" y="27" text-anchor="middle" fill="#37404c" font-family="monospace" font-size="8" font-weight="bold">DUM</text></g>'
 };
 return (hats[hat]||'')+(accessories[accessory]||'');
}
export function drawOutfit(c,hat='none',accessory='none',bob=0){
 c.save();c.translate(-29,-40+bob);c.lineJoin='round';c.lineCap='round';
 const path=(points,fill,stroke='#23384e',width=2)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(fill){c.closePath();c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}};
 const rect=(x,y,w,h,r,fill,stroke='#23384e')=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();c.strokeStyle=stroke;c.lineWidth=2;c.stroke();};
 const circle=(x,y,r,fill)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=fill;c.fill();c.strokeStyle='#385367';c.lineWidth=1.5;c.stroke();};
 if(hat==='sprout'){path([[30,8],[30,-6]],null,'#4e9b6b',3);path([[30,-4],[14,-12],[14,-4],[22,0]],'#a0d278','#325847');path([[30,-4],[44,-13],[46,-7],[39,-1]],'#a0d278','#325847');}
 if(hat==='cap'){rect(16,-5,29,16,10,'#5e8fba');path([[15,8],[52,8],[52,14],[22,14]],'#8cb7cb');}
 if(hat==='beanie'){rect(17,-8,29,19,12,'#bd738a','#35283c');rect(14,5,34,8,3,'#e9a7ae','#35283c');circle(31,-10,5,'#f1c5bc');}
 if(hat==='crown'){path([[15,-5],[24,2],[31,-11],[39,2],[48,-5],[44,12],[19,12]],'#edc86d','#755134');circle(31,4,2,'#d36b72');}
 if(hat==='party'){path([[17,10],[31,-15],[46,10]],'#9b83c5','#3a3555');path([[23,0],[40,4]],null,'#e4b28e',3);circle(31,-15,3,'#ead6a1');}
 if(hat==='chef'){circle(20,-7,9,'#e8ebd9');circle(31,-11,9,'#e8ebd9');circle(42,-7,9,'#e8ebd9');rect(18,-2,26,15,3,'#f4f0dc','#728d92');}
 if(hat==='antenna'){path([[31,5],[31,-4],[35,-9]],null,'#233b53',5);path([[31,5],[31,-4],[35,-9]],null,'#b4cbd0',2.5);circle(35,-12,3.7,'#e8ae71');circle(34,-13,1.1,'#ffe4a2');c.beginPath();c.moveTo(21,10);c.quadraticCurveTo(22,4,31,4);c.quadraticCurveTo(40,4,41,10);c.closePath();c.fillStyle='#628197';c.fill();c.strokeStyle='#233b53';c.lineWidth=2;c.stroke();path([[27,8],[35,8]],null,'#a2bdc7',1.5);}
 if(accessory==='scarf'){path([[16,34],[30,38],[46,33],[45,41],[30,43],[16,40]],'#d47679','#633f50');path([[22,39],[24,53],[31,51],[29,40]],'#e29387','#633f50');}
 if(accessory==='tie'){path([[21,34],[31,36],[26,40],[21,37]],'#e4ece3','#345067',1.3);path([[31,36],[43,34],[41,37],[36,40]],'#e4ece3','#345067',1.3);path([[29,36],[33,36],[34,38],[31,40],[28,38]],'#be5767','#542f46',1.3);path([[31,39],[34,42],[31,44],[28,42]],'#be5767','#542f46',1.3);path([[31,40],[32,42]],null,'#ef9b99',1.2);}
 if(accessory==='hockey'){path([[16,19],[29,19]],null,'#263644',4);path([[17,28],[29,28]],null,'#263644',4);c.beginPath();c.moveTo(27,13);c.quadraticCurveTo(40,7,50,15);c.lineTo(52,28);c.quadraticCurveTo(50,37,38,39);c.quadraticCurveTo(26,35,25,27);c.closePath();c.fillStyle='#e4dfbf';c.fill();c.strokeStyle='#354656';c.lineWidth=2;c.stroke();path([[29,21],[36,19],[37,25],[29,26]],'#23323e',null);path([[42,19],[49,21],[48,26],[41,25]],'#23323e',null);path([[36,15],[39,18],[42,15]],null,'#b95b60',1.8);path([[29,29],[33,31]],null,'#b95b60',1.8);path([[45,31],[49,29]],null,'#b95b60',1.8);for(const [x,y] of [[36,30],[41,30],[38.5,34]]){c.beginPath();c.arc(x,y,1,0,Math.PI*2);c.fillStyle='#607071';c.fill();}}
 if(accessory==='dum'){c.save();c.translate(38,24);c.rotate(8*Math.PI/180);c.translate(-38,-24);path([[28,17],[50,17],[50,35],[28,35]],'#0002',null);path([[27,15],[49,15],[49,30],[45,34],[27,34]],'#f4dfa1','#8a784f',1.1);path([[45,30],[49,30],[45,34]],'#c6ad72',null);c.fillStyle='#d8e5dbb8';c.fillRect(33,13,10,5);c.fillStyle='#37404c';c.font='bold 8px monospace';c.textAlign='center';c.textBaseline='alphabetic';c.fillText('DUM',38,27);c.restore();}
 c.restore();
}

export const PETS=[{id:'none',name:'No pet'},{id:'mini',name:'Mini crewmate'},{id:'stickman',name:'Stickman'},{id:'ufo',name:'UFO'},{id:'cyclops',name:'Blue cyclops dog'}];

// One set of shapes keeps the wardrobe and the moving companions identical.
function petArt(type,color,step=0){
 const shapes=[],add=(kind,values)=>shapes.push({kind,...values});
 const path=(points,fill,stroke='#132339',width=1.8)=>add('path',{points,fill,stroke,width});
 const ellipse=(x,y,rx,ry,fill,stroke=null,width=1.8)=>add('ellipse',{x,y,rx,ry,fill,stroke,width});
 const rect=(x,y,w,h,r,fill,stroke='#132339',width=1.8)=>add('rect',{x,y,w,h,r,fill,stroke,width});
 const leg=Math.sin(step)*2;
 if(type==='mini'){
  rect(-16,-19,8,14,3,color);path([['M',-10,-5],['L',-10,-18],['Q',-10,-29,0,-29],['Q',10,-29,10,-18],['L',10,-3],['Q',10,0,5,0],['L',2,0],['L',2,-7],['L',-2,-7],['L',-2,0],['L',-6,0],['Q',-10,0,-10,-5],['Z']],color);
  rect(-2,-23,16,10,4,'#9fc9de');path([['M',1,-20],['L',9,-20]],null,'#effbff',2);ellipse(-6,-1+leg,4,2,color,'#132339');ellipse(6,-1-leg,4,2,color,'#132339');
 }else if(type==='stickman'){
  path([['M',0,-20],['L',0,-10],['M',0,-16],['L',-8,-11-leg],['M',0,-16],['L',8,-11+leg],['M',0,-10],['L',-6-leg,-1],['M',0,-10],['L',6+leg,-1]],null,'#b9e6dd',2.5);
  ellipse(0,-25,5.5,5.5,'#e0f2d9','#294353');ellipse(2,-26,1,1,'#233c4c');path([['M',1,-22],['L',3,-22]],null,'#44677a',1);
 }else if(type==='ufo'){
  path([['M',-9,-16],['Q',-8,-30,2,-29],['Q',11,-29,11,-16],['Z']],'#a0d7df','#23445b');ellipse(1,-21,4,5,'#a7cf89','#3d6b6a');ellipse(2,-22,1.3,2,'#183b48');
  ellipse(0,-14,19,7,'#9e94cc','#25334e');path([['M',-18,-14],['Q',0,-6,18,-14]],null,'#d4d5e9',2);for(const x of [-11,0,11])ellipse(x,-12,2,1.5,'#e8cb7b');
  path([['M',-5,-6],['L',-2,-2],['M',1,-6],['L',4,-2]],null,'#88cbbb',1.5);
 }else if(type==='cyclops'){
  path([['M',-11,-11],['Q',-23,-14,-18,-23]],null,'#509edf',4);
  ellipse(-2,-10,13,8,'#4d9cdb','#193b60');rect(-11,-8,5,8+leg,2,'#529fdd','#193b60');rect(5,-8,5,8-leg,2,'#529fdd','#193b60');
  path([['M',-1,-17],['L',-7,-29],['Q',-14,-25,-9,-16],['Z']],'#3978bb','#193b60');path([['M',11,-18],['L',14,-28],['Q',20,-24,15,-14],['Z']],'#3978bb','#193b60');
  ellipse(5,-18,12,11,'#67b5ed','#193b60');ellipse(6,-20,6,6,'#f3f6e1','#264e76',1.4);ellipse(8,-20,2.6,3.6,'#233a61');ellipse(9,-21,1,1,'#fff');ellipse(11,-11,2,1.5,'#183858');
  path([['M',5,-8],['Q',8,-6,11,-8]],null,'#234768',1.2);
 }
 return shapes;
}
export function petSVG(type,size=44,color='#ed687e'){
 if(!PETS.some(p=>p.id===type)||type==='none')return `<svg width="${size}" height="${size}" viewBox="-24 -37 48 48" aria-hidden="true"><circle cx="0" cy="-13" r="12" fill="none" stroke="#6d8898" stroke-width="2"/><path d="m-8-5 16-16" stroke="#6d8898" stroke-width="2"/></svg>`;
 const shapes=petArt(type,color).map(s=>s.kind==='path'?`<path d="${s.points.map(p=>p.join(' ')).join(' ')}"`:s.kind==='ellipse'?`<ellipse cx="${s.x}" cy="${s.y}" rx="${s.rx}" ry="${s.ry}"`:`<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}"`);
 const art=petArt(type,color).map((s,i)=>`${shapes[i]} fill="${s.fill||'none'}" stroke="${s.stroke||'none'}" stroke-width="${s.width}" stroke-linejoin="round" stroke-linecap="round"/>`).join('');
 return `<svg width="${size}" height="${size}" viewBox="-24 -37 48 48" aria-hidden="true"><ellipse cx="0" cy="3" rx="16" ry="3" fill="#000" opacity=".18"/>${art}</svg>`;
}
export function drawPet(c,pet,time=0,reducedMotion=false){
 if(pet.type==='none')return;
 const fallen=pet.alive===false,progress=Math.min(1,pet.deathProgress||0),step=reducedMotion?0:pet.steps||0;
 c.save();c.translate(pet.x,pet.y+12);c.scale(pet.dir||1,1);
 c.beginPath();c.ellipse(0,3,15,3,0,0,Math.PI*2);c.fillStyle='#0003';c.fill();
 if(fallen){c.globalAlpha*=1-progress;c.rotate(1.35*Math.min(1,progress*4));}
 else if(!reducedMotion)c.translate(0,pet.type==='ufo'?Math.sin(time*3+pet.ownerId)*2:Math.sin(step)*.9);
 for(const s of petArt(pet.type,pet.color,step)){
  c.beginPath();if(s.kind==='ellipse')c.ellipse(s.x,s.y,s.rx,s.ry,0,0,Math.PI*2);
  else if(s.kind==='rect')c.roundRect(s.x,s.y,s.w,s.h,s.r);
  else for(const [command,...v] of s.points){if(command==='M')c.moveTo(...v);else if(command==='L')c.lineTo(...v);else if(command==='Q')c.quadraticCurveTo(...v);else c.closePath();}
  c.lineJoin='round';c.lineCap='round';if(s.fill){c.fillStyle=s.fill;c.fill();}if(s.stroke){c.strokeStyle=s.stroke;c.lineWidth=s.width;c.stroke();}
 }
 if(fallen){c.strokeStyle='#d9dfd7';c.lineWidth=2;c.beginPath();c.moveTo(-3,-25);c.lineTo(3,-19);c.moveTo(3,-25);c.lineTo(-3,-19);c.stroke();}
 c.restore();
}

export let WORLD = {w:1550,h:980};
export const COLORS = ['#e95c70','#55d4cf','#f2b45c','#9375db','#73bb80','#ece5d4','#5b83df','#eb8db6','#a47762','#bfdc70','#8e425b','#ece09b','#e9907a','#a2acbb','#515c70'];
export const NAMES = ['Nova','Mango','Lilac','Moss','Pearl','Cobalt','Rose','Echo','Atlas','Pip','Comet','Fern','Juno','Orbit','Biscuit','Luna'];
export const ROLE_INFO={
 crew:{name:'Crewmate',color:'#78ddc1',description:'Complete your tasks. Watch your crew. Find the impostor.'},
 impostor:{name:'Impostor',color:'#f37988',description:'Blend in, sabotage the ship, and leave no witnesses.'},
 scientist:{name:'Scientist',color:'#81c5f4',description:'You are on the crew. Use B to check live vitals. Tasks recharge your tablet.'},
 engineer:{name:'Engineer',color:'#edbc77',description:'You are on the crew. Use V near a vent to travel. Vents recharge every 25 seconds.'}
};
export function shuffled(items,random=Math.random){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
export let ROOMS = [
 {id:'upper',name:'Upper Engine',x:110,y:130,w:240,h:215,tint:'#394254'},
 {id:'cafeteria',name:'Cafeteria',x:535,y:100,w:390,h:245,tint:'#334758'},
 {id:'weapons',name:'Weapons',x:1070,y:130,w:230,h:200,tint:'#465044'},
 {id:'security',name:'Security',x:105,y:400,w:220,h:160,tint:'#3a454b'},
 {id:'medbay',name:'MedBay',x:385,y:405,w:235,h:180,tint:'#34514e'},
 {id:'admin',name:'Admin',x:750,y:415,w:220,h:175,tint:'#52434b'},
 {id:'o2',name:'O₂',x:1050,y:410,w:200,h:170,tint:'#3d5146'},
 {id:'navigation',name:'Navigation',x:1320,y:390,w:170,h:220,tint:'#3a4a5d'},
 {id:'reactor',name:'Reactor',x:65,y:620,w:225,h:240,tint:'#4a405b'},
 {id:'electrical',name:'Electrical',x:395,y:680,w:220,h:200,tint:'#52503e'},
 {id:'storage',name:'Storage',x:690,y:680,w:280,h:230,tint:'#4b4c43'},
 {id:'shields',name:'Shields',x:1110,y:730,w:230,h:180,tint:'#3a4f52'}
];
export let HALLS = [
 {x:290,y:235,w:260,h:70},{x:910,y:235,w:180,h:70},
 {x:680,y:330,w:70,h:380},{x:310,y:455,w:390,h:70},
 {x:735,y:455,w:595,h:70},{x:1160,y:300,w:70,h:470},
 {x:265,y:740,w:450,h:70},{x:950,y:790,w:180,h:65},{x:195,y:330,w:70,h:410}
];
export let TASKS = [
 {id:'wires',name:'Fix wiring',room:'electrical',x:439,y:726,type:'wires'},
 {id:'card',name:'Swipe card',room:'admin',x:909,y:466,type:'card'},
 {id:'asteroids',name:'Clear asteroids',room:'weapons',x:1229,y:200,type:'asteroids'},
 {id:'shields',name:'Prime shields',room:'shields',x:1268,y:801,type:'power'},
 {id:'scan',name:'Submit scan',room:'medbay',x:468,y:480,type:'scan'},
 {id:'garbage',name:'Empty garbage chute',room:'storage',x:925,y:863,type:'garbage'},
 {id:'oil',name:'Change engine oil',room:'upper',x:304,y:301,type:'oil'},
 {id:'wifi',name:'Transfer wireless data',room:'navigation',x:1450,y:461,type:'wifi'},
 {id:'course',name:'Chart course',room:'navigation',x:1382,y:534,type:'course'},
 {id:'filter',name:'Clean O₂ filter',room:'o2',x:1199,y:529,type:'filter'},
 {id:'distributor',name:'Calibrate distributor',room:'electrical',x:575,y:781,type:'distributor'},
 {id:'memory',name:'Start reactor',room:'reactor',x:175,y:808,type:'memory'}
];
export function assignTasks(random=Math.random,count=6,taskPool=TASKS){
 const mandatory=shuffled(taskPool.filter(t=>['garbage','oil','wifi'].includes(t.type)),random)[0];
 const pool=shuffled(taskPool.filter(t=>t.id!==mandatory.id),random),picked=[mandatory],rooms=new Set([mandatory.room]);
 for(const t of pool)if(picked.length<Math.min(count,5)&&!rooms.has(t.room)){picked.push(t);rooms.add(t.room);}
 for(const t of pool)if(picked.length<count&&!picked.includes(t))picked.push(t);
 return shuffled(picked,random).map(t=>({...t,done:false,state:{}}));
}
export let VENTS = [{x:167,y:299,room:'upper'},{x:148,y:506,room:'security'},{x:549,y:833,room:'electrical'},{x:1438,y:555,room:'navigation'}];
export let SYSTEMS = {
 lights:{name:'Lights',action:'Fix lights',icon:'ϟ',room:'electrical',description:'Plunge the crew into darkness.',terminals:[{id:'breaker',x:460,y:723,room:'electrical'}]},
 reactor:{name:'Reactor',action:'Stabilize reactor',icon:'☢',room:'reactor',description:'Start a 65-second meltdown.',duration:65,terminals:[{id:'reactor-a',x:112,y:680,room:'reactor'},{id:'reactor-b',x:241,y:773,room:'reactor'}]},
 oxygen:{name:'Oxygen',action:'Restore oxygen',icon:'O₂',room:'o2',description:'Drain oxygen. Two keypads to reset.',duration:70,terminals:[{id:'oxygen-a',x:1083,y:533,room:'o2'},{id:'oxygen-b',x:790,y:550,room:'admin'}]},
 comms:{name:'Communications',action:'Restore comms',icon:'⌁',room:'navigation',description:'Scramble the task list and task map.',terminals:[{id:'radio',x:1360,y:427,room:'navigation'}]}
};
export const BASE_MAP={world:WORLD,rooms:ROOMS,halls:HALLS,tasks:TASKS,vents:VENTS,systems:SYSTEMS};
export const MAPS=buildMaps(BASE_MAP);
({world:WORLD,rooms:ROOMS,halls:HALLS,tasks:TASKS,vents:VENTS,systems:SYSTEMS}=MAPS.skeld);
export function normalizeLobby(options={}){
 const number=(value,fallback)=>Number.isFinite(Number(value))?Math.floor(Number(value)):fallback;
 const players=Math.max(4,Math.min(15,number(options.players,8))),maximum=players>=9?3:players>=7?2:1;
 return {players,impostors:Math.max(1,Math.min(maximum,number(options.impostors,1))),mapId:MAPS[options.mapId]?options.mapId:'skeld',hat:HATS.some(h=>h.id===options.hat)?options.hat:'none',accessory:ACCESSORIES.some(a=>a.id===options.accessory)?options.accessory:'none',pet:PETS.some(p=>p.id===options.pet)?options.pet:'none'};
}
export const dist = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
export const roomAt = (x,y,map=MAPS.skeld) => map.rooms.find(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h);
function inside(x,y,map=MAPS.skeld) {return map.rooms.some(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)||map.halls.some(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h);}
export function walkable(x,y,r=12,map=MAPS.skeld) {
 // Check the body between its corners too; a concave doorway can contain four valid corners and a blocked edge.
 const offsets=[-r,-r/2,0,r/2,r];for(const dx of offsets)for(const dy of offsets)if(!inside(x+dx,y+dy,map))return false;return true;
}
export function lineOfSight(a,b,map=MAPS.skeld){const steps=Math.ceil(dist(a,b)/8);for(let i=0;i<=steps;i++){const t=steps?i/steps:0;if(!inside(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,map))return false;}return true;}
export function visibilityPolygon(origin,radius,samples=192,map=MAPS.skeld){
 const points=[];
 for(let i=0;i<samples;i++){
  const angle=i/samples*Math.PI*2,dx=Math.cos(angle),dy=Math.sin(angle);let length=radius;
  for(let d=4;d<=radius;d+=4)if(!inside(origin.x+dx*d,origin.y+dy*d,map)){length=Math.min(radius,d+8);break;}
  points.push({x:origin.x+dx*length,y:origin.y+dy*length});
 }
 return points;
}
const STEP=20,navigationCache=new WeakMap();
function navigationFor(map){let nav=navigationCache.get(map);if(nav)return nav;const COLS=Math.ceil(map.world.w/STEP),ROWS=Math.ceil(map.world.h/STEP),cells=new Uint8Array(COLS*ROWS);for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)cells[y*COLS+x]=walkable(x*STEP+10,y*STEP+10,13,map)?1:0;nav={COLS,ROWS,cells};navigationCache.set(map,nav);return nav;}
function nearestCell(p,{COLS,ROWS,cells}) {
 let gx=Math.round((p.x-10)/STEP),gy=Math.round((p.y-10)/STEP);
 for(let radius=0;radius<10;radius++)for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
  if(Math.abs(dx)!==radius&&Math.abs(dy)!==radius)continue;
  const x=gx+dx,y=gy+dy;
  if(x>=0&&x<COLS&&y>=0&&y<ROWS&&cells[y*COLS+x])return y*COLS+x;
 }
 return -1;
}
export function pathfind(a,b,map=MAPS.skeld) {
 const nav=navigationFor(map),{COLS,ROWS,cells}=nav,from=nearestCell(a,nav),to=nearestCell(b,nav);if(from<0||to<0)return [];
 const prev=new Int32Array(cells.length).fill(-1),queue=[from];prev[from]=from;
 for(let i=0;i<queue.length&&prev[to]<0;i++){
  const cur=queue[i],x=cur%COLS,y=Math.floor(cur/COLS);
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,ny=y+dy,n=ny*COLS+nx;
   if(nx<0||nx>=COLS||ny<0||ny>=ROWS||!cells[n]||prev[n]>=0)continue;
   prev[n]=cur;queue.push(n);
  }
 }
 if(prev[to]<0)return [];
 const result=[];let cur=to;
 while(cur!==from){result.push({x:(cur%COLS)*STEP+10,y:Math.floor(cur/COLS)*STEP+10});cur=prev[cur];}
 result.push({x:(from%COLS)*STEP+10,y:Math.floor(from/COLS)*STEP+10});
 return result.reverse();
}
export class Game {
 roomAt(x,y){return roomAt(x,y,this.map);}
 pathfind(a,b){return pathfind(a,b,this.map);}
 walkable(x,y,r=12){return walkable(x,y,r,this.map);}
 lineOfSight(a,b){return lineOfSight(a,b,this.map);}
 configure(options={}){this.config=normalizeLobby({...this.config,...options});this.map=MAPS[this.config.mapId];return this.config;}
 constructor(random=Math.random){this.random=random;this.config=normalizeLobby();this.map=MAPS[this.config.mapId];this.phase='lobby';this.role='crew';this.events=[];this.time=0;this.bodies=[];this.sabotageState=null;this.lights=0;this.tasks=this.map.tasks.map(t=>({...t,done:false}));this.resetCrew('You',0);this.settings={speed:175};}
 randomRoom(){return this.map.rooms[Math.floor(this.random()*this.map.rooms.length)];}
 resetCrew(name,color,randomize=false){
  const cafe=this.map.rooms.find(r=>r.id==='cafeteria');
  this.crew=[{id:0,name:name||'You',color:COLORS[color]||COLORS[0],...this.map.spawn,alive:true,ghost:false,inVent:false,dir:1,path:[],steps:0,suspicion:0,hat:this.config.hat,accessory:this.config.accessory}];
  const palette=randomize?shuffled(COLORS.filter((_,i)=>i!==color),this.random):COLORS.filter((_,i)=>i!==color);
  const available=NAMES.filter(n=>n.toLowerCase()!==String(name).toLowerCase());const names=(randomize?shuffled(available,this.random):available).slice(0,this.config.players-1);
  names.forEach((n,i)=>{
   const rand=this.random,profile={speed:83+rand()*40,caution:.25+rand()*.7,social:rand(),repair:rand()>.25,reportDelay:1.4+rand()*4.5,dwell:7+rand()*6,roaming:.08+rand()*.2,watchfulness:.15+rand()*.7};
   const taskOrder=shuffled(this.map.tasks,rand).slice(0,8+Math.floor(rand()*3));
   const columns=5,rows=Math.ceil((this.config.players-1)/columns),x=cafe.x+cafe.w*(.13+(i%columns)*.18),y=cafe.y+cafe.h*(.2+Math.floor(i/columns)*(.5/Math.max(1,rows-1)));
   this.crew.push({id:i+1,name:n,color:palette[i],x:x+(randomize?rand()*16-8:0),y:y+(randomize?rand()*14-7:0),alive:true,inVent:false,dir:rand()>.5?1:-1,path:[],steps:0,wait:randomize?rand()*3:1+i*.6,suspicion:0,imp:false,role:'crew',profile,taskOrder,completedTasks:new Set(),ghostWork:0,ventCooldown:10+rand()*25,huntAt:0,memory:new Map(),observeAt:0,hesitate:0,nextPauseAt:8+rand()*10,cameraUntil:0,hat:randomize?HATS[Math.floor(rand()*HATS.length)].id:'none',accessory:randomize?ACCESSORIES[Math.floor(rand()*ACCESSORIES.length)].id:'none'});
  });
  this.player=this.crew[0];
  for(const c of this.crew){c.pet=c.id===0?this.config.pet:randomize&&this.random()<.55?PETS[1+Math.floor(this.random()*(PETS.length-1))].id:'none';c.companion=c.pet==='none'?null:{ownerId:c.id,type:c.pet,color:c.color,alive:true,x:c.x,y:c.y,dir:c.dir,steps:0,trail:[]};this.snapPet(c);}
 }
 snapPet(c){
  const p=c.companion;if(!p||!c.alive||!p.alive)return;
  const offsets=[[-32*c.dir,14],[-24*c.dir,0],[0,20],[0,0]],offset=offsets.find(([x,y])=>this.walkable(c.x+x,c.y+y)&&this.lineOfSight(c,{x:c.x+x,y:c.y+y}))||[0,0];
  p.x=c.x+offset[0];p.y=c.y+offset[1];p.dir=c.dir;p.trail=[{x:c.x,y:c.y}];p.steps=0;
 }
 updatePets(dt){
  for(const c of this.crew){
   const p=c.companion;if(!p||!p.alive||!c.alive||c.inVent)continue;
   const last=p.trail.at(-1)||p;if(dist(last,c)>90){this.snapPet(c);continue;}
   if(dist(last,c)>4)p.trail.push({x:c.x,y:c.y});
   let length=dist(p,p.trail[0]||c);for(let i=1;i<p.trail.length;i++)length+=dist(p.trail[i-1],p.trail[i]);
   let budget=Math.min(Math.max(0,length-34),(c.id===0?this.settings.speed:c.profile.speed)*1.4*dt);
   // Retrace actual footsteps, including turns at doorways, rather than cutting across walls.
   while(budget>.01&&p.trail.length){const target=p.trail[0],d=dist(p,target);if(d<.2){p.trail.shift();continue;}const step=Math.min(d,budget),before={x:p.x,y:p.y};this.move(p,(target.x-p.x)/d*step,(target.y-p.y)/d*step);budget-=step;if(dist(p,before)<.01)break;if(dist(p,target)<.2)p.trail.shift();}
  }
 }
 eliminatePet(c){
  const p=c.companion;if(!p||!p.alive)return;p.alive=false;p.deathAt=this.time;p.trail=[];
 }
 getPets(){
  return this.crew.filter(c=>!c.inVent&&c.companion&&(c.alive&&c.companion.alive||!c.companion.alive&&this.time-c.companion.deathAt<2.2)).map(c=>{const p=c.companion;return {ownerId:c.id,type:p.type,color:p.color,x:p.x,y:p.y,dir:p.dir,steps:p.steps,alive:p.alive,deathProgress:p.alive?0:Math.min(1,(this.time-p.deathAt)/2.2)};});
 }
 start(role,name,color,{intro=false,...options}={}){
  this.configure(options);
  this.requestedRole=role;this.role=role==='random'?['crew','scientist','engineer','impostor'][Math.floor(this.random()*4)]:ROLE_INFO[role]?role:'crew';
  this.resetCrew(name,color,true);this.player.role=this.role;this.phase=intro?'intro':'playing';this.introElapsed=0;this.time=0;this.bodies=[];this.events=[];this.logs=[];this.tasks=assignTasks(this.random,6,this.map.tasks);this.killCooldown=15;this.sabotageCooldown=15;this.lights=0;this.crewProgress=0;this.lastMeeting=-35;this.emergencies=1;this.meetings=0;this.kills=0;this.reported=new Set();
  const candidates=shuffled(this.crew.slice(1),this.random),impostors=this.isImpostor?[this.player,...candidates.slice(0,this.config.impostors-1)]:candidates.slice(0,this.config.impostors);
  this.impIds=new Set(impostors.map(c=>c.id));this.impId=impostors[0].id;for(const c of impostors){c.imp=true;c.role='impostor';c.killCooldown=27+this.random()*15;}
  this.outcome=null;this.meeting=null;this.autoTarget=null;
  const specialists=shuffled(this.crew.slice(1).filter(c=>!c.imp),this.random);if(specialists[0])specialists[0].role='engineer';if(specialists[1])specialists[1].role='scientist';
  specialists.slice(0,2).forEach(c=>c.profile.repair=true);
  this.sabotageState=null;this.botSabotageCooldown=30+this.random()*22;this.sabotageCount=0;this.ventCooldown=0;this.vitalsBattery=10;this.vitalsOpen=false;this.camerasOpen=false;this.cameraIncidents=[];
  this.events.push({type:'start'});
 }
 emit(type,data={}){this.events.push({type,...data});}
 drain(){return this.events.splice(0);}
 get alive(){return this.crew.filter(c=>c.alive);}
 get completed(){return this.tasks.filter(t=>t.done).length;}
 get isImpostor(){return this.role==='impostor';}
 get isCrew(){return !this.isImpostor;}
 get botKillCooldown(){const bots=this.crew.filter(c=>c.id!==0&&c.imp&&c.alive);return bots.length?Math.min(...bots.map(c=>c.killCooldown??30)):this._botCooldownFallback??30;}
 set botKillCooldown(value){this._botCooldownFallback=value;for(const c of this.crew||[])if(c.id!==0&&c.imp)c.killCooldown=value;}
 get introStage(){return this.phase!=='intro'?'done':this.introElapsed<3?'black':'reveal';}
 get canVent(){return this.isImpostor||this.role==='engineer';}
 get visionRadius(){return this.player.ghost?280:this.role==='impostor'?320:this.lights?54:270;}
 get repairTargets(){const s=this.sabotageState;return s?this.map.systems[s.kind].terminals.filter(t=>!s.repaired.has(t.id)):[];}
 get repairTarget(){return [...this.repairTargets].sort((a,b)=>dist(a,this.player)-dist(b,this.player))[0];}
 goTo(x,y){if(this.player.inVent){this.emit('toast',{message:'Exit the vent before walking.'});return false;}if(!this.walkable(x,y,2))return false;this.player.path=this.pathfind(this.player,{x,y});this.autoTarget={x,y};return !!this.player.path.length;}
 move(c,dx,dy){
  if(c.inVent)return;
  if(c.ghost){c.x=Math.max(30,Math.min(this.map.world.w-30,c.x+dx));c.y=Math.max(30,Math.min(this.map.world.h-30,c.y+dy));}
  else{if(this.walkable(c.x+dx,c.y))c.x+=dx;if(this.walkable(c.x,c.y+dy))c.y+=dy;}
  if(Math.abs(dx)>.1)c.dir=dx>0?1:-1;c.steps+=Math.hypot(dx,dy)*.13;
 }
 follow(c,speed,dt){
  if(!c.path.length)return;let dest=c.path[0],d=dist(c,dest);
  if(d<4){c.path.shift();return;}
  const step=Math.min(d,speed*dt);this.move(c,(dest.x-c.x)/d*step,(dest.y-c.y)/d*step);
 }
 update(dt,input={x:0,y:0}){
  dt=Math.min(Math.max(dt,0),.1);
  if(this.phase==='intro'){this.introElapsed+=dt;if(this.introElapsed>=6.4){this.phase='playing';this.emit('roundReady');}return;}
  if(this.phase!=='playing')return;
  this.time+=dt;this.killCooldown=Math.max(0,this.killCooldown-dt);this.sabotageCooldown=Math.max(0,this.sabotageCooldown-dt);this.ventCooldown=Math.max(0,this.ventCooldown-dt);
  this.updateVent(this.player,dt);
  if(this.camerasOpen&&(!this.player.alive||this.player.inVent||this.sabotageState?.kind==='comms'||dist(this.player,this.map.cameraConsole)>95))this.closeCameras(true);
  if(this.vitalsOpen){this.vitalsBattery=Math.max(0,this.vitalsBattery-dt);if(!this.vitalsBattery||!this.player.alive||this.sabotageState?.kind==='comms')this.closeVitals(true);}
  else this.vitalsBattery=Math.min(10,this.vitalsBattery+dt*.35);
  if(this.sabotageState?.remaining!=null){this.sabotageState.remaining-=dt;if(this.sabotageState.remaining<=0){this.finish('impostor',this.sabotageState.kind==='reactor'?'The reactor melted down.':'The ship ran out of oxygen.');return;}}
  if(!this.sabotageState)this.botSabotageCooldown-=dt;
  const p=this.player;if(!this.camerasOpen){if(input.x||input.y){p.path=[];this.autoTarget=null;const n=Math.max(1,Math.hypot(input.x,input.y));this.move(p,input.x/n*this.settings.speed*dt,input.y/n*this.settings.speed*dt);}else this.follow(p,this.settings.speed,dt);}
  for(const c of this.crew.slice(1)){
   if(c.imp)c.killCooldown-=dt;
   c.ventCooldown=Math.max(0,c.ventCooldown-dt);
   if(!c.alive){if(!c.imp&&c.completedTasks.size<c.taskOrder.length){c.ghostWork+=dt;if(c.ghostWork>16){c.ghostWork=0;const next=c.taskOrder.find(t=>!c.completedTasks.has(t.id));if(next)c.completedTasks.add(next.id);}}continue;}
   this.updateVent(c,dt);if(c.inVent)continue;
   this.observeBot(c);
   if(this.updateBotCameras(c))continue;
   const repairing=this.botRepair(c,dt);
   if(!repairing&&!c.bodyInterest)this.stepBot(c,dt);
   if(c.imp&&c.killCooldown<=0){
    let victims=this.alive.filter(v=>!v.imp&&!v.inVent&&dist(c,v)<68&&this.lineOfSight(c,v));
    let target=victims.sort((a,b)=>dist(c,a)-dist(c,b))[0];
    if(target){const watchers=this.alive.filter(w=>!w.imp&&!w.inVent&&w.id!==target.id&&dist(w,c)<(this.lights?65:190)&&this.lineOfSight(w,c));if(watchers.length<Math.max(1,Math.round((1-c.profile.caution)*3))||c.killCooldown< -30){this.eliminate(c,target);c.killCooldown=22+this.random()*18;c.huntAt=this.time+4+this.random()*8;if(this.random()<.55)this.botVent(c);}}
    else if(c.killCooldown< -3&&this.time>=c.huntAt){const candidates=[...c.memory.values()].filter(m=>!this.crew[m.id].imp&&this.crew[m.id].alive&&this.time-m.at<12);const t=shuffled(candidates,this.random).sort((a,b)=>dist(c,a)-dist(c,b))[0];if(t){c.path=this.pathfind(c,t);c.goalTask=null;c.workingTask=null;c.wait=0;}c.huntAt=this.time+2+this.random()*4;}
   }
   if(!c.inVent&&this.time-this.lastMeeting>15){
    const body=this.bodies.find(b=>!this.reported.has(b.id)&&dist(c,b)<(this.lights?55:115)&&this.lineOfSight(c,b));
    if(body&&!c.imp){if(c.bodyInterest?.id!==body.id){c.bodyInterest={id:body.id,since:this.time};c.path=[];c.goalTask=null;c.workingTask=null;}
     if(this.time-c.bodyInterest.since>=c.profile.reportDelay||c.urgentReportAt&&this.time>=c.urgentReportAt){c.urgentReportAt=0;this.callMeeting(c.id,body);break;}}
    else c.bodyInterest=null;
   }
  }
  this.updatePets(dt);
  if(this.phase!=='playing')return;
  const crewBots=this.crew.slice(1).filter(c=>!c.imp);this.crewProgress=crewBots.reduce((n,c)=>n+c.completedTasks.size,0)/Math.max(1,crewBots.reduce((n,c)=>n+c.taskOrder.length,0));
  if(!this.sabotageState&&this.botSabotageCooldown<=0&&this.sabotageCooldown<=0&&this.alive.some(c=>c.id!==0&&c.imp)){const choices=['lights','lights','lights','reactor','oxygen','comms'];this.activateSabotage(choices[Math.floor(this.random()*choices.length)]);}
  if(this.isImpostor&&this.crewProgress>=1)this.finish('crew','The crew completed all their tasks.');
  this.checkWin();
 }
 stepBot(c,dt){
  if(c.hesitate>0){c.hesitate-=dt;return;}
  if(this.time>=c.nextPauseAt){c.nextPauseAt=this.time+8+this.random()*14;if(c.path.length&&(!c.imp||c.killCooldown>0)&&this.random()<.45){c.hesitate=.25+this.random()*.65;return;}}
  if(c.wait>0){c.wait-=dt;if(c.wait<=0&&c.workingTask){c.completedTasks.add(c.workingTask);c.workingTask=null;}return;}
  if(c.path.length){this.follow(c,c.profile.speed*(c.imp?1.05:1),dt);if(!c.path.length){if(c.goalActivity==='security'&&dist(c,this.map.cameraConsole)<95){c.cameraUntil=this.time+(c.imp?3:6)+this.random()*(c.imp?3:8);c.lastCameraAt=this.time;c.goalActivity=null;c.wait=0;}else if(c.goalTask){c.workingTask=c.goalTask;c.goalTask=null;c.wait=c.profile.dwell+this.random()*4;}else c.wait=.4+this.random()*2.8;}return;}
  if(this.sabotageState?.kind!=='comms'&&this.random()<c.profile.watchfulness*(c.imp?.08:.2)){c.goalActivity='security';c.goalTask=null;c.path=this.pathfind(c,this.map.cameraConsole);return;}
  const unfinished=c.taskOrder.filter(t=>!c.completedTasks.has(t.id));
  if(unfinished.length&&this.random()>c.profile.roaming){
   const candidates=shuffled(unfinished,this.random);const target=this.random()<.45?candidates.sort((a,b)=>dist(c,a)-dist(c,b))[0]:candidates[0];
   c.goalTask=target.id;c.path=this.pathfind(c,target);
   if(c.role==='engineer'&&c.ventCooldown<=0&&this.random()<.3)this.botVent(c,target);
  }else{
   let target;const buddy=this.alive.find(b=>b.id!==c.id&&!b.imp&&!b.inVent&&dist(c,b)>160&&dist(c,b)<400&&this.lineOfSight(c,b));
   if(buddy&&this.random()<c.profile.social*.3)target=buddy;
   else{const r=this.randomRoom();target={x:r.x+35+this.random()*(r.w-70),y:r.y+35+this.random()*(r.h-70)};}
   c.path=this.pathfind(c,target);c.goalTask=null;
  }
 }
 botVent(c,target=null){
  if(!c.alive||!['engineer','impostor'].includes(c.role)||c.ventCooldown>0)return false;
  const entry=this.map.vents.find(v=>dist(v,c)<78);if(!entry||c.inVent)return false;
  const exits=this.map.vents.filter(v=>v!==entry),exit=target?exits.sort((a,b)=>dist(a,target)-dist(b,target))[0]:exits[Math.floor(this.random()*exits.length)];
  this.enterActorVent(c,this.map.vents.indexOf(entry));c.ventDestination=this.map.vents.indexOf(exit);c.ventTravel=.65;c.ventExitIn=1.5+this.random()*3;c.resumeTarget=target?{...target}:null;c.workingTask=null;if(!target)c.goalTask=null;return true;
 }
 recordVent(subject,position){
  for(const c of this.alive.filter(c=>!c.inVent&&c.id!==subject.id&&dist(c,position)<(this.lights?60:160)&&this.lineOfSight(c,position)))this.logs.push({observer:c.id,suspect:subject.id,at:this.time,room:this.roomAt(position.x,position.y)?.name||'the hallway',certain:false,action:'vent'});
 }
 enterActorVent(c,index){
  const v=this.map.vents[index];if(!v||!c.alive||c.inVent||!['engineer','impostor'].includes(c.role)||dist(c,v)>80)return false;
  this.recordVent(c,v);c.inVent=true;c.ventIndex=index;c.ventDestination=index;c.ventTravel=0;c.ventExitIn=2;c.ventRemaining=c.role==='engineer'?8:Infinity;c.x=v.x;c.y=v.y;c.path=[];c.cameraUntil=0;c.bodyInterest=null;
  if(c.id===0){this.closeCameras();this.closeVitals();this.autoTarget=null;this.emit('enteredVent');}return true;
 }
 travelVent(index){
  const p=this.player;if(this.phase!=='playing'||!p.alive||!p.inVent||p.ventTravel>0||!Number.isInteger(index)||!this.map.vents[index]||index===p.ventIndex)return false;
  p.ventDestination=index;p.ventTravel=.65;this.emit('ventTravel');return true;
 }
 updateVent(c,dt){
  if(!c.inVent)return;
  if(c.ventTravel>0){c.ventTravel=Math.max(0,c.ventTravel-dt);if(c.ventTravel===0){const v=this.map.vents[c.ventDestination];c.ventIndex=c.ventDestination;c.x=v.x;c.y=v.y;if(c.id===0)this.emit('ventMoved');}}
  if(c.role==='engineer'){c.ventRemaining-=dt;if(c.ventRemaining<=0){this.exitActorVent(c,true);return;}}
  if(c.id!==0){c.ventExitIn-=dt;if(c.ventExitIn<=0&&c.ventTravel===0)this.exitActorVent(c);}
 }
 exitActorVent(c,forced=false){
  if(!c.inVent||c.ventTravel>0&&!forced)return false;
  c.inVent=false;c.ventTravel=0;const v=this.map.vents[c.ventIndex];c.x=v.x;c.y=v.y;this.recordVent(c,v);this.snapPet(c);
  if(c.id===0){if(this.role==='engineer')this.ventCooldown=25;this.emit('exitedVent');if(forced)this.emit('toast',{message:'Engineer vent time is up. Recharging for 25 seconds.'});}
  else{c.ventCooldown=25+this.random()*15;if(c.resumeTarget)c.path=this.pathfind(c,c.resumeTarget);c.resumeTarget=null;}
  return true;
 }
 observeBot(c){
  if(this.time<c.observeAt)return;c.observeAt=this.time+.35+this.random()*.55;
  for(const target of this.alive)if(target.id!==c.id&&!target.inVent&&dist(c,target)<(this.lights&&!c.imp?75:310)&&this.lineOfSight(c,target))c.memory.set(target.id,{id:target.id,x:target.x,y:target.y,at:this.time});
  for(const [id,m] of c.memory)if(this.time-m.at>25||!this.crew[id].alive)c.memory.delete(id);
 }
 cameraCovers(camera,point){return !!camera&&!point.inVent&&Math.abs(camera.x-point.x)<=camera.width/2&&Math.abs(camera.y-point.y)<=camera.height/2&&this.lineOfSight(camera,point);}
 isCameraViewer(c){return this.phase==='playing'&&!!c?.alive&&!c.inVent&&this.sabotageState?.kind!=='comms'&&dist(c,this.map.cameraConsole)<=95&&(c.id===0?this.camerasOpen:c.cameraUntil>this.time)&&this.lineOfSight(c,this.map.cameraConsole);}
 get cameraWatching(){return this.crew.some(c=>this.isCameraViewer(c));}
 openCameras(){
  if(this.phase!=='playing'||!this.player.alive||this.player.inVent||dist(this.player,this.map.cameraConsole)>95||!this.lineOfSight(this.player,this.map.cameraConsole))return false;
  if(this.sabotageState?.kind==='comms'){this.emit('toast',{message:'Camera feeds are offline. Restore Communications.'});return false;}
  this.closeVitals();this.camerasOpen=true;this.player.path=[];return true;
 }
 closeCameras(notify=false){const wasOpen=this.camerasOpen;this.camerasOpen=false;if(wasOpen&&notify)this.emit('camerasClosed');}
 getCameraFeed(index,viewerId=0){
  if(!Number.isInteger(index)||!this.map.cameras[index])return null;const camera=this.map.cameras[index],online=this.isCameraViewer(this.crew[viewerId]);
  return {camera,online,actors:online?this.alive.filter(c=>!c.inVent&&this.cameraCovers(camera,c)).map(c=>({id:c.id,name:c.name,color:c.color,hat:c.hat,accessory:c.accessory,x:c.x,y:c.y,dir:c.dir,steps:c.steps,alive:true,imp:this.isImpostor&&c.imp})):[],pets:online?this.getPets().filter(p=>this.cameraCovers(camera,p)):[],bodies:online?this.bodies.filter(b=>!this.reported.has(b.id)&&this.cameraCovers(camera,b)).map(({id,x,y,color,at})=>({id,x,y,color,at})):[],incident:online&&this.cameraIncidents.some(i=>i.cameraId===index&&this.time-i.at<1.1)};
 }
 updateBotCameras(c){
  if(c.cameraUntil<=this.time)return false;
  if(!this.isCameraViewer(c)){c.cameraUntil=0;return false;}
  for(const target of this.alive)if(target.id!==c.id&&!target.inVent&&this.map.cameras.some(cam=>this.cameraCovers(cam,target)))c.memory.set(target.id,{id:target.id,x:target.x,y:target.y,at:this.time});
  if(c.imp&&c.killCooldown<=0&&[...c.memory.values()].some(m=>!this.crew[m.id].imp&&this.time-m.at<1)){c.cameraUntil=0;c.huntAt=0;return false;}
  const body=!c.imp&&this.bodies.find(b=>!this.reported.has(b.id)&&this.map.cameras.some(cam=>this.cameraCovers(cam,b)));
  if(body){c.cameraUntil=0;c.path=this.pathfind(c,body);c.goalTask=null;c.workingTask=null;c.wait=0;return false;}
  return true;
 }
 openVitals(){
  if(this.phase!=='playing'||this.role!=='scientist'||!this.player.alive||this.player.inVent)return false;
  if(this.sabotageState?.kind==='comms'){this.emit('toast',{message:'Communications are down. Restore the radio before checking vitals.'});return false;}
  if(this.vitalsBattery<.25){this.emit('toast',{message:'Vitals battery depleted. Wait for recharge or finish a task.'});return false;}
  this.closeCameras();this.vitalsOpen=true;return true;
 }
 closeVitals(notify=false){const wasOpen=this.vitalsOpen;this.vitalsOpen=false;if(wasOpen&&notify)this.emit('vitalsClosed');}
 getVitals(){if(!this.vitalsOpen||this.role!=='scientist'||this.sabotageState?.kind==='comms')return [];return this.crew.map(c=>({id:c.id,name:c.name,color:c.color,hat:c.hat,accessory:c.accessory,alive:c.alive,bpm:c.alive?Math.round(68+c.id*2+Math.sin(this.time*1.6+c.id)*5):0}));}
 eliminate(killer,victim){
  if(!victim?.alive||victim.inVent||killer.inVent||killer.imp&&victim.imp)return false;victim.alive=false;victim.path=[];victim.ghost=victim.id===0;this.eliminatePet(victim);
  this.bodies.push({id:victim.id,x:victim.x,y:victim.y,color:victim.color,at:this.time,killer:killer.id});
  const witnessRange=this.lights?65:210;
  const witnesses=this.alive.filter(c=>!c.imp&&!c.inVent&&dist(c,victim)<witnessRange&&this.lineOfSight(c,victim));
  for(const w of witnesses){w.witness=killer.id;w.urgentReportAt=this.time+.35+this.random()*.7;killer.suspicion+=4;this.logs.push({observer:w.id,suspect:killer.id,at:this.time,room:this.roomAt(victim.x,victim.y)?.name||'the hallway',certain:true});}
  for(const camera of this.map.cameras)if(this.cameraCovers(camera,killer)&&this.cameraCovers(camera,victim)){
   this.cameraIncidents.push({cameraId:camera.id,at:this.time});
   for(const w of this.alive.filter(w=>!w.imp&&this.isCameraViewer(w)&&!witnesses.includes(w)))this.logs.push({observer:w.id,suspect:killer.id,at:this.time,room:camera.name,certain:true,via:'camera',cameraId:camera.id});
  }
  this.cameraIncidents=this.cameraIncidents.filter(i=>this.time-i.at<5);
  if(!witnesses.length){const nearby=this.alive.filter(c=>!c.imp&&!c.inVent&&dist(c,killer)<350&&this.lineOfSight(c,killer));for(const w of nearby)this.logs.push({observer:w.id,suspect:killer.id,at:this.time,room:this.roomAt(killer.x,killer.y)?.name||'the hallway',certain:false});}
  if(killer.id===0||victim.id===0){const sprite=c=>({id:c.id,name:c.name,color:c.color,hat:c.hat,accessory:c.accessory,pet:c.pet});this.emit('killAnimation',{killer:sprite(killer),victim:sprite(victim),style:['knife','chomp','blaster'][Math.floor(this.random()*3)]});}
  if(killer.id===0){this.kills++;this.emit('toast',{message:`${victim.name} eliminated. Leave before someone finds the body.`});}
  if(victim.id===0)this.emit('death');
  this.checkWin();
 }
 nearestTask(){return this.tasks.filter(t=>!t.done).sort((a,b)=>dist(this.player,a)-dist(this.player,b))[0];}
 canUse(){
  if(this.phase!=='playing'||this.player.inVent)return null;
  const p=this.player,t=this.nearestTask();
  const terminal=this.repairTarget;
  if(terminal&&p.alive&&dist(p,terminal)<70&&this.lineOfSight(p,terminal))return {type:'repair',terminal};
  if(p.alive&&dist(p,this.map.cameraConsole)<90&&this.lineOfSight(p,this.map.cameraConsole))return {type:'cameras'};
  if(t&&dist(p,t)<86)return {type:'task',task:t};
  if(p.alive&&dist(p,this.map.emergency)<90&&this.lineOfSight(p,this.map.emergency))return {type:'emergency'};
  return null;
 }
 completeTask(id){
  if(this.phase!=='playing'||this.player.inVent)return false;const t=this.tasks.find(t=>t.id===id);if(!t||t.done)return false;
  t.done=true;if(this.role==='scientist')this.vitalsBattery=Math.min(10,this.vitalsBattery+4);this.emit('task',{task:t});if(this.isCrew&&this.completed===this.tasks.length)this.finish('crew','Every task is complete. The ship is safe.');return true;
 }
 report(){
  if(this.phase!=='playing'||!this.player.alive||this.player.inVent)return false;
  const b=this.bodies.find(b=>!this.reported.has(b.id)&&dist(this.player,b)<105);
  if(!b)return false;return this.callMeeting(0,b);
 }
 emergency(){
  if(this.phase!=='playing'||!this.player.alive||this.player.inVent)return false;
  if(this.sabotageState?.remaining!=null){this.emit('toast',{message:'Fix the critical sabotage before calling an emergency meeting.'});return false;}
  if(this.emergencies<=0){this.emit('toast',{message:'You have already used your emergency meeting.'});return false;}
  if(this.time-this.lastMeeting<25){this.emit('toast',{message:'Emergency button is cooling down. Try again shortly.'});return false;}
  this.emergencies--;return this.callMeeting(0,null);
 }
 callMeeting(reporter,body){
  if(this.phase!=='playing')return false;this.closeVitals();this.closeCameras();
  for(const c of this.crew){if(c.inVent&&c.role==='engineer'){if(c.id===0)this.ventCooldown=25;else c.ventCooldown=25;}c.inVent=false;c.ventTravel=0;c.cameraUntil=0;c.goalActivity=null;if(c.companion&&!c.companion.alive)c.companion.deathAt=-Infinity;}
  this.phase='meeting';this.meetings++;this.player.path=[];
  if(body)this.reported.add(body.id);
  const r=this.crew[reporter];let lines=[{who:reporter,text:body?`I found ${this.crew[body.id].name} in ${this.roomAt(body.x,body.y)?.name||'the hallway'}.`:'Emergency meeting. Has anyone seen anything suspicious?'}];
  for(const c of this.alive.filter(c=>c.id!==0&&c.id!==reporter)){
   const evidence=this.logs.filter(l=>l.observer===c.id&&this.time-l.at<90).sort((a,b)=>Number(b.certain)-Number(a.certain))[0];
   const pick=list=>list[Math.floor(this.random()*list.length)],place=this.roomAt(c.x,c.y)?.name||'the hallway';
   if(evidence){const suspect=this.crew[evidence.suspect].name;lines.push({who:c.id,text:evidence.via==='camera'?`I saw ${suspect} eliminate someone on the ${evidence.room} camera. I was at the Security monitor.`:evidence.certain?pick([`I saw ${suspect} eliminate someone in ${evidence.room}. Vote them out!`,`${suspect} did the elimination. I was right there in ${evidence.room}.`]):evidence.action==='vent'?`I saw ${suspect} use a vent in ${evidence.room}. Could be an Engineer, though.`:pick([`${suspect} was near ${evidence.room} before the report. That's all I know.`,`I passed ${suspect} by ${evidence.room}. Suspicious timing, but I didn't see a kill.`])});}
   else if(c.imp)lines.push({who:c.id,text:pick([`I was doing tasks in ${this.randomRoom().name}. Can anyone confirm?`,`I only saw the report. I think we need more evidence.`,`I passed through ${place}. Someone else was behind me.`])});
   else lines.push({who:c.id,text:pick([`I was in ${place}. I didn't see the elimination.`,`Just finishing tasks in ${place}. I have no solid evidence.`,`I came from ${place}. Don't vote blindly.`,`${place} was quiet when I was there. Does anyone have a witness?`])});
  }
  this.meeting={reporter,body:body?.id??null,lines,result:null};this.emit('meeting');return true;
 }
 vote(selected){
  if(this.phase!=='meeting'||this.meeting.result)return null;
  if(!this.player.alive||!this.crew[selected]?.alive||selected===0)selected=-1;
  const votes={};const cast=(id)=>votes[id]=(votes[id]||0)+1;
  if(this.player.alive)cast(selected??-1);
  for(const c of this.alive.filter(c=>c.id!==0)){
   const known=this.logs.filter(l=>l.observer===c.id&&this.crew[l.suspect].alive&&!(c.imp&&this.crew[l.suspect].imp));
   const certain=known.find(l=>l.certain);
   if(certain){cast(certain.suspect);continue;}
   if(c.imp){const suspects=this.alive.filter(v=>!v.imp&&v.id!==c.id);cast(suspects[Math.floor(this.random()*suspects.length)]?.id??-1);continue;}
   const lead=known.find(l=>l.action!=='vent')||known[0];if(lead&&this.random()<(lead.action==='vent'?.2:(1-c.profile.caution)*.8+.15)){cast(lead.suspect);continue;}
   if(selected>=0&&this.random()<c.profile.social*.55&&selected!==c.id){cast(selected);continue;}
   cast(-1);
  }
  const sorted=Object.entries(votes).sort((a,b)=>b[1]-a[1]);
  let ejected=null,reason='No one was ejected. (Skipped)';
  if(sorted.length&&Number(sorted[0][0])>=0){if(sorted[1]&&sorted[0][1]===sorted[1][1])reason='No one was ejected. (Tie)';else{ejected=Number(sorted[0][0]);const c=this.crew[ejected];c.alive=false;c.ghost=c.id===0;c.path=[];this.eliminatePet(c);reason=`${c.name} was ${c.imp?'an Impostor.':'not an Impostor.'}`;}}
  this.meeting.result={ejected,reason,votes};this.emit('voteResult',{...this.meeting.result});return this.meeting.result;
 }
 continueMeeting(){
  if(this.phase!=='meeting'||!this.meeting.result)return;
  this.lastMeeting=this.time;this.phase='playing';this.bodies=[];this.botKillCooldown=Math.max(18,this.botKillCooldown);this.killCooldown=Math.max(15,this.killCooldown);
  const cafe=this.map.rooms.find(r=>r.id==='cafeteria'),rows=Math.ceil(this.crew.length/5);
  this.crew.forEach((c,i)=>{if(c.alive||c.ghost){c.x=cafe.x+cafe.w*(.13+(i%5)*.18);c.y=cafe.y+cafe.h*(.2+Math.floor(i/5)*(.5/Math.max(1,rows-1)));c.path=[];c.wait=.8+this.random()*2.5;c.bodyInterest=null;c.urgentReportAt=0;c.goalTask=null;c.workingTask=null;this.snapPet(c);}if(c.companion&&!c.companion.alive)c.companion.deathAt=-Infinity;});
  this.meeting=null;this.checkWin();
 }
 killTarget(){return this.player.inVent?undefined:this.alive.filter(c=>!c.imp&&!c.inVent&&dist(c,this.player)<82&&this.lineOfSight(c,this.player)).sort((a,b)=>dist(a,this.player)-dist(b,this.player))[0];}
 kill(){if(this.phase!=='playing'||this.role!=='impostor'||!this.player.alive||this.player.inVent||this.killCooldown>0)return false;const t=this.killTarget();if(!t)return false;this.eliminate(this.player,t);this.killCooldown=22;return true;}
 vent(){
  if(this.phase!=='playing'||!this.canVent||!this.player.alive)return false;
  if(this.player.inVent)return this.exitActorVent(this.player);
  if(this.role==='engineer'&&this.ventCooldown>0){this.emit('toast',{message:`Vent system recharging. ${Math.ceil(this.ventCooldown)} seconds remaining.`});return false;}
  const i=this.map.vents.findIndex(v=>dist(v,this.player)<80);if(i<0){this.emit('toast',{message:'Get closer to a floor vent to use it.'});return false;}
  return this.enterActorVent(this.player,i);
 }
 sabotage(kind='lights'){if(this.phase!=='playing'||this.role!=='impostor'||!this.player.alive||this.sabotageCooldown>0||this.sabotageState)return false;return this.activateSabotage(kind);}
 activateSabotage(kind){
  const system=this.map.systems[kind];if(!system||this.sabotageState||this.phase!=='playing')return false;
  this.sabotageState={kind,remaining:system.duration??null,repaired:new Set(),switches:[false,true,false,false,true],codes:Object.fromEntries(system.terminals.map(t=>[t.id,String(10000+Math.floor(this.random()*90000))])),frequency:62,botProgress:{}};
  this.lights=kind==='lights'?1:0;this.sabotageCooldown=30;this.botSabotageCooldown=65;this.sabotageCount++;
  this.emit('sabotage');this.emit('toast',{message:kind==='lights'?'Lights are out! Repair the breakers in Electrical.':`${system.name} sabotaged! ${system.action} at the marked panels.`});return true;
 }
 canRepair(id){const t=this.repairTargets.find(t=>t.id===id);return this.phase==='playing'&&this.player.alive&&!this.player.inVent&&!!t&&dist(this.player,t)<70&&this.lineOfSight(this.player,t);}
 toggleLight(index){
  const s=this.sabotageState;if(s?.kind!=='lights'||!this.canRepair('breaker')||!Number.isInteger(index)||index<0||index>4)return false;
  s.switches[index]=!s.switches[index];if(s.switches.every(Boolean))this.fixLights();return true;
 }
 fixLights(){return this.repairSystem('breaker');}
 repairSystem(id,solution){
  const s=this.sabotageState;if(!s||!this.canRepair(id))return false;
  const valid=s.kind==='lights'?s.switches.every(Boolean):s.kind==='oxygen'?String(solution)===s.codes[id]:s.kind==='reactor'?Number(solution)>=3.2:Math.abs(Number(solution)-s.frequency)<=3;
  if(!valid)return false;this.completeRepair(id);return true;
 }
 completeRepair(id){
  const s=this.sabotageState;if(!s||!this.map.systems[s.kind].terminals.some(t=>t.id===id)||s.repaired.has(id))return;
  s.repaired.add(id);const done=s.repaired.size===this.map.systems[s.kind].terminals.length;
  if(done){this.sabotageState=null;this.lights=0;this.botSabotageCooldown=55;this.sabotageCooldown=25;this.crew.forEach(c=>c.repairTarget=null);}
  this.emit('repair',{done});this.emit('toast',{message:done?'Systems restored. Nice work, crew.':'Panel restored. Head to the other marked panel.'});
 }
 botRepair(c,dt){
  if(!this.isImpostor||c.imp||!this.sabotageState||!c.profile.repair&&this.alive.length>3)return false;
  const targets=this.repairTargets,t=targets[c.id%targets.length];if(!t)return false;
  if(c.repairTarget!==t.id){c.repairTarget=t.id;c.path=this.pathfind(c,t);c.wait=0;c.goalTask=null;c.workingTask=null;}
  if(dist(c,t)>48){if(!c.path.length)c.path=this.pathfind(c,t);this.follow(c,110,dt);}
  else{const s=this.sabotageState;s.botProgress[t.id]=(s.botProgress[t.id]||0)+dt;if(s.botProgress[t.id]>=9)this.completeRepair(t.id);}
  return true;
 }
 checkWin(){
  if(this.phase!=='playing')return;
  const imps=this.alive.filter(c=>c.imp).length,crew=this.alive.filter(c=>!c.imp).length;
  if(imps===0)this.finish('crew',this.config.impostors>1?'All impostors were ejected. Your crew is safe.':'The impostor was ejected. Your crew is safe.');
  else if(imps>=crew)this.finish('impostor',this.config.impostors>1?'The impostor team has taken over the ship.':'The impostor has taken over the ship.');
 }
 finish(winner,reason){if(this.phase==='ended')return;this.closeVitals();this.closeCameras();this.phase='ended';this.outcome={winner,reason,victory:winner===(this.isImpostor?'impostor':'crew')};this.emit('win',{...this.outcome});}
}

