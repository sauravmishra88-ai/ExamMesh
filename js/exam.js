const questions = [
  {q:"Which data structure is primarily used to implement a Breadth-First Search (BFS)?",o:["Stack","Queue","Heap","HashMap"]},
  {q:"What is the average time complexity of searching in a HashMap?",o:["O(1)","O(log n)","O(n)","O(n log n)"]},
  {q:"Which HTTP status code indicates a successful request?",o:["201","301","404","200"]},
  {q:"Which principle ensures that a system can continue operating when one component fails?",o:["Coupling","Resilience","Compilation","Inheritance"]},
  {q:"Which structure follows Last-In-First-Out (LIFO)?",o:["Queue","Graph","Stack","Heap"]}
];
let current=0, answers=JSON.parse(localStorage.getItem("examAnswers")||"{}");
let events=JSON.parse(localStorage.getItem("examEvents")||"[]");
let start=Number(localStorage.getItem("examStart")||Date.now());
localStorage.setItem("examStart",start);

if(localStorage.getItem("examSubmitted")==="true"){
  window.location.href="index.html";
}

function isOffline(){return localStorage.getItem("centralServer")==="OFFLINE"}
function hashText(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return ("00000000"+(h>>>0).toString(16)).slice(-8)}
function addEvent(q,a){
  const prev=events.length?events[events.length-1].hash:"00000000";
  const id="E"+String(events.length+1).padStart(3,"0");
  const payload=id+"|"+q+"|"+a+"|"+prev;
  const event={id,question:q,answer:a,previousHash:prev,hash:hashText(payload),timestamp:new Date().toISOString()};
  events.push(event); localStorage.setItem("examEvents",JSON.stringify(events));
}
function render(){
  const item=questions[current]; document.getElementById("questionNumber").textContent=String(current+1).padStart(2,"0");
  document.getElementById("questionText").textContent=item.q;
  document.getElementById("options").innerHTML=item.o.map((x,i)=>`<div class="option ${answers[current]===i?"selected":""}" data-i="${i}"><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${x}</span></div>`).join("");
  document.querySelectorAll(".option").forEach(el=>el.onclick=()=>select(Number(el.dataset.i)));
  document.getElementById("prevBtn").disabled=current===0;
  document.getElementById("nextBtn").textContent=current===questions.length-1?"Finish →":"Next →";
  document.getElementById("questionNav").innerHTML=questions.map((_,i)=>`<button class="${i===current?"current ":""}${answers[i]!==undefined?"answered":""}" data-q="${i}">${i+1}</button>`).join("");
  document.querySelectorAll(".question-nav button").forEach(b=>b.onclick=()=>{current=Number(b.dataset.q);render()});
  document.getElementById("answeredCount").textContent=Object.keys(answers).length+"/5";
  document.getElementById("pendingEvents").textContent=isOffline()?events.length:0;
  document.getElementById("saveText").textContent=isOffline()?"◷ Saved locally":"✓ Saved";
}
function select(i){
  answers[current]=i; localStorage.setItem("examAnswers",JSON.stringify(answers));
  addEvent(current+1,String.fromCharCode(65+i));
  render(); updateConnection();
}
function updateConnection(){
  const offline=isOffline(), banner=document.getElementById("continuityBanner"), state=document.getElementById("connectionState");
  banner.classList.toggle("hidden",!offline);
  state.innerHTML=offline?`<span class="dot" style="background:var(--orange)"></span><div><strong style="color:var(--orange)">Continuity Mode</strong><small>Response stored locally</small></div>`:`<span class="dot online"></span><div><strong>Connected</strong><small>Response securely synchronized</small></div>`;
}
document.getElementById("prevBtn").onclick=()=>{if(current>0){current--;render()}};
document.getElementById("nextBtn").onclick=()=>{
  if(current<questions.length-1){
    current++;
    render();
  } else {
    finishExam();
  }
};
function finishExam(){
  if(Object.keys(answers).length < questions.length){
    const remaining = questions.length - Object.keys(answers).length;
    if(!confirm(`You still have ${remaining} unanswered question(s). Submit the exam anyway?`)) return;
  } else {
    if(!confirm("Submit your examination? You will not be able to change answers after submission.")) return;
  }
  localStorage.setItem("examSubmitted","true");
  localStorage.setItem("examSubmittedAt",new Date().toISOString());
  localStorage.setItem("examStatus","SUBMITTED");
  document.body.innerHTML = `
    <header class="topbar">
      <a class="brand" href="index.html"><span class="brand-mark">E</span><span>Exam<span>Mesh</span></span></a>
      <div class="top-status"><span class="dot online"></span> Examination Submitted</div>
    </header>
    <main style="max-width:760px;margin:90px auto;padding:24px;text-align:center">
      <section class="glass-card" style="padding:48px 30px">
        <div style="width:70px;height:70px;border-radius:22px;margin:0 auto 20px;display:grid;place-items:center;background:#45d39c20;color:#45d39c;font-size:36px">✓</div>
        <div class="eyebrow">SUBMISSION CONFIRMED</div>
        <h1 style="font-size:38px;margin:10px 0">Examination Submitted</h1>
        <p style="color:var(--muted);max-width:520px;margin:0 auto 25px">
          Your examination state has been preserved. ExamMesh recorded the final candidate state successfully.
        </p>
        <div class="glass-card" style="padding:15px;text-align:left;margin:20px 0">
          <div class="state-line"><span>Candidate</span><strong>Saurav Mishra</strong></div>
          <div class="state-line"><span>Exam ID</span><strong>EXM-24017</strong></div>
          <div class="state-line"><span>Answered</span><strong>${Object.keys(answers).length}/5</strong></div>
          <div class="state-line"><span>Status</span><strong class="good">SUBMITTED</strong></div>
        </div>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <a class="btn btn-secondary" href="index.html">Back to Home</a>
          <a class="btn btn-primary" href="admin.html">Open Admin Dashboard →</a>
        </div>
      </section>
    </main>`;
  renderAdminSubmissionEvent();
}
function renderAdminSubmissionEvent(){
  let incidents=JSON.parse(localStorage.getItem("examIncidents")||"[]");
  incidents.push({
    time:new Date().toLocaleTimeString("en-IN",{hour12:false}),
    msg:"Candidate EXM-24017 submitted examination",
    type:"ok"
  });
  localStorage.setItem("examIncidents",JSON.stringify(incidents));
}
let elapsed=Math.floor((Date.now()-start)/1000), total=1800;
function tick(){let left=Math.max(0,total-elapsed++);let m=Math.floor(left/60),s=left%60;document.getElementById("timer").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;document.getElementById("timerProgress").style.width=(left/total*100)+"%"} setInterval(tick,1000);
window.addEventListener("storage",()=>{events=JSON.parse(localStorage.getItem("examEvents")||"[]");answers=JSON.parse(localStorage.getItem("examAnswers")||"{}");render();updateConnection()});
render();updateConnection();tick();
