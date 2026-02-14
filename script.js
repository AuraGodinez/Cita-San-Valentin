alert("JS NUEVO CARGADO ✅ v3");

// ====== Personaliza aquí ======
const CONFIG = {
  fecha: "San Valentín 2026",   // ej: "14 de febrero 2026"
  hora: "15:30",               // ej: "7:00 pm"
  firma: "Te espero mi amor ❤️" // ej: "Con amor, Aura 💌"
};
// ==============================

const screens = ["s1", "s2", "s3", "s4"];
const state = {
  plan: { title: "COMIDA", desc: "Comer algo rico juntos" },
  place: { title: "AFUERA", desc: "Afuera" },
};

function show(id){
  screens.forEach(s => document.getElementById(s)?.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
}

function updateFinal(){
  const dateEl = document.getElementById("dateText");
  const timeEl = document.getElementById("timeText");
  const signEl = document.getElementById("signatureText");
  const sumEl  = document.getElementById("summaryText");

  if (dateEl) dateEl.textContent = CONFIG.fecha;
  if (timeEl) timeEl.textContent = CONFIG.hora;
  if (signEl) signEl.textContent = CONFIG.firma;

  if (sumEl){
    sumEl.innerHTML = `Tenemos una cita <b>${state.place.desc}</b> a las <b>${CONFIG.hora}</b> para <b>${state.plan.desc}</b>.`;
  }
}

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Botón NO que se mueve (siempre seguro) ---
function setupNoButton(){
  const noZone = document.getElementById("noZone");
  const btnNo1 = document.getElementById("btnNo1");
  if (!noZone || !btnNo1) return;

  function dodgeNo(){
    const zone = noZone.getBoundingClientRect();
    const btn  = btnNo1.getBoundingClientRect();

    const maxX = zone.width - btn.width;
    const maxY = zone.height - btn.height;

    const x = randomInt(0, Math.max(0, Math.floor(maxX)));
    const y = randomInt(0, Math.max(0, Math.floor(maxY)));

    btnNo1.style.position = "absolute";
    btnNo1.style.left = `${x}px`;
    btnNo1.style.top  = `${y}px`;
  }

  btnNo1.addEventListener("mouseenter", dodgeNo);
  btnNo1.addEventListener("touchstart", (e) => { e.preventDefault(); dodgeNo(); }, {passive:false});
  btnNo1.addEventListener("click", dodgeNo);
}

function setupYesButton(){
  const yes = document.getElementById("btnYes1");
  if (!yes) return;
  yes.addEventListener("click", () => show("s2"));
}

function setupRestartCopy(){
  const restart = document.getElementById("btnRestart");
  const copy    = document.getElementById("btnCopy");
  const msg     = document.getElementById("copiedMsg");

  if (restart){
    restart.addEventListener("click", () => {
      state.plan = { title: "COMIDA", desc: "Comer algo rico juntos" };
      state.place = { title: "AFUERA", desc: "Afuera" };
      if (msg) msg.textContent = "";
      show("s1");
    });
  }

  if (copy){
    copy.addEventListener("click", async () => {
      const url = window.location.href;
      const text =
`💘 Invitación 💘
Fecha: ${CONFIG.fecha}
Hora: ${CONFIG.hora}
Plan: ${state.plan.title}
Lugar: ${state.place.title}

Abrí aquí: ${url}`;

      try{
        await navigator.clipboard.writeText(text);
        if (msg) msg.textContent = "✅ Copiado. Pegalo en WhatsApp.";
      }catch(e){
        if (msg) msg.textContent = "No pude copiar automático. Copiá el link de la barra y mandalo por WhatsApp.";
      }
    });
  }
}

// ✅ EVENT DELEGATION: un solo listener para TODOS los .pick
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".pick");
  if (!btn) return;

  // Plan (Comida/Película)
  if (btn.dataset.plan){
    state.plan.title = btn.dataset.plan;
    state.plan.desc  = btn.dataset.plandesc || btn.dataset.planDesc || state.plan.desc;
  }

  // Lugar (Afuera/En casa)
  if (btn.dataset.place){
    state.place.title = btn.dataset.place;
    state.place.desc  = btn.dataset.placedesc || btn.dataset.placeDesc || state.place.desc;
  }

  const next = btn.dataset.next;
  if (next === "s4") updateFinal();
  if (next) show(next);
});

// Inicialización
setupNoButton();
setupYesButton();
setupRestartCopy();
updateFinal();
