/* ===================================================================
   FASTMART-ENTERPRISE - GSAP SLIDE ENGINE
   High-performance timeline animations, diagram transitions & controls
   =================================================================== */

class SlidePresentation {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.isAnimating = false;

    this.initControls();
    this.initGSAP();
    this.showSlide(0, false);
  }

  initControls() {
    // Buttons
    const btnNext = document.getElementById('btn-next-slide');
    const btnPrev = document.getElementById('btn-prev-slide');
    const btnToggleNotes = document.getElementById('btn-toggle-notes');
    const notesModal = document.getElementById('presenter-notes-modal');
    const btnCloseNotes = document.getElementById('btn-close-notes');

    if (btnNext) btnNext.addEventListener('click', () => this.nextSlide());
    if (btnPrev) btnPrev.addEventListener('click', () => this.prevSlide());

    if (btnToggleNotes && notesModal) {
      btnToggleNotes.addEventListener('click', () => {
        notesModal.style.display = notesModal.style.display === 'block' ? 'none' : 'block';
      });
    }
    if (btnCloseNotes && notesModal) {
      btnCloseNotes.addEventListener('click', () => {
        notesModal.style.display = 'none';
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only active if slide view is visible
      const slideView = document.getElementById('view-slides');
      if (!slideView || !slideView.classList.contains('active')) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.goToSlide(this.totalSlides - 1);
      }
    });

    // Thumbnail / Quick jump select
    const slideSelect = document.getElementById('slide-jump-select');
    if (slideSelect) {
      slideSelect.addEventListener('change', (e) => {
        this.goToSlide(parseInt(e.target.value, 10));
      });
    }

    // Interactive AS-IS Crash vs TO-BE Simulator on Slide 2
    const btnSimAsis = document.getElementById('btn-sim-asis-crash');
    const btnSimTobe = document.getElementById('btn-sim-tobe-success');
    const simOutput = document.getElementById('asis-sim-output');

    if (btnSimAsis && simOutput) {
      btnSimAsis.addEventListener('click', () => {
        simOutput.style.display = 'block';
        simOutput.style.background = 'rgba(244, 63, 94, 0.15)';
        simOutput.style.border = '1px solid rgba(244, 63, 94, 0.4)';
        simOutput.style.color = '#fca5a5';
        simOutput.innerHTML = `
          <strong>[THỰC TRẠNG AS-IS: FLASH SALE CRASH TEST]</strong><br>
          ➔ Đẩy tải: 8,500 CCU đồng thời ập vào máy chủ Monolithic...<br>
          ➔ CPU chạm 100%, RAM 98.4%. MySQL Connection Pool: 500/500 cạn kiệt!<br>
          ➔ <span style="color: #fb7185; font-weight: 700;">LỖI NGHIÊM TRỌNG: HTTP 500 Database Lock Timeout & Server Crash!</span><br>
          ➔ Cổng thanh toán đứt kết nối. <strong>Over-selling xảy ra: 14 đơn hàng bị trùng cùng 1 suất hàng cuối!</strong> Khách hàng khiếu nại gay gắt.
        `;
        window.showToast?.('error', 'Hệ thống Monolithic AS-IS đã bị sập do quá tải kết nối và lệch tồn kho!');
      });
    }

    if (btnSimTobe && simOutput) {
      btnSimTobe.addEventListener('click', () => {
        simOutput.style.display = 'block';
        simOutput.style.background = 'rgba(16, 185, 129, 0.15)';
        simOutput.style.border = '1px solid rgba(16, 185, 129, 0.4)';
        simOutput.style.color = '#a7f3d0';
        simOutput.innerHTML = `
          <strong>[GIẢI PHÁP MỤC TIÊU TO-BE: 3-TIER ENTERPRISE TEST]</strong><br>
          ➔ Đẩy tải: 10,000 CCU Flash Sale qua Load Balancer (Presentation Layer)...<br>
          ➔ Redis Distributed Cache hấp thụ 82% lượt đọc Catalog & Giá.<br>
          ➔ Business Layer kích hoạt Pessimistic Lock & giữ chỗ tồn kho trong 15ms.<br>
          ➔ <span style="color: #34d399; font-weight: 700;">THÀNH CÔNG: HTTP 200 OK. Latency: 118ms (P95). Tỷ lệ Over-selling: 0.00%!</span> SLA đạt 99.9%.
        `;
        window.showToast?.('success', 'Hệ thống 3-Tier TO-BE xử lý mượt mà 10,000 CCU, triệt tiêu hoàn toàn Over-selling!');
      });
    }
  }

  initGSAP() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP library not loaded yet');
      return;
    }
    // Set default ease
    gsap.defaults({ ease: 'power2.out', duration: 0.6 });
  }

  showSlide(index, animate = true) {
    if (index < 0 || index >= this.totalSlides || (this.isAnimating && animate)) return;

    this.isAnimating = true;
    const prevIndex = this.currentSlide;
    const prevSlideEl = this.slides[prevIndex];
    const newSlideEl = this.slides[index];
    this.currentSlide = index;

    // Update UI Indicators
    const counterEl = document.getElementById('slide-counter-display');
    if (counterEl) {
      counterEl.textContent = `${index + 1} / ${this.totalSlides}`;
    }

    const progressBar = document.getElementById('slide-progress-bar');
    if (progressBar) {
      const pct = ((index + 1) / this.totalSlides) * 100;
      progressBar.style.width = `${pct}%`;
    }

    const selectEl = document.getElementById('slide-jump-select');
    if (selectEl) {
      selectEl.value = index;
    }

    const btnPrev = document.getElementById('btn-prev-slide');
    const btnNext = document.getElementById('btn-next-slide');
    if (btnPrev) btnPrev.disabled = index === 0;
    if (btnNext) btnNext.disabled = index === this.totalSlides - 1;

    // Update Notes
    this.updateNotes(index);

    if (!animate || typeof gsap === 'undefined') {
      this.slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
        s.style.opacity = i === index ? '1' : '0';
        s.style.visibility = i === index ? 'visible' : 'hidden';
      });
      this.isAnimating = false;
      this.animateSlideContent(newSlideEl);
      return;
    }

    // GSAP Transition
    const tl = gsap.timeline({
      onComplete: () => {
        prevSlideEl.classList.remove('active');
        prevSlideEl.style.visibility = 'hidden';
        this.isAnimating = false;
        this.animateSlideContent(newSlideEl);
      }
    });

    // Fade out previous slide
    if (prevSlideEl && prevSlideEl !== newSlideEl) {
      tl.to(prevSlideEl, { opacity: 0, y: -20, duration: 0.3 });
    }

    // Prepare new slide
    newSlideEl.classList.add('active');
    newSlideEl.style.visibility = 'visible';
    tl.fromTo(newSlideEl, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.5 }, 
      '-=0.1'
    );
  }

  animateSlideContent(slideEl) {
    if (typeof gsap === 'undefined' || !slideEl) return;

    // Stagger animate cards and badges
    const cards = slideEl.querySelectorAll('.slide-card, .tier-item, .uml-lane, .uml-class-box');
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 25, scale: 0.96 }, 
        { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.2)' }
      );
    }

    const title = slideEl.querySelector('.slide-title');
    const badge = slideEl.querySelector('.slide-badge-title');
    if (title && badge) {
      gsap.fromTo([badge, title], 
        { opacity: 0, x: -25 }, 
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.4 }
      );
    }

    // Specific animations for diagram flows
    if (slideEl.id === 'slide-seq') {
      this.animateSequenceDiagram();
    } else if (slideEl.id === 'slide-swimlanes') {
      this.animateSwimlanes();
    }
  }

  animateSwimlanes() {
    const nodes = document.querySelectorAll('#slide-swimlanes .uml-node');
    if (nodes.length > 0) {
      gsap.fromTo(nodes, 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, stagger: 0.12, duration: 0.4, ease: 'elastic.out(1, 0.7)' }
      );
    }
  }

  animateSequenceDiagram() {
    const steps = document.querySelectorAll('#slide-seq .seq-message-row');
    if (steps.length > 0) {
      gsap.fromTo(steps, 
        { opacity: 0, x: -30 }, 
        { opacity: 1, x: 0, stagger: 0.15, duration: 0.4 }
      );
    }
  }

  updateNotes(index) {
    const notesContent = document.getElementById('presenter-notes-body');
    if (!notesContent) return;

    const notes = [
      `<strong>Slide 1 (Bối cảnh & Giới thiệu):</strong> Giới thiệu dự án chuyển đổi số FastMart-Enterprise cho chuỗi 50 siêu thị FMCG & E-Commerce. Mục tiêu của System Analyst (SA) và quy chuẩn đóng gói IEEE 830 / ISO 29148.`,
      `<strong>Slide 2 (Phân Tích Thực Trạng AS-IS):</strong> Làm rõ 3 nút thắt khủng hoảng của hệ thống Monolithic cũ: 1. Nghẽn mạng & sập CSDL giờ cao điểm; 2. Bất đồng bộ tồn kho gây Over-selling 18.5% và đứt luồng thanh toán; 3. Khủng hoảng tài liệu gây tranh chấp nghiệm thu 6 tháng. Bảng đối chiếu toàn diện AS-IS vs TO-BE.`,
      `<strong>Slide 3 (Kiến trúc 3 Tầng TO-BE):</strong> Nhấn mạnh 3 tầng phân tách: Presentation (đa kênh POS, Web, App), Business Logic (Core APIs, Lock, Validation), và Data Access (MySQL Master-Slave + Redis Cache). Nêu bật 3 lý do giải quyết triệt để nghẽn mạng và bảo mật CSDL (phân tán tải, caching, cách ly CSDL sau DMZ).`,
      `<strong>Slide 4 (Stakeholders & User Stories & FR/NFR):</strong> Trình bày ma trận 4 nhóm: Ban Giám đốc (ROI, SLA), PM (tiến độ, scope), Dev (Class, Sequence, DB), QA (test case, criteria). Giới thiệu 3 User Story mẫu và 4 NFR dạng câu SMART (SLA 99.9%, Latency < 2s, SSL/BCrypt, 10,000 CCU).`,
      `<strong>Slide 5 (Activity Diagram với 4 Làn Swimlanes):</strong> Phân tích luồng "Đặt hàng Đa kênh & Khóa tồn kho Tự động" qua 4 làn: Khách hàng -> Business Layer -> Cổng Thanh toán -> Hệ thống Kho. Giải thích decision nodes khi hết hàng hoặc thanh toán thất bại.`,
      `<strong>Slide 6 (Use Case Diagram & Đặc tả Chi tiết):</strong> Giải thích 4 Actor chính (Customer, Cashier, Warehouse Staff, Admin). Mối quan hệ <<include>> (Xác thực, Kiểm tra tồn kho) và <<extend>> (Áp mã Voucher, Thanh toán VNPay). Trình bày bảng đặc tả Use Case cốt lõi "Đặt hàng trực tuyến (Place Order)".`,
      `<strong>Slide 7 (Thiết kế Hướng đối tượng - Class Diagram 3 Ngăn):</strong> Trình bày 3 ngăn (Name, Attributes + access modifiers, Methods). Thể hiện đầy đủ OOP: Kế thừa (User -> Customer/Staff), Composition (Order *-- OrderItem 1..*), Aggregation (Product o-- Category) và Multiplicity.`,
      `<strong>Slide 8 (Tương tác Động - Sequence Diagram):</strong> Thể hiện 5 Lifelines: CustomerUI, OrderController, InventoryService, PaymentService, Database. Chỉ rõ các khung loop duyệt giỏ hàng, alt kiểm tra tồn kho & thanh toán thành công/thất bại và cơ chế đối soát.`,
      `<strong>Slide 9 (Thiết kế Cơ sở Dữ liệu ERD Chuẩn 3NF):</strong> Mapping Class Diagram sang CSDL quan hệ. Quá trình chuẩn hóa: 1NF (tách mảng OrderItem), 2NF (khóa tổng hợp OrderItem loại bỏ phụ thuộc một phần), 3NF (tách Category, User loại bỏ phụ thuộc bắc cầu).`,
      `<strong>Slide 10 (Xử lý 3 Bẫy Dữ liệu Dị biệt - Edge Cases):</strong> 1. Race condition (Flash Sale) giải quyết bằng Optimistic/Pessimistic lock; 2. Timeout cổng thanh toán giải quyết bằng Reconciliation Service 5 phút; 3. Dữ liệu dị biệt (quantity = -5, voucher hết hạn) giải quyết bằng Defensive Validation tại Tầng 2.`,
      `<strong>Slide 11 (Ma trận Phân quyền & Đóng gói Hồ sơ SRS):</strong> Bảng phân quyền 3 tầng 4 vai trò. Hồ sơ SRS hoàn chỉnh 4 phần chuẩn IEEE 830, Lịch sử phiên bản v1.0 APPROVED, và Bảng chữ ký phê duyệt nghiệm thu 3 bên (Khách hàng, PM, SA Lead).`
    ];

    notesContent.innerHTML = notes[index] || 'Không có ghi chú cho slide này.';
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.showSlide(this.currentSlide + 1);
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.showSlide(this.currentSlide - 1);
    }
  }

  goToSlide(index) {
    this.showSlide(index);
  }
}

window.SlidePresentation = SlidePresentation;
