// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Menu Tabs Functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabBtns.length > 0 && tabContents.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            const tabId = btn.getAttribute('data-tab');
            if (tabId && document.getElementById(tabId)) {
                document.getElementById(tabId).classList.add('active');
            }
        });
    });
}

// Hamburger Menu Functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Global Cart & Modals Initialization
let cart = JSON.parse(localStorage.getItem('deliciousBitesCart')) || [];

function saveCart() {
    localStorage.setItem('deliciousBitesCart', JSON.stringify(cart));
}

function initGlobalModals() {
    // Inject Toast Container
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Always ensure Checkout Modal is inserted into body globally
    const existingCheckout = document.getElementById('checkout-modal');
    if (existingCheckout) existingCheckout.remove();

    const checkoutModalHTML = `
    <div id="checkout-modal" class="modal">
        <div class="modal-content checkout-modal-content">
            <span class="close-modal checkout-close-modal">&times;</span>
            <div class="modal-body checkout-modal-body">
                <div class="checkout-header">
                    <h2>Your Cart</h2>
                    <p class="cart-subtitle"><span id="checkout-cart-count">0</span> items</p>
                </div>
                <div id="checkout-items" class="checkout-items">
                    <!-- Cart items will be injected here -->
                </div>
                <div class="checkout-footer">
                    <div class="checkout-total">
                        <h3>Total:</h3>
                        <span id="total-amount">$0.00</span>
                    </div>
                    <form id="checkout-form" class="checkout-form">
                        <div class="form-group">
                            <input type="text" placeholder="Full Name" required>
                        </div>
                        <div class="form-group">
                            <input type="email" placeholder="Email" required>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Delivery Address" required></textarea>
                        </div>
                        <button type="submit" class="btn-primary w-100">Place Order</button>
                    </form>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', checkoutModalHTML);

    // Provide Dish Modal if not present
    if (!document.getElementById('dish-modal')) {
        const dishModalHTML = `
        <div id="dish-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal dish-close-modal">&times;</span>
                <div class="modal-body">
                    <div class="modal-image">
                        <img id="modal-dish-image" src="" alt="">
                    </div>
                    <div class="modal-details">
                        <h2 id="modal-dish-title"></h2>
                        <p id="modal-dish-description"></p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; width: 100%;">
                            <span id="modal-dish-price" class="price" style="margin-bottom:0;"></span>
                            <button id="add-to-cart-btn" class="btn-primary">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', dishModalHTML);
    }

    // Insert cart button into navbar if not present
    const navLinksUl = document.querySelector('.nav-links');
    if (navLinksUl && !document.getElementById('nav-cart-btn')) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="javascript:void(0)" id="nav-cart-btn" class="nav-cart-btn">Cart (<span id="nav-cart-count">0</span>)</a>`;
        navLinksUl.appendChild(li);
    }
}

// Function to show toast
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // Trigger reflow
    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    initGlobalModals();
    setupEventHandlers();
    updateCartDisplay();
});

function setupEventHandlers() {
    const dishModal = document.getElementById('dish-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const dishClose = document.querySelector('.dish-close-modal');
    const checkoutClose = document.querySelector('.checkout-close-modal');
    const navCartBtn = document.getElementById('nav-cart-btn');
    const dishAddToCartBtn = document.getElementById('add-to-cart-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const oldCheckoutBtn = document.getElementById('checkout-btn'); // from menu page

    // Menu Item click
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function (e) {
            if (e.target.tagName === 'BUTTON') return;

            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const price = this.getAttribute('data-price');
            const image = this.getAttribute('data-image');

            document.getElementById('modal-dish-image').src = image;
            document.getElementById('modal-dish-image').alt = title;
            document.getElementById('modal-dish-title').textContent = title;
            document.getElementById('modal-dish-description').textContent = description;

            // Just display raw price, css will hande $ symbol if needed/not
            document.getElementById('modal-dish-price').textContent = price;

            dishModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    if (dishClose) dishClose.addEventListener('click', () => closeModals());
    if (checkoutClose) checkoutClose.addEventListener('click', () => closeModals());

    window.addEventListener('click', (e) => {
        if (e.target === dishModal || e.target === checkoutModal) closeModals();
    });

    if (dishAddToCartBtn) {
        dishAddToCartBtn.addEventListener('click', () => {
            const title = document.getElementById('modal-dish-title').textContent;
            const description = document.getElementById('modal-dish-description').textContent;
            let priceText = document.getElementById('modal-dish-price').textContent;

            addToCart(title, description, priceText, document.getElementById('modal-dish-image').src);
            closeModals();
        });
    }

    if (navCartBtn) {
        navCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCheckout();
        });
    }

    if (oldCheckoutBtn) {
        oldCheckoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCheckout();
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                showToast('Your cart is empty!');
                return;
            }
            showToast('Order placed successfully! Thank you!');
            cart = [];
            saveCart();
            updateCartDisplay();
            closeModals();
            checkoutForm.reset();
        });
    }
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    document.body.style.overflow = 'auto';
}

function openCheckout() {
    updateCheckoutModal();
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
        checkoutModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function addToCart(title, description, price, image) {
    const rawPrice = price.replace(/[^0-9.]/g, '');
    const item = {
        title,
        description,
        price: parseFloat(rawPrice),
        image,
        id: Date.now()
    };
    cart.push(item);
    saveCart();
    updateCartDisplay();
    showToast(`${title} added to cart`);
}

function updateCartDisplay() {
    const navCartCount = document.getElementById('nav-cart-count');
    if (navCartCount) navCartCount.textContent = cart.length;

    const cartCountSpan = document.getElementById('cart-count');
    if (cartCountSpan) cartCountSpan.textContent = cart.length;

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.style.display = cart.length > 0 ? 'inline-block' : 'none';
    }
}

function updateCheckoutModal() {
    const checkoutItems = document.getElementById('checkout-items');
    const totalAmount = document.getElementById('total-amount');
    const checkoutCartCount = document.getElementById('checkout-cart-count');

    if (!checkoutItems || !totalAmount) return;

    checkoutItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        checkoutItems.innerHTML = '<div class="empty-cart-msg">Your cart is currently empty.</div>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const itemElement = document.createElement('div');
            itemElement.className = 'checkout-item professional-item';
            itemElement.innerHTML = `
                <div class="checkout-item-img-wrapper">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="checkout-item-details">
                    <h4>${item.title}</h4>
                    <p class="desc">${item.description.substring(0, 45)}...</p>
                    <span class="price item-price">$${item.price.toFixed(2)}</span>
                </div>
                <div class="checkout-item-action">
                    <button class="remove-btn" onclick="removeFromCart(${index})" title="Remove">
                        &times;
                    </button>
                </div>
            `;
            checkoutItems.appendChild(itemElement);
        });
    }

    totalAmount.textContent = `$${total.toFixed(2)}`;
    if (checkoutCartCount) checkoutCartCount.textContent = cart.length;
}

window.removeFromCart = function (index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
    updateCheckoutModal();
    showToast('Item removed');
}