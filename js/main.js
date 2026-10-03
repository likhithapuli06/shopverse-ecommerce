/**
 * Shopverse - Main UI Interactions
 * Controls the core header scroll changes, mobile menu toggle, back to top button,
 * user authentication visual updates, and newsletter form submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Sticky Header Scroll Effect ---
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // --- Mobile Navigation Menu ---
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // Accessibility attributes
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
      menuToggle.setAttribute('aria-expanded', !expanded);
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Back to Top Button ---
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- User Authentication Display Sync ---
  const userAccountLink = document.querySelector('.user-account-link');
  const loggedInUser = JSON.parse(localStorage.getItem('shopverse_logged_in_user'));

  if (userAccountLink && loggedInUser) {
    // If user is logged in, change the link to welcome the user or show profile link with dropdown
    userAccountLink.innerHTML = `
      <div class="user-dropdown-container" style="position: relative; display: inline-block;">
        <a href="#" class="user-welcome flex items-center gap-1 font-medium text-sm text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-check"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="m16 11 2 2 4-4"/></svg>
          <span class="desktop-only text-xs">Hi, ${loggedInUser.firstName}</span>
        </a>
        <div class="user-dropdown" style="display: none; position: absolute; right: 0; top: 100%; background: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 8px; padding: 10px; min-width: 150px; z-index: 1000; border: 1px solid #f3f4f6; margin-top: 5px;">
          <p class="font-semibold text-xs text-gray-500 border-b pb-1.5 mb-1.5 overflow-hidden text-ellipsis">${loggedInUser.email}</p>
          <a href="#" class="logout-btn flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 py-1" style="width: 100%; transition: color 0.2s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </a>
        </div>
      </div>
    `;

    const dropdownContainer = userAccountLink.querySelector('.user-dropdown-container');
    const dropdownMenu = userAccountLink.querySelector('.user-dropdown');
    const welcomeLink = userAccountLink.querySelector('.user-welcome');

    if (welcomeLink && dropdownMenu) {
      welcomeLink.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
      });

      // Close if click outside
      document.addEventListener('click', (e) => {
        if (!dropdownContainer.contains(e.target)) {
          dropdownMenu.style.display = 'none';
        }
      });
    }

    // Logout handling
    const logoutBtn = userAccountLink.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('shopverse_logged_in_user');
        if (typeof showToast === 'function') {
          showToast("Successfully logged out. Redirecting...");
        } else {
          alert("Successfully logged out!");
        }
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      });
    }
  }

  // --- Newsletter Form Submission ---
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (email) {
        if (typeof showToast === 'function') {
          showToast("Thank you for subscribing to our newsletter!");
        } else {
          alert("Thank you for subscribing to our newsletter!");
        }
        emailInput.value = '';
      }
    });
  }
});
