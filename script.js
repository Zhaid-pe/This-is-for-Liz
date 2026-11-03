/* ============================================
   PARA TI 💜 — Lógica principal
   ============================================ */

// ── Configuración (edita estos valores) ──────────────────────────
const CONFIG = {
  // 23 de septiembre de 2026 a las 3:50 PM 💜
  startDate: new Date(2026, 8, 23, 15, 50, 0),

  // Nombre para el título
  name: "Liz",
};
// ─────────────────────────────────────────────────────────────────

/* ══════════════════════════════════════════
   CONTADOR DE TIEMPO
══════════════════════════════════════════ */
function updateCounter() {
  const now = new Date();
  const diff = now - CONFIG.startDate;

  if (diff < 0) return; // fecha futura: no mostrar

  const totalMinutes = Math.floor(diff / 60000);
  const totalHours = Math.floor(diff / 3600000);
  const totalDays = Math.floor(diff / 86400000);

  const displayMinutes = totalMinutes % 60;
  const displayHours = totalHours % 24;

  document.getElementById("counter-days").textContent = totalDays.toLocaleString();
  document.getElementById("counter-hours").textContent = displayHours;
  document.getElementById("counter-minutes").textContent = displayMinutes;
}

updateCounter();
setInterval(updateCounter, 60000); // actualizar cada minuto

/* ══════════════════════════════════════════
   MODALES — Abrir / Cerrar
══════════════════════════════════════════ */
let currentModal = null;

function openModal(id) {
  // Cerrar el modal anterior si existe
  if (currentModal && currentModal !== id) {
    closeModal(currentModal, false);
  }

  const overlay = document.getElementById(id);
  if (!overlay) return;

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
  currentModal = id;

  if (id === "modal-carta") {
    renderCartaDia();
    startCartaCountdown();
  }

  // Accesibilidad: focus en el modal
  const win = overlay.querySelector(".modal-window");
  if (win) win.focus();

  // Cerrar con Escape
  document.addEventListener("keydown", handleEscKey);
}

function closeModal(id, restoreScroll = true) {
  const overlay = document.getElementById(id);
  if (!overlay) return;

  overlay.classList.remove("active");
  if (restoreScroll) {
    document.body.style.overflow = "";
    currentModal = null;
    document.removeEventListener("keydown", handleEscKey);
  }
}

function closeModalOnOverlay(event, id) {
  // Solo cerrar si se hizo clic en el fondo (overlay), no en el contenido
  if (event.target === event.currentTarget) {
    closeModal(id);
  }
}

function handleEscKey(e) {
  if (e.key === "Escape" && currentModal) {
    closeModal(currentModal);
  }
}

/* ══════════════════════════════════════════
   HEADER — Efecto al hacer scroll
══════════════════════════════════════════ */
const header = document.getElementById("site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}, { passive: true });

/* ══════════════════════════════════════════
   PARTÍCULAS FLOTANTES DE FONDO
══════════════════════════════════════════ */
function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  const colors = [
    "rgba(180, 111, 255, 0.6)",
    "rgba(224, 64,  251, 0.5)",
    "rgba(208, 170, 255, 0.4)",
    "rgba(157, 78,  221, 0.5)",
    "rgba(255, 200, 255, 0.35)",
  ];

  const count = 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    const size = Math.random() * 5 + 2;        // 2–7 px
    const left = Math.random() * 100;           // % horizontal
    const delay = Math.random() * 20;            // s de delay
    const dur = Math.random() * 15 + 12;       // 12–27 s
    const color = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      left:   ${left}%;
      bottom: -10px;
      background: ${color};
      animation-duration: ${dur}s;
      animation-delay:    -${delay}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;

    container.appendChild(p);
  }
}

createParticles();

/* ══════════════════════════════════════════
   ANIMACIÓN DE ENTRADA DE LAS TARJETAS
══════════════════════════════════════════ */
function initCardAnimations() {
  const cards = document.querySelectorAll(".exp-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = `fade-in-up 0.6s ${i * 0.12}s ease both`;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  cards.forEach((card) => observer.observe(card));
}

initCardAnimations();

/* ══════════════════════════════════════════
   ANIMACIÓN DE ENTRADA DE LOS ITEMS DEL MODAL
══════════════════════════════════════════ */
document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("transitionend", () => {
    if (overlay.classList.contains("active")) {
      const items = overlay.querySelectorAll(".reason-item, .letter, .memory-card");
      items.forEach((item, i) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(16px)";
        item.style.transition = `opacity 0.4s ${i * 0.08}s ease, transform 0.4s ${i * 0.08}s ease`;

        // Trigger reflow
        void item.offsetWidth;

        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      });
    }
  });
});

/* ══════════════════════════════════════════
   CARTA DEL DÍA — Base de Datos (Supabase)
   ══════════════════════════════════════════ */
const SUPABASE_URL = "https://kvzkkdtgvkavwofflmcq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ZhosuwnZN-IlykNJg9KvLQ_Ra6hIICa";

// Diccionario de cartas en memoria (inicia con respaldo local)
let CARTAS = {
  "2026-11-03": {
    texto: `Buen dia, bonita 💜

Como te dije por acá te escribiré todo lo que sentí del dia, q decir ksksksksk. Me has dado el mejor beso de mi vida, me has dado la esperanza de que podamos volver a estar juntos, y sobre todo por fin me has hecho saber que en verdad quieres estar conmigo más adelante, y el unico condicional es que estes más estable. No sabes cuanto me ilusiono eso, con decirte que tengo una sonrisa de idiota hasta ahora. Hoy como te dije no siento que te haya hablado todo lo que me gustaria y no sé como haré para aguantarme las ganas de escribirte, lo más probable es que te siga escribiendo pero sin escribirte; me entiendes?, con esto quiero decir que te voy a estar escribiendo bastante por acá en los otros apartados como en razones por las cuales me gustas o en cosas que no te dije. Mis manos todavia huelen un poquito a ti en lo que escribo esto y no sabes lo mucho que me gustaria tenerte cerca mientras te abrazo, te  como la boca o hablamos de cualquier cosa, porque hasta hablando de que nos vamos a alejar nos reimos DKSJDKSK, no sé, me parece interesante que hablar contigo hasta de un tema que me duele me pueda reir xd. Espero te estes sintiendo igual de bien que yo a comparación de ayer o el resto de los dias, porque por fin siento que no hay incertidumbre.`,
    firma: "— De loquito, para bonita 💜",
  },
  "2026-11-02": {
    texto: `Buenos dias, bonita 💜

Hoy fue raro todo, desde despertar hasta estar libre, intento no escribirte para darte espacio para pensar pero se me es muy complicado. Así que decidí ponerme a codear esta página para sentir como si estuviara cerca tuyo, para recordarte porque valdria la pena continuar, espero te guste esto, y que cada dia te pases por acá para ver la carta nueva jeje

Gracias por existir y por ser como eres.`,
    firma: "— De loquito, para bonita 💜",
  },
  "2026-11-01": {
    texto: `:C`,
    firma: "— ...",
  },
};

let cartasCargadas = false;

/** Descarga las cartas desde la base de datos de Supabase */
async function cargarCartasDesdeSupabase() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cartas?select=*&order=fecha.desc`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!res.ok) {
      console.warn("No se pudo conectar a Supabase. Se utilizarán las cartas locales.");
      return;
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const mapa = {};
      data.forEach((item) => {
        if (item.fecha && item.texto) {
          mapa[item.fecha] = {
            texto: item.texto,
            firma: item.firma || "— De loquito, para bonita 💜"
          };
        }
      });

      // Combinamos con las cartas existentes, teniendo prioridad las de Supabase
      CARTAS = { ...CARTAS, ...mapa };
      cartasCargadas = true;

      // Si el modal de la carta está abierto en este momento, actualizamos la vista
      const modal = document.getElementById("modal-carta");
      if (modal && modal.classList.contains("active")) {
        const todayKey = getTodayKey();
        mostrarCartaHoy();
        renderCartaHistory(todayKey);
      }
    }
  } catch (err) {
    console.warn("Error al consultar Supabase:", err);
  }
}

// Iniciar descarga en segundo plano desde el primer segundo
cargarCartasDesdeSupabase();

/** Devuelve la clave del día de hoy en formato "YYYY-MM-DD" */
function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Formatea una clave de fecha para mostrar al usuario */
function formatDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Muestra la carta de hoy en el panel principal */
function mostrarCartaHoy() {
  const todayKey = getTodayKey();
  const carta = CARTAS[todayKey];

  const display = document.getElementById("carta-display");
  const empty = document.getElementById("carta-empty");
  const textEl = document.getElementById("carta-text");
  const firmaEl = document.getElementById("carta-firma");
  const labelEl = document.getElementById("carta-paper-label");
  const dateLabel = document.getElementById("carta-date-label");
  const backBtn = document.getElementById("carta-back-today");

  if (dateLabel) dateLabel.textContent = formatDateKey(todayKey);
  if (labelEl) labelEl.textContent = "Para ti, hoy";

  if (carta) {
    display.classList.remove("hidden");
    empty.classList.add("hidden");
    textEl.textContent = carta.texto;
    firmaEl.textContent = carta.firma || "— Con todo mi cariño 💜";
  } else {
    display.classList.add("hidden");
    empty.classList.remove("hidden");
  }

  // Ocultar el botón de volver cuando ya estamos en hoy
  if (backBtn) backBtn.classList.add("hidden");

  // Quitar resaltado de cualquier item del historial
  document.querySelectorAll(".carta-history-item").forEach(el => el.classList.remove("active"));

  document.getElementById("modal-carta-win").scrollTo({ top: 0, behavior: "smooth" });
}

/** Renderiza la carta del día actual */
async function renderCartaDia() {
  const todayKey = getTodayKey();

  // Mostrar fecha en el header
  const dateLabel = document.getElementById("carta-date-label");
  if (dateLabel) {
    dateLabel.textContent = formatDateKey(todayKey);
  }

  mostrarCartaHoy();
  renderCartaHistory(todayKey);

  // Si aún no se cargaron de Supabase al abrir el modal, esperamos la respuesta
  if (!cartasCargadas) {
    await cargarCartasDesdeSupabase();
  }
}

/** Renderiza el historial de cartas anteriores */
function renderCartaHistory(todayKey) {
  const list = document.getElementById("carta-history-list");
  if (!list) return;

  // Ordenar fechas del más reciente al más antiguo, excluyendo hoy
  const pastKeys = Object.keys(CARTAS)
    .filter((k) => k < todayKey)
    .sort((a, b) => (a > b ? -1 : 1));

  list.innerHTML = "";

  if (pastKeys.length === 0) {
    list.innerHTML = `<p class="carta-history-empty">Aún no hay cartas anteriores 💜</p>`;
    return;
  }

  pastKeys.forEach((key) => {
    const carta = CARTAS[key];
    const item = document.createElement("div");
    item.className = "carta-history-item";
    item.id = `hist-${key}`;
    item.innerHTML = `
      <span class="carta-history-date">${formatDateKey(key)
        .replace(/^\w/, (c) => c.toUpperCase())
        .split(",")[0]}, ${key.split("-").reverse().slice(0, 2).join("/")}</span>
      <span class="carta-history-preview">${carta.texto}</span>
    `;

    // Al hacer clic en un historial, muestra esa carta en el panel principal
    item.addEventListener("click", () => {
      const textEl = document.getElementById("carta-text");
      const firmaEl = document.getElementById("carta-firma");
      const labelEl = document.getElementById("carta-paper-label");
      const display = document.getElementById("carta-display");
      const empty = document.getElementById("carta-empty");
      const dateLabel = document.getElementById("carta-date-label");
      const backBtn = document.getElementById("carta-back-today");

      display.classList.remove("hidden");
      empty.classList.add("hidden");
      textEl.textContent = carta.texto;
      firmaEl.textContent = carta.firma || "— Con todo mi cariño 💜";
      labelEl.textContent = formatDateKey(key);
      if (dateLabel) dateLabel.textContent = formatDateKey(key);

      // Mostrar el botón de volver a hoy
      if (backBtn) backBtn.classList.remove("hidden");

      // Resaltar el item seleccionado
      document.querySelectorAll(".carta-history-item").forEach(el => el.classList.remove("active"));
      item.classList.add("active");

      // Scroll al inicio del modal
      document.getElementById("modal-carta-win").scrollTo({ top: 0, behavior: "smooth" });
    });

    list.appendChild(item);
  });
}

/** Countdown hasta medianoche (cuando sale la próxima carta) */
let cartaCountdownInterval = null;

function startCartaCountdown() {
  function update() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);          // próxima medianoche
    const diff = midnight - now;

    const hh = Math.floor(diff / 3600000);
    const mm = Math.floor((diff % 3600000) / 60000);
    const ss = Math.floor((diff % 60000) / 1000);

    const setVal = (id, val, prev) => {
      const el = document.getElementById(id);
      if (!el) return val;
      const str = String(val).padStart(2, "0");
      if (el.textContent !== str) {
        el.textContent = str;
        el.classList.add("tick");
        setTimeout(() => el.classList.remove("tick"), 200);
      }
      return val;
    };

    setVal("cd-hours", hh);
    setVal("cd-mins", mm);
    setVal("cd-secs", ss);
  }

  update();
  clearInterval(cartaCountdownInterval);
  cartaCountdownInterval = setInterval(update, 1000);
}

// Iniciar el sistema cuando se abre el modal de carta
document.getElementById("modal-carta")?.addEventListener("transitionend", (e) => {
  if (e.target === e.currentTarget && e.currentTarget.classList.contains("active")) {
    renderCartaDia();
    startCartaCountdown();
  }
});

// Pausar el intervalo cuando se cierra
document.getElementById("modal-carta")?.addEventListener("transitionend", (e) => {
  if (e.target === e.currentTarget && !e.currentTarget.classList.contains("active")) {
    clearInterval(cartaCountdownInterval);
  }
});

console.log("💜 Para Ti — cargado con amor");
