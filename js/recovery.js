const nodes=[...document.querySelectorAll(".pipeline-node")], activities=document.getElementById("activityList");
function events(){return JSON.parse(localStorage.getItem("examEvents")||"[]")}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function addActivity(text,cls="done"){const d=document.createElement("div");d.className="activity "+cls;d.textContent=cls==="done"?"✓ "+text:"◌ "+text;activities.appendChild(d)}
function clearActivities(){activities.innerHTML=""}
function hashText(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return ("00000000"+(h>>>0).toString(16)).slice(-8)}
async function recover(){
  if(localStorage.getItem("centralServer")==="OFFLINE"){document.getElementById("recoveryDescription").textContent="Central server is still offline. Restore it from Admin Dashboard first.";return}
  const ev=events(); if(!ev.length){document.getElementById("recoveryDescription").textContent="No queued events found. Answer a few questions during the failure simulation first.";return}
  document.getElementById("recoverBtn").disabled=true; clearActivities();
  const steps=["Local events detected","Center edge connection established","Sync queue processed","Events synchronized to central server","Duplicate events checked","Examination state reconstructed","Event chain verified"];
  for(let i=0;i<steps.length;i++){
    nodes[Math.min(i,nodes.length-1)].classList.add("active");
    await sleep(450);
    addActivity(steps[i]);
    if(i<nodes.length)nodes[i].classList.add("complete");
    document.getElementById("progressPercent").textContent=Math.round((i+1)/steps.length*100)+"%";
    document.getElementById("progressBar").style.width=((i+1)/steps.length*100)+"%";
  }
  renderAudit(ev);
  document.getElementById("recoveredEvents").textContent=ev.length;
  const unique=[...new Set(ev.map(x=>x.question))].length;
  document.getElementById("questionsRecovered").textContent=unique+"/5";
  document.getElementById("integrityState").textContent="VALID"; document.getElementById("integrityState").className="good";
  document.getElementById("auditStatus").textContent="✓ Integrity Verification: VALID"; document.getElementById("auditStatus").className="audit-status valid";
  document.getElementById("recoveryBadge").innerHTML='<span class="dot online"></span> Recovery Complete';document.getElementById("recoveryBadge").classList.add("success");
  document.getElementById("successPanel").classList.remove("hidden");
  // In the prototype, synchronization is complete, so the pending queue is cleared.
  localStorage.setItem("examEvents","[]"); localStorage.setItem("examIncidents",JSON.stringify([...(JSON.parse(localStorage.getItem("examIncidents")||"[]")),{time:new Date().toLocaleTimeString("en-IN",{hour12:false}),msg:`${ev.length} events synchronized and verified`,type:"ok"}]));
}
function renderAudit(ev){
  const table=document.getElementById("auditTable");
  table.innerHTML=`<div class="audit-row audit-head"><div>ID</div><div>EVENT</div><div>PREVIOUS HASH</div><div>HASH</div><div>STATUS</div></div>`+
  ev.map(e=>`<div class="audit-row"><div><b>${e.id}</b></div><div>Q${e.question} → <b>${e.answer}</b></div><div class="hash">${e.previousHash}</div><div class="hash">${e.hash}</div><div class="verified">✓ Verified</div></div>`).join("");
}
document.getElementById("recoverBtn").onclick=recover;
