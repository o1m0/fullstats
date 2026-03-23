(() => {
  const page = document.querySelector(".home-page");
  if (!page) return;

  document.body.classList.add("home-screen");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const arenaMain = document.querySelector("[data-arena-main]");
  const title = document.querySelector("[data-glitch-text]");
  const statusBadge = document.querySelector("[data-status-badge]");
  const score = document.querySelector("[data-cycling-status]");
  const tiltCard = document.querySelector("[data-tilt-card]");
  const weekHeads = [...document.querySelectorAll(".member-week-head")];
  const activeTextAnimations = new WeakMap();

  const connectedLabel = "\u63a5\u7d9a\u4e2d";
  const syncingLabel = "\u540c\u671f\u4e2d";
  const readyLabel = "\u6e96\u5099\u5b8c\u4e86";
  const lockedLabel = "\u30ed\u30c3\u30af\u4e2d";
  const waitingLabel = "\u5f85\u6a5f\u4e2d";
  const checkingLabel = "\u78ba\u8a8d\u4e2d";

  const animateTextSwap = (element, nextText, options = {}) => {
    if (!element) return;

    const {
      exitX = 18,
      enterX = 18,
      exitY = -2,
      enterY = 2,
      exitScale = 0.985,
      enterScale = 0.985,
      exitBlur = 2,
      enterBlur = 2,
      exitDuration = 280,
      enterDuration = 420,
    } = options;

    const running = activeTextAnimations.get(element);
    if (running) {
      running.forEach((animation) => animation.cancel());
      activeTextAnimations.delete(element);
    }

    if (typeof element.animate !== "function") {
      element.textContent = nextText;
      return;
    }

    const exitAnimation = element.animate(
      [
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) scale(1)",
          filter: "blur(0px)",
        },
        {
          opacity: 0,
          transform: `translate3d(${exitX}px, ${exitY}px, 0) scale(${exitScale})`,
          filter: `blur(${exitBlur}px)`,
        },
      ],
      {
        duration: exitDuration,
        easing: "cubic-bezier(0.32, 0, 0.2, 1)",
        fill: "forwards",
      }
    );

    activeTextAnimations.set(element, [exitAnimation]);

    exitAnimation.finished
      .then(() => {
        if (element.textContent === nextText) return;

        element.textContent = nextText;

        const enterAnimation = element.animate(
          [
            {
              opacity: 0,
              transform: `translate3d(${-enterX}px, ${enterY}px, 0) scale(${enterScale})`,
              filter: `blur(${enterBlur}px)`,
            },
            {
              opacity: 1,
              transform: "translate3d(0, 0, 0) scale(1)",
              filter: "blur(0px)",
            },
          ],
          {
            duration: enterDuration,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          }
        );

        activeTextAnimations.set(element, [enterAnimation]);
        return enterAnimation.finished.catch(() => {});
      })
      .catch(() => {})
      .finally(() => {
        element.style.opacity = "";
        element.style.transform = "";
        element.style.filter = "";
        activeTextAnimations.delete(element);
      });
  };

  if (title) {
    title.dataset.text = title.dataset.glitchText || title.textContent.trim();
  }

  if (weekHeads.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const labels = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return String(date.getDate());
    });

    weekHeads.forEach((head) => {
      const cells = [...head.querySelectorAll("span")];
      cells.forEach((cell, index) => {
        if (!labels[index]) return;
        cell.textContent = labels[index];
      });
    });
  }

  if (arenaMain && !prefersReducedMotion) {
    const particleField = document.createElement("div");
    particleField.className = "particle-field";
    const floorTrailField = document.createElement("div");
    floorTrailField.className = "floor-trail-field";

    for (let i = 0; i < 18; i += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.setProperty("--size", `${2 + Math.random() * 5}px`);
      particle.style.setProperty("--x", `${Math.random() * 100}%`);
      particle.style.setProperty("--y", `${55 + Math.random() * 45}%`);
      particle.style.setProperty("--drift-x", `${-40 + Math.random() * 80}px`);
      particle.style.setProperty("--duration", `${7 + Math.random() * 8}s`);
      particle.style.setProperty("--blink", `${1.8 + Math.random() * 2.4}s`);
      particle.style.setProperty("--delay", `${-Math.random() * 8}s`);
      particle.style.setProperty("--alpha", `${0.24 + Math.random() * 0.55}`);
      particleField.appendChild(particle);
    }

    arenaMain.appendChild(particleField);
    arenaMain.appendChild(floorTrailField);

    const spawnFloorTrail = () => {
      const trail = document.createElement("span");
      trail.className = "floor-trail";
      trail.style.left = `${8 + Math.random() * 84}%`;
      trail.style.animationDuration = `${1.4 + Math.random() * 1.4}s`;
      trail.style.animationDelay = `${Math.random() * 0.2}s`;
      floorTrailField.appendChild(trail);

      window.setTimeout(() => {
        trail.remove();
      }, 2400);
    };

    for (let i = 0; i < 4; i += 1) {
      window.setTimeout(spawnFloorTrail, i * 420);
    }

    window.setInterval(spawnFloorTrail, 900);

    const updatePointer = (clientX, clientY) => {
      const rect = arenaMain.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      const rotateY = ((x / 100) - 0.5) * 7;
      const rotateX = (0.5 - (y / 100)) * 6;

      page.style.setProperty("--pointer-x", `${x}%`);
      page.style.setProperty("--pointer-y", `${y}%`);
      arenaMain.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
      arenaMain.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
    };

    arenaMain.addEventListener("pointermove", (event) => {
      updatePointer(event.clientX, event.clientY);
    });

    arenaMain.addEventListener("pointerleave", () => {
      page.style.setProperty("--pointer-x", "50%");
      page.style.setProperty("--pointer-y", "50%");
      arenaMain.style.removeProperty("--tilt-x");
      arenaMain.style.removeProperty("--tilt-y");
    });
  }

  if (tiltCard && !prefersReducedMotion) {
    tiltCard.addEventListener("pointerenter", () => {
      tiltCard.classList.add("is-hovered");
    });

    tiltCard.addEventListener("pointerleave", () => {
      tiltCard.classList.remove("is-hovered");
    });
  }

  if (title && !prefersReducedMotion) {
    const triggerGlitch = () => {
      title.classList.add("is-glitching");
      window.setTimeout(() => title.classList.remove("is-glitching"), 180);
    };

    const triggerSurge = () => {
      title.classList.add("is-surging");
      window.setTimeout(() => title.classList.remove("is-surging"), 520);
    };

    triggerGlitch();
    triggerSurge();
    window.setInterval(triggerGlitch, 3200);
    window.setInterval(triggerSurge, 5400);
  }

  if (score && !prefersReducedMotion) {
    const isConnected = score.textContent.trim() === connectedLabel;
    const states = isConnected
      ? [connectedLabel, syncingLabel, readyLabel]
      : [lockedLabel, waitingLabel, checkingLabel];
    let stateIndex = 0;

    window.setInterval(() => {
      stateIndex = (stateIndex + 1) % states.length;
      animateTextSwap(score, states[stateIndex], {
        exitX: 22,
        enterX: 22,
        exitY: -2,
        enterY: 2,
        exitBlur: 2,
        enterBlur: 2,
        exitDuration: 300,
        enterDuration: 460,
      });

      if (statusBadge) {
        animateTextSwap(statusBadge, states[stateIndex], {
          exitX: 14,
          enterX: 14,
          exitY: 0,
          enterY: 0,
          exitScale: 0.99,
          enterScale: 0.99,
          exitBlur: 1,
          enterBlur: 1,
          exitDuration: 260,
          enterDuration: 400,
        });
      }
    }, 2400);
  }
})();
