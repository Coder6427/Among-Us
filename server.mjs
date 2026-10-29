import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {WebSocketServer,WebSocket} from 'ws';
import {pathToFileURL} from 'node:url';
import {performance} from 'node:perf_hooks';
import {Hub} from './multiplayer.mjs';

export function createGameServer({port=Number(process.env.PORT)||3000,host='0.0.0.0'}={}){
 const hub=new Hub(),files=new Map([['/','index.html'],['/index.html','index.html'],['/practice','practice.html'],['/practice.html','practice.html']]);
 const server=http.createServer(async(req,res)=>{
  const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','Cache-Control':'no-store','Permissions-Policy':'camera=(), microphone=(), geolocation=()'};
  try{const url=new URL(req.url,'http://localhost');if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,headers).end();return;}if(url.pathname==='/health'){res.writeHead(200,{...headers,'Content-Type':'application/json'}).end(JSON.stringify({ok:true,rooms:hub.rooms.size,version:'2.0.0'}));return;}const file=files.get(url.pathname);if(!file){res.writeHead(404,headers).end('Not found');return;}const body=await readFile(new URL(file,import.meta.url));res.writeHead(200,{...headers,'Content-Type':'text/html; charset=utf-8','Content-Length':body.length});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(500,headers).end('The ship is restarting. Please retry.');}
 });
 const wss=new WebSocketServer({noServer:true,maxPayload:8192,perMessageDeflate:false});
 server.on('upgrade',(req,socket,head)=>{let url;try{url=new URL(req.url,'http://localhost');}catch{socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');socket.destroy();return;}const origin=req.headers.origin;let allowed=!origin;try{allowed=allowed||new URL(origin).host===req.headers.host;}catch{}if(url.pathname!=='/ws'||!allowed||wss.clients.size>=1500){socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');socket.destroy();return;}wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws,req));});
 wss.on('connection',ws=>{
  let member=null,count=0,windowAt=Date.now(),lastList=0;ws.isAlive=true;ws.on('pong',()=>ws.isAlive=true);const send=payload=>{if(ws.readyState===WebSocket.OPEN){if(ws.bufferedAmount>512*1024){ws.close(1013,'Connection too slow');return;}ws.send(JSON.stringify(payload));}};
  const authTimeout=setTimeout(()=>{if(!member)ws.close(1008,'Join handshake timed out');},10000);authTimeout.unref();
  ws.on('message',raw=>{let message;try{if(Date.now()-windowAt>1000){windowAt=Date.now();count=0;}if(++count>70)throw new Error('Too many actions. Slow down.');message=JSON.parse(raw.toString());if(!message||typeof message!=='object'||typeof message.op!=='string'||!message.data||typeof message.data!=='object'||Array.isArray(message.data))throw new Error('Invalid message.');if(!member){if(message.op!=='hello')throw new Error('Connect before joining a room.');member=hub.connect(send,message.data.token);clearTimeout(authTimeout);return;}if(message.op==='ping'){send({type:'pong',time:message.data.time});return;}if(message.op==='list'&&Date.now()-lastList<1000)throw new Error('Wait a moment before refreshing rooms.');if(message.op==='list')lastList=Date.now();const value=hub.command(member,message.op,message.data);if(message.id)send({type:'reply',id:message.id,ok:true,value:value||{},state:member.room?.snapshot(member)});if(message.op==='leave')send({type:'left'});}catch(e){if(message?.op!=='input'||message?.id)send({type:'reply',id:message?.id,ok:false,error:e.message||'Action unavailable.'});}});
  ws.on('close',()=>{clearTimeout(authTimeout);hub.disconnect(member);});ws.on('error',()=>{});
 });
 let previous=performance.now(),frames=0;const tick=setInterval(()=>{const now=performance.now(),dt=(now-previous)/1000;previous=now;hub.tick(dt);if(++frames%3===0)for(const m of hub.sessions.values())if(m.connected&&m.room)m.send({type:'state',state:m.room.snapshot(m)});},1000/30);
 const heartbeat=setInterval(()=>{for(const ws of wss.clients){if(!ws.isAlive){ws.terminate();continue;}ws.isAlive=false;ws.ping();}},15000);
 const close=()=>new Promise(resolve=>{clearInterval(tick);clearInterval(heartbeat);for(const ws of wss.clients){ws.send(JSON.stringify({type:'shutdown',message:'The server is restarting. Please rejoin shortly.'}));ws.terminate();}wss.close(()=>server.close(resolve));});
 return {hub,server,wss,close,listen:()=>new Promise(resolve=>server.listen(port,host,()=>resolve(server.address())))};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const app=createGameServer();await app.listen();console.log(`Orbital Crew Online listening on port ${app.server.address().port}`);let closing=false;const stop=async()=>{if(closing)return;closing=true;await app.close();process.exit(0);};process.on('SIGTERM',stop);process.on('SIGINT',stop);}
