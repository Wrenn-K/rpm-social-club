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
    navItems[0]?.focus();
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

const dialog = document.querySelector("#interest-dialog");
const dialogTriggers = document.querySelectorAll("[data-dialog-mode]");
const dialogCloseButtons = dialog?.querySelectorAll("[data-dialog-close]") ?? [];
const dialogKicker = dialog?.querySelector("[data-dialog-kicker]");
const dialogTitle = dialog?.querySelector("[data-dialog-title]");
const dialogCopy = dialog?.querySelector("[data-dialog-copy]");
let dialogReturnFocus = null;

const dialogContent = {
  membership: {
    kicker: "Membership",
    title: "Membership details are coming soon.",
    copy: "Touring, Grand Touring, and VIP membership frameworks are still being finalized. Follow RPM Social on Instagram for enrollment updates.",
  },
  event: {
    kicker: "Private events",
    title: "Event inquiries will open soon.",
    copy: "The private-event experience and inquiry process are still in development. Follow RPM Social on Instagram as the space and event calendar take shape.",
  },
};

function openDialog(mode, trigger) {
  if (!dialog) return;

  const content = dialogContent[mode] ?? dialogContent.membership;
  if (dialogKicker) dialogKicker.textContent = content.kicker;
  if (dialogTitle) dialogTitle.textContent = content.title;
  if (dialogCopy) dialogCopy.textContent = content.copy;

  dialogReturnFocus = trigger;
  document.body.classList.add("dialog-open");

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeDialog() {
  if (!dialog) return;

  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

dialogTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openDialog(trigger.dataset.dialogMode, trigger);
  });
});

dialogCloseButtons.forEach((button) => {
  button.addEventListener("click", closeDialog);
});

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});

dialog?.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  dialogReturnFocus?.focus();
});

dialog?.addEventListener("cancel", () => {
  document.body.classList.remove("dialog-open");
});
