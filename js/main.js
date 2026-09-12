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
  document.querySelectorAll(".nav-links a").forEach(function (link) {
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
  var businessEmail = form.getAttribute("data-business-email") || "contact@tharaitechnologies.com";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.elements["name"].value.trim();
    var org = form.elements["organization"].value.trim();
    var email = form.elements["email"].value.trim();
    var phone = form.elements["phone"].value.trim();
    var enquiryType = form.elements["enquiryType"].value;
    var message = form.elements["message"].value.trim();

    if (!name || !email || !message) {
      showStatus(status, "Please fill in your name, email and message before submitting.", "error");
      return;
    }

    var subject = "Website Enquiry from " + name + (enquiryType ? " — " + enquiryType : "");
    var bodyLines = [
      "Name: " + name,
      "Organization: " + (org || "-"),
      "Email: " + email,
      "Phone: " + (phone || "-"),
      "Enquiry Type: " + (enquiryType || "-"),
      "",
      "Message:",
      message
    ];
    var mailtoUrl =
      "mailto:" + businessEmail +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(bodyLines.join("\n"));

    window.location.href = mailtoUrl;
    showStatus(status, "Opening your email client to send this enquiry to " + businessEmail + "…", "success");
  });
}

function showStatus(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove("success", "error");
  el.classList.add("is-visible", type);
}
