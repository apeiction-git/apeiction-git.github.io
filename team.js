const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
let isScrolling = false;

function goToSlide(index) {
    if (index < 0 || index > slides.length - 1) return;

    isScrolling = true;

    slides.forEach(s => s.classList.remove('active'));
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

slides[0].classList.add('active');

window.addEventListener("wheel", (e) => {
    if (isScrolling) return;

    if (e.deltaY > 0) {
        goToSlide(currentSlide + 1);
    } else {
        goToSlide(currentSlide - 1);
    }
});
