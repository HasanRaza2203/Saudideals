import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(__dirname,'..');
const dataDir=path.join(__dirname,'data');
const dashboardDir=path.join(__dirname,'dashboard');
const statePath=path.join(dataDir,'state.json');
const activityPath=path.join(dataDir,'activity.json');
const agentsPath=path.join(__dirname,'agents','registry.json');
const port=4310;

const readJson=(p,fallback)=>{try{return JSON.parse(fs.readFileSync(p,'utf8'))}catch{return fallback}};
const writeJson=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2));
const now=()=>new Date().toISOString();
const activities=()=>readJson(activityPath,[]);
const log=(agent,message,status='ok')=>{
  const rows=activities(); rows.unshift({time:now(),agent,message,status});
  writeJson(activityPath,rows.slice(0,300));
};const setState=(mutate)=>{const s=readJson(statePath,{}); mutate(s); s.updatedAt=now(); writeJson(statePath,s);};
const runGitStatus=()=>new Promise(resolve=>{
  execFile('C:\\Program Files\\Git\\cmd\\git.exe',['status','-sb'],{cwd:root},(err,stdout)=>{
    const text=(stdout||err?.message||'').trim();
    log('dev',`Repository check: ${text||'clean'}`,err?'warn':'ok');
    setState(s=>{s.system=s.system||{};s.system.git=text||'clean';}); resolve();
  });
});

async function checkWebsite(){
  try{
    const r=await fetch('https://hasanraza2203.github.io/Saudideals/',{redirect:'follow'});
    const body=await r.text();
    const healthy=r.ok && /SaudiDeals/i.test(body);
    log('qa',`Public website ${healthy?'healthy':'unexpected'} (${r.status})`,healthy?'ok':'warn');
    setState(s=>{s.system=s.system||{};s.system.website={healthy,status:r.status,lastChecked:now()};});
  }catch(e){
    log('security',`Website health check failed: ${e.message}`,'error');
    setState(s=>{s.system=s.system||{};s.system.website={healthy:false,error:e.message,lastChecked:now()};});
  }
}

function refreshAgentState(){
  const agents=readJson(agentsPath,[]);
  setState(s=>{s.agents=agents.length;s.departments=new Set(agents.map(a=>a.department)).size;s.active=agents.filter(a=>a.auto).length;});
}function seedWork(){
  setState(s=>{s.work=[
    {department:'Executive & Operations',task:'Coordinate autonomous daily plan',status:'ACTIVE',owner:'CEO Orchestrator'},
    {department:'Engineering & IT',task:'Monitor repository and deployment readiness',status:'ACTIVE',owner:'Lead Developer'},
    {department:'Quality Assurance',task:'Monitor public website health',status:'ACTIVE',owner:'QA Lead'},
    {department:'Affiliate & Merchant Partnerships',task:'Track merchant/API approval blockers',status:'ACTIVE',owner:'Affiliate Manager'},
    {department:'Marketing & Growth',task:'Maintain launch-growth backlog',status:'ACTIVE',owner:'Growth Manager'},
    {department:'Finance & Accounting',task:'Maintain revenue/expense readiness',status:'ACTIVE',owner:'Finance Controller'}
  ];});
}

function contentType(p){
  if(p.endsWith('.html'))return 'text/html; charset=utf-8';
  if(p.endsWith('.js'))return 'text/javascript; charset=utf-8';
  if(p.endsWith('.json'))return 'application/json; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

function sendJson(res,obj,code=200){res.writeHead(code,{'content-type':'application/json; charset=utf-8'});res.end(JSON.stringify(obj));}
function serveFile(res,p){
  if(!fs.existsSync(p)){res.writeHead(404);return res.end('Not found');}
  res.writeHead(200,{'content-type':contentType(p),'cache-control':'no-store'});res.end(fs.readFileSync(p));
}const server=http.createServer(async(req,res)=>{
  const u=new URL(req.url,'http://localhost');
  if(u.pathname==='/api/state') return sendJson(res,readJson(statePath,{}));
  if(u.pathname==='/api/agents') return sendJson(res,readJson(agentsPath,[]));
  if(u.pathname==='/api/activity') return sendJson(res,activities());
  if(u.pathname==='/api/run-checks' && req.method==='POST'){
    await Promise.all([runGitStatus(),checkWebsite()]); refreshAgentState();
    return sendJson(res,{ok:true,ranAt:now()});
  }
  if(u.pathname==='/') return serveFile(res,path.join(dashboardDir,'index.html'));
  return serveFile(res,path.join(dashboardDir,u.pathname.replace(/^\//,'')));
});

async function cycle(){
  refreshAgentState();
  await Promise.all([runGitStatus(),checkWebsite()]);
  log('ops','Automatic operating cycle completed');
}

if(!fs.existsSync(activityPath)) writeJson(activityPath,[]);
seedWork(); refreshAgentState(); cycle();
setInterval(cycle,5*60*1000);
server.listen(port,'127.0.0.1',()=>{
  log('ceo',`SaudiDeals AI Office started on http://127.0.0.1:${port}`);
  console.log(`SaudiDeals AI Office running at http://127.0.0.1:${port}`);
});