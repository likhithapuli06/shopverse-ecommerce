/**
 * Shopverse - Search Management
 * Handles standard search redirects to the shop page with query parameters.
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchForms = document.querySelectorAll('.search-form');

  searchForms.forEach(form => {
    const input = form.querySelector('.search-input');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input.value.trim();
      
      if (query) {
        // Redirect to shop page with search parameter
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
      }
    });
  });
});
