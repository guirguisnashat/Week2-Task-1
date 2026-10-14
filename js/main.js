/**
 * Lumen Tech Solutions — site scripts (ES6+, no dependencies)
 *
 * Modules (each runs only if its elements exist on the current page):
 *   1. initMobileNav()     – hamburger menu toggle with keyboard + resize handling
 *   2. initBackToTop()     – floating "back to top" button
 *   3. initContactForm()   – client-side validation for the contact form
 *   4. initFooterYear()    – keeps the copyright year current
 */

"use strict";

/* --------------------------------------------------------------------------
 * 1. Mobile navigation
 * ------------------------------------------------------------------------ */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#main-nav");
  if (!toggle || !nav) return;

  const DESKTOP_QUERY = window.matchMedia("(min-width: 900px)");

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close the menu after a link is chosen (useful for same-page anchors).
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  // Escape closes the menu and returns focus to the toggle button.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // If the window is resized to desktop width, reset the mobile menu state.
  DESKTOP_QUERY.addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}

/* --------------------------------------------------------------------------
 * 2. Back-to-top button
 * ------------------------------------------------------------------------ */
function initBackToTop() {
  const button = document.querySelector(".to-top");
  if (!button) return;

  const onScroll = () => button.classList.toggle("is-visible", window.scrollY > 600);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  button.addEventListener("click", () => window.scrollTo({ top: 0 }));
}

/* --------------------------------------------------------------------------
 * 3. Contact form validation
 *    Each rule returns an error message, or "" when the value is valid.
 * ------------------------------------------------------------------------ */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,20}$/;
const MESSAGE_MAX = 500;

const validators = {
  name: (value) => {
    if (!value) return "Please enter your full name.";
    if (value.length < 3) return "Name must be at least 3 characters.";
    if (!/^[\p{L}\s.'-]+$/u.test(value)) return "Name can only contain letters, spaces, apostrophes and hyphens.";
    return "";
  },
  email: (value) => {
    if (!value) return "Please enter your email address.";
    if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email, e.g. name@company.com.";
    return "";
  },
  phone: (value) => {
    if (!value) return ""; // optional field
    if (!PHONE_PATTERN.test(value)) return "Use digits, spaces, +, - or brackets (7–20 characters).";
    return "";
  },
  service: (value) => (value ? "" : "Please choose the service you are interested in."),
  message: (value) => {
    if (!value) return "Please write a short message.";
    if (value.length < 20) return `Message must be at least 20 characters (${value.length}/20).`;
    if (value.length > MESSAGE_MAX) return `Message must be ${MESSAGE_MAX} characters or fewer.`;
    return "";
  },
  consent: (_value, input) => (input.checked ? "" : "Please agree to be contacted about your enquiry."),
};

/**
 * Validate one field, update its visual state and error text.
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} input
 * @returns {boolean} true when valid
 */
function validateField(input) {
  const rule = validators[input.name];
  if (!rule) return true;

  const value = input.type === "checkbox" ? input.checked : input.value.trim();
  const message = rule(value, input);
  const field = input.closest(".field") || input.closest(".checkbox");
  const errorEl = document.getElementById(`${input.name}-error`);

  field.classList.toggle("is-invalid", Boolean(message));
  field.classList.toggle("is-valid", !message && input.type !== "checkbox" && value !== "");
  input.setAttribute("aria-invalid", String(Boolean(message)));
  if (errorEl) errorEl.textContent = message;

  return !message;
}

function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const inputs = [...form.querySelectorAll("input, select, textarea")];
  const success = document.querySelector("#form-success");
  const counter = document.querySelector("#message-count");
  const message = form.elements.message;

  // Live character counter for the message box.
  const updateCounter = () => {
    counter.textContent = `${message.value.length} / ${MESSAGE_MAX}`;
  };
  message.addEventListener("input", updateCounter);
  updateCounter();

  inputs.forEach((input) => {
    // Validate when the user leaves a field…
    input.addEventListener("blur", () => validateField(input));
    // …and re-validate while typing once an error is showing, so it clears instantly.
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") validateField(input);
    });
    input.addEventListener("change", () => validateField(input));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = inputs.map(validateField);
    const firstInvalid = inputs[results.indexOf(false)];

    if (firstInvalid) {
      success.hidden = true;
      firstInvalid.focus();
      return;
    }

    // No backend for this static site: show a confirmation and reset the form.
    const firstName = form.elements.name.value.trim().split(/\s+/)[0];
    success.querySelector("span").textContent =
      `Thank you, ${firstName}! Your message has been sent. Our team will reply within one business day.`;
    success.hidden = false;
    form.reset();
    inputs.forEach((input) => {
      const field = input.closest(".field") || input.closest(".checkbox");
      field.classList.remove("is-valid", "is-invalid");
      input.removeAttribute("aria-invalid");
    });
    updateCounter();
    success.focus();
  });
}

/* --------------------------------------------------------------------------
 * 4. Footer year
 * ------------------------------------------------------------------------ */
function initFooterYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initBackToTop();
  initContactForm();
  initFooterYear();
});
