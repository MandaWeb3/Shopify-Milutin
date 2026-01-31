/**
 * Product Card Enhancements
 * Quick view, wishlist, and quick add functionality
 */

(function() {
  'use strict';

  /**
   * Wishlist Manager
   * Uses localStorage to store wishlist items
   */
  class WishlistManager {
    constructor() {
      this.storageKey = 'milutin_wishlist';
      this.wishlist = this.load();
      this.init();
    }

    load() {
      try {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
      } catch {
        return [];
      }
    }

    save() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
        this.updateUI();
        this.dispatchEvent();
      } catch (e) {
        console.error('Failed to save wishlist:', e);
      }
    }

    add(product) {
      if (!this.has(product.id)) {
        this.wishlist.push(product);
        this.save();
      }
    }

    remove(productId) {
      this.wishlist = this.wishlist.filter(p => p.id !== productId);
      this.save();
    }

    toggle(product) {
      if (this.has(product.id)) {
        this.remove(product.id);
        return false;
      } else {
        this.add(product);
        return true;
      }
    }

    has(productId) {
      return this.wishlist.some(p => p.id === productId);
    }

    getAll() {
      return this.wishlist;
    }

    getCount() {
      return this.wishlist.length;
    }

    init() {
      this.updateUI();

      // Listen for clicks on wishlist toggles
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-wishlist-toggle]');
        if (!btn) return;

        e.preventDefault();

        const product = {
          id: btn.dataset.productId,
          handle: btn.dataset.productHandle,
          title: btn.dataset.productTitle,
          image: btn.dataset.productImage,
          price: btn.dataset.productPrice,
          url: btn.dataset.productUrl
        };

        const added = this.toggle(product);
        btn.classList.toggle('is-active', added);
        btn.setAttribute('aria-label', added
          ? window.translations?.removeFromWishlist || 'Remove from wishlist'
          : window.translations?.addToWishlist || 'Add to wishlist'
        );
      });
    }

    updateUI() {
      // Update all wishlist toggle buttons
      document.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
        const productId = btn.dataset.productId;
        const isInWishlist = this.has(productId);
        btn.classList.toggle('is-active', isInWishlist);
      });

      // Update wishlist count if element exists
      const countEl = document.querySelector('[data-wishlist-count]');
      if (countEl) {
        countEl.textContent = this.getCount();
        countEl.hidden = this.getCount() === 0;
      }
    }

    dispatchEvent() {
      document.dispatchEvent(new CustomEvent('milutin:wishlist:updated', {
        detail: { wishlist: this.wishlist, count: this.getCount() }
      }));
    }
  }

  /**
   * Quick View Modal
   */
  class QuickViewModal {
    constructor() {
      this.modal = document.getElementById('QuickViewModal');
      if (!this.modal) return;

      this.content = this.modal.querySelector('[data-quick-view-content]');
      this.init();
    }

    init() {
      // Open quick view
      document.addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-quick-view]');
        if (!btn) return;

        e.preventDefault();
        const productUrl = btn.dataset.productUrl;
        await this.open(productUrl);
      });

      // Close modal
      this.modal.querySelectorAll('[data-quick-view-close]').forEach(el => {
        el.addEventListener('click', () => this.close());
      });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });
    }

    isOpen() {
      return this.modal.getAttribute('aria-hidden') === 'false';
    }

    async open(productUrl) {
      // Show modal with loading state
      this.content.innerHTML = `
        <div class="quick-view-modal__loading">
          <span class="quick-view-modal__spinner"></span>
        </div>
      `;
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      try {
        // Fetch product page
        const response = await fetch(`${productUrl}?view=quick-view`);

        if (!response.ok) {
          // Fallback: fetch regular product page and extract content
          const fallbackResponse = await fetch(productUrl);
          const html = await fallbackResponse.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          // Try to get product JSON
          const productScript = doc.querySelector('script[type="application/json"][data-product-json]');
          if (productScript) {
            const productData = JSON.parse(productScript.textContent);
            this.renderQuickView(productData, productUrl);
          } else {
            // Simple fallback
            this.content.innerHTML = `
              <div class="quick-view-product">
                <p style="text-align: center; padding: var(--spacing-8);">
                  <a href="${productUrl}" class="btn btn--primary">View Product</a>
                </p>
              </div>
            `;
          }
        } else {
          const html = await response.text();
          this.content.innerHTML = html;
          this.initQuickViewProduct();
        }
      } catch (error) {
        console.error('Quick view error:', error);
        this.content.innerHTML = `
          <div style="text-align: center; padding: var(--spacing-8);">
            <p>Unable to load product</p>
            <a href="${productUrl}" class="btn btn--primary">View Product</a>
          </div>
        `;
      }
    }

    renderQuickView(product, productUrl) {
      const selectedVariant = product.variants[0];
      const hasMultipleImages = product.images && product.images.length > 1;

      let imagesHtml = '';
      if (product.featured_image) {
        imagesHtml = `<img src="${product.featured_image}" class="quick-view-product__image" alt="${product.title}">`;
      }

      let thumbnailsHtml = '';
      if (hasMultipleImages) {
        thumbnailsHtml = `<div class="quick-view-product__thumbnails">
          ${product.images.slice(0, 5).map((img, i) => `
            <button class="quick-view-product__thumbnail ${i === 0 ? 'is-active' : ''}" data-image-index="${i}">
              <img src="${img}" alt="">
            </button>
          `).join('')}
        </div>`;
      }

      let optionsHtml = '';
      if (product.options && product.options.length > 0 && !(product.options.length === 1 && product.options[0] === 'Title')) {
        optionsHtml = `<div class="quick-view-product__options">
          ${product.options.map((option, i) => {
            const values = [...new Set(product.variants.map(v => v.options[i]))];
            return `
              <div class="quick-view-product__option">
                <p class="quick-view-product__option-label">${option}</p>
                <div class="quick-view-product__option-values">
                  ${values.map((value, j) => `
                    <button class="quick-view-product__option-btn ${j === 0 ? 'is-selected' : ''}"
                      data-option-index="${i}" data-value="${value}">${value}</button>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>`;
      }

      const priceHtml = selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price
        ? `<span class="quick-view-product__price-sale">${this.formatMoney(selectedVariant.price)}</span>
           <s class="quick-view-product__price-compare">${this.formatMoney(selectedVariant.compare_at_price)}</s>`
        : `<span>${this.formatMoney(selectedVariant.price)}</span>`;

      this.content.innerHTML = `
        <div class="quick-view-product" data-quick-view-product>
          <div class="quick-view-product__gallery">
            ${imagesHtml}
            ${thumbnailsHtml}
          </div>
          <div class="quick-view-product__info">
            <h2 class="quick-view-product__title">${product.title}</h2>
            <div class="quick-view-product__price" data-price>${priceHtml}</div>

            ${optionsHtml}

            <div class="quick-view-product__quantity">
              <span class="quick-view-product__quantity-label">Quantity</span>
              <div class="quick-view-product__quantity-selector">
                <button type="button" class="quick-view-product__quantity-btn" data-quantity-minus>−</button>
                <input type="number" value="1" min="1" class="quick-view-product__quantity-input" data-quantity-input>
                <button type="button" class="quick-view-product__quantity-btn" data-quantity-plus>+</button>
              </div>
            </div>

            <button type="button" class="btn btn--primary btn--full quick-view-product__add"
              data-add-to-cart data-variant-id="${selectedVariant.id}"
              ${!selectedVariant.available ? 'disabled' : ''}>
              ${selectedVariant.available ? (window.translations?.addToCart || 'Add to cart') : (window.translations?.soldOut || 'Sold out')}
            </button>

            <a href="${productUrl}" class="quick-view-product__view-full">View full details</a>
          </div>
        </div>
      `;

      this.initQuickViewProduct();
    }

    initQuickViewProduct() {
      const product = this.content.querySelector('[data-quick-view-product]');
      if (!product) return;

      // Thumbnail clicks
      product.querySelectorAll('.quick-view-product__thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const index = thumb.dataset.imageIndex;
          const mainImage = product.querySelector('.quick-view-product__image');
          const thumbImg = thumb.querySelector('img');

          if (mainImage && thumbImg) {
            mainImage.src = thumbImg.src.replace(/&width=\d+/, '&width=600');
          }

          product.querySelectorAll('.quick-view-product__thumbnail').forEach(t => t.classList.remove('is-active'));
          thumb.classList.add('is-active');
        });
      });

      // Quantity controls
      const quantityInput = product.querySelector('[data-quantity-input]');
      product.querySelector('[data-quantity-minus]')?.addEventListener('click', () => {
        if (quantityInput && parseInt(quantityInput.value) > 1) {
          quantityInput.value = parseInt(quantityInput.value) - 1;
        }
      });
      product.querySelector('[data-quantity-plus]')?.addEventListener('click', () => {
        if (quantityInput) {
          quantityInput.value = parseInt(quantityInput.value) + 1;
        }
      });

      // Add to cart
      const addBtn = product.querySelector('[data-add-to-cart]');
      addBtn?.addEventListener('click', async () => {
        const variantId = addBtn.dataset.variantId;
        const quantity = parseInt(quantityInput?.value) || 1;
        await this.addToCart(variantId, quantity, addBtn);
      });
    }

    async addToCart(variantId, quantity, btn) {
      const originalText = btn.textContent;
      btn.textContent = window.translations?.adding || 'Adding...';
      btn.disabled = true;

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: quantity })
        });

        if (response.ok) {
          btn.textContent = window.translations?.added || 'Added!';

          // Update cart count
          document.querySelectorAll('[data-cart-count]').forEach(el => {
            fetch('/cart.js')
              .then(r => r.json())
              .then(cart => {
                el.textContent = cart.item_count;
                el.hidden = cart.item_count === 0;
              });
          });

          // Open cart drawer
          document.dispatchEvent(new CustomEvent('milutin:cart:open'));

          setTimeout(() => this.close(), 500);
        } else {
          throw new Error('Failed to add to cart');
        }
      } catch (error) {
        console.error('Add to cart error:', error);
        btn.textContent = 'Error';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      }
    }

    formatMoney(cents) {
      return (cents / 100).toFixed(2) + ' RSD';
    }

    close() {
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  /**
   * Quick Add to Cart
   * Handles size buttons and single-variant quick add
   */
  class QuickAdd {
    constructor() {
      this.init();
    }

    init() {
      // Size button clicks
      document.addEventListener('click', async (e) => {
        const sizeBtn = e.target.closest('[data-quick-add-size]');
        if (sizeBtn && !sizeBtn.disabled) {
          e.preventDefault();
          await this.addToCart(sizeBtn.dataset.variantId, sizeBtn);
        }

        const singleBtn = e.target.closest('[data-quick-add-single]');
        if (singleBtn) {
          e.preventDefault();
          await this.addToCart(singleBtn.dataset.variantId, singleBtn);
        }
      });
    }

    async addToCart(variantId, btn) {
      if (btn.classList.contains('is-adding')) return;

      btn.classList.add('is-adding');
      const originalText = btn.textContent;

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });

        if (response.ok) {
          btn.classList.remove('is-adding');
          btn.classList.add('is-added');

          // Update cart count
          document.querySelectorAll('[data-cart-count]').forEach(el => {
            fetch('/cart.js')
              .then(r => r.json())
              .then(cart => {
                el.textContent = cart.item_count;
                el.hidden = cart.item_count === 0;
              });
          });

          // Open cart drawer
          document.dispatchEvent(new CustomEvent('milutin:cart:open'));

          setTimeout(() => {
            btn.classList.remove('is-added');
          }, 2000);
        } else {
          throw new Error('Failed to add');
        }
      } catch (error) {
        console.error('Quick add error:', error);
        btn.classList.remove('is-adding');
      }
    }
  }

  /**
   * Initialize
   */
  function init() {
    window.wishlist = new WishlistManager();
    new QuickViewModal();
    new QuickAdd();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
