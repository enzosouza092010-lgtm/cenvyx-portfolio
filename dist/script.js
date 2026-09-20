// Adicione apenas os números, com DDI e DDD. Exemplo: 5511999999999.
const WHATSAPP_NUMBER = "";
const WHATSAPP_MESSAGE = "Olá! Vi o portfólio da Cenvyx e quero conversar sobre um projeto.";

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  const message = link.dataset.message || WHATSAPP_MESSAGE;
  link.href = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
});

document.getElementById("year").textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

const portfolioView = document.getElementById("portfolio-view");
const aiView = document.getElementById("ai-view");
const portfolioNavigation = document.querySelectorAll(".portfolio-nav");
const aiNavigation = document.querySelectorAll(".ai-nav");
const skipLink = document.querySelector(".skip-link");

const closeMenu = () => {
  menuButton.classList.remove("active");
  mobileMenu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
};

const showView = (view, updateHistory = true) => {
  const showAi = view === "ai";
  portfolioView.hidden = showAi;
  aiView.hidden = !showAi;
  portfolioNavigation.forEach((nav) => { nav.hidden = showAi; });
  aiNavigation.forEach((nav) => { nav.hidden = !showAi; });
  document.body.classList.toggle("ai-active", showAi);
  skipLink.href = showAi ? "#ai-view" : "#portfolio-view";
  document.title = showAi
    ? "Cenvyx AI — Inteligência para pequenos negócios"
    : "Cenvyx — Sites e IA para negócios";
  closeMenu();

  if (updateHistory) {
    history.pushState({ view }, "", showAi ? "#cenvyx-ai" : window.location.pathname);
  }

  window.scrollTo({ top: 0, behavior: "instant" });
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.classList.toggle("active");
  mobileMenu.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

document.querySelectorAll("[data-show-ai]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showView("ai");
  });
});

document.querySelectorAll("[data-show-portfolio]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showView("portfolio");
  });
});

window.addEventListener("popstate", () => {
  showView(window.location.hash === "#cenvyx-ai" ? "ai" : "portfolio", false);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".project-card").forEach((card) => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

showView(window.location.hash === "#cenvyx-ai" ? "ai" : "portfolio", false);
