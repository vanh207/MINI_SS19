/* ===================================================================
   FASTMART-ENTERPRISE - RELATIONAL DATABASE ENGINE (3NF COMPLIANT)
   Handles transactional state, relational integrity, locks & audit logs
   =================================================================== */

class FastMartDatabase {
  constructor() {
    this.listeners = [];
    this.initDefaultData();
  }

  initDefaultData() {
    this.categories = [
      { categoryId: 'CAT-01', categoryName: 'Thực phẩm Tươi sống & Rau củ', description: 'Nông sản sạch VietGAP' },
      { categoryId: 'CAT-02', categoryName: 'Sữa & Sản phẩm từ Sữa', description: 'Sữa tươi, bơ sữa dinh dưỡng' },
      { categoryId: 'CAT-03', categoryName: 'Hóa mỹ phẩm & Chăm sóc gia đình', description: 'Nước giặt, dầu gội, tẩy rửa' },
      { categoryId: 'CAT-04', categoryName: 'Đồ uống & Giải khát', description: 'Nước ngọt, trà xanh, cà phê' },
    ];

    this.products = [
      { productId: 'PRD-1001', productName: 'Gạo ST25 Ông Cua (Túi 5kg)', categoryId: 'CAT-01', unitPrice: 195000, stockQuantity: 15, status: 'ACTIVE', emoji: '🌾' },
      { productId: 'PRD-1002', productName: 'Sữa tươi TH True Milk 1L', categoryId: 'CAT-02', unitPrice: 38000, stockQuantity: 40, status: 'ACTIVE', emoji: '🥛' },
      { productId: 'PRD-1003', productName: 'Thịt Ba Rọi Heo CP 500g', categoryId: 'CAT-01', unitPrice: 85000, stockQuantity: 1, status: 'ACTIVE', emoji: '🥩' }, // Edge case 1 item!
      { productId: 'PRD-1004', productName: 'Nước giặt OMO Matic Cửa Trên 3.6kg', categoryId: 'CAT-03', unitPrice: 220000, stockQuantity: 20, status: 'ACTIVE', emoji: '🧼' },
      { productId: 'PRD-1005', productName: 'Trà Xanh Không Độ Chai 455ml', categoryId: 'CAT-04', unitPrice: 10000, stockQuantity: 100, status: 'ACTIVE', emoji: '🍵' },
      { productId: 'PRD-1006', productName: 'Dầu ăn Simply Đậu Nành 1L', categoryId: 'CAT-01', unitPrice: 62000, stockQuantity: 30, status: 'ACTIVE', emoji: '🍳' },
    ];

    this.users = [
      { userId: 'US-0001', username: 'vietanh.customer', fullName: 'Nguyễn Việt Anh', phone: '0912345678', email: 'vietanh@fastmart.vn', role: 'CUSTOMER' },
      { userId: 'US-0002', username: 'pos.cashier01', fullName: 'Trần Thị Thu Ngân', phone: '0987654321', email: 'cashier01@fastmart.vn', role: 'CASHIER' },
      { userId: 'US-0003', username: 'warehouse.lead', fullName: 'Lê Văn Kho', phone: '0933221100', email: 'warehouse@fastmart.vn', role: 'WAREHOUSE' },
      { userId: 'US-0004', username: 'admin.enterprise', fullName: 'System Administrator', phone: '0909998888', email: 'admin@fastmart.vn', role: 'ADMIN' },
    ];

    this.orders = [
      { orderId: 'ORD-8801', customerId: 'US-0001', orderDate: '2026-10-04 10:15:00', totalAmount: 233000, channel: 'ONLINE_WEB', status: 'COMPLETED' },
      { orderId: 'ORD-8802', customerId: 'US-0001', orderDate: '2026-10-04 11:00:00', totalAmount: 85000, channel: 'ONLINE_APP', status: 'PROCESSING' },
    ];

    this.orderItems = [
      { orderId: 'ORD-8801', productId: 'PRD-1001', quantity: 1, price: 195000, lineTotal: 195000 },
      { orderId: 'ORD-8801', productId: 'PRD-1002', quantity: 1, price: 38000, lineTotal: 38000 },
      { orderId: 'ORD-8802', productId: 'PRD-1003', quantity: 1, price: 85000, lineTotal: 85000 },
    ];

    this.payments = [
      { paymentId: 'PAY-9001', orderId: 'ORD-8801', paymentMethod: 'VNPAY', amount: 233000, paymentStatus: 'PAID', transactionNo: 'VNP20261004101582' },
      { paymentId: 'PAY-9002', orderId: 'ORD-8802', paymentMethod: 'MOMO', amount: 85000, paymentStatus: 'PAID', transactionNo: 'MM20261004110093' },
    ];

    this.stockLocks = [];
    this.auditLogs = [
      { logId: 'LOG-001', timestamp: '10:00:05', tier: 'T2-Business', action: 'INIT_SYSTEM', status: 'SUCCESS', details: 'FastMart-Enterprise 3-Tier engine online.' },
    ];

    this.vouchers = {
      'FASTMART50': { code: 'FASTMART50', discount: 50000, minOrder: 150000, active: true },
      'FREESHIP': { code: 'FREESHIP', discount: 25000, minOrder: 100000, active: true },
      'EXPIRED2024': { code: 'EXPIRED2024', discount: 100000, minOrder: 50000, active: false }
    };

    this.notify();
  }

  // Subscribe to changes
  subscribe(fn) {
    this.listeners.push(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  logAudit(tier, action, status, details) {
    const logId = 'LOG-' + String(this.auditLogs.length + 1).padStart(3, '0');
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    this.auditLogs.unshift({ logId, timestamp: timeStr, tier, action, status, details });
    if (this.auditLogs.length > 50) this.auditLogs.pop();
    this.notify();
  }

  // 15-Minute Real-time Stock Lock mechanism
  createStockLock(productId, quantity, orderId) {
    const product = this.products.find(p => p.productId === productId);
    if (!product) return { success: false, reason: 'Sản phẩm không tồn tại' };

    // Calculate active locked quantity
    const now = Date.now();
    const activeLocked = this.stockLocks
      .filter(l => l.productId === productId && l.status === 'ACTIVE' && l.expiresAt > now)
      .reduce((sum, l) => sum + l.quantity, 0);

    const availableStock = product.stockQuantity - activeLocked;

    if (availableStock < quantity) {
      return { success: false, reason: `Hết hàng khả dụng (Tồn: ${product.stockQuantity}, Đang khóa: ${activeLocked})` };
    }

    const lockId = 'LCK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const lock = {
      lockId,
      productId,
      quantity,
      orderId,
      createdAt: now,
      expiresAt: now + (15 * 60 * 1000), // 15 minutes
      status: 'ACTIVE'
    };

    this.stockLocks.push(lock);
    this.logAudit('T2-Business', 'STOCK_LOCK', 'SUCCESS', `Khóa ${quantity}x ${product.productName} trong 15p cho đơn ${orderId}`);
    this.notify();
    return { success: true, lock };
  }

  // Commit order transaction (Atomic operation)
  commitOrder(orderData, itemsData, paymentData) {
    // Pessimistic check
    for (const item of itemsData) {
      const prod = this.products.find(p => p.productId === item.productId);
      if (!prod || prod.stockQuantity < item.quantity) {
        this.logAudit('T2-Business', 'ORDER_COMMIT_FAIL', 'FAILED', `Không đủ tồn kho cho ${item.productId}`);
        return { success: false, error: `Sản phẩm ${prod ? prod.productName : item.productId} không đủ hàng.` };
      }
    }

    // Deduct stock
    itemsData.forEach(item => {
      const prod = this.products.find(p => p.productId === item.productId);
      prod.stockQuantity -= item.quantity;
      // Mark locks as COMMITTED
      this.stockLocks.forEach(l => {
        if (l.orderId === orderData.orderId && l.productId === item.productId) {
          l.status = 'COMMITTED';
        }
      });
    });

    this.orders.unshift(orderData);
    itemsData.forEach(it => this.orderItems.unshift(it));
    this.payments.unshift(paymentData);

    this.logAudit('T3-Data', 'DB_TRANSACTION_COMMIT', 'SUCCESS', `Tạo đơn ${orderData.orderId}, trừ kho và lưu Payment ${paymentData.paymentId}`);
    this.notify();
    return { success: true, order: orderData };
  }

  // Defensive validation at Business Logic Layer
  validateOrderInput(items, customerInfo) {
    // Check customer phone: 10 digits starting with 0
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      return { valid: false, field: 'phone', message: 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0' };
    }

    // Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      return { valid: false, field: 'email', message: 'Email không đúng định dạng chuẩn' };
    }

    // Check quantity strictly > 0
    for (const it of items) {
      if (!Number.isInteger(it.quantity) || it.quantity <= 0) {
        return { valid: false, field: 'quantity', message: `Số lượng sản phẩm [${it.productName}] phải là số nguyên dương strictly (> 0)` };
      }
    }

    return { valid: true };
  }
}

// Global instance
window.fastMartDB = new FastMartDatabase();
