/**
 * Header Component
 * Handles sticky header, mega menu, and mobile menu interactions
 */

class HeaderComponent extends HTMLElement {
  constructor() {
    super();

    this.header = this.querySelector('[data-header]');
    this.mobileMenu = this.querySelector('[data-mobile-menu]');
    this.mobileMenuToggle = this.querySelector('[data-mobile-menu-toggle]');
    this.mobileMenuClose = this.querySelector('[data-mobile-menu-close]');
    this.mobileMenuOverlay = this.querySelector('[data-mobile-menu-overlay]');
    this.megaMenuToggles = this.querySelectorAll('[data-mega-menu-toggle]');
    this.mobileSubmenuToggles = this.querySelectorAll('[data-mobile-submenu-toggle]');

    this.isSticky = this.dataset.sticky === 'true';
    this.lastScrollY = 0;
    this.scrollThreshold = 100;
    this.isHidden = false;
    this.activeMegaMenu = null;

    this.init();
  }

  init() {
    // Sticky header behavior
    if (this.isSticky) {
      this.initStickyHeader();
    }

    // Mobile menu
    this.initMobileMenu();

    // Mega menu (desktop)
    this.initMegaMenu();

    // Mobile submenus
    this.initMobileSubmenus();

    // Cart count updates
    this.initCartUpdates();
  }

  /**
   * Sticky Header with hide on scroll down
   */
  initStickyHeader() {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.handleScroll(); // Initial check
  }

  handleScroll() {
    const currentScrollY = window.scrollY;

    // Add/remove scrolled class
    if (currentScrollY > 0) {
      this.classList.add('is-scrolled');
    } else {
      this.classList.remove('is-scrolled');
    }

    // Hide/show on scroll direction (only after threshold)
    if (currentScrollY > this.scrollThreshold) {
      if (currentScrollY > this.lastScrollY && !this.isHidden) {
        // Scrolling down - hide header
        this.classList.add('is-hidden');
        this.isHidden = true;
        this.closeMegaMenu();
      } else if (currentScrollY < this.lastScrollY && this.isHidden) {
        // Scrolling up - show header
        this.classList.remove('is-hidden');
        this.isHidden = false;
      }
    } else {
      this.classList.remove('is-hidden');
      this.isHidden = false;
    }

    this.lastScrollY = currentScrollY;
  }

  /**
   * Mobile Menu
   */
  initMobileMenu() {
    if (!this.mobileMenu) return;

    this.mobileMenuToggle?.addEventListener('click', () => this.openMobileMenu());
    this.mobileMenuClose?.addEventListener('click', () => this.closeMobileMenu());
    this.mobileMenuOverlay?.addEventListener('click', () => this.closeMobileMenu());

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenu.getAttribute('aria-hidden') === 'false') {
        this.closeMobileMenu();
      }
    });
  }

  openMobileMenu() {
    this.mobileMenu.setAttribute('aria-hidden', 'false');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-menu-open');

    // Focus first focusable element
    const firstFocusable = this.mobileMenu.querySelector('button, [href], input');
    firstFocusable?.focus();

    // Trap focus within menu
    this.trapFocus(this.mobileMenu);
  }

  closeMobileMenu() {
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-menu-open');

    // Return focus to toggle button
    this.mobileMenuToggle?.focus();

    // Remove focus trap
    this.removeFocusTrap();
  }

  /**
   * Mega Menu (Desktop)
   */
  initMegaMenu() {
    this.megaMenuToggles.forEach((toggle) => {
      const megaMenuId = toggle.getAttribute('aria-controls');
      const megaMenu = document.getElementById(megaMenuId);

      if (!megaMenu) return;

      const navItem = toggle.closest('.header__nav-item');

      // Mouse enter on nav item
      navItem.addEventListener('mouseenter', () => {
        this.openMegaMenu(toggle, megaMenu);
      });

      // Mouse leave on nav item
      navItem.addEventListener('mouseleave', () => {
        this.closeMegaMenu();
      });

      // Click toggle (for accessibility)
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          this.closeMegaMenu();
        } else {
          this.openMegaMenu(toggle, megaMenu);
        }
      });

      // Keyboard navigation
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const isOpen = toggle.getAttribute('aria-expanded') === 'true';
          if (isOpen) {
            this.closeMegaMenu();
          } else {
            this.openMegaMenu(toggle, megaMenu);
          }
        } else if (e.key === 'Escape') {
          this.closeMegaMenu();
          toggle.focus();
        }
      });
    });

    // Close mega menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.activeMegaMenu && !e.target.closest('.header__nav-item')) {
        this.closeMegaMenu();
      }
    });
  }

  openMegaMenu(toggle, megaMenu) {
    // Close any open mega menu first
    this.closeMegaMenu();

    toggle.setAttribute('aria-expanded', 'true');
    megaMenu.setAttribute('aria-hidden', 'false');
    this.activeMegaMenu = { toggle, megaMenu };
  }

  closeMegaMenu() {
    if (this.activeMegaMenu) {
      this.activeMegaMenu.toggle.setAttribute('aria-expanded', 'false');
      this.activeMegaMenu.megaMenu.setAttribute('aria-hidden', 'true');
      this.activeMegaMenu = null;
    }

    // Also close all mega menus (safety)
    this.megaMenuToggles.forEach((toggle) => {
      toggle.setAttribute('aria-expanded', 'false');
    });
    this.querySelectorAll('[data-mega-menu]').forEach((menu) => {
      menu.setAttribute('aria-hidden', 'true');
    });
  }

  /**
   * Mobile Submenus (Accordion)
   */
  initMobileSubmenus() {
    this.mobileSubmenuToggles.forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const submenuId = toggle.getAttribute('aria-controls');
        const submenu = document.getElementById(submenuId);

        if (!submenu) return;

        const isOpen = toggle.getAttribute('aria-expanded') === 'true';

        // Close other open submenus
        this.mobileSubmenuToggles.forEach((otherToggle) => {
          if (otherToggle !== toggle) {
            otherToggle.setAttribute('aria-expanded', 'false');
            const otherSubmenuId = otherToggle.getAttribute('aria-controls');
            const otherSubmenu = document.getElementById(otherSubmenuId);
            otherSubmenu?.setAttribute('aria-hidden', 'true');
          }
        });

        // Toggle current submenu
        toggle.setAttribute('aria-expanded', String(!isOpen));
        submenu.setAttribute('aria-hidden', String(isOpen));
      });
    });
  }

  /**
   * Cart Count Updates
   */
  initCartUpdates() {
    // Listen for cart updates from Shopify's cart API
    document.addEventListener('cart:updated', (e) => {
      this.updateCartCount(e.detail?.itemCount || 0);
    });

    // Custom event for cart updates
    window.addEventListener('milutin:cart-updated', (e) => {
      this.updateCartCount(e.detail?.itemCount || 0);
    });
  }

  updateCartCount(count) {
    const cartCountElements = this.querySelectorAll('[data-cart-count]');
    cartCountElements.forEach((el) => {
      el.textContent = count;
      el.classList.toggle('header__cart-count--hidden', count === 0);
    });
  }

  /**
   * Focus Trap for Modal
   */
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    this.focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    container.addEventListener('keydown', this.focusTrapHandler);
  }

  removeFocusTrap() {
    if (this.focusTrapHandler && this.mobileMenu) {
      this.mobileMenu.removeEventListener('keydown', this.focusTrapHandler);
    }
  }
}

// Register the custom element
customElements.define('header-component', HeaderComponent);

/**
 * Helper: Dispatch cart updated event
 * Call this after cart API operations
 */
window.updateCartCount = function(itemCount) {
  window.dispatchEvent(new CustomEvent('milutin:cart-updated', {
    detail: { itemCount }
  }));
};
