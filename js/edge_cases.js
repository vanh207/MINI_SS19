/* ===================================================================
   FASTMART-ENTERPRISE - EDGE CASES INTERACTIVE SANDBOX
   1. Race Condition (Flash Sale Lock)
   2. Payment Callback Timeout & 5-min Reconciliation
   3. Negative/Invalid Input Injection (Defensive Tier 2 Validation)
   =================================================================== */

class EdgeCaseSandbox {
  constructor(db) {
    this.db = db;
    this.initUI();
  }

  initUI() {
    // Simulator 1: Race Condition
    const btnSimRace = document.getElementById('btn-run-race-sim');
    if (btnSimRace) {
      btnSimRace.addEventListener('click', () => this.runRaceConditionSim());
    }

    // Simulator 2: Payment Timeout
    const btnSimTimeout = document.getElementById('btn-run-timeout-sim');
    const btnTriggerRecon = document.getElementById('btn-trigger-reconciliation');
    if (btnSimTimeout) {
      btnSimTimeout.addEventListener('click', () => this.runPaymentTimeoutSim());
    }
    if (btnTriggerRecon) {
      btnTriggerRecon.addEventListener('click', () => this.triggerReconciliationService());
    }

    // Simulator 3: Negative Input Injection
    const btnSimInjection = document.getElementById('btn-run-injection-sim');
    if (btnSimInjection) {
      btnSimInjection.addEventListener('click', () => this.runNegativeInputSim());
    }
  }

  appendConsole(consoleId, text, type = 'info') {
    const el = document.getElementById(consoleId);
    if (!el) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    let color = '#a5f3fc';
    if (type === 'success') color = '#34d399';
    if (type === 'error') color = '#fb7185';
    if (type === 'warn') color = '#fbbf24';

    el.innerHTML += `<div style="color: ${color}; margin-bottom: 2px;">[${timeStr}] ${text}</div>`;
    el.scrollTop = el.scrollHeight;
  }

  clearConsole(consoleId) {
    const el = document.getElementById(consoleId);
    if (el) el.innerHTML = '';
  }

  // =================================================================
  // 1. RACE CONDITION SIMULATION
  // =================================================================
  runRaceConditionSim() {
    this.clearConsole('console-race-sim');
    this.appendConsole('console-race-sim', '>>> KHỞI CHẠY FLASH SALE: 5 KHÁCH ĐỒNG THỜI MUA 1 MÓN DUY NHẤT', 'warn');

    // Reset PRD-1003 stock to 1
    const p = this.db.products.find(x => x.productId === 'PRD-1003');
    if (p) p.stockQuantity = 1;
    this.db.notify();

    const users = ['Khách A (Hà Nội)', 'Khách B (Đà Nẵng)', 'Khách C (TP.HCM)', 'Khách D (Cần Thơ)', 'Khách E (Hải Phòng)'];
    this.appendConsole('console-race-sim', `Tồn kho hiện tại: [${p ? p.productName : 'PRD-1003'}] = 1 đơn vị.`);
    this.appendConsole('console-race-sim', 'Business Layer áp dụng: Pessimistic Row Lock (`SELECT ... FOR UPDATE`) & Redis Atomic Key.');

    let winnerFound = false;

    users.forEach((userName, idx) => {
      setTimeout(() => {
        const orderId = 'ORD-FLASH-' + (idx + 1);
        this.appendConsole('console-race-sim', `[Thread-${idx+1}] ${userName} gửi request đặt hàng ${orderId}...`);

        if (!winnerFound && p && p.stockQuantity > 0) {
          winnerFound = true;
          p.stockQuantity -= 1;
          this.db.orders.unshift({
            orderId,
            customerId: 'US-FLASH-' + (idx+1),
            orderDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
            totalAmount: 85000,
            channel: 'ONLINE_APP',
            status: 'CONFIRMED'
          });
          this.appendConsole('console-race-sim', `==> [Thread-${idx+1}] KHÓA THÀNH CÔNG! Giành được sản phẩm cuối cùng. Đơn: ${orderId}`, 'success');
          this.db.logAudit('T2-Business', 'RACE_LOCK_ACQUIRED', 'SUCCESS', `${userName} giành được lock cho ${p.productId}`);
        } else {
          this.appendConsole('console-race-sim', `==> [Thread-${idx+1}] TỪ CHỐI AN TOÀN: Tồn kho đã = 0. Trả về thông báo "Rất tiếc sản phẩm đã hết". Không bị Over-selling!`, 'error');
          this.db.logAudit('T2-Business', 'RACE_LOCK_REJECTED', 'SAFE', `${userName} bị từ chối do hết hàng`);
        }
        this.db.notify();
      }, 100 + (idx * 50));
    });
  }

  // =================================================================
  // 2. PAYMENT CALLBACK TIMEOUT & RECONCILIATION SIMULATION
  // =================================================================
  runPaymentTimeoutSim() {
    this.clearConsole('console-timeout-sim');
    this.appendConsole('console-timeout-sim', '>>> BẮT ĐẦU GIAO DỊCH VNPAY & MÔ PHỎNG ĐỨT KẾT NỐI MẠNG...', 'warn');

    const tempOrderId = 'ORD-TIMEO-' + Math.floor(1000 + Math.random() * 9000);
    this.timeoutOrder = {
      orderId: tempOrderId,
      customerId: 'US-0001',
      orderDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      totalAmount: 195000,
      channel: 'ONLINE_WEB',
      status: 'PENDING_RECONCILIATION'
    };

    this.appendConsole('console-timeout-sim', `Khách hàng quét mã VNPay QR thanh toán 195.000 đ.`);
    this.appendConsole('console-timeout-sim', `Cổng VNPay: Ví khách hàng đã BỊ TRỪ TIỀN thành công (Mã GD: VNP_RECON_8988).`);
    this.appendConsole('console-timeout-sim', `[MẠNG SỰ CỐ] Đường truyền 4G bị ngắt kết nối. Callback Webhook KHÔNG THỂ gửi tới FastMart!`, 'error');
    this.appendConsole('console-timeout-sim', `FastMart Server: Quá 5 giây chưa nhận được callback. Đưa đơn [${tempOrderId}] vào hàng đợi ĐỐI SOÁT TỰ ĐỘNG.`, 'warn');

    // Add to DB in pending state
    this.db.orders.unshift(this.timeoutOrder);
    this.db.logAudit('T2-Business', 'PAYMENT_CALLBACK_TIMEOUT', 'TIMEOUT', `Đơn ${tempOrderId} đứt kết nối mạng webhook`);
    this.db.notify();

    const btnRecon = document.getElementById('btn-trigger-reconciliation');
    if (btnRecon) btnRecon.disabled = false;
  }

  triggerReconciliationService() {
    if (!this.timeoutOrder) {
      this.appendConsole('console-timeout-sim', 'Chưa có đơn hàng nào bị gián đoạn để đối soát. Hãy chạy bước 1 trước!', 'warn');
      return;
    }

    this.appendConsole('console-timeout-sim', '>>> KÍCH HOẠT TIẾN TRÌNH RECONCILIATION WORKER (ĐỐI SOÁT ĐỊNH KỲ 5 PHÚT)...', 'info');
    this.appendConsole('console-timeout-sim', `Reconciliation Service gửi request kiểm tra: GET /api/vnpay/query_transaction?ref=${this.timeoutOrder.orderId}...`);

    setTimeout(() => {
      this.appendConsole('console-timeout-sim', `Phản hồi từ VNPAY: Giao dịch HỢP LỆ, Tiền đã vào tài khoản merchant lúc ${new Date().toLocaleTimeString('vi-VN')}.`, 'success');
      this.timeoutOrder.status = 'CONFIRMED';

      const payment = {
        paymentId: 'PAY-RECON-' + Math.floor(1000 + Math.random() * 9000),
        orderId: this.timeoutOrder.orderId,
        paymentMethod: 'VNPAY',
        amount: this.timeoutOrder.totalAmount,
        paymentStatus: 'PAID',
        transactionNo: 'VNP_RECON_VERIFIED'
      };
      this.db.payments.unshift(payment);
      this.db.logAudit('T2-Business', 'RECONCILIATION_RESOLVED', 'SUCCESS', `Tự động đối soát đơn ${this.timeoutOrder.orderId} thành công -> CONFIRMED`);

      this.appendConsole('console-timeout-sim', `==> HỆ THỐNG TỰ ĐỘNG CẬP NHẬT TRẠNG THÁI: [${this.timeoutOrder.orderId}] -> CONFIRMED.`, 'success');
      this.appendConsole('console-timeout-sim', `Gửi thông báo Push Notification tới Mobile App khách hàng: "Đơn hàng của bạn đã được xác nhận!".`, 'success');
      this.db.notify();

      const btnRecon = document.getElementById('btn-trigger-reconciliation');
      if (btnRecon) btnRecon.disabled = true;
      this.timeoutOrder = null;
    }, 600);
  }

  // =================================================================
  // 3. NEGATIVE / INVALID INPUT INJECTION SIMULATION
  // =================================================================
  runNegativeInputSim() {
    this.clearConsole('console-injection-sim');
    const attackType = document.getElementById('select-injection-type').value;

    this.appendConsole('console-injection-sim', `>>> BẮT ĐẦU THỬ NGHIỆM TẤN CÔNG / GIAO DỊCH DỊ BIỆT: [${attackType}]`, 'warn');

    if (attackType === 'NEGATIVE_QUANTITY') {
      this.appendConsole('console-injection-sim', 'Client Payload gửi thẳng API: { "productId": "PRD-1001", "quantity": -5 }');
      this.appendConsole('console-injection-sim', 'Đang thẩm định tại Tầng 2 (Business Logic Layer - Defensive Filter)...');

      setTimeout(() => {
        this.appendConsole('console-injection-sim', '[DEFENSE TRIGGERED] Phát hiện số lượng âm hoặc bằng 0: quantity = -5!', 'error');
        this.appendConsole('console-injection-sim', 'HTTP 400 Bad Request: "Số lượng sản phẩm phải là số nguyên dương strictly (> 0)"', 'error');
        this.appendConsole('console-injection-sim', 'CSDL MySQL không bị ảnh hưởng. Dữ liệu tài chính an toàn tuyệt đối.', 'success');
        this.db.logAudit('T2-Business', 'DEFENSIVE_VALIDATION_BLOCKED', 'SECURITY_ALERT', 'Phát hiện quantity âm: -5');
      }, 300);

    } else if (attackType === 'EXPIRED_VOUCHER') {
      this.appendConsole('console-injection-sim', 'Client Payload gửi mã Voucher: "EXPIRED2024" (Đã hết hạn từ năm ngoái)');
      setTimeout(() => {
        this.appendConsole('console-injection-sim', '[DEFENSE TRIGGERED] Kiểm tra Promotion Rules: Voucher "EXPIRED2024" có flag active = false.', 'error');
        this.appendConsole('console-injection-sim', 'HTTP 400 Bad Request: "Mã giảm giá đã hết hạn sử dụng. Vui lòng kiểm tra lại!"', 'error');
        this.appendConsole('console-injection-sim', 'Từ chối giảm trừ hóa đơn trái phép thành công.', 'success');
        this.db.logAudit('T2-Business', 'EXPIRED_VOUCHER_BLOCKED', 'SECURITY_ALERT', 'Áp voucher hết hạn EXPIRED2024');
      }, 300);

    } else if (attackType === 'INVALID_PHONE') {
      this.appendConsole('console-injection-sim', 'Client Payload thông tin khách hàng: phone = "987abc12" (Sai định dạng regex)');
      setTimeout(() => {
        this.appendConsole('console-injection-sim', '[DEFENSE TRIGGERED] Regex check failed: Không thỏa mãn /^0\\d{9}$/ (phải gồm 10 chữ số bắt đầu bằng 0).', 'error');
        this.appendConsole('console-injection-sim', 'HTTP 422 Unprocessable Entity: "Số điện thoại không hợp lệ". Chặn trước khi ghi vào CSDL.', 'error');
        this.db.logAudit('T2-Business', 'INVALID_PHONE_BLOCKED', 'VALIDATION_FAIL', 'SĐT sai định dạng: 987abc12');
      }, 300);
    }
  }
}

window.EdgeCaseSandbox = EdgeCaseSandbox;
