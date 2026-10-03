/**
 * Shopverse - Shopping Cart Management
 * Handles local storage synchronization, cart addition, removal, quantity updates, and calculations.
 */

// Initialize cart from localStorage, or empty array if not present
let cart = JSON.parse(localStorage.getItem('shopverse_cart')) || [];

/**
 * Save current cart state to localStorage and trigger cart count update
 */
function saveCart() {
  localStorage.setItem('shopverse_cart', JSON.stringify(cart));
  updateCartCount();
  // Dispatch a custom event so other components or pages can listen for cart updates
  window.dispatchEvent(new Event('cartUpdated'));
}

/**
 * Add a product to the cart
 * @param {number} productId 
 * @param {number} quantity 
 * @param {string} size 
 * @param {string} color 
 */
function addToCart(productId, quantity = 1, size = 'M', color = 'Default') {
  const prodsList = window.products || (typeof products !== 'undefined' ? products : []);
  const product = prodsList.find(p => p.id === parseInt(productId));
  if (!product) return false;

  // Check if item with same ID, size, and color already exists in cart
  const existingItemIndex = cart.findIndex(item => 
    item.id === parseInt(productId) && 
    item.size === size && 
    item.color === color
  );

  if (existingItemIndex > -1) {
    // Increment quantity
    cart[existingItemIndex].quantity += parseInt(quantity);
  } else {
    // Add new item
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.image,
      quantity: parseInt(quantity),
      size: size,
      color: color
    });
  }

  saveCart();
  showToast(`${product.name} added to cart!`);
  return true;
}

/**
 * Remove an item from the cart
 * @param {number} productId 
 * @param {string} size 
 * @param {string} color 
 */
function removeFromCart(productId, size, color) {
  const index = cart.findIndex(item => 
    item.id === parseInt(productId) && 
    item.size === size && 
    item.color === color
  );

  if (index > -1) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    showToast(`${itemName} removed from cart.`);
    return true;
  }
  return false;
}

/**
 * Update the quantity of a cart item
 * @param {number} productId 
 * @param {string} size 
 * @param {string} color 
 * @param {number} newQuantity 
 */
function updateCartQuantity(productId, size, color, newQuantity) {
  const index = cart.findIndex(item => 
    item.id === parseInt(productId) && 
    item.size === size && 
    item.color === color
  );

  if (index > -1) {
    newQuantity = parseInt(newQuantity);
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
    } else {
      cart[index].quantity = newQuantity;
      saveCart();
    }
    return true;
  }
  return false;
}

/**
 * Get total count of individual items in the cart
 */
function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Get total price of items in the cart (before tax and shipping)
 */
function getCartSubtotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Get saving discount total (originalPrice - price)
 */
function getCartDiscount() {
  return cart.reduce((total, item) => {
    const original = item.originalPrice || item.price;
    const itemDiscount = (original - item.price) * item.quantity;
    return total + (itemDiscount > 0 ? itemDiscount : 0);
  }, 0);
}

/**
 * Calculate full totals including tax and shipping
 */
function calculateCartTotals() {
  const subtotal = getCartSubtotal();
  const shipping = subtotal >= 9999 || subtotal === 0 ? 0 : 499; // Free shipping over ₹9,999
  const taxRate = 0.08; // 8% GST
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + shipping + tax;

  return {
    subtotal: Math.round(subtotal).toString(),
    shipping: shipping === 0 ? "FREE" : `₹${shipping.toLocaleString('en-IN')}`,
    tax: tax.toString(),
    total: Math.round(total).toString(),
    discount: Math.round(getCartDiscount()).toString()
  };
}

/**
 * Clear the shopping cart
 */
function clearCart() {
  cart = [];
  saveCart();
}

/**
 * Update the cart count number shown in the header badges
 */
function updateCartCount() {
  const badgeElements = document.querySelectorAll('.cart-count');
  const count = getCartCount();
  badgeElements.forEach(badge => {
    badge.textContent = count;
    // Hide or fade if 0
    if (count === 0) {
      badge.style.display = 'none';
    } else {
      badge.style.display = 'flex';
    }
  });
}

/**
 * Custom Simple Toast Notification helper
 */
function showToast(message) {
  // Check if toast container exists, if not create it
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '30px';
    toastContainer.style.right = '30px';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '10px';
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.style.background = '#1e3a8a'; // Dark blue accent
  toast.style.color = '#ffffff';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '30px';
  toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
  toast.style.fontSize = '14px';
  toast.style.fontWeight = '500';
  toast.style.transform = 'translateY(50px)';
  toast.style.opacity = '0';
  toast.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '10px';

  // Add shopping cart icon inline
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 50);

  // Animate out and remove
  setTimeout(() => {
    toast.style.transform = 'translateY(-20px)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}

// Initial count sync on script load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});

// Expose cart functions and variables to the window object for global module accessibility
window.cart = cart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.getCartCount = getCartCount;
window.getCartSubtotal = getCartSubtotal;
window.getCartDiscount = getCartDiscount;
window.calculateCartTotals = calculateCartTotals;
window.clearCart = clearCart;
window.updateCartCount = updateCartCount;
window.showToast = showToast;

