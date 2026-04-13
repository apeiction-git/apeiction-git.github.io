const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
let isScrolling = false;

function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;

    isScrolling = true;

    // Quitar active de todas
    slides.forEach(s => s.classList.remove('active'));

    // Activar la nueva
    slides[index].classList.add('active');

    currentSlide = index;

    window.scrollTo({
        top: slides[index].offsetTop,
        behavior: "smooth"
    });

    setTimeout(() => {
        isScrolling = false;
    }, 900);
}

// Activar la primera pantalla al cargar
slides[0].classList.add('active');

window.addEventListener("wheel", (e) => {
    if (isScrolling) return;

    if (e.deltaY > 0) {
        goToSlide(currentSlide + 1);
    } else {
        goToSlide(currentSlide - 1);
    }
});
