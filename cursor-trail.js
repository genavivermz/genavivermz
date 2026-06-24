(function () {
  const SYMBOLS = ['᯽', '⊹', '⟡'];
  const INTERVAL = 40;
  let lastTime = 0;
  let symbolIndex = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTime < INTERVAL) return;
    lastTime = now;

    const trail = document.createElement('span');
    trail.className = 'cursor-trail';
    trail.textContent = SYMBOLS[symbolIndex % SYMBOLS.length];
    symbolIndex++;

    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    trail.style.left = e.clientX + offsetX + 'px';
    trail.style.top = e.clientY + offsetY + 'px';

    document.body.appendChild(trail);
    trail.addEventListener('animationend', () => trail.remove());
  });
})();
