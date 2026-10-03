/**
 * Shopverse - Hero Banner Slider
 * Controls the sliding animation, navigation dots, and autoplay for the homepage hero.
 */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dotContainer = document.querySelector('.slider-dots');
  
  if (slides.length === 0) return; // Exit if not on the homepage or if slider is missing

  let currentSlide = 0;
  let slideInterval;
  const intervalTime = 6000; // 6 seconds auto-rotate

  // Generate navigation dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('data-slide', index);
    dotContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  /**
   * Show a specific slide
   * @param {number} index 
   */
  function showSlide(index) {
    // Wrap around index
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    // Update slides class active
    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update dots class active
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  /**
   * Advance to the next slide
   */
  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  /**
   * Go back to the previous slide
   */
  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Setup event listeners for navigation buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  // Setup event listeners for dots
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.getAttribute('data-slide'));
      showSlide(slideIndex);
      resetAutoplay();
    });
  });

  /**
   * Start slide show interval
   */
  function startAutoplay() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  /**
   * Stop slide show and restart it
   */
  function resetAutoplay() {
    clearInterval(slideInterval);
    startAutoplay();
  }

  // Initialize auto-sliding
  startAutoplay();

  // Pause auto-sliding when user hovers over the slider
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    heroSlider.addEventListener('mouseleave', () => {
      startAutoplay();
    });
  }
});
