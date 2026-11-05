'use strict';
const $ = id => document.getElementById(id);
const ui = Object.fromEntries(['score','streak','round','pause','arena','context','trail','word','overlay','overlayTitle','overlayText','start','route','path','question','particles','targets','feedback','modes','levels','speeds','levelHint','speedHint','effects','sound','guide','help'].map(id => [id,$(id)]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let mode = 'catch', level = 0, speed = reduceMotion.matches ? 0 : 1, sound = true, audio;
let state = 'idle', deck = [], index = 0, points = 0, streak = 0, hits = 0, step = 0;
let elapsed = 0, frame = 0, last = 0, nextTimer, drag = null, dropAnimation;
const roundSize = 10;
const hint = {
  catch: 'Korb anklicken, Wort hineinziehen oder 1–5 drücken.',
  route: 'Wähle an jeder Weiche den passenden Weg. Tasten: 1 und 2.'
};
const duration = () => [Infinity, 7000, 3800][speed] + (mode === 'route' && speed ? 1000 : 0);
const card = () => deck[index];
const branch = () => routes[card().type][step];

function setPressed(group, key, value) {
  for (const b of group.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset[key] === String(value)));
}
function settings() {
  setPressed(ui.modes,'mode',mode); setPressed(ui.levels,'level',level); setPressed(ui.speeds,'speed',speed);
  ui.levelHint.textContent = ['Klare Fälle aus dem Alltag.', 'Gebeugte Formen und Wörter im Satz.', 'Grenzfälle, Nominalisierungen und Zahladjektive.'][level];
  ui.speedHint.textContent = speed ? `${String(duration()/1000).replace('.', ',')} Sekunden pro ${mode === 'catch' ? 'Wort' : 'Weiche'}.` : 'Entscheide in deinem eigenen Tempo.';
}
function stats() {
  ui.score.textContent = String(points).padStart(3,'0');
  ui.streak.textContent = streak;
  ui.round.textContent = `${state === 'idle' ? 0 : Math.min(index + 1, roundSize)} / ${roundSize}`;
}
function message(text, kind = '') {
  ui.feedback.textContent = text;
  ui.feedback.className = ['feedback',kind].join(' ');
}
function targets() {
  const active = state === 'playing';
  const labels = mode === 'catch' ? classes : active ? stations[branch()[0]][1] : stations.change[1];
  const focused = ui.targets.contains(document.activeElement) ? [...ui.targets.children].indexOf(document.activeElement) : -1;
  ui.targets.replaceChildren(...labels.map((name, i) => {
    const b = document.createElement('button');
    b.className = 'target';
    b.style.setProperty('--tint', mode === 'catch' ? tints[i] : ['#d8c9ff','#bde6ff'][i]);
    b.disabled = !active;
    const kbd = document.createElement('kbd');
    kbd.textContent = i+1; kbd.setAttribute('aria-hidden','true');
    b.append(kbd, document.createTextNode(name));
    b.addEventListener('click', () => answer(i));
    return b;
  }));
  if (active && focused >= 0) ui.targets.children[Math.min(focused, labels.length-1)].focus();
}
function overlay(title, body, action) {
  ui.overlay.hidden = false;
  ui.overlayTitle.textContent = title;
  ui.overlayText.textContent = body;
  ui.start.replaceChildren(document.createTextNode(action+' '));
  const arrow = document.createElement('span'); arrow.textContent = '→'; ui.start.append(arrow);
}
function stopMotion() {
  cancelAnimationFrame(frame);
  clearTimeout(nextTimer);
  if (drag !== null && ui.word.hasPointerCapture(drag)) ui.word.releasePointerCapture(drag);
  drag = null;
  ui.word.style.left = '50%';
  for (const b of ui.targets.children) b.classList.remove('ready');
}
function idle() {
  stopMotion();
  dropAnimation?.cancel();
  state = 'idle'; index = points = streak = hits = 0;
  ui.word.style.background = '';

  ui.pause.disabled = true;
  for (const el of [ui.word,ui.context,ui.route,ui.trail]) el.hidden = true;
  overlay(mode === 'catch' ? 'Bereit zum Wortfang?' : 'Bereit für die Wortweiche?', mode === 'catch' ? 'Ordne fallende Wörter zu, bevor sie unten ankommen.' : 'Prüfe jedes Wort Schritt für Schritt und leite es zur richtigen Wortart.', 'Spiel starten');
  message(hint[mode]); targets(); stats();
}
function shuffle(items) {
  const result = [...items];
  for (let i=result.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}
function start() {
  initAudio();
  if (state === 'paused') { resume(); return; }
  const bank = vocabulary[level];
  const grouped = classes.map((_,type) => shuffle(bank.filter(c => c.type === type)).slice(0,2));
  deck = shuffle(grouped.flat());
  index = points = streak = hits = step = 0;
  nextCard();
}
function nextCard() {
  if (index === roundSize) { finish(); return; }
  step = 0;
  const c = card();
  ui.word.textContent = c.word;
  ui.word.style.cursor = mode === 'catch' ? 'grab' : 'default';
  ui.context.hidden = !c.sentence;
  if (c.sentence) {
    const [before,after] = c.sentence.split('*');
    const mark = document.createElement('mark'); mark.textContent = c.word;
    ui.context.replaceChildren(before,mark,after);
  }
  message(hint[mode]);
  showStage();
}
function showStage() {
  state = 'playing'; elapsed = 0; last = 0;
  ui.overlay.hidden = true; ui.word.hidden = false; ui.trail.hidden = !speed;
  ui.pause.disabled = false; ui.pause.textContent = 'Ⅱ'; ui.pause.setAttribute('aria-label','Pausieren');
  ui.route.hidden = mode !== 'route';
  if (mode === 'route') {
    const route = routes[card().type];
    ui.path.textContent = ['Start', ...route.slice(0,step).map(([key,i]) => stations[key][1][i])].join(' → ');
    ui.question.textContent = stations[branch()[0]][0];
  }
  targets(); stats(); paint(); frame = requestAnimationFrame(tick);
}
function paint() {
  const progress = speed ? Math.min(1,elapsed/duration()) : .43;
  const top = ui.context.hidden ? 12 : ui.context.offsetHeight + 18;
  const bottom = mode === 'route' ? ui.route.offsetHeight + 19 : 10;
  const distance = Math.max(0,ui.arena.clientHeight - top - bottom - ui.word.offsetHeight);
  const fraction = reduceMotion.matches ? .43 : progress;
  if (drag === null) ui.word.style.top = `${top + fraction * distance}px`;
  ui.trail.style.width = `${100*(1-progress)}%`;
}
function tick(now) {
  if (state !== 'playing') return;
  if (last) elapsed += now-last;
  last = now; paint();
  if (elapsed >= duration()) { answer(-1); return; }
  frame = requestAnimationFrame(tick);
}
function answer(choice) {
  if (state !== 'playing') return;
  const c = card();
  const expected = mode === 'catch' ? c.type : branch()[1];
  const correct = choice === expected;
  stopMotion();
  if (correct && mode === 'route' && step + 1 < routes[c.type].length) {
    message(`✓ ${stations[branch()[0]][1][choice]}. Weiter zur nächsten Weiche.`,'good');
    step++; play('step'); showStage(); return;
  }
  state = 'feedback'; ui.pause.disabled = true;
  for (const b of ui.targets.children) b.disabled = true;
  ui.trail.hidden = true;
  if (correct) {
    hits++; streak++; points += 100 + Math.min(5,streak-1)*20;
    ui.word.style.background = tints[c.type];
    if (mode === 'catch') sink(choice);
    pop(); play(streak % 3 === 0 ? 'combo' : 'good');
    message(`✓ ${c.word} → ${classes[c.type]}: ${c.clue}.${streak % 3 === 0 ? ' · ' + streak + ' in Serie!' : ''}`,'good');
  } else {
    streak = 0; play('miss');
    const correction = mode === 'route' ? ` Hier: ${stations[branch()[0]][1][expected]}.` : '';
    message(`${choice < 0 ? 'Zeit abgelaufen.' : 'Noch nicht richtig.'}${correction} ${c.word} → ${classes[c.type]}: ${c.clue}.`,'bad');
  }
  stats();
  nextTimer = setTimeout(() => {
    dropAnimation?.cancel();
    ui.word.style.background = '';
    index++; nextCard();
  }, correct ? 1150 : 2850);
}
function finish() {
  state = 'done'; stats();
  for (const el of [ui.word,ui.context,ui.route,ui.trail]) el.hidden = true;
  targets();
  overlay('Runde geschafft!', `${hits} von ${roundSize} Wörtern richtig · ${points} Punkte`, 'Noch einmal spielen');
  message(hits === roundSize ? 'Perfekte Runde! Probier ein höheres Niveau oder den Turbomodus.' : 'Wiederhole die Runde oder probier die andere Spielart.');
  ui.start.focus();
}
function pause(focus = false) {
  if (state !== 'playing') return;
  stopMotion(); state = 'paused'; targets();
  ui.pause.textContent = '▶'; ui.pause.setAttribute('aria-label','Fortsetzen');
  overlay('Pause', 'Dein Wort wartet auf dich.', 'Weiterspielen');
  if (focus) ui.start.focus();
}
function resume() {
  state = 'playing'; last = 0; targets();
  ui.overlay.hidden = true; ui.pause.textContent = 'Ⅱ'; ui.pause.setAttribute('aria-label','Pausieren');
  ui.pause.focus(); frame = requestAnimationFrame(tick);
}
function initAudio() {
  if (!sound) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (Audio) { audio ||= new Audio(); audio.resume().catch(()=>{}); }
  } catch {}
}
function play(type) {
  if (!sound || !audio || audio.state !== 'running') return;
  const notes = {step:[390], good:[523,659], combo:[523,659,784,1047], miss:[240,160]}[type];
  notes.forEach((freq,i) => {
    const time = audio.currentTime + i*.075, osc = audio.createOscillator(), gain = audio.createGain();
    osc.frequency.value = freq; osc.type = type === 'miss' ? 'triangle' : 'sine';
    gain.gain.setValueAtTime(.0001,time);
    gain.gain.exponentialRampToValueAtTime(.10,time+.02);
    gain.gain.exponentialRampToValueAtTime(.0001,time+.15);
    osc.connect(gain).connect(audio.destination); osc.start(time); osc.stop(time+.16);
  });
}
function pop() {
  if (!ui.effects.checked || reduceMotion.matches) return;
  for (let i=0;i<22;i++) {
    const spark = document.createElement('i'), angle = i*2.4, radius = 45 + Math.random()*100;
    spark.style.setProperty('--x',Math.cos(angle)*radius+'px');
    spark.style.setProperty('--y',Math.sin(angle)*radius+'px');
    spark.style.setProperty('--color',tints[i%5]);
    spark.addEventListener('animationend',()=>spark.remove(),{once:true});
    ui.particles.append(spark);
  }
}
function sink(choice) {
  if (reduceMotion.matches || !ui.effects.checked) return;
  const basket = ui.targets.children[choice];
  const from = ui.word.getBoundingClientRect(), to = basket.getBoundingClientRect();
  const x = to.left + to.width/2 - from.left - from.width/2;
  const y = to.top + to.height/2 - from.top - from.height/2;
  dropAnimation = ui.word.animate([
    {transform:'translate(-50%, 0)'},
    {transform:`translate(calc(-50% + ${x}px), ${y}px) scale(.4)`,opacity:0}
  ], {duration:460,fill:'forwards',easing:'cubic-bezier(.4,0,.8,1)'});
  basket.animate([{transform:'scale(1)'},{transform:'scale(1.09)'},{transform:'scale(1)'}],{delay:300,duration:260});
}
function dropTarget(x,y) {
  return [...ui.targets.children].findIndex(b => {
    const r=b.getBoundingClientRect();
    return x>=r.left && x<=r.right && y>=r.top && y<=r.bottom;
  });
}
ui.word.addEventListener('pointerdown',e => {
  if (state !== 'playing' || mode !== 'catch' || e.button !== 0 || drag !== null) return;
  drag = e.pointerId; ui.word.setPointerCapture(drag); e.preventDefault();
});
ui.word.addEventListener('pointermove',e => {
  if (drag !== e.pointerId) return;
  const r=ui.arena.getBoundingClientRect(), half=ui.word.offsetWidth/2;
  ui.word.style.left = Math.max(half,Math.min(r.width-half,e.clientX-r.left))+'px';
  ui.word.style.top = Math.max(0,Math.min(r.height-ui.word.offsetHeight,e.clientY-r.top-ui.word.offsetHeight/2))+'px';
  const target=dropTarget(e.clientX,e.clientY);
  [...ui.targets.children].forEach((b,i)=>b.classList.toggle('ready',i===target));
});
ui.word.addEventListener('pointerup',e => {
  if (drag !== e.pointerId) return;
  const choice=dropTarget(e.clientX,e.clientY);
  drag=null; ui.word.style.left='50%';
  for (const b of ui.targets.children) b.classList.remove('ready');
  if (choice>=0) answer(choice);
});
ui.word.addEventListener('lostpointercapture',e => { if (drag === e.pointerId) { drag=null; ui.word.style.left='50%'; for (const b of ui.targets.children) b.classList.remove('ready'); } });
ui.start.onclick = start;
ui.pause.onclick = () => state === 'paused' ? resume() : pause(true);
ui.sound.onclick = () => { sound = !sound; ui.sound.setAttribute('aria-pressed',String(sound)); if (sound) { initAudio(); play('step'); } };
ui.guide.onclick = () => { pause(); ui.help.showModal(); };
ui.effects.onchange = () => { if (!ui.effects.checked) ui.particles.replaceChildren(); };
ui.modes.onclick = e => { const b=e.target.closest('button'); if (b && b.dataset.mode !== mode) { mode=b.dataset.mode; settings(); idle(); } };
ui.levels.onclick = e => { const b=e.target.closest('button'); if (b && Number(b.dataset.level) !== level) { level=Number(b.dataset.level); settings(); idle(); } };
ui.speeds.onclick = e => {
  const b=e.target.closest('button'); if (!b || Number(b.dataset.speed) === speed) return;
  const fraction = speed ? elapsed / duration() : 0;
  speed = Number(b.dataset.speed); elapsed = speed ? fraction * duration() : 0;
  settings();
  if (state === 'playing' || state === 'paused') { ui.trail.hidden = !speed; paint(); }
};
document.addEventListener('keydown',e => {
  if (e.repeat || e.altKey || e.ctrlKey || e.metaKey || ui.help.open) return;
  if (e.key === 'Escape') { if (state === 'playing') pause(true); else if (state === 'paused') resume(); }
  if (state === 'playing' && /^[1-5]$/.test(e.key) && Number(e.key)<=ui.targets.children.length) { e.preventDefault(); answer(Number(e.key)-1); }
});
document.addEventListener('visibilitychange',() => { if (document.hidden) pause(); });
settings(); idle();
