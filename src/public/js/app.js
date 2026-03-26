(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const header = document.querySelector(".site-header");

  body.classList.add("js-ready");
  if (!prefersReducedMotion) {
    body.classList.add("motion-ready");
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  const navCollapse = document.querySelector("#siteNavMenu");
  if (navCollapse && window.bootstrap?.Collapse) {
    document.querySelectorAll("#siteNavMenu .nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth >= 992 || !navCollapse.classList.contains("show")) return;
        window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      });
    });
  }

  const revealTargets = document.querySelectorAll("[data-reveal]");
  if (revealTargets.length > 0) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      });

      revealTargets.forEach((element) => observer.observe(element));
    }
  }
})();
