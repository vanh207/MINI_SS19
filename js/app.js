/* ===================================================================
   FASTMART-ENTERPRISE - MAIN APP CONTROLLER
   View switching, live 3NF DB table rendering, toasts & role switcher
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Init Toast helper
  window.showToast = function(type, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // Tab View Switcher
  const navTabs = document.querySelectorAll('.nav-tab');
  const viewContainers = document.querySelectorAll('.view-container');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetView = tab.dataset.view;
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      viewContainers.forEach(vc => {
        if (vc.id === targetView) {
          vc.classList.add('active');
        } else {
          vc.classList.remove('active');
        }
      });

      // If switched to slides, trigger GSAP update
      if (targetView === 'view-slides' && window.presentation) {
        window.presentation.showSlide(window.presentation.currentSlide, false);
      }
    });
  });

  // Fullscreen button
  const btnFullscreen = document.getElementById('btn-fullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn('Fullscreen error:', err);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Reset database button
  const btnResetData = document.getElementById('btn-reset-db');
  if (btnResetData) {
    btnResetData.addEventListener('click', () => {
      if (confirm('Khôi phục dữ liệu ban đầu cho hệ thống FastMart?')) {
        window.fastMartDB.initDefaultData();
        window.showToast('success', 'Đã đặt lại dữ liệu gốc của hệ thống!');
      }
    });
  }

  // Init instances
  window.presentation = new window.SlidePresentation();
  window.fastMartDemo = new window.FastMartDemo(window.fastMartDB);
  window.edgeCaseSandbox = new window.EdgeCaseSandbox(window.fastMartDB);

  // Live Database Table Renderer for view-db-arch
  function renderLiveDatabaseTables(db) {
    // 1. Products Table
    const prodTable = document.getElementById('db-table-products');
    if (prodTable) {
      prodTable.innerHTML = `
        <table class="slide-table">
          <thead>
            <tr><th>productId</th><th>productName</th><th>categoryId</th><th>unitPrice</th><th>stockQuantity</th><th>status</th></tr>
          </thead>
          <tbody>
            ${db.products.map(p => `
              <tr>
                <td style="font-family: var(--font-mono); color: #38bdf8;">${p.productId}</td>
                <td>${p.productName}</td>
                <td><span class="badge badge-cyan">${p.categoryId}</span></td>
                <td>${p.unitPrice.toLocaleString('vi-VN')} đ</td>
                <td><strong style="color: ${p.stockQuantity <= 0 ? '#fb7185' : (p.stockQuantity <= 3 ? '#fbbf24' : '#34d399')}">${p.stockQuantity}</strong></td>
                <td><span class="badge badge-emerald">${p.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // 2. Orders Table
    const orderTable = document.getElementById('db-table-orders');
    if (orderTable) {
      orderTable.innerHTML = `
        <table class="slide-table">
          <thead>
            <tr><th>orderId</th><th>customerId</th><th>channel</th><th>totalAmount</th><th>status</th><th>orderDate</th></tr>
          </thead>
          <tbody>
            ${db.orders.map(o => `
              <tr>
                <td style="font-family: var(--font-mono); color: #38bdf8;">${o.orderId}</td>
                <td>${o.customerId}</td>
                <td><span class="badge badge-cyan">${o.channel}</span></td>
                <td style="color: #34d399; font-weight: 700;">${o.totalAmount.toLocaleString('vi-VN')} đ</td>
                <td><span class="badge ${o.status === 'CONFIRMED' ? 'badge-emerald' : (o.status === 'CANCELLED' ? 'badge-rose' : 'badge-amber')}">${o.status}</span></td>
                <td style="font-size: 0.72rem; color: var(--text-dim);">${o.orderDate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // 3. OrderItems Table (3NF Intersection Table)
    const itemTable = document.getElementById('db-table-order-items');
    if (itemTable) {
      itemTable.innerHTML = `
        <table class="slide-table">
          <thead>
            <tr><th>orderId</th><th>productId</th><th>quantity</th><th>price</th><th>lineTotal</th></tr>
          </thead>
          <tbody>
            ${db.orderItems.map(it => `
              <tr>
                <td style="font-family: var(--font-mono);">${it.orderId}</td>
                <td style="font-family: var(--font-mono); color: #38bdf8;">${it.productId}</td>
                <td>${it.quantity}</td>
                <td>${it.price.toLocaleString('vi-VN')} đ</td>
                <td style="color: #34d399;">${it.lineTotal.toLocaleString('vi-VN')} đ</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // 4. Payments Table
    const payTable = document.getElementById('db-table-payments');
    if (payTable) {
      payTable.innerHTML = `
        <table class="slide-table">
          <thead>
            <tr><th>paymentId</th><th>orderId</th><th>method</th><th>amount</th><th>status</th><th>transactionNo</th></tr>
          </thead>
          <tbody>
            ${db.payments.map(py => `
              <tr>
                <td style="font-family: var(--font-mono); color: #38bdf8;">${py.paymentId}</td>
                <td>${py.orderId}</td>
                <td><span class="badge badge-cyan">${py.paymentMethod}</span></td>
                <td style="color: #34d399;">${py.amount.toLocaleString('vi-VN')} đ</td>
                <td><span class="badge badge-emerald">${py.paymentStatus}</span></td>
                <td style="font-family: var(--font-mono); font-size: 0.72rem;">${py.transactionNo}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // 5. Audit Logs Table
    const logTable = document.getElementById('db-table-audit-logs');
    if (logTable) {
      logTable.innerHTML = `
        <table class="slide-table">
          <thead>
            <tr><th>Time</th><th>Tier</th><th>Action</th><th>Status</th><th>Details</th></tr>
          </thead>
          <tbody>
            ${db.auditLogs.slice(0, 10).map(l => `
              <tr>
                <td style="font-family: var(--font-mono); font-size: 0.72rem;">${l.timestamp}</td>
                <td><span class="badge badge-cyan">${l.tier}</span></td>
                <td style="font-family: var(--font-mono); font-weight: 600;">${l.action}</td>
                <td><span class="badge ${l.status === 'SUCCESS' ? 'badge-emerald' : (l.status === 'FAILED' || l.status === 'SECURITY_ALERT' ? 'badge-rose' : 'badge-amber')}">${l.status}</span></td>
                <td style="font-size: 0.75rem; color: #cbd5e1;">${l.details}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  }

  // Subscribe DB renderer
  window.fastMartDB.subscribe((db) => renderLiveDatabaseTables(db));
  renderLiveDatabaseTables(window.fastMartDB);
});
