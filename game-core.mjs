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

export const HATS=[{id:'none',name:'None'},{id:'sprout',name:'Sprout'},{id:'cap',name:'Crew cap'},{id:'beanie',name:'Beanie'},{id:'crown',name:'Crown'},{id:'party',name:'Party hat'},{id:'chef',name:'Chef'},{id:'antenna',name:'Antenna'},{id:'fedora',name:'Fedora'},{id:'flower',name:'Flower'},{id:'egg',name:'Fried egg'},{id:'halo',name:'Halo'},{id:'plunger',name:'Plunger'},{id:'hardhat',name:'Hard hat'}];
export const ACCESSORIES=[{id:'none',name:'None'},{id:'scarf',name:'Scarf'},{id:'tie',name:'Crew tie'},{id:'hockey',name:'Jason mask'},{id:'dum',name:'DUM note'},{id:'bowtie',name:'Bow tie'},{id:'eyepatch',name:'Eye patch'},{id:'toolbelt',name:'Utility belt'}];
// The same fitted shapes are used by wardrobe SVGs and moving Canvas characters.
function classicOutfitParts(hat,accessory){
 const parts=[],path=(d,fill,stroke='#243247',width=1.8)=>parts.push({kind:'path',d,fill,stroke,width}),ellipse=(x,y,rx,ry,fill,stroke='#243247',width=1.8)=>parts.push({kind:'ellipse',x,y,rx,ry,fill,stroke,width}),rect=(x,y,w,h,r,fill,stroke='#243247',width=1.8)=>parts.push({kind:'rect',x,y,w,h,r,fill,stroke,width});
 if(hat==='sprout'){path([['M',30,8],['Q',29,0,30,-5]],null,'#4e8e61',2.5);path([['M',30,-4],['Q',13,-16,14,-5],['Q',19,3,30,-4],['Z']],'#9dcc77','#325847',1.4);path([['M',30,-4],['Q',45,-17,46,-7],['Q',43,0,30,-4],['Z']],'#91c76f','#325847',1.4);path([['M',18,-6],['L',27,-4],['M',34,-6],['L',42,-10]],null,'#c9e69f',1.2);}
 if(hat==='cap'){path([['M',16,9],['L',16,5],['Q',18,-6,31,-6],['Q',44,-6,45,8],['Z']],'#5e8fba','#243247',1.8);path([['M',31,-5],['Q',37,0,36,7]],null,'#365f86',1.1);path([['M',15,8],['Q',30,7,49,9],['Q',54,10,51,13],['L',23,13],['Z']],'#8cb7cb','#243247',1.8);ellipse(26,0,3,2.6,'#b7d1d9',null);}
 if(hat==='beanie'){path([['M',17,8],['Q',18,-8,31,-8],['Q',44,-8,46,8],['Z']],'#bd738a','#51364b',1.8);for(const x of [24,31,38])path([['M',x,2],['Q',x-1,-3,31,-6]],null,'#d58b9e',1);rect(14,5,34,8,3,'#e9a7ae','#51364b',1.8);for(const x of [20,26,32,38,44])path([['M',x,8],['L',x,10]],null,'#b76c89',.9);ellipse(31,-11,4.6,4.6,'#f1c5bc','#65485a',1.3);}
 if(hat==='crown'){path([['M',15,-5],['L',24,2],['L',31,-11],['L',39,2],['L',48,-5],['L',44,12],['L',19,12],['Z']],'#edc86d','#755134',1.8);path([['M',20,8],['Q',31,10,43,8]],null,'#fff0b5',1.6);ellipse(31,4,2.3,2.8,'#d36b72','#946347',.8);ellipse(21,5,1.2,1.6,'#91bdb4',null);ellipse(41,5,1.2,1.6,'#91bdb4',null);}
 if(hat==='party'){path([['M',17,10],['L',31,-14],['L',46,10],['Z']],'#9b83c5','#3a3555',1.8);path([['M',23,0],['L',40,4],['M',20,6],['L',43,9]],null,'#e4b28e',2.5);ellipse(31,-14,2.7,2.7,'#ead6a1','#6c5a64',1);}
 if(hat==='chef'){path([['M',19,7],['L',19,-1],['Q',10,-7,17,-12],['Q',24,-18,30,-11],['Q',38,-19,45,-12],['Q',52,-4,43,0],['L',43,8],['Z']],'#e8ebd9','#728d92',1.7);path([['M',24,-4],['L',24,2],['M',37,-5],['L',37,2]],null,'#c4d2c7',1.3);rect(18,4,26,9,3,'#f4f0dc','#728d92',1.7);path([['M',23,7],['L',39,7]],null,'#fff9e6',1.2);}
 if(hat==='antenna'){path([['M',31,6],['L',31,-4],['L',35,-9]],null,'#233b53',4.5);path([['M',31,5],['L',31,-4],['L',35,-9]],null,'#b4cbd0',2);ellipse(35,-12,3.7,3.7,'#e8ae71','#3f4c63',1.5);ellipse(34,-13,1.1,1.1,'#ffe4a2',null);path([['M',21,10],['Q',22,4,31,4],['Q',40,4,41,10],['Z']],'#628197','#233b53',1.8);path([['M',27,8],['L',35,8]],null,'#a2bdc7',1.3);}
 if(hat==='fedora'){path([['M',19,7],['L',21,-7],['Q',24,-11,31,-7],['Q',39,-11,42,-6],['L',45,8],['Z']],'#344553');path([['M',21,1],['Q',31,5,43,1],['L',44,7],['Q',30,11,20,7],['Z']],'#9a7d64');ellipse(31,9,21,4,'#344553');path([['M',15,9],['Q',31,12,48,8]],null,'#6d8190',1.2);}
 if(hat==='flower'){path([['M',25,8],['Q',25,0,20,-5]],null,'#55896b',2.5);path([['M',25,4],['Q',34,-5,35,1],['Q',31,7,25,4],['Z']],'#80b877','#365e4d',1.2);for(const [x,y] of [[17,-11],[24,-9],[26,-2],[20,2],[13,-2]])ellipse(x,y,4.5,4.5,'#df8fab','#6e485f',1.2);ellipse(20,-5,4,4,'#efcf70','#866c45',1.3);}
 if(hat==='egg'){path([['M',18,8],['Q',13,2,22,0],['Q',25,-7,32,-2],['Q',39,-7,44,0],['Q',54,5,45,10],['Q',39,15,33,10],['Q',23,15,18,8],['Z']],'#f3eee0','#879ca2',1.5);ellipse(34,3,6,5,'#f0ba50','#bc893d',1.2);ellipse(32,1,2,1,'#f8d685',null);}
 if(hat==='halo'){ellipse(31,-10,17,4.6,'#e9c65b','#77603e',1.5);ellipse(31,-10,12.5,2.2,'#213345','#ffe9a1',1);path([['M',18,-12],['Q',29,-16,43,-12]],null,'#fff0b2',1.3);}
 if(hat==='plunger'){rect(28,-16,6,17,2,'#c39a73','#73563e',1.5);path([['M',20,9],['Q',21,-2,31,-2],['Q',41,-2,43,9],['Z']],'#b45b65','#563647',1.7);ellipse(31,9,14,3.5,'#cb7780','#563647',1.5);path([['M',25,3],['Q',28,0,33,1]],null,'#e09c9b',1.4);}
 if(hat==='hardhat'){path([['M',17,8],['Q',17,-7,31,-7],['Q',45,-7,46,8],['Z']],'#e0bc55','#806234',1.8);rect(28,-8,7,17,3,'#f5d775','#806234',1.3);path([['M',14,7],['L',49,7],['L',49,12],['L',16,12],['Z']],'#eccd66','#806234',1.6);path([['M',21,0],['L',21,5],['M',41,0],['L',41,5]],null,'#ba943f',1.5);}
 if(accessory==='scarf'){path([['M',16,34],['Q',30,39,46,33],['L',45,40],['Q',30,45,16,40],['Z']],'#d47679','#633f50',1.6);path([['M',22,39],['L',23,49],['L',29,47],['L',28,40],['Z']],'#e29387','#633f50',1.5);path([['M',19,37],['Q',30,41,41,37]],null,'#edaca0',1.1);path([['M',24,46],['L',28,45]],null,'#b56a74',1);}
 if(accessory==='tie'){path([['M',21,34],['L',31,36],['L',26,40],['L',21,37],['Z']],'#e4ece3','#345067',1.2);path([['M',31,36],['L',43,34],['L',41,37],['L',36,40],['Z']],'#e4ece3','#345067',1.2);path([['M',30,39],['L',33,39],['L',35,43],['L',31.5,46],['L',28,43],['Z']],'#be5767','#542f46',1.2);path([['M',28.5,36.5],['L',34,36.5],['L',33,39.5],['L',30,39.5],['Z']],'#d87380','#542f46',1.2);path([['M',31,40.5],['L',32.5,43]],null,'#f0a49d',1);}
 if(accessory==='hockey'){path([['M',16,19],['L',29,19],['M',17,28],['L',29,28]],null,'#263644',3);path([['M',27,13],['Q',40,7,50,15],['L',52,28],['Q',50,37,38,39],['Q',26,35,25,27],['Z']],'#e4dfbf','#354656',1.8);path([['M',29,21],['L',36,19],['L',37,25],['L',29,26],['Z']],'#23323e',null);path([['M',42,19],['L',49,21],['L',48,26],['L',41,25],['Z']],'#23323e',null);path([['M',36,15],['L',39,18],['L',42,15],['M',29,29],['L',33,31],['M',45,31],['L',49,29]],null,'#b95b60',1.6);for(const [x,y] of [[36,30],[41,30],[38.5,34]])ellipse(x,y,1,1,'#607071',null);path([['M',29,16],['Q',31,13,34,13]],null,'#f9f0d1',1.2);}
 if(accessory==='dum'){const start=parts.length;rect(28,17,22,19,0,'#0003',null);path([['M',27,15],['L',49,15],['L',49,30],['L',45,34],['L',27,34],['Z']],'#f4dfa1','#8a784f',1.1);path([['M',45,30],['L',49,30],['L',45,34],['Z']],'#c6ad72',null);rect(33,13,10,5,.5,'#d8e5dbb8',null);parts.push({kind:'text',x:38,y:27,text:'DUM',size:8,fill:'#37404c'});for(const p of parts.slice(start))p.rotation=8;}
 if(accessory==='bowtie'){path([['M',31,37],['L',23,34],['Q',21,38,23,42],['L',31,39],['L',40,42],['Q',42,38,40,34],['Z']],'#bd627d','#57384f',1.4);rect(29,36,5,4,1.5,'#e598a4','#57384f',1.2);}
 if(accessory==='eyepatch'){path([['M',23,17],['L',50,31]],null,'#263342',2.5);path([['M',35,20],['L',47,23],['Q',49,33,41,33],['Q',34,31,35,20],['Z']],'#243544','#152439',1.5);path([['M',38,24],['L',44,26]],null,'#506477',1.1);}
 if(accessory==='toolbelt'){path([['M',17,38],['Q',31,41,45,37],['L',45,43],['Q',29,47,17,43],['Z']],'#866b50','#493e38',1.5);rect(30,39,7,5,1,'#d6bb75','#655337',1.1);rect(18,40,9,8,2,'#a48759','#5c4c3b',1.3);path([['M',41,38],['L',41,46],['M',39,46],['L',43,46]],null,'#a8c6cd',1.6);}
 return parts;
}
function shapeSVG(p){
 const shape=p.kind==='path'?`<path d="${p.d.map(v=>v.join(' ')).join(' ')}"`:p.kind==='ellipse'?`<ellipse cx="${p.x}" cy="${p.y}" rx="${p.rx}" ry="${p.ry}"`:p.kind==='text'?`<text x="${p.x}" y="${p.y}" text-anchor="middle" font-family="monospace" font-size="${p.size}" font-weight="bold"`:`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="${p.r}"`;
 const transform=p.rotation?` transform="rotate(${p.rotation} 38 24)"`:'';
 return `${shape}${transform} fill="${p.fill||'none'}" stroke="${p.stroke||'none'}" stroke-width="${p.width||0}" stroke-linejoin="round" stroke-linecap="round"${p.kind==='text'?`>${p.text}</text>`:'/>'}`;
}
export function outfitSVG(hat='none',accessory='none'){return classicOutfitParts(hat,accessory).map(shapeSVG).join('');}
export function drawOutfit(c,hat='none',accessory='none',bob=0){
 c.save();c.translate(-29,-40+bob);c.lineJoin='round';c.lineCap='round';
 for(const p of classicOutfitParts(hat,accessory)){
  c.save();if(p.rotation){c.translate(38,24);c.rotate(p.rotation*Math.PI/180);c.translate(-38,-24);}
  if(p.kind==='text'){c.fillStyle=p.fill;c.font=`bold ${p.size}px monospace`;c.textAlign='center';c.textBaseline='alphabetic';c.fillText(p.text,p.x,p.y);}
  else{c.beginPath();if(p.kind==='ellipse')c.ellipse(p.x,p.y,p.rx,p.ry,0,0,Math.PI*2);else if(p.kind==='rect')c.roundRect(p.x,p.y,p.w,p.h,p.r);else for(const [cmd,...v] of p.d){if(cmd==='M')c.moveTo(...v);else if(cmd==='L')c.lineTo(...v);else if(cmd==='Q')c.quadraticCurveTo(...v);else c.closePath();}if(p.fill){c.fillStyle=p.fill;c.fill();}if(p.stroke){c.strokeStyle=p.stroke;c.lineWidth=p.width;c.stroke();}}
  c.restore();
 }
 c.restore();
}

export const PETS=[{id:'none',name:'No pet'},{id:'mini',name:'Mini crewmate'},{id:'stickman',name:'Stickman'},{id:'ufo',name:'UFO'},{id:'cyclops',name:'Blue cyclops dog'},{id:'hamster',name:'Hamster ball'},{id:'robot',name:'Mini robot'},{id:'alien',name:'Green alien'}];

// One set of shapes keeps the wardrobe and the moving companions identical.
function petArt(type,color,step=0,energy=0){
 const shapes=[],add=(kind,values)=>shapes.push({kind,...values});
 const path=(points,fill,stroke='#132339',width=1.8)=>add('path',{points,fill,stroke,width});
 const ellipse=(x,y,rx,ry,fill,stroke=null,width=1.8)=>add('ellipse',{x,y,rx,ry,fill,stroke,width});
 const rect=(x,y,w,h,r,fill,stroke='#132339',width=1.8)=>add('rect',{x,y,w,h,r,fill,stroke,width});
 const leg=Math.sin(step)*2*energy;
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
  path([['M',-2,-25],['Q',-14,-28,-11,-17],['Q',-9,-10,-4,-16],['Z']],'#3978bb','#193b60');path([['M',12,-25],['Q',22,-27,19,-15],['Q',16,-9,13,-17],['Z']],'#3978bb','#193b60');
  ellipse(5,-18,12,11,'#67b5ed','#193b60');ellipse(6,-20,6,6,'#f3f6e1','#264e76',1.4);ellipse(8,-20,2.6,3.6,'#233a61');ellipse(9,-21,1,1,'#fff');ellipse(11,-11,2,1.5,'#183858');
  ellipse(10,-11,4,2.8,'#a0d5ed',null);ellipse(12,-12,1.8,1.1,'#183858',null);path([['M',5,-8],['Q',8,-6,11,-8]],null,'#234768',1.2);
 }else if(type==='hamster'){
  ellipse(0,-14,20,20,'#8ad6e51c','#7fc3d4',1.6);ellipse(0,-14,Math.max(2,Math.abs(Math.cos(step*.3))*17),18,null,'#a3dce552',.8);
  ellipse(1,-11,10.5,13,'#c69762','#76523d',1.3);ellipse(2,-9,7.5,10,'#f4dfb5',null);
  ellipse(-5,-27,4.6,4.8,'#c69762','#76523d',1.2);ellipse(9,-27,4.6,4.8,'#c69762','#76523d',1.2);ellipse(-5,-27,2.7,2.9,'#e7afa2',null);ellipse(9,-27,2.7,2.9,'#e7afa2',null);
  ellipse(2,-19,11,9.5,'#dfb47b','#76523d',1.2);ellipse(-3.7,-15,5.3,5,'#f8e6bf',null);ellipse(7.7,-15,5.3,5,'#f8e6bf',null);
  ellipse(-2.4,-20,1.65,2,'#2a2528',null);ellipse(7,-20,1.65,2,'#2a2528',null);ellipse(-2.8,-20.7,.6,.7,'#fff4dd',null);ellipse(6.6,-20.7,.6,.7,'#fff4dd',null);
  path([['M',.5,-16.4],['Q',2.3,-18,4.1,-16.4],['L',2.3,-14.8],['Z']],'#cc8c86','#8b6258',.6);path([['M',2.3,-14.5],['L',2.3,-13],['M',-.5,-12.5],['Q',2.3,-11,5,-12.5]],null,'#845c4c',.7);rect(.8,-12.2,3,2.5,.7,'#fff6df','#b4916e',.5);
  path([['M',-6,-15],['L',-13,-17],['M',-6,-13],['L',-13,-12],['M',10,-15],['L',16,-17],['M',10,-13],['L',16,-12]],null,'#8e715b',.65);
  ellipse(-5,-6+leg,2.7,2.1,'#e0b89b','#93684f',.7);ellipse(8,-6-leg,2.7,2.1,'#e0b89b','#93684f',.7);ellipse(-4,1,3.5,1.8,'#dbad8b','#93684f',.7);ellipse(7,1,3.5,1.8,'#dbad8b','#93684f',.7);
  ellipse(0,-14,20,20,null,'#b0e3e9',1.1);path([['M',-12,-29],['Q',-18,-24,-17,-17]],null,'#efffffcc',2.5);path([['M',-13,-10],['Q',-13,-7,-11,-5]],null,'#e3faff88',1.3);path([['M',11,1],['Q',18,-5,17,-14]],null,'#ceeef6a0',1.2);
 }else if(type==='robot'){
  path([['M',0,-25],['L',0,-31]],null,'#a9bac3',1.5);ellipse(0,-32,2,2,'#e8957c','#534e61',1.1);rect(-12,-27,25,16,4,'#9aaeb8','#2c4058',1.6);rect(-8,-23,18,8,2,'#294b65','#2c4058',1.1);ellipse(-3,-19,2,2,'#a4e5e0',null);ellipse(5,-19,2,2,'#a4e5e0',null);rect(-9,-11,19,12,3,'#7b93a8','#2c4058',1.6);rect(-6,-7,6,4,1,'#d7c68d','#3c5666',1);ellipse(5,-5,1.8,1.8,'#e78f85',null);path([['M',-11,-9],['L',-16,-4+leg],['M',12,-9],['L',17,-4-leg]],null,'#a9bac3',3);rect(-10,-1+leg,8,4,1,'#3e5970');rect(4,-1-leg,8,4,1,'#3e5970');
 }else if(type==='alien'){
  path([['M',-4,-24],['Q',-8,-31,-3,-32]],null,'#87b881',2);ellipse(-3,-32,2,2,'#d6e2a0','#456c59',1.1);
  path([['M',-17,0],['Q',-20,-7,-12,-11],['Q',-15,-26,1,-27],['Q',16,-26,13,-11],['Q',23,-5,16,0],['L',8,-4],['Q',1,4,-6,-3],['Z']],'#8bc584','#335d56',1.6);ellipse(2,-18,7,8,'#e7efc7','#477467',1.2);ellipse(4,-18,3.3,4.3,'#304f65',null);ellipse(5,-20,1.2,1.2,'#f9fff4',null);path([['M',-2,-7],['Q',2,-4,7,-8]],null,'#477467',1.5);
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
 const fallen=pet.alive===false,progress=Math.min(1,pet.deathProgress||0),step=reducedMotion?0:(pet.steps||0)*.6,energy=reducedMotion||fallen?0:Math.max(0,Math.min(1,pet.motionEnergy??0));
 c.save();c.translate(pet.x,pet.y+12);c.scale(pet.dir||1,1);
 c.beginPath();c.ellipse(0,3,15,3,0,0,Math.PI*2);c.fillStyle='#0003';c.fill();
 if(fallen){c.globalAlpha*=1-progress;c.rotate(1.35*Math.min(1,progress*4));}
 else if(!reducedMotion)c.translate(0,pet.type==='ufo'?Math.sin(time*2.2+pet.ownerId)*1.5:-Math.abs(Math.sin(step))*1.2*energy);
 for(const s of petArt(pet.type,pet.color,step,energy)){
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
 sendMeetingChat(value){
  if(this.phase!=='meeting'||!this.meeting||this.meeting.result||typeof value!=='string')return false;
  const text=Array.from(value.replace(/[\u0000-\u001f\u007f]/g,' ').trim()).slice(0,160).join('');if(!text||(this.meeting.sentCount||0)>=24)return false;
  this.meeting.sentCount=(this.meeting.sentCount||0)+1;const ghost=!this.player.alive;
  this.meeting.lines.push({who:0,text,ghost,user:true});
  const candidates=this.crew.filter(c=>c.id!==0&&(ghost?!c.alive:c.alive));
  if(candidates.length){
   const mentioned=candidates.find(c=>text.toLowerCase().includes(c.name.toLowerCase())),speaker=mentioned||candidates[Math.floor(this.random()*candidates.length)],previous=this.meeting.lines.find(l=>l.who===speaker.id&&!l.ghost);
   let reply;
   if(ghost)reply='We can still help. Finish your remaining tasks; the living crew cannot read this chat.';
   else if(/\b(skip|evidence|proof)\b|跳过|证据|证明|スキップ|証拠|根拠/i.test(text))reply='Vote on what you actually saw. A vent alone could be an Engineer.';
   else if(/\b(where|room|location)\b|哪里|在哪|位置|どこ|場所|部屋/i.test(text)&&!speaker.imp)reply=`I was in ${this.roomAt(speaker.x,speaker.y)?.name||'the hallway'}. ${previous?.text.includes('saw')?'My earlier account is in the chat.':"I did not see the elimination."}`;
   else reply=previous?.text||'I have no new evidence. What did you see?';
   this.meeting.lines.push({who:speaker.id,text:reply,ghost});
  }
  this.emit('chat');return true;
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

