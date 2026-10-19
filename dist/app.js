(() => {
  const config = window.SITE_CONFIG;
  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => [...root.querySelectorAll(s)];

  qsa("[data-brand-name]").forEach((el) => (el.textContent = config.brand.name));
  qsa("[data-brand-descriptor]").forEach((el) => (el.textContent = config.brand.descriptor));
  qsa("[data-owner-name]").forEach((el) => (el.textContent = config.brand.owner));
  qsa("[data-email-text]").forEach((el) => (el.textContent = config.brand.email));
  qsa("[data-email-link]").forEach((el) => {
    el.href = `mailto:${config.brand.email}?subject=Project%20brief%20for%20${encodeURIComponent(config.brand.name)}`;
  });
  qsa("[data-whatsapp-text]").forEach((el) => (el.textContent = config.brand.whatsappDisplay));
  qsa("[data-whatsapp-link]").forEach((el) => {
    const message = "Hello Abdulhameed, I saw your portfolio and would like to discuss a project.";
    el.href = `https://wa.me/${config.brand.whatsapp}?text=${encodeURIComponent(message)}`;
  });
  qsa("[data-booking-link]").forEach((el) => {
    el.href = config.brand.bookingUrl;
  });
  const grid = qs("#portfolio-grid");
  config.portfolio.forEach((project) => {
    const article = document.createElement("article");
    article.className = `project-card ${project.category === "email" ? "email" : ""} reveal`;
    article.dataset.category = project.category;
    article.tabIndex = 0;
    article.setAttribute("role", "button");
    article.setAttribute("aria-label", `View details for ${project.title}`);
    article.innerHTML = `<div class="project-image"><img src="${project.image}" alt="${project.alt}" loading="lazy"><span class="project-badge">Source checked</span></div><div class="project-copy"><div><p>${project.type}</p><h3>${project.title}</h3></div><button type="button" aria-label="View details for ${project.title}">↗</button></div>`;
    const open = () => openProject(project);
    article.addEventListener("click", open);
    article.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
    });
    grid.append(article);
  });

  const renderAutomationSamples = (group, targetSelector) => {
    const target = qs(targetSelector);
    config.automationSamples
      .filter((sample) => sample.group === group)
      .forEach((sample) => {
        const article = document.createElement("article");
        article.className = `automation-card automation-card-${sample.group} reveal`;
        article.innerHTML = `<div class="automation-card-top"><span>${sample.kind}</span></div><button class="automation-image" type="button" aria-label="View the full workflow sample for ${sample.title}"><img src="${sample.image}" width="${sample.imageWidth}" height="${sample.imageHeight}" alt="${sample.alt}" loading="lazy" decoding="async"><span>View full sample <b aria-hidden="true">↗</b></span></button><div class="automation-card-copy"><h4>${sample.title}</h4><p>${sample.purpose}</p><small>${sample.evidence}</small></div>`;
        qs(".automation-image", article).addEventListener("click", () => openAutomation(sample));
        target.append(article);
      });
  };
  renderAutomationSamples("workflow", "#automation-workflows");
  renderAutomationSamples("journey", "#automation-journeys");

  const testimonials = qs("#testimonials-grid");
  config.testimonials.forEach((testimonial) => {
    const article = document.createElement("article");
    article.className = "testimonial-card reveal";
    const testimonialMeta = testimonial.source && testimonial.rating ? `<small>${testimonial.source} · ${testimonial.rating}</small>` : "";
    article.innerHTML = `<span class="testimonial-mark" aria-hidden="true">“</span><blockquote>${testimonial.quote}</blockquote><footer><strong>${testimonial.name}</strong>${testimonialMeta}</footer>`;
    testimonials.append(article);
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
    qs("#dialog-source").href = `mailto:${config.brand.email}?subject=${encodeURIComponent(`Project brief: ${project.title}`)}`;
    dialog.showModal();
  }
  qs(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

  const automationDialog = qs("#automation-dialog");
  function openAutomation(sample) {
    qs("#automation-dialog-image").src = sample.image;
    qs("#automation-dialog-image").alt = sample.alt;
    qs("#automation-dialog-title").textContent = sample.title;
    qs("#automation-dialog-type").textContent = sample.kind;
    qs("#automation-dialog-purpose").textContent = sample.purpose;
    qs("#automation-dialog-evidence").textContent = sample.evidence;
    qs("#automation-dialog-asset").textContent = sample.originalAsset;
    automationDialog.showModal();
  }
  qs(".automation-dialog-close").addEventListener("click", () => automationDialog.close());
  automationDialog.addEventListener("click", (event) => { if (event.target === automationDialog) automationDialog.close(); });

  const menuButton = qs(".menu-button");
  const nav = qs("#site-nav");
  const closeMenu = () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  };
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });
  qsa("#site-nav a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  document.addEventListener("click", (event) => {
    if (nav.classList.contains("open") && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 900) closeMenu(); });

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), { threshold: 0.08 });
  qsa(".reveal").forEach((el) => observer.observe(el));
})();
