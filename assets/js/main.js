/**
 * Minimalist Non-Slop Portfolio Script
 * Zero-install, pure ES6+, fully responsive
 */

const PROJECTS = [
  {
    id: "kabi-rag",
    title: "Kabi RAG",
    category: "projects",
    year: "2026",
    description: "Per-project RAG memory MCP server and embedded React dashboard enabling persistent codebase context for AI coding agents.",
    tags: ["Go", "MCP", "Vector DB", "React"],
    link: "https://github.com/enpidi26/kabi-rag",
    previewHint: "MCP Server • Go 1.26"
  },
  {
    id: "lepsink",
    title: "Lepsink",
    category: "projects",
    year: "2026",
    description: "Privacy-centric personal finance web app featuring a tactile 90s OS aesthetic, Gemini Vision receipt scanning, and zero-login sync.",
    tags: ["Vanilla JS", "Cloudflare D1", "Gemini AI"],
    link: "https://github.com/enpidi26/lepsink-byrakitfactories",
    previewHint: "Web App • 90s Retro OS"
  },
  {
    id: "alphakit",
    title: "AlphaKit",
    category: "experiments",
    year: "2026",
    description: "Offline desktop tool for Roblox Studio creators with AI-assisted building, Luau generation, and native MCP bridge.",
    tags: ["Rust", "Tauri v2", "Three.js", "Luau"],
    link: "https://github.com/enpidi26/alphakit",
    previewHint: "Desktop App • Tauri v2"
  },
  {
    id: "9router-extra-tools",
    title: "9router Extra Tools",
    category: "experiments",
    year: "2026",
    description: "CLI orchestrator for multi-provider credentials, upstream anti-fingerprint patching, and smart fallback routing for 9router.",
    tags: ["Python", "SQLite", "CLI", "AI Routing"],
    link: "https://github.com/enpidi26/9router-extra-tools",
    previewHint: "CLI Tool • Zero Deps"
  },
  {
    id: "moramoka",
    title: "MoraMoka",
    category: "projects",
    year: "2026",
    description: "Bakery storefront and food ordering platform with realtime order management, Decap CMS, and Cloudflare Pages Functions.",
    tags: ["JavaScript", "Cloudflare Pages", "Decap CMS"],
    link: "https://github.com/enpidi26/moramoka-web",
    previewHint: "E-Commerce • Cloudflare"
  },
  {
    id: "rf-harness",
    title: "RF Harness",
    category: "experiments",
    year: "2026",
    description: "Browser port seam replacing Electron with WebSocket IPC to run multi-agent office simulations and delegated tasks in a web tab.",
    tags: ["TypeScript", "React", "WebSocket", "Node.js"],
    link: "https://github.com/enpidi26/rf-harness",
    previewHint: "Browser Port • WebSocket"
  }
];

let activeFilter = "all";
let projectRenderTimer = 0;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initInkCursor();
  renderProjects();
  setupFilterListeners();
  setupCopyEmail();
  initScrollReveal();
});


// Theme Management
const THEME_KEY = "portfolio-theme";

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (e) {
    return null; // storage blocked (private mode / sandboxed frame)
  }
}

function storeTheme(value) {
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch (e) {
    /* theme still applies for this session */
  }
}

function initTheme() {
  // The class is already correct thanks to the inline script in <head>;
  // re-applying it here keeps things in sync and covers JS-only entry points.
  document.documentElement.classList.toggle("dark", readStoredTheme() !== "light");
  updateThemeButton();
}

let isThemeTransitioning = false;
let themeSettleTimer = 0;

// Replaced by initInkCursor(). No-ops until the cursor is set up.
let suspendInkCursor = () => {};
let resumeInkCursor = () => {};

function settleThemeTransition() {
  window.clearTimeout(themeSettleTimer);
  document.documentElement.classList.remove("no-transitions", "theme-transitioning");
  isThemeTransitioning = false;
  resumeInkCursor();
}

function toggleTheme(event) {
  if (isThemeTransitioning) return;

  const applyTheme = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    storeTheme(isDark ? "dark" : "light");
    updateThemeButton();
  };

  const btn = document.getElementById("theme-toggle");

  // Pure WAAPI Circular Bloom View Transition
  if (
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    isThemeTransitioning = true;

    // Determine bloom origin: prefer button center, fall back to event coords
    let x = window.innerWidth - 48;
    let y = 48;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      x = Math.round(rect.left + rect.width / 2);
      y = Math.round(rect.top + rect.height / 2);
    } else if (event && typeof event.clientX === "number" && event.clientX > 0) {
      x = Math.round(event.clientX);
      y = Math.round(event.clientY);
    }

    // Exact distance to the furthest corner. A big overshoot (+100px) used to
    // keep expanding after the viewport was already fully covered, which made
    // the last ~350ms of the transition look frozen.
    const endRadius = Math.ceil(Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )) + 2;

    // Responsive animation: Snappy crossfade on mobile/responsive, circular bloom on desktop
    const isMobile = window.innerWidth <= 768;
    const dur = 500;
    // Linear radius = constant edge speed and, with the exact end radius, the
    // circle keeps visibly growing until the transition ends. The old
    // ease-out curve covered ~99% of the viewport in the first 300ms of a
    // 700ms transition, so the rest looked frozen.
    const bloomEase = "linear";

    // Lock transitions on live DOM during snapshot
    document.documentElement.classList.add("no-transitions");

    // The live DOM is covered by the View Transition snapshots, so a canvas
    // cursor cannot move during the bloom. Hand the pointer back to the OS and
    // hide the frozen dot; resumeInkCursor() restores it when the bloom settles.
    suspendInkCursor();

    let transition;
    try {
      transition = document.startViewTransition(() => {
        applyTheme();
      });
    } catch (e) {
      document.documentElement.classList.remove("no-transitions");
      resumeInkCursor();
      applyTheme();
      isThemeTransitioning = false;
      return;
    }

    // Safety net: a skipped/aborted transition does not always settle its
    // `finished` promise. Never leave the page stuck in a transitioning state.
    themeSettleTimer = window.setTimeout(settleThemeTransition, 2500);

    // Attach animation cleanly when pseudo-elements are ready
    transition.ready
      .then(() => {
        if (isMobile) {
          // Mobile & responsive: Smooth, elegant cross-fade (dissolve).
          // Eliminates awkward diagonal sweep ("kepinggir bergerak") and corner snap ("patah").
          document.documentElement.animate(
            [
              { opacity: 0 },
              { opacity: 1 }
            ],
            {
              duration: 280,
              easing: "cubic-bezier(0.25, 1, 0.5, 1)",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        } else {
          // Desktop: Expanding circular bloom from toggle button
          document.documentElement.animate(
            [
              { clipPath: `circle(0px at ${x}px ${y}px)` },
              { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
            ],
            {
              duration: dur,
              easing: bloomEase,
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        }
      })
      .catch(() => {});

    // Clean up when the transition finishes or aborts (e.g. window resize)
    transition.finished
      .catch(() => {})
      .finally(settleThemeTransition);

  } else {
    // Smooth fallback for browsers without View Transitions API
    document.documentElement.classList.add("theme-transitioning");
    applyTheme();
    // Keep the ink palette in sync (and repaint a parked cursor dot).
    resumeInkCursor();
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
      isThemeTransitioning = false;
    }, 350);
  }
}

function updateThemeButton() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const isDark = document.documentElement.classList.contains("dark");
  btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

// Project Rendering (Responsive list cards)
function renderProjects(animate = true) {
  const container = document.getElementById("projects-list");
  if (!container) return;

  const filtered = PROJECTS.filter(p => activeFilter === "all" || p.category === activeFilter);

  // Build new HTML with animation classes
  const newHTML = filtered.map((project, index) => `
    <article class="project-item group py-5 sm:py-6 border-b border-neutral-200 dark:border-neutral-800 last:border-0 last:pb-0 ${animate ? 'animate-project-in' : ''}" ${animate ? `style="animation-delay: ${0.05 + index * 0.08}s"` : ''}>
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-2">
        <h3 class="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 hover:underline underline-offset-4">
            <span>${project.title}</span>
            <span class="text-xs text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">↗</span>
          </a>
        </h3>
        <span class="text-xs font-mono text-neutral-400 dark:text-neutral-500 tabular-nums">
          ${project.year}
        </span>
      </div>

      <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3 max-w-xl">
        ${project.description}
      </p>

      <!-- Tags & category metadata -->
      <div class="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span class="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-tight shrink-0">
          ${project.previewHint}
        </span>
        <span class="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
        <div class="flex flex-wrap items-center gap-1.5">
          ${project.tags.map(tag => `
            <span class="text-[11px] sm:text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700/60">
              ${tag}
            </span>
          `).join("")}
        </div>
      </div>
    </article>
  `).join("");

  if (animate && container.children.length > 0) {
    // Animate out existing items
    const existingItems = container.querySelectorAll('.project-item');
    existingItems.forEach((item, i) => {
      item.style.animationDelay = `${i * 0.03}s`;
      item.classList.add('animate-project-out');
    });

    // After out animation completes, replace with new items
    window.clearTimeout(projectRenderTimer);
    projectRenderTimer = window.setTimeout(() => {
      container.innerHTML = newHTML;
    }, 150 + existingItems.length * 30);
  } else {
    container.innerHTML = newHTML;
  }
}

// Filter listeners
function setupFilterListeners() {
  const buttons = document.querySelectorAll(".filter-btn");
  const setActive = (selected) => {
    buttons.forEach(b => {
      const isActive = b === selected;
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.filter === activeFilter) return; // nothing to re-render
      setActive(btn);
      activeFilter = btn.dataset.filter;
      renderProjects();
    });
  });

  setActive(document.querySelector('.filter-btn[data-filter="all"]'));
}

// Copy Email with unobtrusive inline feedback
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for non-secure origins (LAN http://) where the Clipboard API is absent
  return new Promise((resolve, reject) => {
    try {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.top = "-1000px";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(field);
      ok ? resolve() : reject(new Error("copy failed"));
    } catch (err) {
      reject(err);
    }
  });
}

function setupCopyEmail() {
  const btn = document.getElementById("copy-email");
  const feedback = document.getElementById("copy-feedback");
  if (!btn || !feedback) return;

  let feedbackTimer = 0;
  const showFeedback = (message) => {
    feedback.textContent = message;
    feedback.classList.remove("opacity-0");
    window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
      feedback.classList.add("opacity-0");
    }, 2000);
  };

  btn.addEventListener("click", () => {
    const email = btn.dataset.email || "navidvkt@gmail.com";
    copyText(email).then(
      () => showFeedback("Copied to clipboard"),
      () => showFeedback("Press Ctrl+C to copy")
    );
  });
}

// Global expose for theme button
window.toggleTheme = toggleTheme;

/**
 * Ink Cursor
 * High-performance 2D canvas calligraphy trail with magnetic hover halo
 */
function initInkCursor() {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let canvas = document.getElementById("ink-cursor");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "ink-cursor";
    canvas.className = "ink-cursor";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
  }

  if (isReducedMotion) {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.setAttribute("data-active", "true");
  document.documentElement.classList.add("ink-cursor-on");

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let viewW = window.innerWidth;
  let viewH = window.innerHeight;

  let inkColor = "";
  const refreshInkColor = () => {
    inkColor = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() ||
      (document.documentElement.classList.contains("dark") ? "#fafafa" : "#18181b");
  };
  refreshInkColor();

  const finePointer = window.matchMedia("(pointer: fine)");
  const HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, .project-item, .filter-btn';
  const TRAIL_LIFE = 700;
  const IDLE_AFTER = 900;

  let rafId = null;
  let booted = false;
  let suspended = false;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    canvas.width = Math.round(viewW * dpr);
    canvas.height = Math.round(viewH * dpr);
    canvas.style.width = `${viewW}px`;
    canvas.style.height = `${viewH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    startLoop();
  };

  // The loop parks itself when there is nothing left to draw (hidden cursor or
  // a still pointer) and wakes up on the next interaction. Visually identical,
  // but an idle page no longer burns a core repainting an empty canvas.
  function startLoop() {
    if (!booted || suspended || rafId !== null) return;
    rafId = window.requestAnimationFrame(render);
  }

  resize();

  let targetX = viewW / 2;
  let targetY = viewH / 2;
  let currentX = targetX;
  let currentY = targetY;
  let isDown = false;
  let isVisible = false;
  let isHovering = false;
  let isTouchMode = false;
  let touchOpacity = 0;
  let lastTouchTime = 0;
  let lastActivity = 0;
  let haloRadius = 11;
  let lastPointerX = viewW / 2;
  let lastPointerY = viewH / 2;
  let pointerInside = false;
  const trail = [];

  // Chrome can drop or delay `pointermove` around a View Transition and emit a
  // spurious document `pointerleave` (relatedTarget = null) while the pointer is
  // still inside the page. Track the position from every pointer event instead
  // of trusting `pointermove` alone.
  const trackPointer = (x, y) => {
    lastPointerX = x;
    lastPointerY = y;
  };

  let leaveTimer = 0;
  const noteActivity = () => {
    window.clearTimeout(leaveTimer);
    lastActivity = performance.now();
    startLoop();
  };

  const handleTouchStartPos = (x, y) => {
    isTouchMode = true;
    lastTouchTime = performance.now();
    currentX = x;
    currentY = y;
    targetX = x;
    targetY = y;
    isDown = true;
    isVisible = true;
    touchOpacity = 1;
    pointerInside = true;
    trackPointer(x, y);

    const el = document.elementFromPoint(x, y);
    isHovering = !!(el && el.closest(HOVER_SELECTOR));

    trail.length = 0;
    trail.push({ x: targetX, y: targetY, t: performance.now() });
    noteActivity();
  };

  const handleTouchMovePos = (x, y) => {
    isTouchMode = true;
    lastTouchTime = performance.now();
    targetX = x;
    targetY = y;
    isVisible = true;
    isDown = true;
    touchOpacity = 1;
    pointerInside = true;
    trackPointer(x, y);

    const el = document.elementFromPoint(x, y);
    isHovering = !!(el && el.closest(HOVER_SELECTOR));

    trail.push({ x: targetX, y: targetY, t: performance.now() });
    if (trail.length > 60) trail.shift();
    noteActivity();
  };

  const handleTouchEndPos = () => {
    isTouchMode = true;
    lastTouchTime = performance.now();
    isDown = false;
    isHovering = false;
  };

  const onTouchStart = (e) => {
    if (!e.touches || !e.touches[0]) return;
    handleTouchStartPos(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onTouchMove = (e) => {
    if (!e.touches || !e.touches[0]) return;
    handleTouchMovePos(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onTouchEnd = () => {
    handleTouchEndPos();
  };

  const onPointerMove = (e) => {
    if (e.pointerType === "touch") {
      if (performance.now() - lastTouchTime > 150) {
        handleTouchMovePos(e.clientX, e.clientY);
      }
      return;
    }
    isTouchMode = false;
    touchOpacity = 1;
    targetX = e.clientX;
    targetY = e.clientY;
    isVisible = true;
    pointerInside = true;
    trackPointer(e.clientX, e.clientY);

    const target = e.target;
    isHovering = !!(target && target.closest(HOVER_SELECTOR));

    trail.push({ x: targetX, y: targetY, t: performance.now() });
    if (trail.length > 60) {
      trail.shift();
    }
    noteActivity();
  };

  const onPointerEnter = (e) => {
    if (e.pointerType === "touch") return;
    pointerInside = true;
    trackPointer(e.clientX, e.clientY);
    targetX = e.clientX;
    targetY = e.clientY;
    isVisible = true;
    noteActivity();
  };

  // Hide only for a real exit. `pointerleave` also fires spuriously while the
  // pointer is still inside the page (notably right before/after a View
  // Transition); hiding on those left the ink circle parked at its old spot.
  const onPointerLeave = (e) => {
    trackPointer(e.clientX, e.clientY);
    if (isTouchMode || !finePointer.matches) return;
    if (isThemeTransitioning) return;

    const outside = e.clientX <= 0 || e.clientY <= 0 || e.clientX >= viewW || e.clientY >= viewH;
    if (!outside) return;

    window.clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(() => {
      if (isThemeTransitioning) return;
      pointerInside = false;
      isVisible = false;
      startLoop();
    }, 120);
  };

  const onPointerDown = (e) => {
    if (e.pointerType === "touch") {
      if (performance.now() - lastTouchTime > 150) {
        handleTouchStartPos(e.clientX, e.clientY);
      }
      return;
    }
    isTouchMode = false;
    touchOpacity = 1;
    isDown = true;
    pointerInside = true;
    trackPointer(e.clientX, e.clientY);
    noteActivity();
  };

  const onPointerUp = (e) => {
    if (e.pointerType === "touch") {
      if (performance.now() - lastTouchTime > 150) {
        handleTouchEndPos();
      }
      return;
    }
    isTouchMode = false;
    touchOpacity = 1;
    isDown = false;
    trackPointer(e.clientX, e.clientY);
    noteActivity();
  };

  const onScroll = () => {
    if (isVisible && !isTouchMode) {
      const el = document.elementFromPoint(currentX, currentY);
      isHovering = !!(el && el.closest(HOVER_SELECTOR));
      startLoop();
    }
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  document.addEventListener("pointerenter", onPointerEnter);
  document.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("blur", () => {
    if (isTouchMode || !finePointer.matches) return;
    pointerInside = false;
    isVisible = false;
    startLoop();
  });

  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchcancel", onTouchEnd, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  // Debounced: mobile browsers fire resize while the URL bar hides/shows during
  // scrolling, and reallocating the full-screen canvas buffer each time janks.
  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  };
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize, { passive: true });

  const render = () => {
    rafId = null;

    const now = performance.now();

    // Smooth trailing interpolation (lerp 0.2)
    currentX += (targetX - currentX) * 0.2;
    currentY += (targetY - currentY) * 0.2;

    // Smoothly animate halo radius based on hover and click
    const targetHaloRadius = isDown ? 15 : (isHovering ? 20 : 11);
    haloRadius += (targetHaloRadius - haloRadius) * 0.2;

    // Smooth touch fade-out and cleanup when touch ends so no touch mark remains
    if (isTouchMode && !isDown) {
      touchOpacity -= 0.08;
      if (touchOpacity <= 0) {
        touchOpacity = 0;
        isVisible = false;
        trail.length = 0;
      }
    }

    // Drop expired trail points before painting so the last frame is clean
    while (trail.length > 0 && (now - trail[0].t) >= TRAIL_LIFE) {
      trail.shift();
    }

    ctx.clearRect(0, 0, viewW, viewH);

    if (isVisible) {
      const currentAlpha = isTouchMode ? touchOpacity : 1;

      if (currentAlpha > 0) {
        // 1. Calligraphy ink trail fading over 700ms
        for (let i = 1; i < trail.length; i++) {
          const prev = trail[i - 1];
          const curr = trail[i];
          const age = (now - curr.t) / TRAIL_LIFE;

          if (age < 1) {
            ctx.globalAlpha = (1 - age) * 0.45 * currentAlpha;
            ctx.strokeStyle = inkColor;
            ctx.lineWidth = (1 - age) * 7 + 0.5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(curr.x, curr.y);
            ctx.stroke();
          }
        }

        // 2. Solid center dot
        const dotRadius = isDown ? 7 : (isHovering ? 6 : 5);
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = inkColor;
        ctx.beginPath();
        ctx.arc(currentX, currentY, dotRadius, 0, Math.PI * 2);
        ctx.fill();

        // 3. Outer halo ring
        const baseHaloAlpha = isHovering ? 0.18 : 0.12;
        ctx.globalAlpha = baseHaloAlpha * currentAlpha;
        ctx.beginPath();
        ctx.arc(currentX, currentY, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
      }
    }

    // Park the loop: nothing is visible, or the pointer has been still long
    // enough for the trail to expire. The last painted frame stays on screen.
    const idle = !isVisible || (!isDown && trail.length === 0 && (now - lastActivity) > IDLE_AFTER);
    if (idle) return;

    rafId = window.requestAnimationFrame(render);
  };

  // A View Transition paints snapshots above the live DOM, so the canvas cannot
  // follow the pointer during the bloom. Hide it, give the pointer back to the
  // OS, and restore the ink cursor once the transition settles.
  suspendInkCursor = () => {
    suspended = true;
    window.cancelAnimationFrame(rafId);
    rafId = null;
    // Clear as well as hide: if a snapshot is captured before the style change
    // is painted, an empty canvas leaves no frozen dot behind.
    ctx.clearRect(0, 0, viewW, viewH);
    canvas.removeAttribute("data-active");
    document.documentElement.classList.remove("ink-cursor-on");
  };

  resumeInkCursor = () => {
    if (isReducedMotion) return;
    suspended = false;
    canvas.setAttribute("data-active", "true");
    document.documentElement.classList.add("ink-cursor-on");
    refreshInkColor();

    // Snap to the real pointer position: `pointermove` is unreliable during the
    // transition, so use the latest coordinates seen by any pointer event.
    targetX = lastPointerX;
    targetY = lastPointerY;
    currentX = lastPointerX;
    currentY = lastPointerY;
    if (pointerInside) isVisible = true;

    lastActivity = performance.now();
    startLoop();
  };

  booted = true;
  startLoop();
}

/**
 * Scroll Reveal (.rv)
 * Soft blur and translation transition using IntersectionObserver
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".rv");
  if (!reveals.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reveals.forEach(el => el.setAttribute("data-in", "true"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || "0", 10);
        if (delay > 0) {
          setTimeout(() => el.setAttribute("data-in", "true"), delay);
        } else {
          el.setAttribute("data-in", "true");
        }
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  reveals.forEach(el => observer.observe(el));
}
