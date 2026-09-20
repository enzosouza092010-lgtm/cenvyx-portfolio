// Adicione apenas os números, com DDI e DDD. Exemplo: 5511999999999.
const WHATSAPP_NUMBER = "5518981466441";
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
const projectsView = document.getElementById("projects-view");
const aiView = document.getElementById("ai-view");
const portfolioNavigation = document.querySelectorAll(".portfolio-nav");
const projectsNavigation = document.querySelectorAll(".projects-nav");
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
  const showProjects = view === "projects";
  portfolioView.hidden = showAi || showProjects;
  projectsView.hidden = !showProjects;
  aiView.hidden = !showAi;
  portfolioNavigation.forEach((nav) => { nav.hidden = showAi || showProjects; });
  projectsNavigation.forEach((nav) => { nav.hidden = !showProjects; });
  aiNavigation.forEach((nav) => { nav.hidden = !showAi; });
  document.body.classList.toggle("ai-active", showAi);
  document.body.classList.toggle("projects-active", showProjects);
  skipLink.href = showAi ? "#ai-view" : showProjects ? "#projects-view" : "#portfolio-view";
  document.title = showAi
    ? "Cenvyx AI — Inteligência para pequenos negócios"
    : showProjects
      ? "Projetos — Cenvyx"
      : "Cenvyx — Sites e IA para negócios";
  closeMenu();

  if (updateHistory) {
    const target = showAi ? "#cenvyx-ai" : showProjects ? "#projetos" : window.location.pathname;
    history.pushState({ view }, "", target);
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

document.querySelectorAll("[data-show-projects]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showView("projects");
  });
});

document.querySelectorAll("[data-show-portfolio]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showView("portfolio");
  });
});

window.addEventListener("popstate", () => {
  const projectHashes = ["#projetos", "#feedbacks", "#contato-projetos"];
  const view = window.location.hash === "#cenvyx-ai"
    ? "ai"
    : projectHashes.includes(window.location.hash)
      ? "projects"
      : "portfolio";
  showView(view, false);
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

const projectHashes = ["#projetos", "#feedbacks", "#contato-projetos"];
const initialView = window.location.hash === "#cenvyx-ai"
  ? "ai"
  : projectHashes.includes(window.location.hash)
    ? "projects"
    : "portfolio";

showView(initialView, false);
