import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getSessionExpiry, isSessionActive } from "../../../session-policy.mjs";
const SUPABASE_URL=Deno.env.get("SUPABASE_URL")!, SERVICE_KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, db=createClient(SUPABASE_URL,SERVICE_KEY);
const ALLOWED_ORIGIN="https://yarper.vercel.app";
const cors={"Access-Control-Allow-Origin":ALLOWED_ORIGIN,"Vary":"Origin","Access-Control-Allow-Headers":"content-type, x-yarper-token","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json","Cache-Control":"no-store"};
const BANK:Record<string,string[]>={questions:["What is one small thing I do that always makes you smile?","What memory of us would you replay if you could?","What should we try together before this year ends?","When do you feel closest to me?","What is one thing you appreciate about us?","What would your perfect day with me look like?","What song feels like us right now?","What silly habit of mine do you secretly love?"],challenges:["Give your partner three genuine compliments without repeating a word.","Hold eye contact for 30 seconds and try not to laugh.","Create a secret handshake in one minute.","Do your funniest impression of your partner.","Pick a song and dance together for 30 seconds.","Give each other a three-word pep talk.","Take a ridiculous couple selfie.","Invent a two-person victory celebration."],truth:["Truth: What first caught your attention about me?","Dare: Give your partner a dramatic movie-style compliment.","Truth: When do you feel most loved by me?","Dare: Let your partner choose your silly nickname for the next hour.","Truth: What is one dream you have for us?","Dare: Give a 10-second runway walk.","Truth: What is one thing you want more of in our relationship?","Dare: Make up a ridiculous couple slogan."],cards:["Finish this sentence: I knew we were special when…","Who is more dramatic? Defend your answer.","Choose one: movie night, food adventure, or late-night walk.","Name one thing you appreciate about your partner today.","Describe our relationship using three words.","Pick an emoji for our relationship today and explain it.","Who would survive longer in a zombie apocalypse?","Plan a tiny-budget surprise date in 60 seconds."],date:["Cozy night: snacks, blankets, music and five questions for each other.","Adventure night: choose somewhere neither of you has tried.","At-home luxury: dress up and turn dinner into a fancy date.","Memory lane: choose an old photo and retell the story behind it.","Chaos night: funny videos, snacks and silly challenges."]};
const DAILY=["Give each other one compliment you have never said before.","Spend five minutes talking with your phones face down.","Choose one song that represents your relationship today.","Tell your partner one thing you are looking forward to together.","Take one photo that captures today's mood."];
function json(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:cors})}
function randomCode(){const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let out="";crypto.getRandomValues(new Uint8Array(6)).forEach(n=>out+=chars[n%chars.length]);return out}
function randomToken(){const b=new Uint8Array(32);crypto.getRandomValues(b);return Array.from(b,x=>x.toString(16).padStart(2,"0")).join("")}
async function sha256(v:string){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v));return Array.from(new Uint8Array(d),x=>x.toString(16).padStart(2,"0")).join("")}
function cleanName(v:unknown){const n=String(v??"").trim().replace(/\s+/g," ");if(!n||n.length>40)throw Error("Enter a name between 1 and 40 characters.");return n}
function cleanCode(v:unknown){const c=String(v??"").trim().toUpperCase();if(!/^[A-Z2-9]{6}$/.test(c))throw Error("Enter the exact 6-character couple code.");return c}
async function allowAttempt(req:Request,action:"create"|"join"){
 const ip=(req.headers.get("cf-connecting-ip")||req.headers.get("x-real-ip")||(req.headers.get("x-forwarded-for")||"").split(",")[0]||"unknown").trim().slice(0,128);
 const key=await sha256(ip+"|yarper|"+action);
 const limit=action==="create"?5:15, windowSeconds=action==="create"?3600:600;
 const {data,error}=await db.rpc("consume_yarper_rate_limit",{p_key:key,p_action:action,p_limit:limit,p_window_seconds:windowSeconds});
 if(error)throw new Error("Security check unavailable. Please try again shortly.");
 return data===true;
}
function dayKey(){return new Date().toISOString().slice(0,10)}
async function memberFromToken(t:string){if(!t)throw Error("Your Yarper session is missing.");const h=await sha256(t),r=await db.from("yarper_members").select("*").eq("device_token_hash",h).maybeSingle();if(r.error||!r.data||!isSessionActive(r.data.token_expires_at,r.data.token_revoked_at))throw Error("Session expired or revoked. Join your couple again.");return r.data}
async function allowMemberAction(memberId:string,action:string){
 const limits:Record<string,{limit:number;windowSeconds:number}>={
  start_game:{limit:20,windowSeconds:600},
  advance_game:{limit:20,windowSeconds:600},
  answer_game:{limit:30,windowSeconds:600},
  react:{limit:60,windowSeconds:600},
  rename:{limit:10,windowSeconds:3600},
  complete_daily:{limit:5,windowSeconds:600},
  claim_streak:{limit:5,windowSeconds:600}
 };
 const policy=limits[action];if(!policy)return true;
 const key=await sha256(memberId+"|yarper|member|"+action);
 const {data,error}=await db.rpc("consume_yarper_rate_limit",{p_key:key,p_action:action,p_limit:policy.limit,p_window_seconds:policy.windowSeconds});
 if(error)throw new Error("Security check unavailable. Please try again shortly.");
 return data===true;
}
async function ensureState(cid:string){const r=await db.from("yarper_state").select("*").eq("couple_id",cid).maybeSingle();if(r.data){if(r.data.state_day!==dayKey()){await db.from("yarper_state").update({state_day:dayKey(),daily:DAILY[Math.floor(Math.random()*DAILY.length)],daily_done:false,streak_claimed:false,updated_at:new Date().toISOString()}).eq("couple_id",cid);return (await db.from("yarper_state").select("*").eq("couple_id",cid).single()).data}return r.data}return (await db.from("yarper_state").insert({couple_id:cid,daily:DAILY[Math.floor(Math.random()*DAILY.length)],state_day:dayKey()}).select("*").single()).data}
async function snapshot(member:any){const state=await ensureState(member.couple_id);const mr=await db.from("yarper_members").select("id,display_name,role,online,last_seen,created_at").eq("couple_id",member.couple_id).order("created_at");const list=(mr.data??[]).map((m:any)=>({id:m.id,display_name:m.display_name,role:m.role,online:Date.now()-new Date(m.last_seen).getTime()<9000,last_seen:m.last_seen}));const me=list.find((m:any)=>m.id===member.id),partner=list.find((m:any)=>m.id!==member.id)||null;const game=(await db.from("yarper_game_sessions").select("*").eq("couple_id",member.couple_id).order("created_at",{ascending:false}).limit(1).maybeSingle()).data;const history=(await db.from("yarper_game_sessions").select("*").eq("couple_id",member.couple_id).order("created_at",{ascending:false}).limit(20)).data??[];const reactions=(await db.from("yarper_reactions").select("*").eq("couple_id",member.couple_id).order("created_at",{ascending:false}).limit(50)).data??[];const cr=await db.from("yarper_couples").select("code").eq("id",member.couple_id).single();return {couple_id:member.couple_id,code:cr.data?.code??null,connected:list.length===2,member_count:list.length,me,partner,state,game,history,reactions}}
Deno.serve(async req=>{
 const origin=req.headers.get("origin");
 if(origin&&origin!==ALLOWED_ORIGIN)return json({error:"Origin not allowed."},403);
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
 if(req.method!=="POST")return json({error:"Method not allowed."},405);
 if(!req.headers.get("content-type")?.toLowerCase().includes("application/json"))return json({error:"Content-Type must be application/json."},415);
 try{
 const rawBody=await req.text();
 if(rawBody.length>8192)return json({error:"Request is too large."},413);
 let body:any;try{body=JSON.parse(rawBody)}catch{return json({error:"Invalid JSON request."},400)}
 if(!body||typeof body!=="object"||Array.isArray(body))return json({error:"Invalid request body."},400);
 const action=String(body.action||"");
if(action==="create"){if(!(await allowAttempt(req,"create")))return json({error:"Too many couple creation attempts. Please try again later."},429);const name=cleanName(body.name);let couple:any=null;for(let i=0;i<8&&!couple;i++){const r=await db.from("yarper_couples").insert({code:randomCode()}).select("*").single();if(!r.error)couple=r.data}if(!couple)throw Error("Could not create a couple code. Please try again.");const token=randomToken(),hash=await sha256(token),r=await db.from("yarper_members").insert({couple_id:couple.id,device_token_hash:hash,display_name:name,role:"player1",online:true,last_seen:new Date().toISOString(),token_expires_at:getSessionExpiry(),token_revoked_at:null}).select("id,display_name,role,online,last_seen").single();if(r.error)throw r.error;await ensureState(couple.id);return json({token,code:couple.code,...await snapshot(r.data)})}
if(action==="join"){
 if(!(await allowAttempt(req,"join")))return json({error:"Too many join attempts. Please try again in a few minutes."},429);
 const name=cleanName(body.name),code=cleanCode(body.code),token=randomToken(),hash=await sha256(token);
 const joined=await db.rpc("join_yarper_couple",{p_code:code,p_display_name:name,p_device_token_hash:hash});
 if(joined.error){
  const message=joined.error.message||"Could not join this couple.";
  if(joined.error.code==="P0002"||message.includes("COUPLE_NOT_FOUND"))return json({error:"That couple code does not exist."},404);
  if(message.includes("COUPLE_FULL"))return json({error:"This couple is already full."},409);
  if(joined.error.code==="23505")return json({error:"This device or couple slot has already been used."},409);
  if(joined.error.code==="22023")return json({error:"Check the couple code and your name, then try again."},400);
  throw new Error("Could not complete the join securely. Please try again.");
 }
 const member=joined.data;
 await ensureState(member.couple_id);
 return json({token,code:member.code,...await snapshot(member)});
}
if(action==="revoke_session"){const sessionToken=String(req.headers.get("x-yarper-token")||"");if(!sessionToken)return json({ok:true});const tokenHash=await sha256(sessionToken),revoked=await db.from("yarper_members").update({token_revoked_at:new Date().toISOString(),online:false,last_seen:new Date().toISOString()}).eq("device_token_hash",tokenHash).is("token_revoked_at",null);if(revoked.error)throw new Error("Could not revoke this session. Please try again.");return json({ok:true})}
const member=await memberFromToken(String(req.headers.get("x-yarper-token")||""));
const rateLimited=await allowMemberAction(member.id,action);
if(!rateLimited)return json({error:"Too many requests. Please wait before trying again.",retry_after_seconds:60},429);
if(action==="me"||action==="heartbeat"){const now=new Date().toISOString();await db.from("yarper_members").update({online:true,last_seen:now,token_expires_at:getSessionExpiry(Date.parse(now))}).eq("id",member.id);return json(await snapshot((await db.from("yarper_members").select("*").eq("id",member.id).single()).data))}
if(action==="rename"){const name=cleanName(body.name);await db.from("yarper_members").update({display_name:name,last_seen:new Date().toISOString(),online:true}).eq("id",member.id);return json(await snapshot((await db.from("yarper_members").select("*").eq("id",member.id).single()).data))}
if(action==="start_game"){const mode=String(body.mode||"questions"),question=String(body.question||"").trim();if(!BANK[mode]||!question||question.length>300)throw Error("Invalid game prompt.");const shared=await db.from("yarper_state").select("current_turn,picker_ready").eq("couple_id",member.couple_id).single();if(shared.error)throw new Error("Could not check whose turn it is.");if(shared.data.current_turn!==member.role)return json({error:"It is your partner’s turn to choose the next prompt."},403);if(shared.data.picker_ready===false){const latest=await db.from("yarper_game_sessions").select("id,status").eq("couple_id",member.couple_id).order("created_at",{ascending:false}).limit(1).maybeSingle();if(latest.error)throw new Error("Could not check the previous round.");if(latest.data?.status==="answered")return json({error:"Tap Next on the completed round before choosing again."},409);}const open=await db.from("yarper_game_sessions").select("id,status").eq("couple_id",member.couple_id).eq("status","waiting").maybeSingle();if(open.error)throw new Error("Could not check the current round. Please try again.");if(open.data)return json({error:"Finish the current round first."},409);const created=await db.from("yarper_game_sessions").insert({couple_id:member.couple_id,game_mode:mode,question,selected_by:member.role,status:"waiting"});if(created.error){if(created.error.code==="23505")return json({error:"A round was just started. Finish the current round first."},409);throw new Error("Could not start the round. Please try again.");}const turnUpdate=await db.from("yarper_state").update({current_turn:member.role==="player1"?"player2":"player1",picker_ready:false,updated_at:new Date().toISOString()}).eq("couple_id",member.couple_id);if(turnUpdate.error)throw new Error("The round started, but turn status could not be updated. Refresh to sync.");return json(await snapshot(member))}
if(action==="advance_game"){const latest=await db.from("yarper_game_sessions").select("id,status").eq("couple_id",member.couple_id).order("created_at",{ascending:false}).limit(1).maybeSingle();if(latest.error||!latest.data||latest.data.status!=="answered")return json({error:"Complete the current round before moving on."},409);const ready=await db.from("yarper_state").update({picker_ready:true,updated_at:new Date().toISOString()}).eq("couple_id",member.couple_id);if(ready.error)throw new Error("Could not sync the next turn. Please try again.");return json(await snapshot(member))}
if(action==="answer_game"){const gameId=String(body.game_id||""),answer=String(body.answer||"").trim();if(!gameId||!answer||answer.length>1000)throw Error("Write a response first.");const result=await db.rpc("yarper_answer_game",{p_game_id:gameId,p_couple_id:member.couple_id,p_role:member.role,p_answer:answer});if(result.error){const message=result.error.message||"";if(message.includes("ROUND_NOT_WAITING"))return json({error:"That round is no longer waiting."},409);if(message.includes("SELECTING_PLAYER_CANNOT_ANSWER"))return json({error:"Your partner needs to answer this round."},403);if(message.includes("INVALID_ANSWER"))return json({error:"Write a valid response first."},400);throw new Error("Could not save your answer securely. Please try again.");}return json(await snapshot(member))}
if(action==="react"){const gameId=String(body.game_id||""),emoji=String(body.emoji||"");if(!["❤️","😂","🔥","🥰","😏","👀","👏","💚"].includes(emoji))throw Error("Reaction not available.");if(!(await db.from("yarper_game_sessions").select("id").eq("id",gameId).eq("couple_id",member.couple_id).maybeSingle()).data)throw Error("Round not found.");const saved=await db.from("yarper_reactions").insert({couple_id:member.couple_id,game_id:gameId,by_role:member.role,emoji});if(saved.error)throw new Error("Could not save your reaction. Please try again.");return json(await snapshot(member))}
if(action==="complete_daily"){const result=await db.rpc("yarper_complete_daily",{p_couple_id:member.couple_id});if(result.error)throw new Error("Could not complete the daily reward securely. Please try again.");return json(await snapshot(member))}
if(action==="claim_streak"){const result=await db.rpc("yarper_claim_streak",{p_couple_id:member.couple_id});if(result.error)throw new Error("Could not claim the streak reward securely. Please try again.");return json(await snapshot(member))}
if(action==="snapshot")return json(await snapshot(member));return json({error:"Unknown action."},400)}catch(e){return json({error:e instanceof Error?e.message:"Something went wrong."},500)}});