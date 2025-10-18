/*
Karis Nemik's Manifesto Firware
Created by Diego J. Arevalo.
2023 v 1.1
*/
var _initialized = false;
var _running = false;

const offsetCookieName = 'offset';
const offsetDefaultValue = 100;

var _zoomValue = 100;
const zoomCookieName = 'zoom';
const zoomDefaultValue = 100;
const zoomMaxValue = 195;
const zoomMinValue = 5;
const zoomIncrement = 3;

// === Audio config: prefer local files on GitHub Pages (avoids https/http blocking) ===
const AudioLanguage = { English: 0, Spanish: 1 };
var _audioLanguage = "";
const audioLanguageDefaultValue = AudioLanguage.English;
const audioLanguageCookieName = 'audioLanguage';

// Local filenames at repo root (add spanish.mp3 if you want Spanish)
const englishAudioID = "english.mp3";
const spanishAudioID = "spanish.mp3"; // optional; only if present

function setup() {
    _initialized = true;
    setupZoom();
    setupDivManifestoOffset();
    createBars('bars', 'bar');
    createBars('barsDown', 'barDown');
    setupTableSymbol('black');
    document.getElementById('ManifestoMarqueeText').style.color = 'black';
    twInit();
    getAudioLanguage();
    setupAudioLanguage();
    wireOverlayControls();     // << overlay play/pause/restart
    pause();
}

function createBars(divTagName, innerDivTagName) {
    let divBars = document.getElementById(divTagName);
    for (let index = 0; index < 45; ++index) {
        let divBar = document.createElement("div");
        divBar.className = innerDivTagName;
        divBars.appendChild(divBar);
    }
}

function setupAudioLanguage() {
    const id = getAudioLanguageID();   // "english.mp3" or "spanish.mp3"
    const url = id;                    // relative path at repo root

    const nemiksManifestoAudioSource = document.getElementById('NemiksManifestoAudioSource');
    nemiksManifestoAudioSource.src = url;

    const nemiksManifestoAudio = document.getElementById('NemiksManifestoAudio');
    nemiksManifestoAudio.preload = 'auto';
    nemiksManifestoAudio.load();

    // When audio ends, mark playback stopped (overlay will restart from top on next tap)
    nemiksManifestoAudio.onended = onAudioEnded;
}

function getAudioLanguageID() {
    if (_audioLanguage == AudioLanguage.English) return englishAudioID;
    if (_audioLanguage == AudioLanguage.Spanish) return spanishAudioID;
    return englishAudioID;
}

function pause() {
    stopAnimation();
    document.getElementById('NemiksManifestoAudio').pause();
}

function setupTableSymbol(backgroundColor) {
    let tableSymbol = document.getElementById('TableSymbolA');
    tableSymbol.style.backgroundColor = backgroundColor;
    tableSymbol = document.getElementById('TableSymbolB');
    tableSymbol.style.backgroundColor = backgroundColor;
}

function setupDivManifestoOffset() {
    let divManifestoOffset = document.getElementById('DivManifestoOffset');
    offsetValue = getOffset();
    divManifestoOffset.style.marginTop = offsetValue + "px";
}

function startStop() { if (!_running) { start(); } else { pause(); } }

function start() {
    let color = 'rgb(145, 240, 249)';
    let manifestoMarqueeText = document.getElementById('ManifestoMarqueeText');
    manifestoMarqueeText.style.color = color;

    twStart();         // typewriter
    startScroll();     // dynamic scroll (fast in first half)

    document.getElementById('NemiksManifestoAudio').play();
    if (!_initialized) startAnimation(); else setTimeout(startAnimation, 500);
    setupTableSymbol(color);
    _running = true;
    _initialized = false;
}

function startAnimation() {
    let color = 'rgb(145, 240, 249)';
    document.getElementById('TableThinWindowCellDown').style.backgroundColor = color;
    let bars = document.getElementsByClassName("bars");
    for (let i = 0; i < bars.length; ++i) bars[i].style.display = 'block';
}

function stopAnimation() {
    twStop();
    stopScroll();
    document.getElementById('TableThinWindowCellDown').style.backgroundColor = 'black';
    let bars = document.getElementsByClassName("bars");
    for (let i = 0; i < bars.length; ++i) bars[i].style.display = 'none';
    _running = false;
}

function reset() { if (!_running) window.location.reload(); }

function setupZoom() {
    _zoomValue = getZoom();
    if (_zoomValue > zoomMaxValue) _zoomValue = zoomMaxValue;
    if (_zoomValue < zoomMinValue) _zoomValue = zoomMinValue;
    setZoomValue();
}
function getZoom() {
    let zoomValue = getCookie(zoomCookieName);
    if (zoomValue === "") zoomValue = zoomDefaultValue;
    return zoomValue;
}
function zoomOut() { _zoomValue += zoomIncrement; if (_zoomValue > zoomMaxValue) _zoomValue = zoomMaxValue; setZoomValue(); saveZoom(); }
function zoomIn()  { _zoomValue -= zoomIncrement; if (_zoomValue < zoomMinValue) _zoomValue = zoomMinValue; setZoomValue(); saveZoom(); }
function setZoomValue() { let v = _zoomValue + "%"; document.getElementById('zoom').innerText = v; document.body.style.zoom = v; }
function saveZoom() { setCookie(zoomCookieName, _zoomValue, 365); }

function loadSetup(){ loadOffsetSetup(); loadAudioLanguageSetup(); }
function loadOffsetSetup(){ document.getElementById(offsetCookieName).value = getOffset(); }
function saveOffset(){ setCookie(offsetCookieName, document.getElementById(offsetCookieName).value, 365); }
function resetOffset(){ document.getElementById(offsetCookieName).value = offsetDefaultValue; setCookie(offsetCookieName, offsetDefaultValue, 365); }
function getOffset(){ let v = getCookie(offsetCookieName); if (v === "") v = offsetDefaultValue; return v; }

function loadAudioLanguageSetup(){ getAudioLanguage(); document.getElementById(audioLanguageCookieName).value = _audioLanguage; }
function getAudioLanguage(){ _audioLanguage = getCookie(audioLanguageCookieName); if (_audioLanguage === "") _audioLanguage = AudioLanguage.English; }
function saveAudioLanguage(){ _audioLanguage = document.getElementById(audioLanguageCookieName).value; setCookie(audioLanguageCookieName, _audioLanguage, 365); }

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let list = decodedCookie.split(';');
    for (let i = 0; i < list.length; i++) {
        let c = list[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
function setCookie(cname, cvalue, exdays) {
    const date = new Date();
    date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/* ===================== Typewriter w/ dynamic first-half scroll ===================== */

/* Your tuned typing pace */
const TW_BASE_SPEED = 73.75;   // ms / char

/* Back-pressure skip list (lines that should never stall waiting for scroll) */
const SKIP_BACKPRESSURE_LINES = new Set([12, 13, 17, 22, 27, 28]);

/* Typewriter state */
let twNext = null;
let twParas = [];
let twLineIdx = 0;
let twCharIdx = 0;
let twVisibleLines = [];
let twLineNums = [];
let twMaxLines = 12;

/* === Dynamic SCROLL: fast in first half, normal in second === */
let scrollPos = 0;
const SCROLL_INTERVAL = 30;      // ms between increments
const SCROLL_STEP_FAST = 0.60;   // slightly faster first-half scroll
const SCROLL_STEP_SLOW = 0.32;   // second half scroll
let scrollTimer = null;

function getPlaybackProgress() {
  const a = document.getElementById('NemiksManifestoAudio');
  if (!a || !a.duration || !isFinite(a.duration) || a.duration <= 0) {
    // fallback to line-based progress if audio not ready
    const total = Math.max(1, twParas.length);
    return Math.min(1, twLineIdx / total);
  }
  return Math.min(1, a.currentTime / a.duration);
}

function desiredScrollStep(){
  const p = getPlaybackProgress();
  // “first half” is a bit generous (55%) to keep you ahead early
  return (p < 0.55) ? SCROLL_STEP_FAST : SCROLL_STEP_SLOW;
}

function startScroll(){
  if (scrollTimer) return;
  const m = document.getElementById('ManifestoMarqueeText');
  scrollTimer = setInterval(()=>{
    scrollPos += desiredScrollStep();
    m.scrollTop = scrollPos;
  }, SCROLL_INTERVAL);
}
function stopScroll(){
  if (scrollTimer){ clearInterval(scrollTimer); scrollTimer = null; }
}

/* --- init / render --- */
function twInit(){
  const src = document.getElementById('ManifestoSource');
  const out = document.getElementById('TypewriterOut');
  if(!src || !out) return;

  twParas = Array.from(src.querySelectorAll('p'))
            .map(p => p.innerHTML.split(/<br\s*\/?>/i).map(s=>s.trim()))
            .flat();

  const cell = document.getElementById('ManifestoMarqueeText');
  const lineHeight = parseFloat(getComputedStyle(cell).lineHeight || '70');
  const height = cell.clientHeight || 700;
  twMaxLines = Math.max(1, Math.floor(height / lineHeight)) + 2;

  twVisibleLines = [];
  twLineNums = [];
  twLineIdx = 0;
  twCharIdx = 0;

  scrollPos = 0;
  cell.scrollTop = 0;

  out.innerHTML = "";
  twRender();
}

function twRender(){
  const out = document.getElementById('TypewriterOut');
  if (!out) return;
  const n = twVisibleLines.length;
  out.innerHTML = twVisibleLines.map((ln,i)=>{
    const isLast = (i === n-1);
    const cursor = isLast ? '<span class="cursor"></span>' : '';
    const abs = twLineNums[i] || 0;
    return `<div class="twline line-${abs}" data-line="${abs}">${ln}${cursor}</div>`;
  }).join('');
}

/* --- helpers --- */
function twScheduleNext(delayMs){
  if (twNext) clearTimeout(twNext);
  twNext = setTimeout(twTick, Math.max(8, delayMs|0));
}

function twOverflowPixels(){
  const m = document.getElementById('ManifestoMarqueeText');
  const out = document.getElementById('TypewriterOut');
  if (!m || !out || !out.lastElementChild) return 0;
  if (m.scrollHeight <= m.clientHeight) return 0;
  const last = out.lastElementChild;
  const lastBottom = last.offsetTop + last.offsetHeight;
  const viewBottom = m.scrollTop + m.clientHeight;
  const SAFE = 6;
  return (lastBottom - (viewBottom - SAFE));
}

/* --- main tick --- */
function twTick(){
  // keep max visible lines synced
  const m = document.getElementById('ManifestoMarqueeText');
  const lh = parseFloat(getComputedStyle(m).lineHeight || '70');
  const newMax = Math.max(1, Math.floor((m.clientHeight || 700) / lh)) + 2;
  if(newMax !== twMaxLines) twMaxLines = newMax;

  const currentLineNo = twLineIdx + 1;

  // In FIRST HALF: do not apply back-pressure at all (go fast)
  // In SECOND HALF: apply gentle back-pressure to avoid overruns
  const inFirstHalf = (getPlaybackProgress() < 0.55);
  if (!inFirstHalf && !SKIP_BACKPRESSURE_LINES.has(currentLineNo)) {
    if (twVisibleLines.length >= twMaxLines) {
      const overflow = twOverflowPixels();
      if (overflow > 2) return twScheduleNext(10);
    }
  }

  if (twLineIdx >= twParas.length){ twStop(); return; }

  const line = twParas[twLineIdx];

  if (twCharIdx === 0){
    twVisibleLines.push("");
    twLineNums.push(currentLineNo);
    if (twVisibleLines.length > twMaxLines) { twVisibleLines.shift(); twLineNums.shift(); }
  }

  twVisibleLines[twVisibleLines.length - 1] += line.charAt(twCharIdx++);
  if (twCharIdx >= line.length){ twLineIdx++; twCharIdx = 0; }

  twRender();
  twScheduleNext(TW_BASE_SPEED);
}

function twStart(){ if (twNext) clearTimeout(twNext); twScheduleNext(TW_BASE_SPEED); }
function twStop(){ if (twNext){ clearTimeout(twNext); twNext = null; } }

/* ===================== Overlay controls & end handling ===================== */

function wireOverlayControls(){
  const overlay = document.getElementById('PlayPauseOverlay');
  if (!overlay) return;
  overlay.onclick = function () {
    const a = document.getElementById('NemiksManifestoAudio');
    if (a.ended) {
      restartFromBeginning();
    } else {
      startStop(); // toggle play/pause
    }
  };
}

function onAudioEnded(){
  // Audio finished; mark stopped so next overlay tap restarts from top
  twStop();
  stopScroll();
  _running = false;
}

function restartFromBeginning(){
  // Reset TW + scroll + audio and start fresh
  twInit();
  const a = document.getElementById('NemiksManifestoAudio');
  a.currentTime = 0;
  start(); // this calls twStart(), startScroll(), plays audio, shows bars
}
