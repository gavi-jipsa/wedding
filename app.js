const C = window.WEDDING;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const WEDDING_DATE = new Date(C.date);
const pad = (n) => String(n).padStart(2, "0");

/* ---------- utils ---------- */
const toast = (msg) => {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 1800);
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
window.sha256 = sha256; // 콘솔에서 비밀번호 해시 만들 때 사용

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
  }
}

/* 사진이 아직 없을 때 보여줄 빈 액자 */
function placeholder(label, w = 600, h = 800) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9e4d7"/><stop offset="1" stop-color="#dcd6c7"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" font-family="-apple-system,'Segoe UI',sans-serif" font-weight="200" font-size="${Math.round(w / 7)}" fill="#8d897d">${esc(label)}</text>
    <text x="50%" y="${h / 2 + w / 10}" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(w / 28)}" letter-spacing="8" fill="#8d897d" fill-opacity=".8">사진</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function setImg(img, src, label) {
  img.decoding = "async";
  img.draggable = false;
  img.onerror = () => { img.onerror = null; img.src = placeholder(label); };
  img.src = src;
}

/* ---------- 1. hero ---------- */
/* 이름 사이 기호 — 얇은 선 하나로 그린 하트 / 겹친 두 반지 */
const MARKS = {
  heart: `<svg viewBox="0 0 24 22" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M12 20 C 5 15, 1.5 11, 1.5 7 A 5 5 0 0 1 12 5 A 5 5 0 0 1 22.5 7 C 22.5 11, 19 15, 12 20 Z"/></svg>`,
  ring: `<svg viewBox="0 0 34 22" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="7.5"/><circle cx="22" cy="12" r="7.5"/><path d="M10 3.4 L12 1.2 L14 3.4" stroke-linejoin="round"/></svg>`,
  // 표지 일러스트처럼 연필로 두 번 그은 듯한 손그림 하트
  sketch: `<svg viewBox="0 0 24 22" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 20.5 C 5.5 15.8, 1.8 11.6, 2 7.4 C 2.2 4, 5 2, 7.6 2.3 C 9.8 2.6, 11.3 4.2, 12.1 6 C 12.9 4, 14.6 2.4, 16.9 2.3 C 19.8 2.2, 22.3 4.6, 22 7.8 C 21.7 11.9, 18 15.9, 12 20.5"/>
    <path d="M11.6 19.6 C 6 15.6, 2.7 11.8, 2.9 7.9 C 3.1 4.9, 5.4 3.1, 7.9 3.2 C 10 3.4, 11.3 5, 12 6.7 C 12.7 4.8, 14.3 3.2, 16.6 3.1 C 19.3 3, 21.3 5.1, 21.1 8.1 C 20.8 11.6, 17.8 15.3, 12.5 19.4" opacity=".55"/></svg>`,
  // 다섯 장 꽃잎 — 봄
  flower: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">${[0, 72, 144, 216, 288]
    .map((r) => `<ellipse cx="12" cy="6.6" rx="3" ry="4.4" transform="rotate(${r} 12 12)"/>`).join("")}<circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  // 클래식 앰퍼샌드
  amp: `<span class="amp">&amp;</span>`,
  // 이어진 두 고리 — 무한
  infinity: `<svg viewBox="0 0 30 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M15 8 C 12 3.5, 4.5 3.5, 4.5 8 C 4.5 12.5, 12 12.5, 15 8 C 18 3.5, 25.5 3.5, 25.5 8 C 25.5 12.5, 18 12.5, 15 8 Z"/></svg>`
};

function initHero() {
  const hero = $("#hero");
  $("#nGroom").textContent = C.groom.name;
  $("#nBride").textContent = C.bride.name;
  $("#heroHall").textContent = C.venue.hall;
  $("#datePlace").textContent = [C.venue.name, C.venue.floor, C.venue.hall].filter(Boolean).join(" ");
  $("#heroLine").textContent = C.heroLine;
  $("#heroKicker").textContent = C.heroKicker;

  const photo = $("#heroPhoto");
  photo.onerror = () => photo.parentElement.classList.add("empty");
  photo.src = C.heroPhoto;

  // 주소 뒤 옵션 (시안 비교용): ?mark=기호  ?nocover  ?cover
  const params = new URLSearchParams(location.search);

  // 이름 사이 기호
  const mark = (params.get("mark") || C.nameMark || "sketch").toLowerCase();
  $$(".mark").forEach((el) => { el.innerHTML = MARKS[mark] || MARKS.sketch; el.classList.add("mark-" + (MARKS[mark] ? mark : "sketch")); });

  // 손그림 표지: 누르거나 잠시 뒤 위로 스르륵 사라짐
  const open = () => hero.classList.add("open");
  $("#cover").addEventListener("click", open);
  if (params.has("nocover")) open();                          // 표지 없이 바로
  else if (!params.has("cover")) setTimeout(open, C.coverSeconds * 1000 || 3200);   // ?cover 면 표지 유지
}

/* ---------- 2. greeting ---------- */
function initGreeting() {
  $("#greetBody").textContent = C.greeting;
  const p = C.parents;
  const row = (side, child) => `
    <div class="row">
      <span>${esc(p[side].father)}</span><span class="dot">·</span><span>${esc(p[side].mother)}</span>
      <span class="rel">의 ${esc(p[side].relation)}</span>
      <span class="child">${esc(child)}</span>
    </div>`;
  $("#parents").innerHTML = row("groom", C.groom.name) + row("bride", C.bride.name);
}

/* ---------- 3. calendar + d-day ---------- */
function initCalendar() {
  const y = WEDDING_DATE.getFullYear(), m = WEDDING_DATE.getMonth(), d = WEDDING_DATE.getDate();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  let cells = "";
  for (let i = 0; i < first; i++) cells += "<span></span>";
  for (let i = 1; i <= days; i++) {
    const dow = (first + i - 1) % 7;
    cells += `<span class="${dow === 0 ? "sun" : ""} ${i === d ? "hl" : ""}">${i}</span>`;
  }
  $("#calendar").innerHTML = `
    <div class="cal-month">${y}년 ${m + 1}월</div>
    <div class="cal-head">${["일", "월", "화", "수", "목", "금", "토"].map((x) => `<span>${x}</span>`).join("")}</div>
    <div class="cal-grid">${cells}</div>`;

  const tick = () => {
    const now = new Date();
    const diff = WEDDING_DATE - now;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dday = Math.round((new Date(y, m, d) - today) / 86400000);
    if (diff > 0) {
      $("#cdD").textContent = Math.floor(diff / 86400000);
      $("#cdH").textContent = pad(Math.floor(diff / 3600000) % 24);
      $("#cdM").textContent = pad(Math.floor(diff / 60000) % 60);
      $("#cdS").textContent = pad(Math.floor(diff / 1000) % 60);
      $("#ddayText").innerHTML = dday > 0
        ? `${esc(C.groom.name)} · ${esc(C.bride.name)}의 결혼식까지 <b>${dday}</b>일`
        : `바로 오늘, 결혼합니다`;
    } else {
      $("#ddayClock").style.display = "none";
      $("#ddayText").textContent = "저희 결혼합니다. 함께해 주셔서 감사합니다.";
    }
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- 4. gallery : 가로 스와이프 + 크게 보기(핀치 줌) ---------- */
function initGallery() {
  const list = C.gallery, n = list.length;
  const track = $("#galTrack");
  track.innerHTML = list.map((_, i) => `<div class="gal-slide${i === 0 ? " on" : ""}" data-i="${i}"><div class="ph"><img alt="웨딩 사진 ${i + 1}" ${i > 1 ? 'loading="lazy"' : ""} /></div></div>`).join("");
  const slides = $$(".gal-slide", track);
  slides.forEach((s, i) => {
    setImg($("img", s), list[i], pad(i + 1));
    s.addEventListener("click", () => openViewer(i));
  });

  const current = (tr, items) => {
    const mid = tr.scrollLeft + tr.clientWidth / 2;
    let best = 0, bd = Infinity;
    items.forEach((el, i) => { const c = el.offsetLeft + el.offsetWidth / 2; const dd = Math.abs(c - mid); if (dd < bd) { bd = dd; best = i; } });
    return best;
  };
  const update = () => {
    const i = current(track, slides);
    slides.forEach((s, k) => s.classList.toggle("on", k === i));
    $("#galCount").textContent = `${pad(i + 1)} / ${pad(n)}`;
    $("#galBar").style.width = ((i + 1) / n) * 100 + "%";
  };
  track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  update();

  /* --- viewer --- */
  const viewer = $("#viewer"), vt = $("#vwTrack"), vc = $("#vwCount");
  let built = false, zooms = [];

  function build() {
    vt.innerHTML = list.map(() => `<div class="vw-slide"><img alt="" /></div>`).join("");
    $$(".vw-slide", vt).forEach((slide, i) => {
      const img = $("img", slide);
      setImg(img, list[i], pad(i + 1));
      zooms.push(attachZoom(slide, img));
    });
    vt.addEventListener("scroll", () => requestAnimationFrame(() => {
      const i = Math.round(vt.scrollLeft / (vt.clientWidth || 1));
      vc.textContent = `${pad(i + 1)} / ${pad(n)}`;
    }), { passive: true });
    built = true;
  }

  function openViewer(i) {
    if (!built) build();
    zooms.forEach((z) => z.reset());
    viewer.classList.add("open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    vt.style.scrollBehavior = "auto";
    vt.scrollLeft = i * vt.clientWidth;
    vc.textContent = `${pad(i + 1)} / ${pad(n)}`;
  }
  function closeViewer() {
    const i = Math.round(vt.scrollLeft / (vt.clientWidth || 1));
    viewer.classList.remove("open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // 보던 사진 위치로 본문 갤러리도 맞춰줌
    const s = slides[i];
    if (s) track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: "auto" });
  }
  $("#vwClose").addEventListener("click", closeViewer);
  document.addEventListener("keydown", (e) => {
    if (!viewer.classList.contains("open")) return;
    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowRight") vt.scrollBy({ left: vt.clientWidth, behavior: "smooth" });
    if (e.key === "ArrowLeft") vt.scrollBy({ left: -vt.clientWidth, behavior: "smooth" });
  });

  /* 두 손가락 핀치 줌 · 더블탭 줌 · 확대 중 드래그 이동 */
  function attachZoom(slide, img) {
    let s = 1, x = 0, y = 0, g = null, lastTap = 0, moved = false;
    const MAX = 4;
    const apply = (anim) => {
      img.style.transition = anim ? "transform .28s ease" : "none";
      img.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
      slide.classList.toggle("zoomed", s > 1.01);
      vt.style.overflowX = s > 1.01 ? "hidden" : "auto";
    };
    const clamp = () => {
      const mx = Math.max(0, (img.offsetWidth * s - slide.clientWidth) / 2);
      const my = Math.max(0, (img.offsetHeight * s - slide.clientHeight) / 2);
      x = Math.min(mx, Math.max(-mx, x));
      y = Math.min(my, Math.max(-my, y));
    };
    const reset = (anim) => { s = 1; x = 0; y = 0; apply(anim); };
    const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const toggle = (cx, cy) => {
      if (s > 1.01) return reset(true);
      const r = slide.getBoundingClientRect();
      s = 2.5;
      x = (r.left + r.width / 2 - cx) * (s - 1);
      y = (r.top + r.height / 2 - cy) * (s - 1);
      clamp(); apply(true);
    };

    slide.addEventListener("touchstart", (e) => {
      moved = false;
      if (e.touches.length === 2) g = { pinch: true, d: dist(e.touches), s, x, y };
      else if (e.touches.length === 1) g = { px: e.touches[0].clientX, py: e.touches[0].clientY, x, y };
    }, { passive: true });

    slide.addEventListener("touchmove", (e) => {
      if (!g) return;
      if (e.touches.length === 2) {
        if (!g.pinch) g = { pinch: true, d: dist(e.touches), s, x, y };
        e.preventDefault();
        const ns = Math.min(MAX, Math.max(1, g.s * dist(e.touches) / g.d));
        x = g.x * (ns / g.s); y = g.y * (ns / g.s); s = ns;
        clamp(); apply(false); moved = true;
      } else if (e.touches.length === 1 && !g.pinch && s > 1.01) {
        e.preventDefault();
        x = g.x + e.touches[0].clientX - g.px;
        y = g.y + e.touches[0].clientY - g.py;
        clamp(); apply(false); moved = true;
      } else if (e.touches.length === 1 && !g.pinch) {
        if (Math.abs(e.touches[0].clientX - g.px) > 8 || Math.abs(e.touches[0].clientY - g.py) > 8) moved = true;
      }
    }, { passive: false });

    slide.addEventListener("touchend", (e) => {
      if (e.touches.length === 1) { g = { px: e.touches[0].clientX, py: e.touches[0].clientY, x, y }; return; }
      if (e.touches.length > 0) return;
      if (s < 1.06) reset(true);
      if (!moved && e.changedTouches.length === 1) {
        const now = Date.now(), t = e.changedTouches[0];
        if (now - lastTap < 300) { e.preventDefault(); toggle(t.clientX, t.clientY); lastTap = 0; }
        else lastTap = now;
      }
      g = null;
    });

    // 데스크톱: 더블클릭 / Ctrl+휠 · 트랙패드 핀치
    slide.addEventListener("dblclick", (e) => toggle(e.clientX, e.clientY));
    slide.addEventListener("wheel", (e) => {
      if (!e.ctrlKey && s <= 1.01) return;
      e.preventDefault();
      s = Math.min(MAX, Math.max(1, s * (e.deltaY < 0 ? 1.12 : 0.89)));
      if (s <= 1.01) return reset(true);
      clamp(); apply(false);
    }, { passive: false });

    return { reset: () => reset(false) };
  }
}

/* ---------- 5. location + weather ---------- */
// 실제 위치 관계를 바탕으로 그린 약도 (송파대로 서측, 문정역 3번 출구에서 남쪽으로 도보 5분)
const MAP_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" role="img" aria-label="더컨벤션 송파문정 약도" style="display:block;width:100%;height:auto;background:#f3ecdc">
  <defs>
    <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#9a7b46" stroke-opacity=".35" stroke-width="1"/></pattern>
  </defs>
  <rect x="6" y="6" width="388" height="308" fill="none" stroke="#9a7b46" stroke-opacity=".5"/>
  <!-- 블록 -->
  <g fill="#e6dcc6" stroke="#b9a984" stroke-width=".8">
    <rect x="28" y="52" width="150" height="60" rx="2"/>
    <rect x="28" y="140" width="64" height="124" rx="2"/>
    <rect x="286" y="28" width="92" height="84" rx="2"/>
    <rect x="286" y="140" width="92" height="74" rx="2"/>
    <rect x="286" y="240" width="92" height="54" rx="2"/>
  </g>
  <!-- 도로 -->
  <g stroke="#fbf7ec" stroke-linecap="butt">
    <line x1="232" y1="6" x2="232" y2="314" stroke-width="40"/>
    <line x1="6" y1="126" x2="394" y2="126" stroke-width="18"/>
    <line x1="6" y1="280" x2="212" y2="280" stroke-width="12"/>
    <line x1="196" y1="136" x2="196" y2="274" stroke-width="10"/>
  </g>
  <line x1="232" y1="6" x2="232" y2="314" stroke="#c9b98f" stroke-width="1" stroke-dasharray="9 8"/>
  <!-- 예식장 -->
  <rect x="104" y="178" width="84" height="64" rx="2" fill="#2b241b"/>
  <rect x="108" y="182" width="76" height="56" fill="none" stroke="#c6a96f" stroke-width=".8"/>
  <text x="146" y="205" text-anchor="middle" font-size="12.5" fill="#f3ecdc" font-weight="700" letter-spacing=".5">더컨벤션</text>
  <text x="146" y="221" text-anchor="middle" font-size="11" fill="#f3ecdc">송파문정</text>
  <text x="146" y="234" text-anchor="middle" font-size="7.5" fill="#c6a96f" letter-spacing=".3">NH송파농협 11–13F</text>
  <!-- 문정역 -->
  <circle cx="232" cy="126" r="15" fill="#f3ecdc" stroke="#2b241b" stroke-width="1.4"/>
  <circle cx="232" cy="126" r="10.5" fill="#d86a94"/>
  <text x="232" y="130.5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="Georgia,serif">8</text>
  <text x="258" y="121" font-size="12.5" font-weight="700" fill="#2b241b">문정역</text>
  <text x="258" y="134" font-size="8.5" fill="#6b5f4f">8호선</text>
  <!-- 3번 출구 → 도보 -->
  <rect x="186" y="140" width="20" height="14" rx="2" fill="#9a7b46"/>
  <text x="196" y="150.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="#fff" font-family="Georgia,serif">3</text>
  <text x="180" y="150.5" text-anchor="end" font-size="9" fill="#6b5f4f">3번 출구</text>
  <path d="M196 156 V 208 H 190" fill="none" stroke="#6e2a25" stroke-width="1.6" stroke-dasharray="3 4" stroke-linecap="round"/>
  <path d="M192 204 l-5 4 l5 4" fill="none" stroke="#6e2a25" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="201" y="186" font-size="8.5" fill="#6e2a25" writing-mode="tb" letter-spacing="1">도보 5분</text>
  <!-- 주변 -->
  <g font-size="10" fill="#6b5f4f" text-anchor="middle">
    <text x="103" y="80">문정 업무지구</text>
    <text x="103" y="94" font-size="8.5">SK V1 · 엠스테이트</text>
    <text x="332" y="68">문정동</text>
    <text x="332" y="82">로데오거리</text>
    <!-- 법조타운: 예식장 바로 서쪽 -->
    <text x="60" y="190" font-size="9.5">문정</text>
    <text x="60" y="203" font-size="9.5">법조타운</text>
    <text x="60" y="219" font-size="7.8">동부지방법원</text>
    <text x="60" y="230" font-size="7.8">동부지방검찰청</text>
  </g>
  <g font-size="9.5" fill="#9a7b46" font-style="italic" font-family="Georgia,serif">
    <text x="232" y="24" text-anchor="middle" font-style="normal" font-size="9" font-family="inherit" fill="#6b5f4f">↑ 가락시장 · 잠실</text>
    <text x="232" y="306" text-anchor="middle" font-style="normal" font-size="9" font-family="inherit" fill="#6b5f4f">↓ 장지 · 가든파이브 · 복정</text>
  </g>
  <text x="262" y="230" font-size="9.5" fill="#9a7b46" letter-spacing="3" writing-mode="tb">송파대로</text>
  <!-- 방위 -->
  <g transform="translate(36,290)" stroke="#2b241b" fill="none" stroke-width="1"><circle r="11"/><path d="M0 8 V-8 M-4 -3 L0 -8 L4 -3"/></g>
  <text x="36" y="274" text-anchor="middle" font-size="8.5" fill="#2b241b" font-family="Georgia,serif">N</text>
</svg>`;

function initLocation() {
  const v = C.venue;
  $("#venueName").textContent = [v.name, v.floor, v.hall].filter(Boolean).join(" ");
  $("#venueAddr").innerHTML = `${esc(v.address)}<br />${esc(v.building)} · <a href="tel:${esc(v.tel.replace(/\D/g, ""))}">${esc(v.tel)}</a>`;
  $("#kakaoMapBtn").href = v.kakaoMap;
  $("#naverMapBtn").href = v.naverMap;
  const map = $("#mapImg");
  map.onerror = () => { map.outerHTML = MAP_SVG; };
  map.src = C.mapImage;
  // 버스처럼 노선이 여러 줄이면 '간선 | 번호들' 표로 정렬
  const busRows = (lines) => lines ? `<span class="bus">${lines.map(([k, nums]) => `<b>${esc(k)}</b><span>${esc(nums)}</span>`).join("")}</span>` : "";
  $("#transport").innerHTML = v.transport
    .map((t) => `<div><dt>${esc(t.label)}</dt><dd>${esc(t.text)}${busRows(t.lines)}${t.note ? `<small class="t-note">${esc(t.note)}</small>` : ""}</dd></div>`).join("");
  initWeather();
}

const W_ICON = {
  sun: `<circle cx="32" cy="32" r="11"/><path d="M32 8v7M32 49v7M8 32h7M49 32h7M15 15l5 5M44 44l5 5M49 15l-5 5M20 44l-5 5"/>`,
  partly: `<circle cx="23" cy="23" r="8"/><path d="M23 7v4M7 23h4M11.500 11.500l3 3M34.500 11.500l-3 3"/><path d="M24 48h22a9 9 0 0 0 0-18 12 12 0 0 0-23 3 7.500 7.500 0 0 0 1 15z"/>`,
  cloud: `<path d="M20 46h26a10 10 0 0 0 0-20 14 14 0 0 0-27 4 8 8 0 0 0 1 16z"/>`,
  rain: `<path d="M20 38h26a10 10 0 0 0 0-20 14 14 0 0 0-27 4 8 8 0 0 0 1 16z"/><path d="M24 45l-3 8M33 45l-3 8M42 45l-3 8"/>`,
  snow: `<path d="M20 36h26a10 10 0 0 0 0-20 14 14 0 0 0-27 4 8 8 0 0 0 1 16z"/><path d="M23 46v.01M33 44v.01M43 46v.01M28 53v.01M38 53v.01" stroke-width="3.500"/>`,
  fog: `<path d="M20 34h26a10 10 0 0 0 0-20 14 14 0 0 0-27 4 8 8 0 0 0 1 16z"/><path d="M14 42h36M18 49h28"/>`
};
const icon = (k) => `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${W_ICON[k]}</svg>`;

// WMO weather code → [아이콘, 설명, 비/눈 여부]
function wmo(code) {
  if (code === 0) return ["sun", "맑음"];
  if (code <= 2) return ["partly", "구름 조금"];
  if (code === 3) return ["cloud", "흐림"];
  if (code <= 48) return ["fog", "안개"];
  if (code <= 67) return ["rain", "비", "rain"];
  if (code <= 77) return ["snow", "눈", "snow"];
  if (code <= 82) return ["rain", "소나기", "rain"];
  if (code <= 86) return ["snow", "눈", "snow"];
  return ["rain", "뇌우", "rain"];
}
// 서울 월별 평년 기온(대략) [최고, 최저]
const CLIMATE = { 1: [2, -6], 2: [5, -3], 3: [11, 2], 4: [18, 8], 5: [24, 13], 6: [28, 18], 7: [29, 22], 8: [30, 23], 9: [26, 17], 10: [20, 10], 11: [12, 3], 12: [4, -3] };

async function initWeather() {
  const days = Math.ceil((WEDDING_DATE - new Date()) / 86400000);
  const month = WEDDING_DATE.getMonth() + 1;
  const ymd = `${WEDDING_DATE.getFullYear()}-${pad(month)}-${pad(WEDDING_DATE.getDate())}`;
  const temp = (lo, hi) => `${lo}°<small>/</small>${hi}°`;
  const tipFor = (lo, kind) =>
    kind === "rain" ? "비 소식이 있어요. 우산을 챙겨 오시면 좋겠습니다."
    : kind === "snow" ? "눈 소식이 있어요. 오시는 길 미끄러우니 조심히 오세요."
    : lo <= 0 ? "아침저녁으로 쌀쌀합니다. 따뜻한 외투를 준비해 주세요."
    : lo <= 10 ? "일교차가 있으니 가벼운 겉옷을 챙겨 주세요."
    : "야외 이동하기 좋은 날씨예요.";

  const showClimate = () => {
    const [hi, lo] = CLIMATE[month];
    $("#weatherMode").textContent = `${month}월 서울 평년 기온`;
    $("#weatherIcon").innerHTML = icon(lo <= 0 ? "snow" : "partly");
    $("#weatherTemp").innerHTML = temp(lo, hi);
    $("#weatherDesc").textContent = "최저 / 최고 · 예년 이맘때 기준";
    $("#weatherTip").textContent = `${tipFor(lo)} 예식 16일 전부터는 실제 예보로 바뀝니다.`;
  };

  if (days < 0 || days > 16) return showClimate();
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${C.venue.lat}&longitude=${C.venue.lng}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=temperature_2m` +
      `&timezone=Asia%2FSeoul&start_date=${ymd}&end_date=${ymd}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status);
    const j = await r.json(), d = j.daily;
    const [ic, desc, kind] = wmo(d.weather_code[0]);
    const lo = Math.round(d.temperature_2m_min[0]), hi = Math.round(d.temperature_2m_max[0]);
    const at = j.hourly?.temperature_2m?.[WEDDING_DATE.getHours()];
    $("#weatherMode").textContent = "예식 당일 예보";
    $("#weatherIcon").innerHTML = icon(ic);
    $("#weatherTemp").innerHTML = temp(lo, hi);
    $("#weatherDesc").textContent = `${desc} · 강수확률 ${d.precipitation_probability_max[0] ?? "-"}%` + (at != null ? ` · 예식 시간 ${Math.round(at)}°` : "");
    $("#weatherTip").textContent = tipFor(lo, kind);
  } catch {
    showClimate();
  }
}

/* ---------- 6. accounts ---------- */
const ICON_TEL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.500" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>`;
const ICON_SMS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.500" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.500"/><path d="M3.500 6.500L12 13l8.500-6.500"/></svg>`;

function initAccounts() {
  $$(".acc").forEach((box) => {
    const side = box.dataset.side;
    box.innerHTML = `
      <button class="acc-toggle">${side === "groom" ? "신랑측" : "신부측"} <span class="chev"></span></button>
      <div class="acc-body"><div>
        ${C.accounts[side].map((p) => {
          const tel = esc(p.tel.replace(/\D/g, "")), num = esc(p.account.replace(/\D/g, ""));
          return `
          <div class="person">
            <div class="person-top">
              <div class="person-name"><small>${esc(p.role)}</small>${esc(p.name)}</div>
              <div class="person-icons">
                <a class="icon-btn" href="tel:${tel}" aria-label="${esc(p.name)}에게 전화">${ICON_TEL}</a>
                <a class="icon-btn" href="sms:${tel}" aria-label="${esc(p.name)}에게 문자">${ICON_SMS}</a>
              </div>
            </div>
            <div class="person-acc">
              <div><span>${esc(p.bank)}</span><b class="num">${esc(p.account)}</b></div>
              <button class="copy-btn" data-num="${num}">복사</button>
            </div>
          </div>`;
        }).join("")}
      </div></div>`;
    $(".acc-toggle", box).addEventListener("click", () => box.classList.toggle("open"));
  });
  document.addEventListener("click", async (e) => {
    const b = e.target.closest(".copy-btn");
    if (!b) return;
    await copyText(b.dataset.num); // 하이픈 제거된 숫자만
    toast("계좌번호가 복사되었습니다");
  });
}

/* ---------- 7. photo share ---------- */
function initPhotoShare() {
  // 맨 아래 '감사합니다' 위 작은 사진
  const tp = $("#thanksPhoto");
  tp.onerror = () => tp.parentElement.classList.add("empty");
  tp.src = C.thanksPhoto;

  // 하객 공유 앨범 — 링크를 아직 안 넣었으면 안내만 띄움
  const btn = $("#googlePhotosBtn");
  if (C.googlePhotosUrl) btn.href = C.googlePhotosUrl;
  else btn.addEventListener("click", (e) => { e.preventDefault(); toast("공유 앨범은 예식 즈음에 열립니다"); });
}

/* ---------- 9. footer ---------- */
function initShare() {
  const pageUrl = location.href.split("#")[0];
  $("#copyLinkBtn").addEventListener("click", async () => { await copyText(pageUrl); toast("청첩장 주소가 복사되었습니다"); });

  $("#kakaoShareBtn").hidden = !C.kakao.jsKey;   // 카카오 키를 넣었을 때만 버튼 표시
  $("#kakaoShareBtn").addEventListener("click", () => {
    const k = C.kakao;
    if (!window.Kakao || !k.jsKey) return toast("카카오 키 설정 후 사용할 수 있어요");
    if (!Kakao.isInitialized()) Kakao.init(k.jsKey);
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: k.title,
        description: k.description,
        imageUrl: new URL(k.shareImage, pageUrl).href,
        imageWidth: 800,
        imageHeight: 1200,
        link: { mobileWebUrl: pageUrl, webUrl: pageUrl }
      },
      buttons: [
        { title: "청첩장 보기", link: { mobileWebUrl: pageUrl, webUrl: pageUrl } },
        { title: "게스트스냅", link: { mobileWebUrl: pageUrl + k.snapButtonPath, webUrl: pageUrl + k.snapButtonPath } }
      ]
    });
  });
}

/* ---------- 스크롤 등장 애니메이션 (섹션 안에서 차례로) ---------- */
function initReveal() {
  $$(".sec").forEach((sec) => $$(".rv", sec).forEach((el, i) => el.style.setProperty("--d", Math.min(i, 6) * 0.12 + "s")));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  $$(".rv").forEach((el) => io.observe(el));
}

initHero();
initGreeting();
initCalendar();
initGallery();
initLocation();
initAccounts();
initPhotoShare();
initShare();
initReveal();
