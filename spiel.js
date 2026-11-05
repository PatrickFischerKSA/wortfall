'use strict';
const $ = id => document.getElementById(id);
const ui = Object.fromEntries(['score','streak','round','roundLabel','pause','endRun','arena','context','trail','word','overlay','overlayTitle','overlayText','start','route','path','question','particles','targets','feedback','modes','levels','speeds','levelHint','speedHint','effects','sound','guide','help'].map(id => [id,$(id)]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let mode = 'catch', level = 0, speed = reduceMotion.matches ? 0 : 1, sound = true, audio;
let soundBus, clapNoise;
let state = 'idle', deck = [], index = 0, points = 0, streak = 0, hits = 0, step = 0;
let elapsed = 0, frame = 0, last = 0, nextTimer, drag = null, dropAnimation;
let keyboardTarget = -1;
let bestStreak = 0;
const roundSize = 10;
const endless = () => mode === 'endless';
const highscoreKey = 'wortfall.endless.highscore';
let highscore = readHighscore();

function readHighscore() {
  try {
    const saved = Number(localStorage.getItem(highscoreKey));
    return Number.isSafeInteger(saved) && saved > 0 ? saved : 0;
  } catch {
    return 0;
  }
}

function updateHighscore() {
  const previous = highscore;
  highscore = Math.max(highscore, readHighscore(), points);
  if (highscore > previous && highscore === points) {
    try {
      localStorage.setItem(highscoreKey, String(highscore));
    } catch {
      // Keep showing the record in this session if storage is unavailable.
    }
  }
  $('highscore').textContent = String(highscore).padStart(3, '0');
}

const usesBaskets = () => mode !== 'route';
const modeHint = () => hint[usesBaskets() ? 'catch' : 'route'];
const hint = {
  catch: '← → lenkt. Leertaste oder ↓ wirft sofort ein. Unten fällt das Wort von selbst in den Korb.',
  route: '← oder → lenkt das Wort. An der Linie zählt die erreichte Spur. Auch mit 1, 2 oder Tippen.'
};
const switchTravelTime = 360;
let switchSelectedAt = 0;
const pace = [null, {base:6300, change:540}, {base:3900, change:360}];
let tempoStep = 0;
function duration() {
  if (!speed) return Infinity;
  const {base, change} = pace[speed];
  const allowance = mode === 'route' ? 800 : 0;
  return base - change * tempoStep + allowance;
}

function adjustTempo(correct) {
  const before = tempoStep;
  if (speed) tempoStep = Math.max(-2, Math.min(5, tempoStep + (correct ? 1 : -1)));
  speedHint();
  if ((!endless() && index === roundSize - 1) || before === tempoStep) return '';
  return correct ? ' · Nächstes Wort schneller' : ' · Nächstes Wort langsamer';
}

function speedHint() {
  const unit = usesBaskets() ? 'Wort' : 'Weiche';
  const seconds = (duration() / 1000).toLocaleString('de-DE', {maximumFractionDigits:1});
  ui.speedHint.textContent = speed
    ? `${seconds} Sekunden pro ${unit}. Treffer erhöhen das Tempo, Fehler bremsen es.`
    : 'Entscheide in deinem eigenen Tempo.';
}
const card = () => deck[index % deck.length];
const branch = () => routes[card().type][step];

function setPressed(group, key, value) {
  for (const b of group.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset[key] === String(value)));
}
function settings() {
  setPressed(ui.modes,'mode',mode); setPressed(ui.levels,'level',level); setPressed(ui.speeds,'speed',speed);
  ui.levelHint.textContent = ['Klare Fälle aus dem Alltag.', 'Gebeugte Formen und Wörter im Satz.', 'Grenzfälle, Nominalisierungen und Zahladjektive.'][level];
  speedHint();
}
function stats() {
  ui.score.textContent = String(points).padStart(3,'0');
  ui.streak.textContent = streak;
  $('streakPanel').classList.toggle('on-streak', streak >= 3);
  const progress = $('roundProgress');
  progress.hidden = endless();
  progress.value = Math.min(roundSize, index + (state === 'feedback' ? 1 : 0));
  $('highscorePanel').hidden = !endless();
  $('scoreboard').classList.toggle('has-highscore', endless());
  if (endless()) updateHighscore();
  ui.roundLabel.textContent = endless() ? 'WÖRTER' : 'RUNDE';
  ui.round.textContent = endless()
    ? String(state === 'feedback' ? index + 1 : index)
    : `${state === 'idle' ? 0 : Math.min(index + 1, roundSize)} / ${roundSize}`;
}
function message(text, kind = '') {
  ui.feedback.textContent = text;
  ui.feedback.className = ['feedback',kind].join(' ');
}
function targets() {
  ui.arena.classList.toggle('has-lanes', usesBaskets());
  const active = state === 'playing';
  const labels = usesBaskets() ? classes : active ? stations[branch()[0]][1] : stations.change[1];
  const focused = ui.targets.contains(document.activeElement) ? [...ui.targets.children].indexOf(document.activeElement) : -1;
  ui.targets.replaceChildren(...labels.map((name, i) => {
    const b = document.createElement('button');
    b.className = 'target';
    b.style.setProperty('--tint', usesBaskets() ? tints[i] : ['#d8c9ff','#bde6ff'][i]);
    b.disabled = !active;
    const kbd = document.createElement('kbd');
    kbd.textContent = i+1; kbd.setAttribute('aria-hidden','true');
    b.append(kbd, document.createTextNode(name));
    b.addEventListener('click', () => usesBaskets() ? answer(i) : steerSwitch(i));
    return b;
  }));
  if (active && mode === 'route' && focused >= 0) ui.targets.children[Math.min(focused, labels.length-1)].focus();
  if (active && usesBaskets()) markBasket(keyboardTarget < 0 ? 2 : keyboardTarget);
  if (active && !usesBaskets()) markBasket(keyboardTarget);
}
function markBasket(choice) {
  [...ui.targets.children].forEach((basket, index) => {
    basket.classList.toggle('ready', index === choice);
  });
}
function overlay(title, body, action) {
  ui.overlay.hidden = false;
  ui.endRun.hidden = !endless() || state !== 'paused';
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
  for (const b of ui.targets.children) b.classList.remove('ready');
}
function idle() {
  stopMotion();
  dropAnimation?.cancel();
  state = 'idle'; index = points = streak = hits = 0;
  bestStreak = 0;
  tempoStep = 0;
  speedHint();
  ui.word.style.background = '';

  ui.pause.disabled = true;
  for (const el of [ui.word,ui.context,ui.route,ui.trail]) el.hidden = true;
  if (endless()) {
    overlay('Bereit für den Endloslauf?', 'Fange Wörter, solange du willst. Über Pause kannst du den Lauf beenden.', 'Endloslauf starten');
  } else overlay(usesBaskets() ? 'Bereit zum Wortfang?' : 'Bereit für die Wortweiche?', usesBaskets() ? 'Ordne fallende Wörter zu, bevor sie unten ankommen.' : 'Lenke das Wort vor der Abzweigung zum passenden Begriff.', 'Spiel starten');
  message(modeHint()); targets(); stats();
}
function shuffle(items) {
  const result = [...items];
  for (let i=result.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}
function endlessDeck(previous = []) {
  const wordKey = card => card.word.toLocaleLowerCase('de-CH');
  const recent = new Set(previous.slice(-30).map(wordKey));
  const seen = new Set();
  const fresh = [], deferred = [];
  for (const card of shuffle(vocabulary[level])) {
    const key = wordKey(card);
    if (seen.has(key)) continue;
    seen.add(key);
    (recent.has(key) ? deferred : fresh).push(card);
  }
  return [...fresh, ...deferred];
}

function start() {
  initAudio();
  if (state === 'paused') { resume(); return; }
  if (endless()) {
    deck = endlessDeck();
  } else {
    const bank = vocabulary[level];
    const grouped = classes.map((_,type) => shuffle(bank.filter(c => c.type === type)).slice(0,2));
    deck = shuffle(grouped.flat());
  }
  index = points = streak = hits = step = 0;
  bestStreak = 0;
  tempoStep = 0;
  message(modeHint());
  nextCard();
  const board = $('scoreboard').closest('.arcade');
  if (board.getBoundingClientRect().bottom > window.innerHeight) {
    board.scrollIntoView({block:'start', behavior:'instant'});
  }
}
function nextCard() {
  if (!endless() && index === roundSize) { finish(); return; }
  if (endless() && index > 0 && index % deck.length === 0) deck = endlessDeck(deck);
  step = 0;
  const c = card();
  ui.word.textContent = c.word;
  ui.word.style.cursor = usesBaskets() ? 'grab' : 'default';
  ui.context.hidden = !c.sentence;
  if (c.sentence) {
    const [before,after] = c.sentence.split('*');
    const mark = document.createElement('mark'); mark.textContent = c.word;
    ui.context.replaceChildren(before,mark,after);
  }
  showStage();
}
function showStage() {
  keyboardTarget = -1;
  ui.word.style.left = '50%';
  state = 'playing'; elapsed = 0; last = 0;
  speedHint();
  ui.overlay.hidden = true; ui.word.hidden = false; ui.trail.hidden = !speed;
  ui.pause.disabled = false; ui.pause.textContent = 'Ⅱ'; ui.pause.setAttribute('aria-label','Pausieren');
  ui.route.hidden = mode !== 'route';
  if (mode === 'route') {
    delete $('junction').dataset.direction;
    const route = routes[card().type];
    ui.path.textContent = ['Start', ...route.slice(0,step).map(([key,i]) => stations[key][1][i])].join(' → ');
    ui.question.textContent = stations[branch()[0]][0];
  }
  targets(); stats(); paint(); frame = requestAnimationFrame(tick);
}
function paint() {
  const route = !usesBaskets();
  const travel = route && keyboardTarget >= 0
    ? Math.min(1, (elapsed - switchSelectedAt) / switchTravelTime)
    : 0;
  const progress = speed ? Math.min(1,elapsed/duration()) : .43 + .57 * travel;
  const top = ui.context.hidden ? 12 : ui.context.offsetHeight + 18;
  const bottom = mode === 'route' ? ui.route.offsetHeight + 19 : 10;
  const distance = Math.max(0,ui.arena.clientHeight - top - bottom - ui.word.offsetHeight);
  const fall = speed && usesBaskets() ? progress * (.55 + .45 * progress) : progress;
  const fraction = reduceMotion.matches ? .43 : fall;
  const spin = speed && ui.effects.checked && !reduceMotion.matches && drag === null;
  const turn = Math.max(0, Math.min(1, (progress - .12) / .76));
  ui.word.style.rotate = spin ? `${(index % 2 ? -1 : 1) * turn * 360}deg` : '';
  if (route) {
    const split = Math.max(0, (progress - .26) / .74);
    const side = keyboardTarget === 0 ? -1 : 1;
    ui.word.style.left = `${50 + side * 25 * Math.min(split, travel)}%`;
    $('junction').style.top = `${top + ui.word.offsetHeight / 2}px`;
    $('junction').style.height = `${distance}px`;
  }
  if (drag === null) ui.word.style.top = `${top + fraction * distance}px`;
  ui.trail.style.width = `${100*(1-progress)}%`;
}
function steerSwitch(choice) {
  if (state !== 'playing' || keyboardTarget === choice) return;
  keyboardTarget = choice;
  switchSelectedAt = elapsed;
  markBasket(choice);
  $('junction').dataset.direction = choice === 0 ? 'left' : 'right';
}
function positionWordOverBasket() {
  if (!usesBaskets() || keyboardTarget < 0 || drag !== null) return;
  const basket = ui.targets.children[keyboardTarget].getBoundingClientRect();
  const arena = ui.arena.getBoundingClientRect();
  const half = ui.word.offsetWidth / 2;
  const center = basket.left + basket.width / 2 - arena.left;
  ui.word.style.left = Math.max(half, Math.min(arena.width - half, center)) + 'px';
  markBasket(keyboardTarget);
}
function basketBelowWord() {
  if (keyboardTarget >= 0) return keyboardTarget;
  const word = ui.word.getBoundingClientRect();
  const center = word.left + word.width / 2;
  let nearest = 0, shortest = Infinity;
  [...ui.targets.children].forEach((basket, index) => {
    const rect = basket.getBoundingClientRect();
    const distance = Math.abs(center - (rect.left + rect.width / 2));
    if (distance < shortest) {
      nearest = index;
      shortest = distance;
    }
  });
  return nearest;
}
function tick(now) {
  if (state !== 'playing') return;
  if (last) elapsed += now-last;
  last = now; paint();
  const reachedSwitch = !usesBaskets() && keyboardTarget >= 0
    && elapsed - switchSelectedAt >= switchTravelTime;
  if (elapsed >= duration() || (!speed && reachedSwitch)) {
    if (usesBaskets()) answer(basketBelowWord(), true);
    else answer(reachedSwitch ? keyboardTarget : -1);
    return;
  }
  frame = requestAnimationFrame(tick);
}
function answer(choice, fastDrop = false) {
  if (state !== 'playing') return;
  ui.word.style.rotate = '';
  const c = card();
  const expected = usesBaskets() ? c.type : branch()[1];
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
    hits++; streak++;
    bestStreak = Math.max(bestStreak, streak);
    const tempoBonus = speed ? tempoStep * 10 + (speed === 2 ? 30 : 0) : 0;
    const earned = 100 + Math.min(5,streak-1)*20 + tempoBonus;
    points += earned;
    const nextPace = adjustTempo(true);
    ui.word.style.background = tints[c.type];
    const milestone = [3, 5, 10].includes(streak);
    pop();
    reaction(milestone ? 'horn' : 'clap');
    play(milestone ? 'combo' : 'good');
    const celebration = milestone ? ` · ✦ ${streak} in Folge!` : '';
    message(`✓ ${c.word} → ${classes[c.type]}: ${c.clue}. · +${earned} Punkte${celebration}${nextPace}`,'good');
  } else {
    const lost = Math.min(points, 25);
    points -= lost;
    const nextPace = adjustTempo(false);
    streak = 0;
    reaction('tears');
    play('miss');
    const correction = mode === 'route' ? ` Hier: ${stations[branch()[0]][1][expected]}.` : '';
    const result = choice < 0 ? 'Abzweigung verpasst.' : !usesBaskets() ? 'Falsche Abzweigung.' : 'Noch nicht richtig.';
    message(`${result}${correction} ${c.word} → ${classes[c.type]}: ${c.clue}. · ${lost ? '−' + lost : '0'} Punkte${nextPace}`,'bad');
  }
  if (usesBaskets()) sink(choice, fastDrop);
  stats();
  nextTimer = setTimeout(advanceAfterAnswer, correct ? 480 : 700);
}
function advanceAfterAnswer() {
  if (state !== 'feedback') return;
  clearTimeout(nextTimer);
  dropAnimation?.cancel();
  ui.word.style.background = '';
  index++;
  nextCard();
}
function finish() {
  state = 'done'; ui.pause.disabled = true; stats();
  for (const el of [ui.word,ui.context,ui.route,ui.trail]) el.hidden = true;
  targets();
  const summary = `${hits} von ${index} Wörtern richtig · ${points} Punkte · Beste Serie: ${bestStreak}`;
  if (endless()) {
    overlay('Endloslauf beendet', summary, 'Neuer Endloslauf');
  } else overlay('Runde geschafft!', summary, 'Noch einmal spielen');
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
    if (!Audio) return;
    if (!audio) {
      audio = new Audio();
      soundBus = audio.createGain();
      soundBus.connect(audio.destination);
      clapNoise = audio.createBuffer(1, Math.ceil(audio.sampleRate * .12), audio.sampleRate);
      const samples = clapNoise.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    }
    audio.resume().catch(()=>{});
  } catch {}
}
function play(type) {
  if (!sound || !soundBus || audio.state !== 'running') return;
  const now = audio.currentTime;
  if (type === 'good' || type === 'combo') {
    for (const offset of [0, .095, .21]) {
      const source = audio.createBufferSource();
      source.buffer = clapNoise;
      const filter = audio.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1550;
      filter.Q.value = .65;
      source.connect(filter);
      soundEnvelope(source, filter, now + offset, .1, .2, .004);
    }
  }
  if (type === 'combo') {
    soundGlide(now + .08, .13, 300, 273, .095, 'sawtooth');
    soundGlide(now + .25, .21, 378, 306, .09, 'sawtooth');
  }
  if (type === 'miss') {
    soundGlide(now, .19, 565, 295, .10, 'triangle');
    soundGlide(now + .21, .22, 470, 210, .08, 'triangle');
  }
  if (type === 'step') soundGlide(now, .12, 390, 440, .08, 'sine');
}
function soundEnvelope(source, output, start, length, volume, attack = .025) {
  const gain = audio.createGain();
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + attack);
  gain.gain.exponentialRampToValueAtTime(.0001, start + length);
  output.connect(gain).connect(soundBus);
  source.start(start);
  source.stop(start + length);
}
function soundGlide(start, length, from, to, volume, type) {
  const source = audio.createOscillator();
  source.type = type;
  source.frequency.setValueAtTime(from, start);
  source.frequency.exponentialRampToValueAtTime(to, start + length);
  if (type === 'sawtooth') {
    const filter = audio.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1050;
    source.connect(filter);
    soundEnvelope(source, filter, start, length, volume);
  } else {
    soundEnvelope(source, source, start, length, volume);
  }
}
function reaction(type) {
  if (!ui.effects.checked || reduceMotion.matches) return;
  const badge = document.createElement('span');
  badge.className = `reaction reaction-${type}`;
  badge.textContent = {clap:'👏', horn:'📣', tears:'😢'}[type];
  badge.addEventListener('animationend', () => badge.remove(), {once:true});
  ui.particles.append(badge);
  if (type !== 'tears') return;
  for (let i = 0; i < 8; i++) {
    const tear = document.createElement('span');
    tear.className = 'tear';
    tear.style.setProperty('--drift', `${(i - 3.5) * 17}px`);
    tear.style.animationDelay = `${(i % 4) * 55}ms`;
    tear.addEventListener('animationend', () => tear.remove(), {once:true});
    ui.particles.append(tear);
  }
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
function sink(choice, fastDrop) {
  if (reduceMotion.matches || !ui.effects.checked) {
    if (fastDrop) ui.word.hidden = true;
    return;
  }
  const basket = ui.targets.children[choice];
  const from = ui.word.getBoundingClientRect(), to = basket.getBoundingClientRect();
  const x = to.left + to.width/2 - from.left - from.width/2;
  const y = to.top + to.height/2 - from.top - from.height/2;
  dropAnimation = ui.word.animate([
    {transform:'translate(-50%, 0)'},
    {transform:`translate(calc(-50% + ${x}px), ${y}px) scale(.4)`,opacity:0}
  ], {duration:fastDrop ? 100 : 460,fill:'forwards',easing:'cubic-bezier(.4,0,.8,1)'});
  basket.animate([{transform:'scale(1)'},{transform:'scale(1.09)'},{transform:'scale(1)'}],{delay:fastDrop ? 60 : 300,duration:260});
}
function dropTarget(x,y) {
  return [...ui.targets.children].findIndex(b => {
    const r=b.getBoundingClientRect();
    return x>=r.left && x<=r.right && y>=r.top && y<=r.bottom;
  });
}
ui.word.addEventListener('pointerdown',e => {
  if (state !== 'playing' || !usesBaskets() || e.button !== 0 || drag !== null) return;
  keyboardTarget = -1;
  drag = e.pointerId; ui.word.setPointerCapture(drag); e.preventDefault();
  ui.word.style.rotate = '';
});
ui.word.addEventListener('pointermove',e => {
  if (drag !== e.pointerId) return;
  const r=ui.arena.getBoundingClientRect(), half=ui.word.offsetWidth/2;
  ui.word.style.left = Math.max(half,Math.min(r.width-half,e.clientX-r.left))+'px';
  ui.word.style.top = Math.max(0,Math.min(r.height-ui.word.offsetHeight,e.clientY-r.top-ui.word.offsetHeight/2))+'px';
  markBasket(basketBelowWord());
});
ui.word.addEventListener('pointerup',e => {
  if (drag !== e.pointerId) return;
  const choice=dropTarget(e.clientX,e.clientY);
  drag=null;
  if (choice>=0) answer(choice);
  else { ui.word.style.left='50%'; markBasket(2); }
});
ui.word.addEventListener('lostpointercapture',e => { if (drag === e.pointerId) { drag=null; ui.word.style.left='50%'; markBasket(2); } });
ui.start.onclick = start;
ui.endRun.onclick = () => { if (endless() && state === 'paused') finish(); };
ui.pause.onclick = () => state === 'paused' ? resume() : pause(true);
ui.sound.onclick = () => {
  sound = !sound;
  ui.sound.setAttribute('aria-pressed', String(sound));
  if (soundBus) soundBus.gain.value = sound ? 1 : 0;
  if (sound) { initAudio(); play('step'); }
};
ui.guide.onclick = () => { pause(); ui.help.showModal(); };
ui.effects.onchange = () => {
  if (!ui.effects.checked) {
    ui.particles.replaceChildren();
    ui.word.style.rotate = '';
  }
};
ui.modes.onclick = e => { const b=e.target.closest('button'); if (b && b.dataset.mode !== mode) { mode=b.dataset.mode; settings(); idle(); } };
ui.levels.onclick = e => { const b=e.target.closest('button'); if (b && Number(b.dataset.level) !== level) { level=Number(b.dataset.level); settings(); idle(); } };
ui.speeds.onclick = e => {
  const b=e.target.closest('button'); if (!b || Number(b.dataset.speed) === speed) return;
  const fraction = state === 'playing' || state === 'paused'
    ? speed ? elapsed / duration() : 0
    : 0;
  speed = Number(b.dataset.speed); elapsed = speed ? fraction * duration() : 0;
  switchSelectedAt = elapsed;
  settings();
  if (state === 'playing' || state === 'paused') { ui.trail.hidden = !speed; paint(); }
};
document.addEventListener('keydown',e => {
  if (e.altKey || e.ctrlKey || e.metaKey || ui.help.open) return;
  const direction = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
  const drop = usesBaskets() && (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowDown');
  if ((state === 'playing' || state === 'feedback') && drag === null && (direction || drop || e.key === 'ArrowDown')) {
    if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable]')) return;
    e.preventDefault();
    if (state === 'feedback') {
      if (!direction || e.repeat) return;
      advanceAfterAnswer();
      if (state !== 'playing') return;
    }
    const buttons = [...ui.targets.children];
    if (!usesBaskets()) {
      if (direction) {
        const choice = direction < 0 ? 0 : 1;
        buttons[choice].focus({preventScroll:true});
        steerSwitch(choice);
      }
      return;
    }
    if (direction) {
      const next = (keyboardTarget < 0 ? Math.floor(buttons.length / 2) : keyboardTarget) + direction;
      keyboardTarget = Math.max(0, Math.min(buttons.length - 1, next));
      buttons[keyboardTarget].focus({preventScroll:true});
      positionWordOverBasket();
    } else if (!e.repeat && drop) {
      answer(basketBelowWord(), true);
    }
    return;
  }
  if (e.repeat) return;
  if (e.key === 'Escape') { if (state === 'playing') pause(true); else if (state === 'paused') resume(); }
  if (state === 'playing' && /^[1-5]$/.test(e.key) && Number(e.key)<=ui.targets.children.length) {
    e.preventDefault();
    const choice = Number(e.key)-1;
    if (usesBaskets()) answer(choice);
    else steerSwitch(choice);
  }
});
window.addEventListener('resize', () => {
  if (state === 'playing' || state === 'paused') positionWordOverBasket();
});
document.addEventListener('visibilitychange',() => { if (document.hidden) pause(); });
settings(); idle();
