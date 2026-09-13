(function () {
  const SYMBOLS = ["᯽", "⊹", "⟡", "✦", "✧", "⋆", "✶"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const intro = document.getElementById("intro");
  const orbit = document.getElementById("intro-orbit");
  const site = document.getElementById("site");

  // Soft oval with a light curly pull — aligned, not perfect
  function curlyPoint(t) {
    const a = t * Math.PI * 2 - Math.PI / 2; // start near the top
    const rx = 152;
    const ry = 108;
    // gentle brace-ish indent so it isn't a plain ellipse
    const curl = Math.sin(a * 2) * 16;
    const x = Math.cos(a) * (rx + curl * 0.35);
    const y = Math.sin(a) * ry + Math.sin(a * 2) * 10;
    return {
      x: x + (Math.random() * 6 - 3),
      y: y + (Math.random() * 6 - 3),
    };
  }

  function placeSparkles() {
    if (!orbit) return;
    const count = 14;
    const sweepMs = 720;
    const startDelay = 120;

    for (let i = 0; i < count; i += 1) {
      const t = i / Math.max(count - 1, 1);
      const { x, y } = curlyPoint(t);
      const sparkle = document.createElement("span");
      sparkle.className = "sparkle";
      sparkle.textContent = SYMBOLS[i % SYMBOLS.length];

      const delay = startDelay + t * sweepMs;
      const size = 0.82 + Math.random() * 0.55;

      sparkle.style.setProperty("--x", `${x.toFixed(1)}px`);
      sparkle.style.setProperty("--y", `${y.toFixed(1)}px`);
      sparkle.style.setProperty("--delay", `${delay.toFixed(0)}ms`);
      sparkle.style.setProperty("--float-dur", `${2.8 + Math.random() * 2.6}s`);
      sparkle.style.setProperty("--dx1", `${(-12 + Math.random() * 24).toFixed(1)}px`);
      sparkle.style.setProperty("--dy1", `${(-14 + Math.random() * 28).toFixed(1)}px`);
      sparkle.style.setProperty("--dx2", `${(-14 + Math.random() * 28).toFixed(1)}px`);
      sparkle.style.setProperty("--dy2", `${(-10 + Math.random() * 20).toFixed(1)}px`);
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
