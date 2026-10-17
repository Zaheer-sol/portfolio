(() => {
  const config = window.SITE_CONFIG;
  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => [...root.querySelectorAll(s)];

  qsa("[data-brand-name]").forEach((el) => (el.textContent = config.brand.name));
  qsa("[data-brand-descriptor]").forEach((el) => (el.textContent = config.brand.descriptor));
  qsa("[data-owner-name]").forEach((el) => (el.textContent = config.brand.owner));
  qsa("[data-email-text]").forEach((el) => (el.textContent = config.brand.email));
  qsa("[data-email-link]").forEach((el) => {
    el.href = `mailto:${config.brand.email}?subject=Project%20enquiry%20for%20${encodeURIComponent(config.brand.name)}`;
  });
  qsa("[data-source-home]").forEach((el) => (el.href = config.sources.home));
  qsa("[data-source-email]").forEach((el) => (el.href = config.sources.email));
  qs("#year").textContent = new Date().getFullYear();

  const grid = qs("#portfolio-grid");
  config.portfolio.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = `project-card ${project.category === "email" ? "email" : ""} reveal`;
    article.dataset.category = project.category;
    article.tabIndex = 0;
    article.setAttribute("role", "button");
    article.setAttribute("aria-label", `View details for ${project.title}`);
    article.innerHTML = `<div class="project-image"><img src="${project.image}" alt="${project.alt}" loading="lazy"><span class="project-badge">Source verified</span><span class="project-index">${String(index + 1).padStart(2, "0")}</span></div><div class="project-copy"><div><p>${project.type}</p><h3>${project.title}</h3></div><button type="button" aria-label="Open ${project.title}">↗</button></div>`;
    const open = () => openProject(project);
    article.addEventListener("click", open);
    article.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
    });
    grid.append(article);
  });

  const services = qs("#services-list");
  config.services.forEach((service) => {
    const item = document.createElement("article");
    item.className = "service-item reveal";
    item.innerHTML = `<span>${service.number}</span><h3>${service.title}</h3><p>${service.summary}</p><button type="button" aria-label="Show deliverables for ${service.title}" aria-expanded="false">+</button><div class="service-detail"><div><ul>${service.deliverables.map((d) => `<li>${d}</li>`).join("")}</ul></div></div>`;
    const button = qs("button", item);
    const toggle = () => { const open = item.classList.toggle("open"); button.setAttribute("aria-expanded", String(open)); };
    item.addEventListener("click", toggle);
    services.append(item);
  });

  qsa(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      qsa(".filter").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      qsa(".project-card").forEach((card) => { card.hidden = filter !== "all" && card.dataset.category !== filter; });
    });
  });

  const dialog = qs("#project-dialog");
  function openProject(project) {
    qs("#dialog-image").src = project.image;
    qs("#dialog-image").alt = project.alt;
    qs("#dialog-title").textContent = project.title;
    qs("#dialog-type").textContent = project.type;
    qs("#dialog-focus").textContent = project.focus;
    qs("#dialog-contribution").textContent = project.contribution;
    qs("#dialog-classification").textContent = project.classification;
    qs("#dialog-asset").textContent = project.originalAsset;
    qs("#dialog-source").href = config.sources[project.source];
    dialog.showModal();
  }
  qs(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

  const menuButton = qs(".menu-button");
  const nav = qs("#site-nav");
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  qsa("#site-nav a").forEach((link) => link.addEventListener("click", () => { nav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); }));

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), { threshold: 0.08 });
  qsa(".reveal").forEach((el) => observer.observe(el));
})();
