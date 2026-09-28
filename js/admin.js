const centralStatus=document.getElementById("centralStatus"), centralCard=document.getElementById("centralCard");
const pendingMetric=document.getElementById("pendingMetric"), eventStoreState=document.getElementById("eventStoreState");
const incidentLog=document.getElementById("incidentLog"), incidentCount=document.getElementById("incidentCount");
let incidents=JSON.parse(localStorage.getItem("examIncidents")||"[]");
function offline(){return localStorage.getItem("centralServer")==="OFFLINE"}
function events(){return JSON.parse(localStorage.getItem("examEvents")||"[]")}
function time(){return new Date().toLocaleTimeString("en-IN",{hour12:false})}
function log(msg,type="warn"){
  incidents.push({time:time(),msg,type}); localStorage.setItem("examIncidents",JSON.stringify(incidents)); render();
}
function render(){
  const off=offline(), count=events().length;
  centralStatus.textContent=off?"OFFLINE":"ONLINE"; centralStatus.className=off?"bad":"good";
  centralCard.style.borderColor=off?"#ff687455":"#45d39c22";
  document.getElementById("centralDetail").textContent=off?"Central infrastructure unavailable":"Primary infrastructure available";
  pendingMetric.textContent=off?count:0;
  eventStoreState.textContent=count?`${count} QUEUED`:"EMPTY";
  eventStoreState.className=count?"bad":"good";
  incidentCount.textContent=incidents.length+" events";
  incidentLog.innerHTML=incidents.length?incidents.slice().reverse().map(x=>`<div class="log-row"><time>${x.time}</time><span class="sev">●</span><span>${x.msg}</span></div>`).join(""):`<div class="empty-log">No incidents. System operating normally.</div>`;
  document.getElementById("controlMessage").textContent=off?"Failure active. Candidate sessions are continuing through local continuity storage.":"System is operating normally.";
}
document.getElementById("failureBtn").onclick=()=>{
  if(offline())return;
  localStorage.setItem("centralServer","OFFLINE");
  log("Central server unavailable");
  setTimeout(()=>log("Continuity mode activated"),200);
  setTimeout(()=>log("Candidate events queued"),500);
  render();
};
document.getElementById("restoreBtn").onclick=()=>{
  if(!offline())return;
  localStorage.setItem("centralServer","ONLINE");
  log("Central server restored");
  document.getElementById("lastSync").textContent="Restored just now";
  render();
};
window.addEventListener("storage",render); render();
