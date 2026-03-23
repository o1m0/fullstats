(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const homePage = document.querySelector(".home-page");
  const isLoggedIn = document.body.dataset.loggedIn === "true";

  const primaryCta = document.querySelector('.hero-cta a[href="/login"]');
  if (primaryCta && isLoggedIn) {
    primaryCta.href = "/tasks";
    primaryCta.textContent = "タスクを開く";
  }

  if (homePage) {
    requestAnimationFrame(() => {
      document.body.classList.add("home-loaded");
    });
  }

  const revealTargets = [...document.querySelectorAll("[data-reveal]")];
  revealTargets.forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
  });

  const countup = document.querySelector("[data-countup]");
  if (countup) {
    const targetValue = Number(countup.dataset.countup);
    const runCountup = () => {
      if (countup.dataset.counted === "true" || Number.isNaN(targetValue)) return;
      countup.dataset.counted = "true";

      if (prefersReducedMotion) {
        countup.textContent = `${targetValue}%`;
        return;
      }

      const duration = 1900;
      const startTime = performance.now();

      const update = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(targetValue * eased);
        countup.textContent = `${value}%`;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      countup.textContent = "0%";
      requestAnimationFrame(update);
    };

    countup.textContent = prefersReducedMotion ? `${targetValue}%` : "0%";

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      runCountup();
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCountup();
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.45,
      });

      observer.observe(countup);
    }
  }

  const tiltCard = document.querySelector("[data-tilt-card]");
  if (tiltCard && !prefersReducedMotion) {
    const limit = 4.5;

    tiltCard.addEventListener("pointermove", (event) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * limit;
      const rotateX = (0.5 - y) * limit;
      tiltCard.style.setProperty("--spot-x", `${x * 100}%`);
      tiltCard.style.setProperty("--spot-y", `${y * 100}%`);
      tiltCard.style.transform =
        `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    tiltCard.addEventListener("pointerleave", () => {
      tiltCard.style.transform = "";
      tiltCard.style.removeProperty("--spot-x");
      tiltCard.style.removeProperty("--spot-y");
    });
  }

  const ctaButtons = [...document.querySelectorAll(".hero-cta .btn")];
  if (ctaButtons.length > 0 && !prefersReducedMotion) {
    ctaButtons.forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate3d(${x * 0.08}px, ${y * 0.08}px, 0)`;
      });

      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });
  }

  const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
  if (parallaxItems.length > 0 && !prefersReducedMotion) {
    let ticking = false;

    const updateParallax = () => {
      const viewportHeight = window.innerHeight || 1;

      parallaxItems.forEach((element) => {
        if (element.hasAttribute("data-tilt-card") && element.matches(":hover")) return;

        const speed = Number(element.dataset.parallax) || 0;
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = ((center - viewportHeight / 2) / viewportHeight) * speed;
        element.style.transform = `translate3d(0, ${offset}px, 0)`;
      });

      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  const heroSection = document.querySelector(".landing-hero");
  if (heroSection && homePage && !prefersReducedMotion) {
    let ticking = false;

    const updateHeroMotion = () => {
      const rect = heroSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(Math.max((-rect.top) / (rect.height + viewportHeight * 0.2), 0), 1);
      homePage.style.setProperty("--hero-progress", progress.toFixed(3));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateHeroMotion);
    };

    updateHeroMotion();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }
})();
