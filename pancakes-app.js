const byId = id => document.getElementById(id);
let current = null;
let elapsed = 0;
let startedAt = 0;
let frameRequest = null;

function listItems(items) {
  return items.map(text => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  });
}

const formatTime = seconds => `0:${String(Math.floor(seconds)).padStart(2, '0')}`;

// Icons come from our own data file, so inserting their SVG markup is safe.
function setIcon(element, pancake) {
  if (pancake.icon) element.innerHTML = pancake.icon;
  else element.textContent = pancake.emoji;
}

function showFrame() {
  drawMovieFrame(byId('movie'), current, elapsed);
  byId('bar-fill').style.width = `${(elapsed / MOVIE_SECONDS) * 100}%`;
  byId('time').textContent = `${formatTime(elapsed)} / ${formatTime(MOVIE_SECONDS)}`;
}

function tick(now) {
  elapsed = Math.min(MOVIE_SECONDS, (now - startedAt) / 1000);
  showFrame();
  if (elapsed < MOVIE_SECONDS) {
    frameRequest = requestAnimationFrame(tick);
  } else {
    frameRequest = null;
    byId('play').textContent = '↺ Play again';
  }
}

function play() {
  if (elapsed >= MOVIE_SECONDS) elapsed = 0;
  startedAt = performance.now() - elapsed * 1000;
  byId('play').textContent = '❚❚ Pause';
  frameRequest = requestAnimationFrame(tick);
}

function pause() {
  cancelAnimationFrame(frameRequest);
  frameRequest = null;
  byId('play').textContent = '▶ Play';
}

function choose(pancake) {
  current = pancake;
  document.querySelectorAll('.choice').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.id === pancake.id));
  });

  byId('recipe').style.setProperty('--accent', pancake.color);
  setIcon(byId('recipe-emoji'), pancake);
  byId('recipe-title').textContent = pancake.name;
  byId('recipe-ingredients').replaceChildren(...listItems([...baseIngredients, ...pancake.toppings]));
  byId('recipe-steps').replaceChildren(...listItems([...baseSteps, pancake.finish]));
  byId('recipe-picture').setAttribute('aria-label', `Picture of a ${pancake.name.toLowerCase()}`);

  byId('recipe').hidden = false;
  byId('video').hidden = false;
  drawPicture(byId('recipe-picture'), pancake);

  pause();
  elapsed = 0;
  play();
  byId('recipe').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

pancakes.forEach(pancake => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'choice';
  button.dataset.id = pancake.id;
  button.setAttribute('aria-pressed', 'false');
  button.style.setProperty('--accent', pancake.color);
  button.innerHTML = '<span class="choice-emoji" aria-hidden="true"></span><span class="choice-name"></span>';
  setIcon(button.querySelector('.choice-emoji'), pancake);
  button.querySelector('.choice-name').textContent = pancake.name;
  button.addEventListener('click', () => choose(pancake));
  byId('choices').append(button);
});

byId('play').addEventListener('click', () => (frameRequest ? pause() : play()));

byId('start-over').addEventListener('click', () => {
  pause();
  byId('recipe').hidden = true;
  byId('video').hidden = true;
  document.querySelectorAll('.choice').forEach(button => button.setAttribute('aria-pressed', 'false'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Redraw once the rounded font has loaded so canvas captions use it.
document.fonts.ready.then(() => {
  if (!current) return;
  drawPicture(byId('recipe-picture'), current);
  if (!frameRequest) showFrame();
});
