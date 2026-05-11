// Small behavior layer for sticky nav, mobile navigation, active section state,
// current-year handling, and reveal animations.
const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinksContainer = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const yearTarget = document.querySelector("[data-current-year]");

function updateHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMobileMenu() {
  if (!navToggle || !navLinksContainer) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.classList.remove("is-open");
  navLinksContainer.classList.remove("is-open");
}

function toggleMobileMenu() {
  if (!navToggle || !navLinksContainer) return;
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isExpanded));
  navToggle.classList.toggle("is-open", !isExpanded);
  navLinksContainer.classList.toggle("is-open", !isExpanded);
}

function setActiveLink() {
  const scrollPosition = window.scrollY + 150;
  let currentId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", isMatch);
  });
}

function setupRevealAnimations() {
  if (reduceMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setCurrentYear() {
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }
}

updateHeaderState();
setActiveLink();
setCurrentYear();
setupRevealAnimations();

window.addEventListener("scroll", () => {
  updateHeaderState();
  setActiveLink();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

document.addEventListener("click", (event) => {
  if (!nav || !navLinksContainer || !navToggle) return;
  if (window.innerWidth > 760) return;
  if (!nav.contains(event.target) && navLinksContainer.classList.contains("is-open")) {
    closeMobileMenu();
  }
});

if (navToggle) {
  navToggle.addEventListener("click", toggleMobileMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});
