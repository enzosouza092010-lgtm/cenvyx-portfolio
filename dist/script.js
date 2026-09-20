const WHATSAPP_NUMBER = "5518981466441";
const WHATSAPP_MESSAGE = "Olá! Vi o portfólio da Cenvyx e quero conversar sobre um projeto.";

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  const message = link.dataset.message || WHATSAPP_MESSAGE;
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const pages = {
  home: document.getElementById("home-view"),
  projects: document.getElementById("projects-view"),
  ai: document.getElementById("ai-view"),
};

const titles = {
  home: "Cenvyx — Sites estratégicos e inteligência para negócios",
  projects: "Projetos — Cenvyx Digital Studio",
  ai: "Cenvyx AI — Inteligência para pequenos negócios",
};

const pageHashes = {
  projects: ["#projetos", "#feedbacks"],
  ai: ["#cenvyx-ai", "#funcionamento-ai", "#planos-ai"],
};

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".page-progress span");
const skipLink = document.querySelector(".skip-link");

const closeMenu = () => {
  menuButton.classList.remove("active");
  mobileMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
};

const routeFromHash = (hash = window.location.hash) => {
  if (pageHashes.projects.includes(hash)) return "projects";
  if (pageHashes.ai.includes(hash)) return "ai";
  return "home";
};

const updateScrollUI = () => {
  const scrollTop = window.scrollY;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  progressBar.style.width = `${Math.min((scrollTop / maxScroll) * 100, 100)}%`;
  header.classList.toggle("scrolled", scrollTop > 24);
};

const scrollToHash = (hash) => {
  if (!hash) return;
  const target = document.querySelector(hash);
  if (target && !target.closest("[hidden]")) {
    requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
};

const showPage = (pageName, { updateHistory = true, hash = null, scroll = true } = {}) => {
  Object.entries(pages).forEach(([name, page]) => {
    page.hidden = name !== pageName;
  });

  document.body.dataset.page = pageName;
  document.title = titles[pageName];
  skipLink.href = `#${pages[pageName].id}`;
  closeMenu();

  const nextHash = hash || (pageName === "projects" ? "#projetos" : pageName === "ai" ? "#cenvyx-ai" : "#inicio");
  if (updateHistory) history.pushState({ page: pageName }, "", nextHash);

  if (scroll) {
    if (hash && hash !== "#inicio" && document.querySelector(hash)) scrollToHash(hash);
    else window.scrollTo({ top: 0, behavior: "auto" });
  }

  requestAnimationFrame(updateScrollUI);
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.classList.toggle("active");
  mobileMenu.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
});

document.querySelectorAll("[data-view]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const pageName = link.dataset.view;
    const hash = link.getAttribute("href");
    showPage(pageName, { hash });
  });
});

document.querySelectorAll("[data-home-anchor]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const hash = link.getAttribute("href");
    showPage("home", { hash });
  });
});

window.addEventListener("popstate", () => {
  const pageName = routeFromHash();
  showPage(pageName, { updateHistory: false, hash: window.location.hash, scroll: false });
  scrollToHash(window.location.hash);
});

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -45px" });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
  revealObserver.observe(element);
});

document.querySelectorAll(".interactive").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    element.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
});

document.querySelectorAll(".interactive-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
    card.style.setProperty("--ry", `${((x / rect.width) - .5) * 3}deg`);
    card.style.setProperty("--rx", `${((y / rect.height) - .5) * -3}deg`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.setProperty("--ty", `${x * 2.2}deg`);
    card.style.setProperty("--tx", `${y * -2.2}deg`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tx", "0deg");
    card.style.setProperty("--ty", "0deg");
  });
});

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const start = performance.now();
    const duration = 900;
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    counterObserver.unobserve(element);
  });
}, { threshold: .7 });

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

const initialPage = routeFromHash();
showPage(initialPage, { updateHistory: false, hash: window.location.hash, scroll: false });
updateScrollUI();
