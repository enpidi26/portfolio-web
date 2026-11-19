# Changelog

---

## [v1.7] — 2026-11-19

### Documentation
- Rewrote `README.md` and `docs/README.md` in English with a professional structure, clearer setup and customization instructions, and a project structure overview.

---

## [v1.6] — 2026-11-19

### Changed
- Removed third-party branding references from source comments and changelog.

---

## [v1.5] — 2026-11-18

### Changed / Structure
- **Reorganisasi struktur proyek**: seluruh file runtime dipindah ke `assets/`, sedangkan dokumentasi dan lisensi font ke `docs/`. Tidak ada perubahan perilaku situs.
  - `app.js` → `assets/js/main.js`
  - `style.css` → `assets/css/main.css`
  - `fonts.css` → `assets/css/fonts.css`
  - `tailwind.css` → `assets/css/tailwind.css`
  - `fonts/` → `assets/fonts/`
  - `icon/profile/` → `assets/icons/`
  - `Dokumentasi/` → `docs/`
  - `screenshot-*.png` → `docs/screenshots/desktop-dark.png` (dan nama sejenis)
  - `fonts/LICENSE-*.txt` → `docs/licenses/Inter-OFL-1.1.txt` dan `docs/licenses/JetBrains-Mono-OFL-1.1.txt`
- Seluruh referensi diperbarui: `index.html`, `assets/css/fonts.css`, `tailwind.config.js` (content path + perintah compile), dan `_headers` (cache untuk `/assets/fonts/*` dan `/assets/icons/*`).
- **Font preload**: kedua file `.woff2` sekarang di-preload langsung dari `<head>` (sebelumnya hanya dimuat lewat `fonts.css`), sehingga selaras dengan dokumentasi dan mempercepat render teks.
- Nama file diseragamkan (kebab-case, lowercase); `README.md` dan `docs/README.md` ditulis ulang mengikuti struktur baru.

### Notes
- Entri changelog di bawah v1.5 masih memakai path lama sesuai kondisi saat rilis.

---

## [v1.4] — 2026-11-17

### Fixed
- **Lingkaran efek pointer (halo kursor tinta) nyangkut setelah ganti tema**: Chrome tidak mengirim `pointermove` secara normal selama View Transition dan justru mengirim `pointerleave` palsu (`relatedTarget: null`, koordinat masih di dalam halaman). Handler lama memakai `pointerleave` itu untuk menyembunyikan kursor, lalu kursor digambar ulang di posisi lama — jadi lingkaran tertinggal di posisi klik. Sekarang posisi pointer dilacak dari **semua** event pointer, `pointerleave` hanya menyembunyikan kursor jika koordinatnya benar-benar di luar viewport (atau window blur), dan setelah bloom kursor langsung di-snap ke posisi pointer terakhir. Terukur: setelah bloom, dot ada di posisi pointer (bukan posisi lama), tetap terlihat saat idle, hilang saat pointer benar-benar keluar, dan kembali saat masuk.
- **Lingkaran bloom berhenti di tengah lalu terasa nyangkut**: radius akhir dulu `jarak-terjauh + 100px` dan easing-nya `cubic-bezier(0.25, 1, 0.5, 1)`, sehingga ~99% viewport sudah tertutup pada ~300 ms dari total 700 ms — sisa ~400 ms layar benar-benar diam (snapshot masih menutupi halaman). Sekarang radius akhir presisi (`+2px`) dan animasinya `linear` 500 ms: terukur gerakan terlihat 95 ms → 546 ms tanpa plateau. Bentuk, origin, dan warna bloom tidak berubah.
- **Cursor “nyangkut” saat ganti tema**: the ink canvas is part of the View Transition snapshot, so it froze at its old position while the native pointer was hidden. The canvas is now hidden for the duration of the bloom and the OS cursor is restored; the ink cursor returns (with the correct palette) as soon as the transition settles.
- **Cursor hilang setelah ganti tema**: spurious `pointerleave` events fired by the View Transition pseudo-elements no longer hide the cursor (debounced + ignored while transitioning).
- **State transisi bisa nyangkut permanen**: `isThemeTransitioning` / `no-transitions` are now always cleaned up, with a 2.5 s safety net for skipped or aborted transitions.
- **Flash tema gelap** for light-mode visitors: the stored theme is applied by an inline script in `<head>`, before the first paint (previously it was applied on `DOMContentLoaded`).
- **Halaman kosong jika `localStorage` diblokir**: theme storage is wrapped in `try/catch`, so a blocked storage no longer aborts the whole init chain.
- **Tombol Copy diam saja di origin non-HTTPS**: clipboard now has a `document.execCommand` fallback and failure feedback.
- **Race pada filter proyek**: rapid filter clicks no longer stack render timers; clicking the active filter is a no-op.

### Changed / Performance
- **Tailwind Play CDN → `tailwind.css` precompiled**: same utilities (verified pixel-identical), 13 KB CSS instead of a ~400 KB in-browser compiler that blocked rendering.
- **Fonts self-hosted** (`fonts/` + `fonts.css`, latin subset, preloaded): removes two third-party origins and the render-blocking Google Fonts request.
- **Ink cursor loop parks itself** when the cursor is hidden or the pointer is still: idle main-thread usage dropped from ~12–15% to ~0.1% of a core. No visual change (the last frame stays on screen).
- Canvas colour is cached instead of reading `getComputedStyle` every frame; viewport size is cached; resize is debounced (mobile URL-bar resize no longer reallocates the full-screen buffer while scrolling).
- `_headers`: CSP tightened (`cdn.tailwindcss.com` and Google Fonts removed, `object-src`/`base-uri`/`form-action` added) and long-lived caching for `/fonts/*` and `/icon/*`.

### Accessibility
- `aria-pressed` on the project filters, `aria-controls` on filter buttons, `role="status"` + `aria-live` for copy feedback, `type="button"` on all buttons.
- `<noscript>` fallback so content is no longer invisible when JavaScript is unavailable.

---

## [v1.3] — 2026-10-08

### Added
- **Signature Ink Cursor**:
  - Fullscreen high-performance 2D canvas calligraphy ink trail (smooth 60fps).
  - Trailing interpolation (lerp 0.2) with a solid center dot and translucent trailing halo ring.
  - Calligraphy ink trail fading smoothly over 700ms with decreasing line thickness.
  - Interactive magnetic feedback: halo radius expands when hovering clickable links, buttons, and filter pills.
  - Click feedback: center dot & halo scale dynamically on `pointerdown`.
  - Zero interference with accessibility: disabled gracefully on touch devices (`pointer: coarse`) and when `prefers-reduced-motion` is active.
  - Dynamic palette matching: ink color automatically synchronizes with light mode (`#18181b`) and dark mode (`#fafafa`).
- **Signature Blur Reveal Animations (`.rv` / `[data-in="true"]`)**:
  - Soft ink blur (14px) and translation entrance using `IntersectionObserver`.
  - Staggered entrance delays on top sections and on-scroll blur reveal on lower sections.
- **Ambient Breathe Texture**:
  - Subtle breathing organic paper texture animation (`body::before`) while preserving the original layout and monochrome colors.
- **Enhanced Project Filter Transitions**:
  - Filter fade-in and fade-out updated with blur and cubic-bezier ink easing curves.
- **Ink Bloom Theme Transition**:
  - Expanding circular ink bloom (View Transition API) paced with the signature easing `cubic-bezier(0.2, 0.9, 0.25, 1)`.
  - Restored Physical Ink Bloom Shockwave element (`.ink-bloom-wave`) with diffused radial gradient mist traveling concurrently with the reveal wave.
  - Optimized shockwave for mobile by replacing GPU-costly `filter: blur()` with pure CSS radial-gradient color stops (0ms blur penalty, 60fps fluid on mobile).
  - Tactile ink-stamp page settle effect (`.theme-bloom-landing`) using composited scale transforms without forced reflow.
  - Adaptive duration: fast & snappy 420ms on mobile, cinematic 650ms on desktop.
  - Seamless fallback on background, borders, and typography for browsers without View Transitions.
  - Interactive ink cursor canvas remains live and uninterrupted across transitions.
- **HTTP Security Hardening (`_headers`)**:
  - Implemented production security headers for Cloudflare Pages (X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy, HSTS, and Content-Security-Policy).
  - Protected against Clickjacking, MIME-sniffing, sensor abuse, and cross-origin attacks without altering frontend code.

### Fixed
- **Project Filter Buttons Visual Definition & Tactile Click**:
  - Added thin black border (`border: 1px solid #18181b` in light, `#3f3f46` in dark) to all filter buttons (All, Projects, Experiments) so they are immediately identifiable as interactive buttons.
  - Enhanced tactile click feedback (`transform: scale(0.92)`) with smooth state morphing on active filter changes.
- **Theme Transition Mobile & Responsive Replacement (Pure Seamless Crossfade)**:
  - Replaced circular clip-path bloom on mobile and responsive viewports (`<= 768px`) with an elegant, snappy crossfade dissolve (280ms).
  - Completely eliminates awkward diagonal sweeping ("kepinggir bergerak") and corner-clip snapping ("patah pas akhir") on narrow portrait screens.
  - Desktop retains the signature expanding circular bloom with hardware-accelerated WAAPI and `fill: forwards`.
- **Mobile Touch Ink Cursor & Automatic Touch-Release Cleanup**:
  - Pointer dot, halo, and calligraphy ink trail appear smoothly during touch, drag, and touch-scrolling like desktop Windows.
  - Automatically and smoothly fades out (~150-200ms) on touch release (`touchend`/`touchcancel`) so no pointer mark or dot remains on screen when finger is lifted.
- **Theme Transition Mobile Optimization (Pure 60fps)**:
  - Eliminated concurrent multi-layer GPU compositor strain on mobile (removed redundant 2000px DOM gradient wave and page scaling during View Transitions on mobile viewports).
  - Enforced hardware-accelerated texture rasterization (`backface-visibility: hidden; transform: translateZ(0); will-change: clip-path`) for View Transition snapshot pseudo-elements.
  - Streamlined mobile transition duration to a snappy 350ms with `cubic-bezier(0.22, 1, 0.36, 1)`, providing an instantaneous, 60fps circular ink reveal without stutter.
  - Prevented forced reflow layout thrashing on theme switch with `requestAnimationFrame`.
- **Theme Transition Responsive Corner Snap ("Patahan di Ujung")**:
  - Fixed premature stalling and snapping of the circular bloom animation at the furthest viewport corner on responsive and mobile displays.
  - Replaced extreme deceleration curve with fluid `cubic-bezier(0.42, 0, 0.58, 1)` (ease-in-out), ensuring the expanding circle sweeps through the corners with confident momentum at ~72-74% of duration and smoothly finishes off-screen.
  - Dynamically calculated radius using layout and visual viewports with proportional `1.12x + 60px` overshoot buffer, compensating for high-DPI (Retina) scaling discrepancies and dynamic mobile browser toolbars.
  - Added temporary `no-transitions` class with synchronous reflow flush during View Transition snapshot capture, guaranteeing zero style/icon lag between the snapshot and live DOM upon completion.
  - Added `pointer-events: none` on `::view-transition` and cleared canvas touch trails during theme toggling.

---

## [v1.2] — 2025-09-20

### Added
- **Browser Tab Icon**: Favicon installed (`favicon.ico`, `favicon-32.png`, `favicon-512.png`) for brand identity
- **Licenses & Certifications Section**: Full 12 certifications with dates, styled consistently with other sections
- **Entrance Animations**: Smooth fade-in & slide-up animations on page load, staggered across all sections (Header → Intro → Projects → Experience → Education → Licenses → Toolkit → Contact → Footer)
- **Filter Button Animations**: Smooth color transitions and scale effects on hover/active state for All/Projects/Experiments filter buttons
- **Project Filter Animations**: Animated transitions when filtering projects — items animate out smoothly before new items fade in with staggered delays

### Changed
- **Content Updates**: Replaced all placeholder content (Alex Chen) with Navid Athallah's real profile data from LinkedIn
- **Profile Info**:
  - Name: Alex Chen → Navid Athallah
  - Tagline: Designer & Developer → IT Enjoyer | AI Native Engineer
  - Bio: Full rewrite to match profile
  - Email: hello@alexdesign.dev → athallahnavid@gmail.com
  - Browser tab title: Alex — Designer & Developer → Navid Athallah
- **Experience Section**: Updated with 3 actual experiences from LinkedIn (OSIS roles, creative work)
- **Education Section**: Added (previously non-existent) with Politeknik IDN Bogor and MA, MIPA entries
  - Pendidikan: "S.Teknik, Rekayasa Perangkat Lunak" → "D4 Teknologi Rekayasa Perangkat Lunak"
- **Toolkit Section**:
  - Removed "Design" category (user is not a designer)
  - Restructured to 4 categories: Development, Design, Editing, Videography & Photography
  - Added: Canva, Affinity, CapCut, Davinci Resolve 16, Snapseed, Lightroom, Mobile, Mirrorless, Stabilizer Operation, Drone Camera
  - Added: Laravel (to Development)
- **Footer**: Copyright updated to Navid Athallah
- **Section Numbers**: Renumbered after adding Education section (5=Education, 6=Licenses, 7=Toolkit, 8=Contact, 9=Footer)

### Fixed
- **Filter Buttons**: Removed conflicting Tailwind `transition-colors` classes, simplified CSS transitions to prevent layout shifts and scrollbar appearance issues
- **Filter Animation Bug**: Removed `overflow-x-auto` from filter container that was causing unexpected scrollbar during filter transitions

---

## [v1.0] — Initial Release (before profile updates)

### Added
- Initial portfolio setup with Tailwind CSS CDN (zero-install)
- Dark mode support with localStorage persistence
- Project filtering (All/Projects/Experiments)
- Copy email to clipboard functionality
- Availability status indicator
- Custom scrollbar styling
- Selection highlight in monochrome
- Font: Inter + JetBrains Mono

### Structure
- 6 Sections: Header, Intro, Projects, Experience, Toolkit, Contact
- Sample/placeholder content for all sections

---

## Notes

- All versions are static HTML/CSS/JS with zero build tools required
- Simply open `index.html` in any browser to view
