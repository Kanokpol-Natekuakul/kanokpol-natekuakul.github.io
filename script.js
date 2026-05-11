const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");
const mobileLinks = document.querySelectorAll("[data-mobile-link]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const typeTarget = document.querySelector("[data-typewriter]");
const sections = document.querySelectorAll("main section[id]");
const yearSlot = document.querySelector("[data-year]");
const contactForm = document.querySelector("form");

if (yearSlot) {
  yearSlot.textContent = new Date().getFullYear();
}

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (menuToggle && mobilePanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = !mobilePanel.classList.contains("hidden");
    mobilePanel.classList.toggle("hidden");
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobilePanel.classList.add("hidden");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tabTarget;
    tabButtons.forEach((item) => item.classList.remove("is-current"));
    button.classList.add("is-current");
    tabPanels.forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.tabPanel !== target);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const duration = 1400;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.35 }
);

counters.forEach((counter) => counterObserver.observe(counter));

if (typeTarget) {
  const words = JSON.parse(typeTarget.dataset.typewriter || "[]");
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const currentWord = words[wordIndex] || "";
    typeTarget.textContent = currentWord.slice(0, charIndex);

    if (!isDeleting && charIndex < currentWord.length) {
      charIndex += 1;
      setTimeout(type, 90);
      return;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, 1400);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(type, 45);
      return;
    }

    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 220);
  };

  type();
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeId = entry.target.id;
      navLinks.forEach((link) => {
        const match = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("is-active", match);
      });
    });
  },
  { threshold: 0.55 }
);

sections.forEach((section) => sectionObserver.observe(section));

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button[type='submit']");
    if (!button) return;
    const original = button.textContent;
    button.textContent = "Message Queued";
    button.disabled = true;
    setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
      contactForm.reset();
    }, 1800);
  });
}
