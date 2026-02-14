// ====== Personaliza aquí ======
const CONFIG = {
  fecha: "San Valentín 2026",   // ej: "14 de febrero 2026"
  hora: "15:30",               // ej: "7:00 pm"
  firma: "Te espero mi amor ❤️" // ej: "Con amor, Aura 💌"
};
// ==============================

const screens = ["s1", "s2", "s3", "s4"];
const state = {
  plan: { title: "COMIDA", desc: "comer algo rico juntos 🍔" },
  place: { title: "AFUERA", desc: "afuera" },
};

function show(id){
  screens.forEach(s => document.getElementById(s).classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function updateFinal(){
  document.getElementById("dateText").textContent = CONFIG.fecha;
  document.getElementById("timeText").textContent = CONFIG.hora;
  document.getElementById("signatureText").textContent = CONFIG.firma;

  const summary = `Tenemos una cita <b>${state.place.desc}</b> a las <b>${CONFIG.hora}</b> para <b>${state.plan.desc}</b>.`;
  document.getElementById("summaryText").innerHTML = summary;
}

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Botón NO que se mueve
const noZone = document.getElementById("noZone");
const btnNo1  = document.getElementById("btnNo1");

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

// en celular: touchstart ayuda a que se mueva al tocar
btnNo1.addEventListener("mouseenter", dodgeNo);
btnNo1.addEventListener("touchstart", (e) => { e.preventDefault(); dodgeNo(); }, {passive:false});
btnNo1.addEventListener("click", dodgeNo);

// Sí de la primera pantalla
document.getElementById("btnYes1").addEventListener("click", () => show("s2"));

// Botones de elección
document.querySelectorAll(".pick").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.plan){
      state.plan.title = btn.dataset.plan;
      state.plan.desc  = btn.dataset.planDesc;
    }
    if (btn.dataset.place){
      state.place.title = btn.dataset.place;
      state.place.desc  = btn.dataset.placeDesc.toLowerCase();
    }
    const next = btn.dataset.next;
    if (next === "s4") updateFinal();
    show(next);
  });
});

// Reiniciar
document.getElementById("btnRestart").addEventListener("click", () => {
  state.plan = { title: "COMIDA", desc: "comer algo rico juntos 🍔" };
  state.place = { title: "AFUERA", desc: "afuera" };
  document.getElementById("copiedMsg").textContent = "";
  show("s1");
});

// Copiar texto para WhatsApp
document.getElementById("btnCopy").addEventListener("click", async () => {
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
    document.getElementById("copiedMsg").textContent = "✅ Copiado. Pegalo en WhatsApp.";
  }catch(e){
    document.getElementById("copiedMsg").textContent = "No pude copiar automático. Copiá el link de la barra y mandalo por WhatsApp.";
  }
});

// Inicial
updateFinal();
