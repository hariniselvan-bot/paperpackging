/**
 * Stackly - Main JavaScript
 * Handles: Navigation, Footer, Smooth Scroll, ASAP Animations, Auth State
 */

// ============================================
// AUTH STATE MANAGEMENT
// ============================================
const Auth = {
  key: 'stackly_auth',

  get() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || { isLoggedIn: false, role: null, name: '' };
    } catch {
      return { isLoggedIn: false, role: null, name: '' };
    }
  },

  set(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  },

  clear() {
    localStorage.removeItem(this.key);
  },

  login(email, role, name) {
    this.set({ isLoggedIn: true, role, name, email });
  },

  logout() {
    this.clear();
    window.location.href = 'index.html';
  },

  isLoggedIn() {
    return this.get().isLoggedIn;
  },

  getRole() {
    return this.get().role;
  },

  checkAuth(requiredRole) {
    const auth = this.get();
    if (!auth.isLoggedIn) {
      window.location.href = 'login.html';
      return false;
    }
    if (requiredRole && auth.role !== requiredRole) {
      window.location.href = auth.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
      return false;
    }
    return true;
  }
};

// ============================================
// NAVIGATION COMPONENT
// ============================================
const Navigation = {
  render() {
    const auth = Auth.get();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const navItems = [
      { href: 'index.html', label: 'Home' },
      { href: 'services.html', label: 'Services' },
      { href: 'about.html', label: 'About Us' },
      { href: 'blog.html', label: 'Blog' },
      { href: 'contact.html', label: 'Contact Us' },
    ];

    const authLinks = auth.isLoggedIn
      ? `<a href="${auth.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html'}" class="nav__icon-btn" title="Dashboard"><i data-lucide="layout-dashboard" style="width:22px;height:22px;"></i></a>
         <button class="nav__icon-btn" onclick="Auth.logout()" title="Logout"><i data-lucide="log-out" style="width:22px;height:22px;"></i></button>`
      : `<a href="login.html" class="nav__icon-btn" title="Login"><i data-lucide="user" style="width:22px;height:22px;"></i></a>`;

    const linksHTML = navItems.map(item => {
      const isActive = currentPage === item.href || (item.href.includes('#') && currentPage === item.href.split('#')[0]);
      const activeClass = isActive ? 'active' : '';
      const badgeHTML = item.badge ? `<span class="nav__badge">${item.badge}</span>` : '';
      return `<a href="${item.href}" class="nav__link ${activeClass}">${item.label}${badgeHTML}</a>`;
    }).join('');

    const overlayLinksHTML = navItems.map(item => {
      const isActive = currentPage === item.href || (item.href.includes('#') && currentPage === item.href.split('#')[0]);
      const activeClass = isActive ? 'active' : '';
      return `<a href="${item.href}" class="nav__overlay-link ${activeClass}">${item.label}<i data-lucide="chevron-right" style="width:20px;height:20px;"></i></a>`;
    }).join('');

    return `
      <nav class="nav" id="mainNav">
        <div class="container">
          <a href="index.html" class="nav__logo">
            <img src="assets/images/logo.webp" class="nav__logo-image" alt="Stackly">
          </a>
          <div class="nav__links">
            ${linksHTML}
          </div>
          <div class="nav__actions">
            <a href="404.html" class="nav__icon-btn" data-search title="Search"><i data-lucide="search" style="width:22px;height:22px;"></i></a>
            ${authLinks}
          </div>
          <button class="nav__menu-toggle" id="menuToggle" aria-label="Toggle menu">
            <i data-lucide="menu" style="width:24px;height:24px;"></i>
          </button>
        </div>
      </nav>
      <div class="nav__overlay-backdrop" id="navBackdrop"></div>
      <div class="nav__overlay" id="navOverlay">
        <button class="nav__overlay-close" id="navClose" aria-label="Close menu">
          <i data-lucide="x" style="width:24px;height:24px;"></i>
        </button>
        <div class="nav__overlay-links">
          ${overlayLinksHTML}
        </div>
      </div>
    `;
  },

  init() {
    const container = document.getElementById('nav-container');
    if (!container) return;
    container.innerHTML = this.render();

    // Initialize Lucide icons
    if (window.lucide) lucide.createIcons();

    // Nav scroll shadow
    const nav = document.getElementById('mainNav');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });

    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const navOverlay = document.getElementById('navOverlay');
    const navBackdrop = document.getElementById('navBackdrop');
    const navClose = document.getElementById('navClose');

    function openMenu() {
      navOverlay.classList.add('open');
      navBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navOverlay.classList.remove('open');
      navBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    menuToggle?.addEventListener('click', openMenu);
    navClose?.addEventListener('click', closeMenu);
    navBackdrop?.addEventListener('click', closeMenu);

    // Close menu on link click
    navOverlay?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }
};

// ============================================
// FOOTER COMPONENT
// ============================================
const Footer = {
  render() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer__grid">
            <div class="footer__brand">
              <a href="index.html" class="footer__logo">
                <img src="assets/images/logo.webp" class="footer__logo-image" alt="Stackly">
              </a>
              <p class="footer__tagline">Premium packaging solutions for businesses that care about quality and sustainability.</p>
              <form class="footer__newsletter" onsubmit="event.preventDefault(); showToast('Thanks for subscribing!', 'success');">
                <input type="email" placeholder="Enter your email" required>
                <button type="submit">Subscribe</button>
              </form>
            </div>
            <div>
              <h4 class="footer__heading">Quick Links</h4>
              <div class="footer__links">
                <a href="index.html" class="footer__link">Home</a>
                <a href="about.html" class="footer__link">About Us</a>
                <a href="services.html" class="footer__link">Services</a>
                <a href="blog.html" class="footer__link">Blog</a>
                <a href="contact.html" class="footer__link">Contact</a>
              </div>
            </div>
            <div>
              <h4 class="footer__heading">Services</h4>
              <div class="footer__links">
                <a href="services.html" class="footer__link">Custom Packaging</a>
                <a href="services.html" class="footer__link">Branded Boxes</a>
                <a href="services.html" class="footer__link">Eco-Friendly</a>
                <a href="services.html" class="footer__link">Bulk Orders</a>
                <a href="services.html" class="footer__link">Design Consultation</a>
              </div>
            </div>
            <div>
              <h4 class="footer__heading">Support</h4>
              <div class="footer__links">
                <a href="index.html#faq" class="footer__link">FAQ</a>
                <a href="404.html" class="footer__link">Shipping Info</a>
                <a href="404.html" class="footer__link">Returns Policy</a>
                <a href="404.html" class="footer__link">Terms of Service</a>
                <a href="404.html" class="footer__link">Privacy Policy</a>
              </div>
            </div>
          </div>
          <div class="footer__bottom">
            <p class="footer__copyright">&copy; 2026 Stackly. All rights reserved.</p>
            <div class="footer__socials">
              <a href="404.html" class="footer__social" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z" fill="currentColor"/></svg></a>
              <a href="404.html" class="footer__social" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.3L6.6 22H3.5l7.3-8.3L3.3 2h6.3l4.3 5.7L18.9 2Zm-1.1 18h1.7L8.7 3.9H6.9L17.8 20Z" fill="currentColor"/></svg></a>
              <a href="404.html" class="footer__social" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 极速赛车开奖记录
        </div>
      </footer>
    `;
  },

  init() {
    const container = document.getElementById('footer-container');
    if (!container) return;
    container.innerHTML = this.render();
    if (window.lucide) lucide.createIcons();
  }
};

// ============================================
// ASAP ENTRANCE ANIMATIONS
// ============================================
const Animations = {
  init() {
    this.setupASAPAnimations();
    this.setupTextSplitAnimations();
    this.setupHeroParallax();
  },

  setupASAPAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-in').forEach(el => {
      observer.observe(el);
    });
  },

  setupTextSplitAnimations() {
    document.querySelectorAll('[data-split-text]').forEach(el => {
      const text = el.textContent;
      el.innerHTML = '';
      el.style.overflow = 'hidden';

      const chars = text.split('');
      chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(40px) rotateX(20deg)';
        span.style.transition = `opacity 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) ${0.7 + i * 0.03}s, transform 0.6s cubic-bezier(0.215, 0.61, 0.355, 1) ${0.7 + i * 0.03}s`;
        el.appendChild(span);
      });

      // Trigger animation
      setTimeout(() => {
        el.querySelectorAll('span').forEach(span => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0) rotateX(0deg)';
        });
      }, 300);
    });
  },

  setupHeroParallax() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Floating product animation using CSS
    const floatElements = heroSection.querySelectorAll('[data-float]');
    floatElements.forEach((el, i) => {
      el.style.animation = `float ${3 + i * 0.5}s ease-in-out infinite alternate`;
      el.style.animationDelay = `${i * 0.3}s`;
    });

    // Mouse parallax
    const parallaxElements = heroSection.querySelectorAll('[data-parallax]');
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      parallaxElements.forEach((el, i) => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const offsetX = x * speed * 100;
        const offsetY = y * speed * 100;
        el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    });
  }
};

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'info') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// FORM VALIDATION
// ============================================
const FormValidator = {
  rules: {
    required: (value) => value.trim() !== '' || 'This field is required',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email',
    phone: (value) => !value || /^[\d\s\-+()]{10,}$/.test(value) || 'Please enter a valid phone number',
    minLength: (value, length) => value.length >= length || `Minimum ${length} characters required`,
    match: (value, matchValue) => value === matchValue || 'Passwords do not match',
  },

  validateField(input, validations) {
    const value = input.value;
    const errorEl = input.closest('.form-group')?.querySelector('.form-error');

    for (const validation of validations) {
      const { rule, param } = validation;
      const result = this.rules[rule](value, param);

      if (result !== true) {
        input.classList.add('error');
        input.classList.remove('success');
        if (errorEl) {
          errorEl.textContent = result;
          errorEl.classList.add('visible');
        }
        return false;
      }
    }

    input.classList.remove('error');
    input.classList.add('success');
    if (errorEl) errorEl.classList.remove('visible');
    return true;
  },

  validateForm(form, fieldValidations) {
    let isValid = true;
    for (const [fieldName, validations] of Object.entries(fieldValidations)) {
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (input && !this.validateField(input, validations)) {
        isValid = false;
      }
    }
    return isValid;
  }
};

// ============================================
// PASSWORD STRENGTH
// ============================================
function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { level: 'weak', label: 'Weak' };
  if (strength <= 3) return { level: 'medium', label: 'Medium' };
  return { level: 'strong', label: 'Strong' };
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
  Footer.init();
  Animations.init();

  // Add floating keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-10px); }
    }
    @keyframes floatSlow {
      0% { transform: translateY(0px) rotate(0deg); }
      100% { transform: translateY(-15px) rotate(2deg); }
    }
  `;
  document.head.appendChild(style);
});

// Expose globally
window.Auth = Auth;
window.showToast = showToast;
window.FormValidator = FormValidator;
window.checkPasswordStrength = checkPasswordStrength;
