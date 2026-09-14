// Tharai Technologies — shared site behavior

document.addEventListener("DOMContentLoaded", function () {
  initNav();
  markActiveLink();
  setFooterYear();
  initContactForm();
});

function initNav() {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    var isOpen = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function markActiveLink() {
  var current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a:not(.nav-cta)").forEach(function (link) {
    var href = (link.getAttribute("href") || "").toLowerCase();
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

function setFooterYear() {
  var el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}

function initContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var submitBtn = form.querySelector("button[type=submit]");
  var businessEmail = form.getAttribute("data-business-email") || "contact@tharaitech.com";
  var fallbackEmail = form.getAttribute("data-fallback-email") || "tharaitech@gmail.com";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.elements["name"].value.trim();
    var org = form.elements["organization"] ? form.elements["organization"].value.trim() : "";
    var email = form.elements["email"].value.trim();
    var phone = form.elements["phone"] ? form.elements["phone"].value.trim() : "";
    var enquiryType = form.elements["enquiryType"] ? form.elements["enquiryType"].value : "";
    var message = form.elements["message"].value.trim();

    if (!name || !email || !message) {
      showStatus(status, "Please fill in your name, email and message before submitting.", "error");
      return;
    }

    var data = new URLSearchParams(new FormData(form)).toString();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Submission failed");
        form.reset();
        showStatus(status, "Thank you — your message has been sent. We'll get back to you within 1–2 business days.", "success");
      })
      .catch(function () {
        sendFallbackEmail({
          to: businessEmail,
          cc: fallbackEmail,
          name: name,
          org: org,
          email: email,
          phone: phone,
          enquiryType: enquiryType,
          message: message
        });
        form.reset();
        showStatus(status, "Thanks — we're opening your email app so you can send this straight to us.", "success");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      });
  });
}

function sendFallbackEmail(fields) {
  var subject = "Website Enquiry from " + fields.name + (fields.enquiryType ? " — " + fields.enquiryType : "");
  var bodyLines = [
    "Name: " + fields.name,
    "Organization: " + (fields.org || "-"),
    "Email: " + fields.email,
    "Phone: " + (fields.phone || "-"),
    "Enquiry Type: " + (fields.enquiryType || "-"),
    "",
    "Message:",
    fields.message
  ];
  var mailtoUrl =
    "mailto:" + fields.to +
    "?cc=" + encodeURIComponent(fields.cc) +
    "&subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(bodyLines.join("\n"));

  window.location.href = mailtoUrl;
}

function showStatus(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove("success", "error");
  el.classList.add("is-visible", type);
}
