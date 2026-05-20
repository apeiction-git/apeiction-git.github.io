/**
 * Ape-ICTION — scripts optimizados para rendimiento
 */
(function () {
    "use strict";

    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData === true;
    const lowCores = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const perfLite = prefersReducedMotion || saveData || lowCores;
    const customCursorEnabled = !prefersReducedMotion && finePointer;

    if (perfLite) {
        root.classList.add("perf-lite");
    }
    if (customCursorEnabled) {
        root.classList.add("custom-cursor");
    }
    if (document.body.classList.contains("page-index")) {
        root.classList.add("page-home");
    }
    if (!finePointer) {
        root.classList.add("touch-device");
    }

    /* Pausar animaciones CSS con pestaña oculta */
    document.addEventListener("visibilitychange", () => {
        root.classList.toggle("is-tab-hidden", document.hidden);
    });

    /* ——— Utilidades ——— */
    function throttleRAF(fn) {
        let scheduled = false;
        return function throttled(...args) {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                fn(...args);
            });
        };
    }

    /* ——— Navbar ——— */
    const navbar = document.getElementById("Main-Navbar");

    if (document.body.classList.contains("page-index") && navbar) {
        navbar.classList.add("visible");
    }

    if (navbar) {
        const navPath = window.location.pathname.split("/").pop() || "index.html";
        const navMap = {
            "index.html": "inicio",
            "": "inicio",
            "SpecialThanks.html": "thanks",
            "Equipo.html": "equipo",
            "Contacto.html": "contacto"
        };
        const activeKey = navMap[navPath];
        navbar.querySelectorAll(".jungle-nav-leaf").forEach((link) => {
            if (link.dataset.nav === activeKey) {
                link.classList.add("is-active");
                link.setAttribute("aria-current", "page");
            }
        });
        if (navPath === "index.html" || navPath === "") {
            navbar.classList.add("is-home");
        }
    }

    const onScrollNav = throttleRAF(() => {
        if (!navbar) return;
        const currentScroll = window.scrollY || document.documentElement.scrollTop;
        if (!navbar._lastScroll) navbar._lastScroll = 0;

        if (currentScroll < 60 || currentScroll < navbar._lastScroll) {
            navbar.classList.add("visible");
        } else if (currentScroll > navbar._lastScroll) {
            navbar.classList.remove("visible");
        }
        navbar._lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });

    window.addEventListener("scroll", onScrollNav, { passive: true });

    /* ——— Marquee patrocinadores (index) ——— */
    const sponsorsMarquee = document.querySelector("[data-sponsors-marquee]");

    if (sponsorsMarquee && perfLite) {
        sponsorsMarquee.classList.add("is-static");
    }

    /* ——— Galería jungla + lightbox ——— */
    const galleryRoot = document.querySelector("[data-gallery]");
    let lightbox = document.getElementById("Gallery-Lightbox");

    if (galleryRoot) {
        if (lightbox && lightbox.parentElement !== document.documentElement) {
            document.documentElement.appendChild(lightbox);
        }

        const thumbs = Array.from(galleryRoot.querySelectorAll("[data-gallery-index]"));
        const mainImg = galleryRoot.querySelector("[data-gallery-main]");
        const captionEl = galleryRoot.querySelector("[data-gallery-caption]");
        const counterCurrent = galleryRoot.querySelector("[data-gallery-current]");
        const counterTotal = galleryRoot.querySelector("[data-gallery-total]");
        const prevBtn = galleryRoot.querySelector("[data-gallery-prev]");
        const nextBtn = galleryRoot.querySelector("[data-gallery-next]");
        const openBtn = galleryRoot.querySelector("[data-gallery-open]");
        const lightboxImg = document.getElementById("Lightbox-Image");
        const lightboxCaption = document.getElementById("Lightbox-Caption");
        const lightboxCloseEls = lightbox ? lightbox.querySelectorAll("[data-lightbox-close]") : [];
        const lightboxPrev = lightbox?.querySelector("[data-lightbox-prev]");
        const lightboxNext = lightbox?.querySelector("[data-lightbox-next]");

        const captions = [
            "Main Menu",
            "Look Around",
            "Use the environment",
            "Complete Levels",
            "Don't Get Tired",
            "Fly Over Obstacles",
            "Use all your Skill",
        ];

        const items = thumbs.map((thumb, index) => {
            const img = thumb.querySelector("img");
            return {
                src: img?.getAttribute("src") || img?.src || "",
                alt: captions[index] || `Escena de juego ${index + 1}`,
            };
        });

        let currentIndex = 0;
        let lightboxOpen = false;

        if (counterTotal) counterTotal.textContent = String(items.length);

        function setIndex(index) {
            currentIndex = (index + items.length) % items.length;
            const item = items[currentIndex];
            if (!item || !mainImg) return;

            mainImg.src = item.src;
            mainImg.alt = item.alt;
            if (captionEl) captionEl.textContent = item.alt;
            if (counterCurrent) counterCurrent.textContent = String(currentIndex + 1);

            thumbs.forEach((thumb, i) => {
                const active = i === currentIndex;
                thumb.classList.toggle("is-active", active);
                thumb.setAttribute("aria-current", active ? "true" : "false");
            });
        }

        function openLightbox() {
            if (!lightbox || !lightboxImg || !items[currentIndex]) return;
            const item = items[currentIndex];
            lightboxImg.src = item.src;
            lightboxImg.alt = item.alt;
            if (lightboxCaption) lightboxCaption.textContent = item.alt;
            lightbox.classList.add("open");
            lightbox.setAttribute("aria-hidden", "false");
            root.classList.add("gallery-lightbox-open");
            document.body.style.overflow = "hidden";
            lightboxOpen = true;
            lightbox.querySelector(".lightbox-close")?.focus();
        }

        function closeLightbox() {
            if (!lightbox || !lightboxImg) return;
            lightbox.classList.remove("open");
            lightbox.setAttribute("aria-hidden", "true");
            lightboxImg.removeAttribute("src");
            if (lightboxCaption) lightboxCaption.textContent = "";
            root.classList.remove("gallery-lightbox-open");
            document.body.style.overflow = "";
            lightboxOpen = false;
        }

        thumbs.forEach((thumb) => {
            thumb.addEventListener("click", () => {
                const index = Number(thumb.getAttribute("data-gallery-index"));
                if (!Number.isNaN(index)) setIndex(index);
            });
        });

        prevBtn?.addEventListener("click", (e) => {
            e.stopPropagation();
            setIndex(currentIndex - 1);
        });
        nextBtn?.addEventListener("click", (e) => {
            e.stopPropagation();
            setIndex(currentIndex + 1);
        });
        openBtn?.addEventListener("click", openLightbox);

        lightboxCloseEls.forEach((el) => el.addEventListener("click", closeLightbox));
        lightboxPrev?.addEventListener("click", (e) => {
            e.stopPropagation();
            setIndex(currentIndex - 1);
            openLightbox();
        });
        lightboxNext?.addEventListener("click", (e) => {
            e.stopPropagation();
            setIndex(currentIndex + 1);
            openLightbox();
        });

        document.addEventListener("keydown", (event) => {
            if (lightboxOpen) {
                if (event.key === "Escape") closeLightbox();
                else if (event.key === "ArrowLeft") {
                    setIndex(currentIndex - 1);
                    openLightbox();
                } else if (event.key === "ArrowRight") {
                    setIndex(currentIndex + 1);
                    openLightbox();
                }
            }
        });

        setIndex(0);
    }

    /* ——— Reveal (solo añadir clase una vez) ——— */
    const revealElements = document.querySelectorAll("[data-reveal]");

    if (revealElements.length) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
        );
        revealElements.forEach((el) => revealObserver.observe(el));
    }

    /* ——— Cursor: glow + partículas (solo escritorio con ratón fino) ——— */
    const clickableSelectors =
        "a, button, [role='button'], input, textarea, select, label, summary, .jungle-btn, .gallery-jungle__arrow, .gallery-jungle__thumb, .gallery-jungle__screen-btn, .lightbox-close, .lightbox-nav, .hero-video-play, .back-btn, .hero-scroll-cue, .itch-btn, .jungle-nav-leaf, .jungle-nav-totem, .creator-card-cta, .creator-card, .fan-card, .sponsor-card";

    if (customCursorEnabled) {
        const cursorLayer = document.createElement("div");
        cursorLayer.id = "cursor-layer";
        cursorLayer.setAttribute("aria-hidden", "true");
        document.documentElement.appendChild(cursorLayer);

        const cursorGlow = document.createElement("div");
        cursorGlow.className = "cursor-glow";
        cursorGlow.setAttribute("aria-hidden", "true");
        cursorLayer.appendChild(cursorGlow);

        let mouseX = -200;
        let mouseY = -200;
        let glowX = -200;
        let glowY = -200;
        let pointerInView = false;
        let glowLoopRunning = false;
        let lastHitTest = 0;
        let isClickable = false;

        const particlePool = [];
        const POOL_SIZE = 14;
        const MAX_ACTIVE_PARTICLES = 10;
        let activeParticles = 0;
        let lastParticleTime = 0;
        const CURSOR_SKIP = new Set([
            "cursor-glow",
            "cursor-particle",
            "cursor-click-pulse",
            "cursor-click-ripple",
            "cursor-trail",
        ]);

        for (let i = 0; i < POOL_SIZE; i++) {
            const p = document.createElement("div");
            p.className = "cursor-particle size-sm color-1";
            p.setAttribute("aria-hidden", "true");
            cursorLayer.appendChild(p);
            particlePool.push(p);
        }

        function isCursorLayer(el) {
            if (!el) return false;
            if (el.id === "cursor-layer" || el.closest?.("#cursor-layer")) return true;
            if (!el.classList) return false;
            for (const cls of CURSOR_SKIP) {
                if (el.classList.contains(cls)) return true;
            }
            return false;
        }

        function hitTestClickable(x, y) {
            const stack = document.elementsFromPoint(x, y);
            for (let i = 0; i < stack.length; i++) {
                const el = stack[i];
                if (isCursorLayer(el)) continue;
                if (el.matches?.(clickableSelectors) || el.closest?.(clickableSelectors)) {
                    return true;
                }
            }
            return false;
        }

        function releaseParticle(p, duration) {
            setTimeout(() => {
                p.classList.remove("is-active");
                p.style.removeProperty("left");
                p.style.removeProperty("top");
                activeParticles = Math.max(0, activeParticles - 1);
            }, duration);
        }

        function spawnParticle(x, y, opts = {}) {
            if (activeParticles >= MAX_ACTIVE_PARTICLES) return;
            const now = performance.now();
            const minGap = opts.burst ? 0 : 56;
            if (now - lastParticleTime < minGap) return;
            lastParticleTime = now;

            const p = particlePool.find((el) => !el.classList.contains("is-active"));
            if (!p) return;

            const sizes = opts.burst ? ["size-sm", "size-sm", "size-sm"] : ["size-sm", "size-md"];
            const colors = opts.burst
                ? ["color-1", "color-2", "color-3"]
                : ["color-1", "color-2", "color-1"];
            const size = sizes[(Math.random() * sizes.length) | 0];
            const color = colors[(Math.random() * colors.length) | 0];
            p.className = "cursor-particle is-active " + size + " " + color;

            const spread = opts.burst ? 14 : 6;
            const offsetX = (Math.random() - 0.5) * spread;
            const offsetY = (Math.random() - 0.5) * spread;
            p.style.left = x + offsetX + "px";
            p.style.top = y + offsetY + "px";

            const angle = Math.random() * Math.PI * 2;
            const dist = (opts.burst ? 22 : 14) + Math.random() * (opts.burst ? 24 : 16);
            p.style.setProperty("--tx", Math.cos(angle) * dist + "px");
            p.style.setProperty("--ty", Math.sin(angle) * dist + "px");

            activeParticles++;
            releaseParticle(p, opts.burst ? 480 : 560 + ((Math.random() * 180) | 0));
        }

        function spawnClickBurst(x, y) {
            const savedTime = lastParticleTime;
            lastParticleTime = 0;
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.35;
                const dist = 6 + Math.random() * 10;
                spawnParticle(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, { burst: true });
            }
            lastParticleTime = savedTime;
        }

        function spawnClickRipple(x, y) {
            const ripple = document.createElement("div");
            ripple.className = "cursor-click-ripple";
            ripple.style.left = x + "px";
            ripple.style.top = y + "px";
            ripple.setAttribute("aria-hidden", "true");

            const core = document.createElement("span");
            core.className = "cursor-click-ripple__core";
            ripple.appendChild(core);

            for (let i = 0; i < 3; i++) {
                const ring = document.createElement("span");
                ring.className = "cursor-click-ripple__ring";
                ring.style.animationDelay = i * 0.07 + "s";
                ripple.appendChild(ring);
            }

            cursorLayer.appendChild(ripple);
            ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
            setTimeout(() => ripple.remove(), 720);
        }

        function runGlowLoop() {
            if (!pointerInView || document.hidden) {
                glowLoopRunning = false;
                return;
            }
            glowX += (mouseX - glowX) * 0.32;
            glowY += (mouseY - glowY) * 0.32;
            cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(runGlowLoop);
        }

        function startGlowLoop() {
            if (glowLoopRunning) return;
            glowLoopRunning = true;
            requestAnimationFrame(runGlowLoop);
        }

        function setPointerVisible(visible) {
            pointerInView = visible;
            cursorGlow.classList.toggle("is-visible", visible);
            if (visible) {
                startGlowLoop();
            }
        }

        const onPointerMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!pointerInView) setPointerVisible(true);
            cursorGlow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            glowX = mouseX;
            glowY = mouseY;
            spawnParticle(mouseX, mouseY);

            const now = performance.now();
            if (now - lastHitTest > 90) {
                lastHitTest = now;
                const clickable = hitTestClickable(mouseX, mouseY);
                if (clickable !== isClickable) {
                    isClickable = clickable;
                    cursorGlow.classList.toggle("active", isClickable);
                }
            }
        };

        document.addEventListener("pointermove", onPointerMove, { passive: true });
        document.addEventListener("mousemove", onPointerMove, { passive: true });
        document.addEventListener("pointerdown", onPointerMove, { passive: true });

        document.addEventListener("mouseout", (e) => {
            if (e.relatedTarget || e.toElement) return;
            setPointerVisible(false);
            cursorGlow.classList.remove("active", "clicking");
        }, { passive: true });

        document.addEventListener("mousedown", (e) => {
            if (e.button !== 0) return;
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorGlow.classList.add("clicking");
            spawnClickBurst(e.clientX, e.clientY);
            spawnClickRipple(e.clientX, e.clientY);
        }, { passive: true });

        document.addEventListener("mouseup", () => {
            cursorGlow.classList.remove("clicking");
        }, { passive: true });

        window.addEventListener("blur", () => {
            setPointerVisible(false);
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                glowLoopRunning = false;
            } else if (pointerInView) {
                startGlowLoop();
            }
        });
    } else {
        root.classList.remove("custom-cursor");
    }

    /* ——— Parallax hero (solo index, escritorio) ——— */
    const heroSplash = document.getElementById("hero-splash");

    if (heroSplash && !perfLite && finePointer) {
        const onHeroParallax = throttleRAF((e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 16;
            const y = (e.clientY / window.innerHeight - 0.5) * 12;
            heroSplash.style.setProperty("--hero-mx", x + "px");
            heroSplash.style.setProperty("--hero-my", y + "px");
        });
        document.addEventListener("mousemove", onHeroParallax, { passive: true });
    }

    /* ——— Video: carga diferida + progreso throttled ——— */
    const videoPlayer = document.querySelector("[data-video-player]");
    const heroVideo = document.getElementById("Main-Video");
    const videoPlayBtn = document.querySelector("[data-video-play]");
    const videoProgressBar = document.querySelector("[data-video-progress]");

    if (videoPlayer && heroVideo) {
        const setPlayingState = (playing) => {
            videoPlayer.classList.toggle("is-playing", playing);
        };

        const updateProgress = throttleRAF(() => {
            if (!videoProgressBar || !heroVideo.duration) return;
            videoProgressBar.style.width = (heroVideo.currentTime / heroVideo.duration) * 100 + "%";
        });

        const videoObserver = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) return;
                if (heroVideo.preload === "none") {
                    heroVideo.preload = "metadata";
                    heroVideo.load();
                }
                videoObserver.disconnect();
            },
            { threshold: 0.2, rootMargin: "80px" }
        );
        videoObserver.observe(videoPlayer);

        videoPlayBtn?.addEventListener("click", () => {
            heroVideo.play();
            setPlayingState(true);
        });
        heroVideo.addEventListener("play", () => setPlayingState(true));
        heroVideo.addEventListener("pause", () => setPlayingState(false));
        heroVideo.addEventListener("ended", () => setPlayingState(false));
        heroVideo.addEventListener("timeupdate", updateProgress);
        heroVideo.addEventListener("loadedmetadata", updateProgress);
        heroVideo.addEventListener("click", () => {
            if (heroVideo.paused) heroVideo.play();
        });
    }

    /* ——— Lazy load imágenes fuera del viewport ——— */
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        if (img.complete) return;
        img.decoding = "async";
    });
})();
