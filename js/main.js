"use strict";

document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.querySelector(".nav__menu");
const navLinks = navMenu ? [...navMenu.querySelectorAll("a")] : [];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setNavigation(open, returnFocus = false) {
  if (!navToggle || !navMenu) return;

  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.querySelector(".sr-only").textContent = open
    ? "Close navigation"
    : "Open navigation";
  navMenu.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-open", open);

  if (open) {
    navLinks[0]?.focus();
  } else if (returnFocus) {
    navToggle.focus();
  }
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  setNavigation(!isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setNavigation(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
    setNavigation(false, true);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && navToggle?.getAttribute("aria-expanded") === "true") {
    setNavigation(false);
  }
});

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 32);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealElements = document.querySelectorAll("[data-reveal]");

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const membershipButton = document.querySelector("[data-membership-button]");
const membershipStatus = document.querySelector("#membership-status");

membershipButton?.addEventListener("click", () => {
  if (!membershipStatus) return;

  membershipStatus.hidden = false;
  membershipButton.setAttribute("aria-expanded", "true");
  membershipStatus.focus({ preventScroll: true });
});
