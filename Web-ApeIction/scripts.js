let lastScrollTop = 0;
const navbar = document.getElementById("Main-Navbar");

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll <= 50) {
        // Mostrar navbar al estar arriba
        navbar.classList.add("visible");
    } else if (currentScroll > lastScrollTop) {
        // Ocultar al bajar
        navbar.classList.remove("visible");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});
