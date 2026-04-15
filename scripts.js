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

document.addEventListener("mousemove", e => {
    const p = document.createElement("div");
    p.className = "cursor-particle";
    p.style.left = e.clientX + "px";
    p.style.top = e.clientY + "px";
    document.body.appendChild(p);

    setTimeout(() => p.remove(), 600);
});

