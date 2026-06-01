// Cart functionality
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    const cartBtn = document.getElementById('cartBtn');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    cartBtn?.addEventListener('click', () => this.toggleCart());
    cartClose?.addEventListener('click', () => this.toggleCart());
    cartOverlay?.addEventListener('click', () => this.toggleCart());
    checkoutBtn?.addEventListener('click', () => this.checkout());

    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        const name = e.target.dataset.name;
        const price = parseInt(e.target.dataset.price);
        this.addItem(name, price);
      }
    });
  }

  toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('open');
  }

  addItem(name, price) {
    const existingItem = this.items.find(item => item.name === name);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      this.items.push({ name, price, qty: 1 });
    }
    this.save();
    this.render();
  }

  removeItem(name) {
    this.items = this.items.filter(item => item.name !== name);
    this.save();
    this.render();
  }

  updateQty(name, qty) {
    const item = this.items.find(item => item.name === name);
    if (item) {
      item.qty = Math.max(1, qty);
      this.save();
      this.render();
    }
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  render() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsDiv || !cartCount || !cartTotal) return;
    
    cartCount.textContent = this.items.reduce((sum, item) => sum + item.qty, 0);
    cartTotal.textContent = 'KES ' + this.getTotal().toLocaleString();

    if (this.items.length === 0) {
      cartItemsDiv.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
      return;
    }

    cartItemsDiv.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-header">
          <span class="cart-item-name">${item.name}</span>
          <button class="cart-item-remove" data-name="${item.name}">Remove</button>
        </div>
        <div class="cart-item-price">KES ${(item.price * item.qty).toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn decrease-qty" data-name="${item.name}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn increase-qty" data-name="${item.name}">+</button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => this.removeItem(btn.dataset.name));
    });

    document.querySelectorAll('.increase-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = this.items.find(i => i.name === btn.dataset.name);
        if (item) this.updateQty(btn.dataset.name, item.qty + 1);
      });
    });

    document.querySelectorAll('.decrease-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = this.items.find(i => i.name === btn.dataset.name);
        if (item) this.updateQty(btn.dataset.name, item.qty - 1);
      });
    });
  }

  checkout() {
    if (this.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const itemList = this.items.map(item => `${item.name} x${item.qty} - KES ${(item.price * item.qty).toLocaleString()}`).join('%0A');
    const message = encodeURIComponent(`Hi Fashion Hub!%0A%0AI would like to checkout with the following items:%0A${itemList}%0A%0ATotal: KES ${this.getTotal().toLocaleString()}%0A%0APlease confirm availability and provide payment details.`);
    window.open(`https://wa.me/254799757915?text=${message}`, '_blank');
  }
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
  if (!window.cart) {
    window.cart = new Cart();
  }
});
