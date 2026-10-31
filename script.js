(function () {
  const SYMBOLS = ["᯽", "⊹", "⟡", "✦", "✧", "⋆", "✶"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const intro = document.getElementById("intro");
  const orbit = document.getElementById("intro-orbit");
  const site = document.getElementById("site");

  // Wide soft oval that clears the intro text — wobble only pushes outward
  function curlyPoint(t, rx, ry) {
    const a = t * Math.PI * 2 - Math.PI / 2; // start near the top
    const curl = Math.abs(Math.sin(a * 2)) * 14;
    const x = Math.cos(a) * (rx + curl);
    const y = Math.sin(a) * (ry + curl * 0.45);
    return {
      x: x + (Math.random() * 4 - 2),
      y: y + (Math.random() * 4 - 2),
    };
  }

  function placeSparkles() {
    if (!orbit) return;
    const mark = document.querySelector(".intro__mark");
    const markRect = mark?.getBoundingClientRect();
    // Fit the path to the actual text box so sparkles sit around it, not on it
    const rx = markRect ? markRect.width / 2 + 44 : 240;
    const ry = markRect ? Math.max(markRect.height / 2 + 52, 64) : 78;

    const count = 16;
    const sweepMs = 720;
    const startDelay = 120;

    for (let i = 0; i < count; i += 1) {
      const t = i / Math.max(count - 1, 1);
      const { x, y } = curlyPoint(t, rx, ry);
      const sparkle = document.createElement("span");
      sparkle.className = "sparkle";
      sparkle.textContent = SYMBOLS[i % SYMBOLS.length];

      const delay = startDelay + t * sweepMs;
      const size = 0.78 + Math.random() * 0.48;
      // Keep float drift mostly tangential / outward so sparkles don't drift into letters
      const outwardX = x === 0 ? 0 : Math.sign(x);
      const outwardY = y === 0 ? 0 : Math.sign(y);

      sparkle.style.setProperty("--x", `${x.toFixed(1)}px`);
      sparkle.style.setProperty("--y", `${y.toFixed(1)}px`);
      sparkle.style.setProperty("--delay", `${delay.toFixed(0)}ms`);
      sparkle.style.setProperty("--float-dur", `${2.8 + Math.random() * 2.6}s`);
      sparkle.style.setProperty("--dx1", `${(outwardX * (4 + Math.random() * 8) + (Math.random() * 6 - 3)).toFixed(1)}px`);
      sparkle.style.setProperty("--dy1", `${(outwardY * (3 + Math.random() * 7) + (Math.random() * 4 - 2)).toFixed(1)}px`);
      sparkle.style.setProperty("--dx2", `${(outwardX * (2 + Math.random() * 7) + (Math.random() * 6 - 3)).toFixed(1)}px`);
      sparkle.style.setProperty("--dy2", `${(outwardY * (2 + Math.random() * 6) + (Math.random() * 4 - 2)).toFixed(1)}px`);
      sparkle.style.setProperty("--rot", `${(-8 + Math.random() * 16).toFixed(1)}deg`);
      sparkle.style.fontSize = `${size}rem`;
      orbit.appendChild(sparkle);
    }
  }

  function enterSite() {
    intro?.classList.add("is-done");
    site?.classList.add("is-in");
    window.setTimeout(() => intro?.remove(), 400);
  }

  function runIntro() {
    if (!intro || reduceMotion) {
      site?.classList.add("is-in");
      intro?.remove();
      return;
    }

    placeSparkles();

    // Short beat after the curly trail finishes, then zoom
    window.setTimeout(() => {
      intro.classList.add("is-zoom");
      site?.classList.add("is-in");
    }, 1180);

    window.setTimeout(enterSite, 2100);
  }

  runIntro();

  // Full bottom closing section pops in on scroll
  (function initClosing() {
    const closing = document.getElementById("wf-invite");
    if (!closing) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      closing.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          closing.classList.add("is-in");
          io.unobserve(closing);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    );

    io.observe(closing);
  })();
})();
