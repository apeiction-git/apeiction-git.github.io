let lastScrollTop = 0;
const navbar = document.getElementById("Main-Navbar");

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (!navbar) {
        return;
    }

    if (currentScroll <= 50) {
        // Mostrar navbar al estar arriba
        navbar.classList.add("visible");
    } else if (currentScroll > lastScrollTop) {
        // Ocultar al bajar
        navbar.classList.remove("visible");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

const galleryRoot = document.querySelector("[data-gallery]");

if (galleryRoot) {
    const slides = Array.from(galleryRoot.querySelectorAll(".gallery-slide"));
    const prevBtn = galleryRoot.querySelector("[data-gallery-prev]");
    const nextBtn = galleryRoot.querySelector("[data-gallery-next]");
    const dotsContainer = document.querySelector("[data-gallery-dots]");
    const lightbox = document.getElementById("Gallery-Lightbox");
    const lightboxImg = document.getElementById("Lightbox-Image");
    const lightboxClose = lightbox?.querySelector("[data-lightbox-close]");
    const lightboxPrev = lightbox?.querySelector("[data-lightbox-prev]");
    const lightboxNext = lightbox?.querySelector("[data-lightbox-next]");
    let currentIndex = 0;
    let autoplayTimer;

    const dots = slides.map((_, index) => {
        const dot = document.createElement("button");
        dot.className = "gallery-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Ir a imagen ${index + 1}`);
        dot.addEventListener("click", () => {
            goToSlide(index);
            restartAutoplay();
        });
        dotsContainer?.appendChild(dot);
        return dot;
    });

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function restartAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(nextSlide, 4200);
    }

    function openLightbox(index) {
        if (!lightbox || !lightboxImg) {
            return;
        }

        const targetSlide = slides[index];
        const image = targetSlide?.querySelector("img");
        if (!image) {
            return;
        }

        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        if (!lightbox || !lightboxImg) {
            return;
        }

        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImg.src = "";
        document.body.style.overflow = "";
    }

    prevBtn?.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
        restartAutoplay();
    });

    nextBtn?.addEventListener("click", () => {
        nextSlide();
        restartAutoplay();
    });

    galleryRoot.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
    galleryRoot.addEventListener("mouseleave", restartAutoplay);

    slides.forEach((slide, index) => {
        slide.addEventListener("click", () => {
            goToSlide(index);
            openLightbox(index);
            clearInterval(autoplayTimer);
        });
    });

    lightboxClose?.addEventListener("click", closeLightbox);

    lightboxPrev?.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
        openLightbox(currentIndex);
    });

    lightboxNext?.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
        openLightbox(currentIndex);
    });

    lightbox?.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!lightbox?.classList.contains("open")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            goToSlide(currentIndex - 1);
            openLightbox(currentIndex);
        } else if (event.key === "ArrowRight") {
            goToSlide(currentIndex + 1);
            openLightbox(currentIndex);
        }
    });

    goToSlide(0);
    restartAutoplay();
}

const revealElements = document.querySelectorAll("[data-reveal]");

if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                } else {
                    entry.target.classList.remove("revealed");
                }
            });
        },
        { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
}

// Particle system mejorado
const particleConfig = {
    sizes: ['size-sm', 'size-md', 'size-lg'],
    colors: ['color-1', 'color-2'],
    timings: [500, 650, 750]
};

let lastParticleTime = 0;
const particleThrottle = 20; // ms entre partículas

document.addEventListener("mousemove", e => {
    const now = Date.now();
    
    // Throttle para optimizar rendimiento
    if (now - lastParticleTime < particleThrottle) {
        return;
    }
    lastParticleTime = now;
    
    // Crear 1-3 partículas por movimiento del cursor
    const particleCount = Math.random() > 0.7 ? 2 : 1;
    
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("div");
        p.className = "cursor-particle";
        
        // Seleccionar tamaño y color aleatorio
        const sizeClass = particleConfig.sizes[Math.floor(Math.random() * particleConfig.sizes.length)];
        const colorClass = particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)];
        const timing = particleConfig.timings[Math.floor(Math.random() * particleConfig.timings.length)];
        
        p.classList.add(sizeClass, colorClass);
        
        // Offset ligeramente para no estar exactamente en el cursor
        const offsetX = (Math.random() - 0.5) * 8;
        const offsetY = (Math.random() - 0.5) * 8;
        
        p.style.left = (e.clientX + offsetX) + "px";
        p.style.top = (e.clientY + offsetY) + "px";
        
        // Variables CSS para las animaciones
        const angle = Math.random() * Math.PI * 2;
        const distance = 15 + Math.random() * 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        p.style.setProperty('--tx', tx + 'px');
        p.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(p);
        
        // Remover después de completar la animación
        setTimeout(() => p.remove(), timing);
    }
});

// CURSOR GLOW
const cursorGlow = document.createElement("div");
cursorGlow.className = "cursor-glow";
document.body.appendChild(cursorGlow);

let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;

// Elementos que son clickables
const clickableSelectors = ['a', 'button', '[role="button"]', '[onclick]', 'input', 'textarea', 'select', '.jungle-btn', '.gallery-nav', '.gallery-dot', '.lightbox-close', '.lightbox-nav'];

document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Detectar si estamos sobre un elemento clickable
    const element = document.elementFromPoint(mouseX, mouseY);
    const isClickable = clickableSelectors.some(selector => element?.matches(selector) || element?.closest(selector));
    
    if (isClickable) {
        cursorGlow.classList.add("active");
    } else {
        cursorGlow.classList.remove("active");
    }
});

document.addEventListener("mousedown", e => {
    cursorGlow.classList.add("clicking");
    createClickPulse(e.clientX, e.clientY);
});

document.addEventListener("mouseup", () => {
    cursorGlow.classList.remove("clicking");
});

function createClickPulse(x, y) {
    const pulse = document.createElement("div");
    pulse.className = "cursor-click-pulse";
    pulse.style.left = `${x}px`;
    pulse.style.top = `${y}px`;
    document.body.appendChild(pulse);
    setTimeout(() => pulse.remove(), 450);
}

function updateGlowCursor() {
    // Suavizar movimiento del glow
    glowX += (mouseX - glowX) * 0.2;
    glowY += (mouseY - glowY) * 0.2;
    
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    
    requestAnimationFrame(updateGlowCursor);
}

updateGlowCursor();

