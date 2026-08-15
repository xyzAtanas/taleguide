const body = document.body;
const sidebar = document.querySelector("#sidebar");
const menuButton = document.querySelector(".menu-button");
const closeButton = document.querySelector(".sidebar-close");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const pageSections = [...document.querySelectorAll("[data-section]")];
const searchInput = document.querySelector("#guide-search");
const guideCards = [...document.querySelectorAll(".guide-card")];
const guideSections = [...document.querySelectorAll(".guide-section")];
const emptyState = document.querySelector("#empty-state");

function setNavigation(open) {
  body.classList.toggle("nav-open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  menuButton?.querySelector(".sr-only")?.replaceChildren(document.createTextNode(open ? "Close navigation" : "Open navigation"));
  if (open) {
    closeButton?.focus();
  } else {
    menuButton?.focus();
  }
}

menuButton?.addEventListener("click", () => setNavigation(!body.classList.contains("nav-open")));
closeButton?.addEventListener("click", () => setNavigation(false));

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (body.classList.contains("nav-open")) setNavigation(false);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput?.focus();
  }
  if (event.key === "Escape" && body.classList.contains("nav-open")) {
    setNavigation(false);
  }
});

function setActiveSection(id) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.navLink === id;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActiveSection(visible[0].target.dataset.section);
    },
    { rootMargin: "-18% 0px -68% 0px", threshold: [0.01, 0.2, 0.6] },
  );
  pageSections.forEach((section) => sectionObserver.observe(section));
}

function filterGuides() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  guideCards.forEach((card) => {
    const matches = !query || card.dataset.searchable.includes(query) || card.textContent.toLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  guideSections.forEach((section) => {
    const matches = !query || section.dataset.searchable.includes(query) || section.textContent.toLowerCase().includes(query);
    section.hidden = !matches;
    if (matches && query) visibleCount += 1;
  });

  emptyState.hidden = visibleCount !== 0;
}

searchInput?.addEventListener("input", filterGuides);
