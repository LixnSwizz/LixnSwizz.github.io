(() => {
  window.__portfolioReady = true;

  /* Draw the hero timeline once it is mostly in view */
  const ruler = document.querySelector(".ruler");
  if (ruler) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            ruler.classList.add("is-drawn");
            observer.disconnect();
          }
        },
        { threshold: 0.6 },
      );
      observer.observe(ruler);
    } else {
      ruler.classList.add("is-drawn");
    }
  }

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  /* Mobile menu */
  const setMenu = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
    nav.classList.toggle("is-open", open);
  };

  toggle?.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });

  /* Hairline under the header once the page has scrolled */
  const markScrolled = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
  markScrolled();
  window.addEventListener("scroll", markScrolled, { passive: true });

  /* Copy email address */
  const copyButton = document.querySelector("[data-copy]");
  const copyLabel = copyButton?.querySelector(".copy-label");
  const copyStatus = document.querySelector(".copy-status");
  let resetTimer;

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      field.remove();
      return copied;
    }
  };

  copyButton?.addEventListener("click", async () => {
    const copied = await copyText(copyButton.dataset.copy);
    if (copyLabel) copyLabel.textContent = copied ? "Copied" : "Copy email";
    if (copyStatus) {
      copyStatus.textContent = copied
        ? "Email address copied."
        : "Couldn’t copy automatically. Select the address above instead.";
    }
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      if (copyLabel) copyLabel.textContent = "Copy email";
      if (copyStatus) copyStatus.textContent = "";
    }, 2400);
  });

  /* Footer year */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
