/* ===================================================================
   FASTMART-ENTERPRISE - STOREFRONT & POS DEMO LOGIC
   Omnichannel shopping, 15m stock reservation timer, payment & receipt
   =================================================================== */

class FastMartDemo {
  constructor(db) {
    this.db = db;
    this.cart = [];
    this.currentChannel = 'ONLINE_WEB';
    this.currentCategory = 'ALL';
    this.appliedVoucher = null;
    this.lockTimerInterval = null;
    this.lockTimeRemaining = 15 * 60; // 15 mins in seconds

    this.initUI();
    this.db.subscribe(() => this.renderProducts());
  }

  initUI() {
    this.renderProducts();
    this.renderCart();

    // Channel Switcher
    const channelBtns = document.querySelectorAll('.channel-btn');
    channelBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        channelBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentChannel = btn.dataset.channel;
        const channelLabel = document.getElementById('demo-channel-label');
        if (channelLabel) {
          channelLabel.textContent = btn.textContent.trim();
        }
        window.showToast?.('info', `Đã chuyển sang kênh bán: ${btn.textContent.trim()}`);
      });
    });

    // Category pills
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentCategory = pill.dataset.cat;
        this.renderProducts();
      });
    });

    // Apply Voucher button
    const btnVoucher = document.getElementById('btn-apply-voucher');
    const voucherInput = document.getElementById('input-voucher-code');
    if (btnVoucher && voucherInput) {
      btnVoucher.addEventListener('click', () => {
        const code = voucherInput.value.trim().toUpperCase();
        this.applyVoucher(code);
      });
    }

    // Checkout button
    const btnCheckout = document.getElementById('btn-open-checkout');
    if (btnCheckout) {
      btnCheckout.addEventListener('click', () => this.openCheckoutModal());
    }

    // Payment confirm button
    const btnConfirmPay = document.getElementById('btn-confirm-payment');
    if (btnConfirmPay) {
      btnConfirmPay.addEventListener('click', () => this.executeOrderTransaction());
    }
  }

  renderProducts() {
    const container = document.getElementById('products-grid-container');
    if (!container) return;

    let prods = this.db.products;
    if (this.currentCategory !== 'ALL') {
      prods = prods.filter(p => p.categoryId === this.currentCategory);
    }

    container.innerHTML = prods.map(p => {
      let stockClass = 'in-stock';
      let stockLabel = `Còn ${p.stockQuantity} sp`;
      if (p.stockQuantity === 0) {
        stockClass = 'out-of-stock';
        stockLabel = 'Hết hàng';
      } else if (p.stockQuantity <= 3) {
        stockClass = 'low-stock';
        stockLabel = `Chỉ còn ${p.stockQuantity} sp!`;
      }

      return `
        <div class="product-card" data-id="${p.productId}">
          <div class="product-image-box">
            <span>${p.emoji || '📦'}</span>
          </div>
          <div class="product-info">
            <span class="product-sku">${p.productId}</span>
            <h4>${p.productName}</h4>
            <div class="product-meta">
              <span class="product-price">${p.unitPrice.toLocaleString('vi-VN')} đ</span>
              <span class="product-stock ${stockClass}">${stockLabel}</span>
            </div>
            <button class="btn-add-cart" onclick="window.fastMartDemo.addToCart('${p.productId}')" ${p.stockQuantity <= 0 ? 'disabled' : ''}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              ${p.stockQuantity <= 0 ? 'Hết hàng' : 'Thêm giỏ hàng'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  addToCart(productId) {
    const prod = this.db.products.find(p => p.productId === productId);
    if (!prod) return;

    const existing = this.cart.find(it => it.productId === productId);
    const currentQtyInCart = existing ? existing.quantity : 0;

    if (currentQtyInCart + 1 > prod.stockQuantity) {
      window.showToast?.('error', `Sản phẩm ${prod.productName} không còn đủ tồn kho khả dụng!`);
      return;
    }

    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        productId: prod.productId,
        productName: prod.productName,
        unitPrice: prod.unitPrice,
        quantity: 1,
        emoji: prod.emoji
      });
    }

    // Start 15-min stock lock timer if not already running
    this.startLockTimer();

    this.renderCart();
    window.showToast?.('success', `Đã thêm "${prod.productName}" vào giỏ hàng`);
  }

  updateQuantity(productId, delta) {
    const item = this.cart.find(it => it.productId === productId);
    if (!item) return;

    const prod = this.db.products.find(p => p.productId === productId);
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      this.cart = this.cart.filter(it => it.productId !== productId);
    } else {
      if (prod && newQty > prod.stockQuantity) {
        window.showToast?.('warning', `Chỉ còn ${prod.stockQuantity} sản phẩm trong kho`);
        return;
      }
      item.quantity = newQty;
    }

    if (this.cart.length === 0) {
      this.stopLockTimer();
    }

    this.renderCart();
  }

  startLockTimer() {
    if (this.lockTimerInterval) return;
    this.lockTimeRemaining = 15 * 60; // 15 mins
    const timerDisplay = document.getElementById('lock-timer-countdown');

    this.lockTimerInterval = setInterval(() => {
      this.lockTimeRemaining--;
      if (this.lockTimeRemaining <= 0) {
        this.stopLockTimer();
        this.cart = [];
        this.renderCart();
        window.showToast?.('error', 'Hết 15 phút giữ chỗ tồn kho! Giỏ hàng đã được tự động giải phóng.');
        return;
      }
      if (timerDisplay) {
        const mins = Math.floor(this.lockTimeRemaining / 60);
        const secs = this.lockTimeRemaining % 60;
        timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    }, 1000);
  }

  stopLockTimer() {
    if (this.lockTimerInterval) {
      clearInterval(this.lockTimerInterval);
      this.lockTimerInterval = null;
    }
    const timerDisplay = document.getElementById('lock-timer-countdown');
    if (timerDisplay) timerDisplay.textContent = '15:00';
  }

  applyVoucher(code) {
    const voucher = this.db.vouchers[code];
    if (!voucher) {
      window.showToast?.('error', `Mã Voucher "${code}" không tồn tại trong hệ thống!`);
      return;
    }

    if (!voucher.active) {
      window.showToast?.('error', `Mã Voucher "${code}" đã hết hạn sử dụng! (Defensive Rule Blocked)`);
      this.db.logAudit('T2-Business', 'VOUCHER_VALIDATE_FAIL', 'REJECTED', `Khách áp voucher hết hạn [${code}]`);
      return;
    }

    const subtotal = this.getSubtotal();
    if (subtotal < voucher.minOrder) {
      window.showToast?.('warning', `Đơn hàng tối thiểu để áp dụng mã "${code}" là ${voucher.minOrder.toLocaleString('vi-VN')} đ`);
      return;
    }

    this.appliedVoucher = voucher;
    window.showToast?.('success', `Áp dụng thành công Voucher "${code}" - Giảm ${voucher.discount.toLocaleString('vi-VN')} đ`);
    this.renderCart();
  }

  getSubtotal() {
    return this.cart.reduce((sum, it) => sum + (it.unitPrice * it.quantity), 0);
  }

  getDiscount() {
    return this.appliedVoucher ? this.appliedVoucher.discount : 0;
  }

  getTotal() {
    return Math.max(0, this.getSubtotal() - this.getDiscount());
  }

  renderCart() {
    const itemsList = document.getElementById('cart-items-container');
    const badgeCount = document.getElementById('cart-badge-count');
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-total');
    const btnCheckout = document.getElementById('btn-open-checkout');
    const timerBox = document.getElementById('cart-lock-banner');

    const totalItems = this.cart.reduce((s, it) => s + it.quantity, 0);
    if (badgeCount) badgeCount.textContent = totalItems;

    if (timerBox) {
      timerBox.style.display = this.cart.length > 0 ? 'flex' : 'none';
    }

    if (!itemsList) return;

    if (this.cart.length === 0) {
      itemsList.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-dim);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛒</div>
          <p style="font-size: 0.85rem;">Giỏ hàng của bạn đang trống</p>
          <span style="font-size: 0.72rem;">Vui lòng chọn sản phẩm để bắt đầu</span>
        </div>
      `;
      if (btnCheckout) btnCheckout.disabled = true;
    } else {
      itemsList.innerHTML = this.cart.map(it => `
        <div class="cart-item">
          <div>
            <div class="cart-item-name">${it.productName}</div>
            <div class="cart-item-sub">${it.unitPrice.toLocaleString('vi-VN')} đ x ${it.quantity}</div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="window.fastMartDemo.updateQuantity('${it.productId}', -1)">-</button>
            <span style="font-size: 0.85rem; font-weight: 700; min-width: 18px; text-align: center;">${it.quantity}</span>
            <button class="qty-btn" onclick="window.fastMartDemo.updateQuantity('${it.productId}', 1)">+</button>
          </div>
        </div>
      `).join('');
      if (btnCheckout) btnCheckout.disabled = false;
    }

    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const total = this.getTotal();

    if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString('vi-VN') + ' đ';
    if (discountEl) discountEl.textContent = '-' + discount.toLocaleString('vi-VN') + ' đ';
    if (totalEl) totalEl.textContent = total.toLocaleString('vi-VN') + ' đ';
  }

  openCheckoutModal() {
    if (this.cart.length === 0) return;
    const modal = document.getElementById('checkout-modal');
    const orderTotalEl = document.getElementById('modal-order-total');
    if (orderTotalEl) orderTotalEl.textContent = this.getTotal().toLocaleString('vi-VN') + ' đ';
    if (modal) modal.classList.add('active');
  }

  closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('active');
  }

  executeOrderTransaction() {
    const nameInput = document.getElementById('checkout-customer-name');
    const phoneInput = document.getElementById('checkout-customer-phone');
    const emailInput = document.getElementById('checkout-customer-email');
    const paymentMethodSelect = document.getElementById('checkout-payment-method');

    const customerInfo = {
      fullName: nameInput ? nameInput.value.trim() : 'Nguyễn Việt Anh',
      phone: phoneInput ? phoneInput.value.trim() : '0912345678',
      email: emailInput ? emailInput.value.trim() : 'vietanh@fastmart.vn'
    };

    // Tier 2 Defensive Validation
    const validation = this.db.validateOrderInput(this.cart, customerInfo);
    if (!validation.valid) {
      window.showToast?.('error', `Lỗi nghiệp vụ: ${validation.message}`);
      this.db.logAudit('T2-Business', 'INPUT_VALIDATION_ERROR', 'FAILED', validation.message);
      return;
    }

    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const paymentId = 'PAY-' + Math.floor(1000 + Math.random() * 9000);
    const paymentMethod = paymentMethodSelect ? paymentMethodSelect.value : 'VNPAY';
    const totalAmount = this.getTotal();

    const orderData = {
      orderId,
      customerId: 'US-0001',
      orderDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      totalAmount,
      channel: this.currentChannel,
      status: 'CONFIRMED'
    };

    const itemsData = this.cart.map(it => ({
      orderId,
      productId: it.productId,
      quantity: it.quantity,
      price: it.unitPrice,
      lineTotal: it.unitPrice * it.quantity
    }));

    const paymentData = {
      paymentId,
      orderId,
      paymentMethod,
      amount: totalAmount,
      paymentStatus: 'PAID',
      transactionNo: (paymentMethod === 'VNPAY' ? 'VNP' : (paymentMethod === 'MOMO' ? 'MM' : 'CSH')) + Date.now().toString().substring(6)
    };

    // Commit to 3-tier DB
    const result = this.db.commitOrder(orderData, itemsData, paymentData);

    if (result.success) {
      this.closeCheckoutModal();
      this.stopLockTimer();
      this.cart = [];
      this.appliedVoucher = null;
      this.renderCart();
      window.showToast?.('success', `Đơn hàng [${orderId}] đã được tạo & thanh toán thành công!`);

      // Show Receipt Modal
      this.showReceiptModal(orderData, itemsData, paymentData, customerInfo);
    } else {
      window.showToast?.('error', result.error);
    }
  }

  showReceiptModal(order, items, payment, customer) {
    const modal = document.getElementById('receipt-modal');
    const content = document.getElementById('receipt-content-body');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align: center; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 1rem; margin-bottom: 1rem;">
        <h3 style="color: #38bdf8; font-size: 1.2rem;">HÓA ĐƠN BÁN HÀNG FASTMART</h3>
        <p style="font-size: 0.78rem; color: var(--text-dim);">Hệ thống Bán lẻ Đa kênh FastMart-Enterprise v1.0</p>
        <span class="badge badge-emerald" style="margin-top: 0.4rem;">ĐÃ THANH TOÁN THÀNH CÔNG</span>
      </div>

      <div style="font-size: 0.8rem; line-height: 1.6; margin-bottom: 1rem; color: #cbd5e1;">
        <div><strong>Mã đơn hàng:</strong> <span style="font-family: var(--font-mono); color: #38bdf8;">${order.orderId}</span></div>
        <div><strong>Mã thanh toán:</strong> <span style="font-family: var(--font-mono);">${payment.paymentId} (${payment.paymentMethod})</span></div>
        <div><strong>Mã giao dịch:</strong> <span style="font-family: var(--font-mono);">${payment.transactionNo}</span></div>
        <div><strong>Kênh mua sắm:</strong> <span class="badge badge-cyan">${order.channel}</span></div>
        <div><strong>Khách hàng:</strong> ${customer.fullName} - ${customer.phone}</div>
        <div><strong>Thời gian:</strong> ${order.orderDate}</div>
      </div>

      <table class="slide-table" style="margin-bottom: 1rem;">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th style="text-align: center;">SL</th>
            <th style="text-align: right;">Đơn giá</th>
            <th style="text-align: right;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(it => `
            <tr>
              <td>${it.productId}</td>
              <td style="text-align: center;">${it.quantity}</td>
              <td style="text-align: right;">${it.price.toLocaleString('vi-VN')} đ</td>
              <td style="text-align: right; color: #34d399;">${it.lineTotal.toLocaleString('vi-VN')} đ</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; color: #38bdf8; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 0.75rem;">
        <span>TỔNG THANH TOÁN:</span>
        <span>${order.totalAmount.toLocaleString('vi-VN')} đ</span>
      </div>
    `;

    modal.classList.add('active');
  }
}

window.FastMartDemo = FastMartDemo;
