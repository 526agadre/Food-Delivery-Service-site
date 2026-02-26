// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Menu Tabs Functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove('active'));
        // Show the corresponding tab content
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Hamburger Menu Functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu after clicking
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    });
});

// Modal Functionality
const modal = document.getElementById('dish-modal');
const modalImage = document.getElementById('modal-dish-image');
const modalTitle = document.getElementById('modal-dish-title');
const modalDescription = document.getElementById('modal-dish-description');
const modalPrice = document.getElementById('modal-dish-price');
const closeModal = document.querySelector('.close-modal');

// Add click event to all menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const title = this.getAttribute('data-title');
        const description = this.getAttribute('data-description');
        const price = this.getAttribute('data-price');
        const image = this.getAttribute('data-image');

        if (modal && modalImage && modalTitle && modalDescription && modalPrice) {
            modalImage.src = image;
            modalImage.alt = title;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalPrice.textContent = price;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    });
});

// Close modal when clicking the close button
if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
}

// Close modal when clicking outside the modal content
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
}

// Cart functionality
let cart = [];
const checkoutBtn = document.getElementById('checkout-btn');
const cartCount = document.getElementById('cart-count');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutItems = document.getElementById('checkout-items');
const totalAmount = document.getElementById('total-amount');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const checkoutForm = document.getElementById('checkout-form');

// Update cart display
function updateCartDisplay() {
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
    if (checkoutBtn) {
        checkoutBtn.style.display = cart.length > 0 ? 'inline-block' : 'none';
    }
}

// Add item to cart
function addToCart(title, description, price, image) {
    const item = {
        title,
        description,
        price: parseFloat(price.replace('$', '')),
        image,
        id: Date.now() // Simple unique ID
    };
    cart.push(item);
    updateCartDisplay();
    updateCheckoutModal();
}

// Update checkout modal content
function updateCheckoutModal() {
    if (!checkoutItems || !totalAmount) return;

    checkoutItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="checkout-item-details">
                <h4>${item.title}</h4>
                <p>${item.description.substring(0, 50)}...</p>
            </div>
            <span class="price">$${item.price.toFixed(2)}</span>
            <button onclick="removeFromCart(${index})" style="background: #e74c3c; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer; margin-left: 1rem;">Remove</button>
        `;
        checkoutItems.appendChild(itemElement);
    });

    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateCheckoutModal();
}

// Open checkout modal
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (checkoutModal) {
            checkoutModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
}

// Close checkout modal
function closeCheckoutModal() {
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Add to cart button functionality
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const title = modalTitle ? modalTitle.textContent : '';
        const description = modalDescription ? modalDescription.textContent : '';
        const price = modalPrice ? modalPrice.textContent : '';
        const image = modalImage ? modalImage.src : '';

        addToCart(title, description, price, image);

        // Close dish modal
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Show success message (you could enhance this)
        alert('Item added to cart!');
    });
}

// Checkout form submission
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Here you would typically send the order to your backend
        // For demo purposes, we'll just show a success message
        alert(`Order placed successfully! Total: ${totalAmount.textContent}\n\nThank you for choosing Delicious Bites!`);

        // Clear cart and close modal
        cart = [];
        updateCartDisplay();
        updateCheckoutModal();
        closeCheckoutModal();
        checkoutForm.reset();
    });
}

// Close checkout modal when clicking outside
if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            closeCheckoutModal();
        }
    });
}

// Initialize cart display
updateCartDisplay();