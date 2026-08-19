"use strict";

document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.querySelector(".nav__menu");
const navItems = navMenu ? [...navMenu.querySelectorAll("a, button")] : [];
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
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (navToggle.getAttribute("aria-expanded") === "true") {
          navItems[0]?.focus();
        }
      });
    });
  } else if (returnFocus) {
    navToggle.focus();
  }
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  setNavigation(!isOpen);
});

navItems.forEach((item) => {
  item.addEventListener("click", () => setNavigation(false));
});

document.addEventListener("keydown", (event) => {
  const navigationIsOpen = navToggle?.getAttribute("aria-expanded") === "true";

  if (event.key === "Escape" && navigationIsOpen) {
    setNavigation(false, true);
  }

  if (event.key !== "Tab" || !navigationIsOpen || !navToggle) return;

  const focusableNavigation = [navToggle, ...navItems];
  const firstItem = focusableNavigation[0];
  const lastItem = focusableNavigation[focusableNavigation.length - 1];

  if (event.shiftKey && document.activeElement === firstItem) {
    event.preventDefault();
    lastItem.focus();
  } else if (!event.shiftKey && document.activeElement === lastItem) {
    event.preventDefault();
    firstItem.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1180 && navToggle?.getAttribute("aria-expanded") === "true") {
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
      threshold: 0.1,
      rootMargin: "0px 0px -7% 0px",
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const contactForm = document.querySelector("[data-contact-form]");
const inquiryType = document.querySelector("[data-inquiry-type]");
const formStatus = document.querySelector("[data-form-status]");

if (inquiryType) {
  const requestedInquiry = new URLSearchParams(window.location.search).get("inquiry");
  const validOptions = [...inquiryType.options].map((option) => option.value);

  if (requestedInquiry && validOptions.includes(requestedInquiry)) {
    inquiryType.value = requestedInquiry;
  }
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  if (!formStatus) return;

  formStatus.hidden = false;
  formStatus.focus({ preventScroll: true });
});
