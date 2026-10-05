import os, subprocess

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
images_dir = os.path.abspath("images")
os.makedirs(images_dir, exist_ok=True)

diagrams = [
    {
        "filename": "FastMart_3Tier.png",
        "title": "SƠ ĐỒ KIẾN TRÚC 3 TẦNG (3-TIER ARCHITECTURE)",
        "subtitle": "FastMart-Enterprise System Architecture: Presentation ➔ Business Logic ➔ Data Access",
        "badge": "Session 17 & 19 - Architecture Pattern",
        "content": """
        <div style="display:flex; flex-direction:column; gap:16px; width:100%;">
            <div style="background:rgba(6,182,212,0.1); border:2px solid #06b6d4; border-radius:12px; padding:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div style="color:#38bdf8; font-size:18px; font-weight:bold;">1. PRESENTATION LAYER (Tầng Giao Diện)</div>
                    <span style="background:#06b6d4; color:#090d16; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:bold;">Client Applications</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-top:10px;">
                    <div style="background:#1e293b; padding:12px; border-radius:8px; text-align:center; border:1px solid rgba(255,255,255,0.1);">🌐 Web Store (Customer SPA)</div>
                    <div style="background:#1e293b; padding:12px; border-radius:8px; text-align:center; border:1px solid rgba(255,255,255,0.1);">📱 Mobile App (iOS / Android)</div>
                    <div style="background:#1e293b; padding:12px; border-radius:8px; text-align:center; border:1px solid rgba(255,255,255,0.1);">🏪 Quầy Thu Ngân POS Siêu Thị</div>
                    <div style="background:#1e293b; padding:12px; border-radius:8px; text-align:center; border:1px solid rgba(255,255,255,0.1);">📦 Warehouse Handheld App</div>
                </div>
            </div>
            <div style="text-align:center; color:#06b6d4; font-weight:bold; font-size:14px;">▼ RESTful API / GraphQL / HTTPS JSON (TLS 1.3) ▼</div>
            <div style="background:rgba(16,185,129,0.1); border:2px solid #10b981; border-radius:12px; padding:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div style="color:#34d399; font-size:18px; font-weight:bold;">2. BUSINESS LOGIC LAYER (Tầng Xử Lý Nghiệp Vụ)</div>
                    <span style="background:#10b981; color:#090d16; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:bold;">Core Services & Rules</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:10px;">
                    <div style="background:#1e293b; padding:12px; border-radius:8px; border-left:3px solid #10b981;">
                        <strong style="color:#34d399;">Order Service</strong>
                        <div style="font-size:12px; color:#94a3b8; margin-top:4px;">Đặt hàng đa kênh, tính tiền, tạo đơn PENDING</div>
                    </div>
                    <div style="background:#1e293b; padding:12px; border-radius:8px; border-left:3px solid #f59e0b;">
                        <strong style="color:#fbbf24;">Inventory Lock Service</strong>
                        <div style="font-size:12px; color:#94a3b8; margin-top:4px;">Khóa tồn kho 15 phút, giải phóng tự động</div>
                    </div>
                    <div style="background:#1e293b; padding:12px; border-radius:8px; border-left:3px solid #06b6d4;">
                        <strong style="color:#38bdf8;">Payment Gateway</strong>
                        <div style="font-size:12px; color:#94a3b8; margin-top:4px;">Tích hợp VNPay, MoMo, IPN Webhook & Đối soát 5p</div>
                    </div>
                </div>
            </div>
            <div style="text-align:center; color:#10b981; font-weight:bold; font-size:14px;">▼ Database Connection Pool / TCP TLS Socket ▼</div>
            <div style="background:rgba(99,102,241,0.1); border:2px solid #6366f1; border-radius:12px; padding:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div style="color:#818cf8; font-size:18px; font-weight:bold;">3. DATA ACCESS LAYER (Tầng Cơ Sở Dữ Liệu)</div>
                    <span style="background:#6366f1; color:#ffffff; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:bold;">Persistence Store</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:10px;">
                    <div style="background:#1e293b; padding:12px; border-radius:8px; text-align:center; border:1px solid rgba(255,255,255,0.1);">
                        <strong style="color:#818cf8;">MySQL Cluster 3NF</strong>
                        <div style="font-size:12px; color:#94a3b8; margin-top:4px;">Master Ghi - Replicas Đọc dữ liệu bền vững</div>
                    </div>
                    <div style="background:#1e293b; padding:12px; border-radius:8px; text-align:center; border:1px solid rgba(255,255,255,0.1);">
                        <strong style="color:#fb7185;">Redis In-Memory Cache</strong>
                        <div style="font-size:12px; color:#94a3b8; margin-top:4px;">Atomic Decrement & Khóa tồn kho (TTL 15 min)</div>
                    </div>
                    <div style="background:#1e293b; padding:12px; border-radius:8px; text-align:center; border:1px solid rgba(255,255,255,0.1);">
                        <strong style="color:#34d399;">Audit Log & Backup</strong>
                        <div style="font-size:12px; color:#94a3b8; margin-top:4px;">Lưu nhật ký bảo mật và bản sao lưu định kỳ</div>
                    </div>
                </div>
            </div>
        </div>
        """
    },
    {
        "filename": "Activity_Order.png",
        "title": "SƠ ĐỒ ACTIVITY DIAGRAM VỚI 4 LÀN SWIMLANES",
        "subtitle": "Quy trình Đặt hàng Đa kênh & Khóa tồn kho Tự động qua các phân vùng trách nhiệm",
        "badge": "Session 04 - Activity Diagram & Swimlanes",
        "content": """
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px; width:100%; height:100%;">
            <div style="background:rgba(6,182,212,0.06); border:1px solid #06b6d4; border-radius:10px; padding:14px; display:flex; flex-direction:column; gap:10px;">
                <div style="color:#38bdf8; font-weight:bold; font-size:15px; border-bottom:2px solid #06b6d4; padding-bottom:6px; text-align:center;">1. Khách Hàng (Customer)</div>
                <div style="background:#1e293b; border-radius:20px; padding:8px 12px; text-align:center; font-size:12px; font-weight:bold; color:#a5f3fc; border:1px solid #06b6d4;">● Bắt đầu đặt hàng</div>
                <div style="text-align:center; color:#64748b;">↓</div>
                <div style="background:#1e293b; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:1px solid rgba(255,255,255,0.1);">Chọn sản phẩm & thêm giỏ hàng</div>
                <div style="text-align:center; color:#64748b;">↓</div>
                <div style="background:#1e293b; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:1px solid rgba(255,255,255,0.1);">Nhập địa chỉ giao & chọn Cổng TT</div>
                <div style="text-align:center; color:#64748b; margin-top:80px;">↓</div>
                <div style="background:#1e293b; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:1px solid rgba(255,255,255,0.1);">Quét mã QR thanh toán trên App</div>
                <div style="text-align:center; color:#64748b; margin-top:120px;">↓</div>
                <div style="background:#1e293b; border-radius:20px; padding:8px 12px; text-align:center; font-size:12px; font-weight:bold; color:#34d399; border:1px solid #10b981;">(O) Nhận Hóa đơn & Email xác nhận</div>
            </div>

            <div style="background:rgba(16,185,129,0.06); border:1px solid #10b981; border-radius:10px; padding:14px; display:flex; flex-direction:column; gap:10px;">
                <div style="color:#34d399; font-weight:bold; font-size:15px; border-bottom:2px solid #10b981; padding-bottom:6px; text-align:center;">2. Business Layer (API)</div>
                <div style="height:60px;"></div>
                <div style="background:#1e293b; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:1px solid rgba(255,255,255,0.1);">Validate Input (Phone, Qty > 0)</div>
                <div style="text-align:center; color:#64748b;">↓</div>
                <div style="background:#0f172a; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:2px dashed #f59e0b; color:#fef08a;">[Decision] Còn tồn kho?</div>
                <div style="text-align:center; color:#64748b;">↓ (Có)</div>
                <div style="background:#1e293b; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:1px solid rgba(255,255,255,0.1);">Khóa tồn 15 phút (Redis Hold)</div>
                <div style="text-align:center; color:#64748b; margin-top:70px;">↓</div>
                <div style="background:#0f172a; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:2px dashed #10b981; color:#a7f3d0;">[Decision] Thanh toán hợp lệ?</div>
                <div style="text-align:center; color:#64748b;">↓ (Thành công)</div>
                <div style="background:#1e293b; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:1px solid #10b981; color:#34d399;">Trừ kho chính thức & Tạo Đơn CONFIRMED</div>
            </div>

            <div style="background:rgba(245,158,11,0.06); border:1px solid #f59e0b; border-radius:10px; padding:14px; display:flex; flex-direction:column; gap:10px;">
                <div style="color:#fbbf24; font-weight:bold; font-size:15px; border-bottom:2px solid #f59e0b; padding-bottom:6px; text-align:center;">3. Payment Gateway (VNPay)</div>
                <div style="height:190px;"></div>
                <div style="background:#1e293b; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:1px solid rgba(255,255,255,0.1);">Khởi tạo mã QR VNPay / MoMo</div>
                <div style="text-align:center; color:#64748b;">↓</div>
                <div style="background:#1e293b; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:1px solid rgba(255,255,255,0.1);">Xác thực OTP & Trừ tiền tài khoản</div>
                <div style="text-align:center; color:#64748b;">↓</div>
                <div style="background:#1e293b; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:1px solid #f59e0b;">Bắn Webhook IPN Callback</div>
                <div style="margin-top:10px; background:#0f172a; padding:8px; border-radius:6px; font-size:11px; color:#fca5a5; border-left:2px solid #f43f5e;">Nếu Timeout: Worker đối soát sau 5 phút</div>
            </div>

            <div style="background:rgba(99,102,241,0.06); border:1px solid #6366f1; border-radius:10px; padding:14px; display:flex; flex-direction:column; gap:10px;">
                <div style="color:#818cf8; font-weight:bold; font-size:15px; border-bottom:2px solid #6366f1; padding-bottom:6px; text-align:center;">4. Hệ Thống Kho (WMS)</div>
                <div style="height:350px;"></div>
                <div style="background:#1e293b; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:1px solid #6366f1;">Tiếp nhận lệnh đóng gói tự động</div>
                <div style="text-align:center; color:#64748b;">↓</div>
                <div style="background:#1e293b; border-radius:8px; padding:10px; text-align:center; font-size:12px; border:1px solid rgba(255,255,255,0.1);">In vận đơn & Bàn giao Shipper</div>
                <div style="text-align:center; color:#64748b;">↓</div>
                <div style="background:#1e293b; border-radius:20px; padding:8px 12px; text-align:center; font-size:12px; font-weight:bold; color:#a5b4fc; border:1px solid #6366f1;">● Kết thúc quy trình giao hàng</div>
            </div>
        </div>
        """
    },
    {
        "filename": "UseCase_Diagram.png",
        "title": "SƠ ĐỒ USE CASE DIAGRAM TỔNG QUAN & ĐẶC TẢ",
        "subtitle": "Phân hệ Bán hàng & Đặt hàng với các quan hệ <<include>> và <<extend>>",
        "badge": "Session 04 - Use Case Modeling",
        "content": """
        <div style="display:grid; grid-template-columns:260px 1fr 260px; gap:20px; width:100%; height:100%; align-items:center;">
            <!-- Left Actors -->
            <div style="display:flex; flex-direction:column; gap:24px;">
                <div style="background:#1e293b; border:1px solid #06b6d4; border-radius:10px; padding:14px; text-align:center;">
                    <div style="font-size:28px;">👤</div>
                    <strong style="color:#38bdf8;">Online Customer</strong>
                    <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Khách mua hàng qua Web & Mobile App</div>
                </div>
                <div style="background:#1e293b; border:1px solid #10b981; border-radius:10px; padding:14px; text-align:center;">
                    <div style="font-size:28px;">🏪</div>
                    <strong style="color:#34d399;">POS Cashier</strong>
                    <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Thu ngân bán hàng tại quầy siêu thị</div>
                </div>
            </div>

            <!-- Middle System Boundary -->
            <div style="background:rgba(15,23,42,0.9); border:2px solid #6366f1; border-radius:14px; padding:20px; position:relative;">
                <div style="position:absolute; top:-12px; left:20px; background:#6366f1; color:white; font-size:11px; font-weight:bold; padding:2px 10px; border-radius:4px;">System Boundary: FastMart Omnichannel</div>
                
                <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
                    <div style="background:#1e293b; border:2px solid #06b6d4; border-radius:30px; padding:12px; text-align:center; font-weight:bold; color:#a5f3fc;">
                        (UC-01) Đặt Hàng Trực Tuyến
                    </div>

                    <div style="display:flex; justify-content:space-around; margin:4px 0;">
                        <span style="color:#34d399; font-size:11px; font-family:monospace;">&lt;&lt;include&gt;&gt; ➔</span>
                        <span style="color:#fbbf24; font-size:11px; font-family:monospace;">⮜ &lt;&lt;extend&gt;&gt;</span>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div style="background:#0f172a; border:1px solid #10b981; border-radius:24px; padding:10px; text-align:center; font-size:12px; color:#6ee7b7;">
                            (UC-02) Xác Thực & Đăng Nhập
                        </div>
                        <div style="background:#0f172a; border:1px dashed #f59e0b; border-radius:24px; padding:10px; text-align:center; font-size:12px; color:#fde68a;">
                            (UC-03) Áp Mã Voucher Giảm Giá
                        </div>
                        <div style="background:#0f172a; border:1px solid #10b981; border-radius:24px; padding:10px; text-align:center; font-size:12px; color:#6ee7b7;">
                            (UC-04) Khóa Tồn Kho 15 Phút
                        </div>
                        <div style="background:#0f172a; border:1px dashed #f59e0b; border-radius:24px; padding:10px; text-align:center; font-size:12px; color:#fde68a;">
                            (UC-05) Thanh Toán VNPay / MoMo
                        </div>
                    </div>

                    <div style="background:#1e293b; border:1px solid #6366f1; border-radius:30px; padding:10px; text-align:center; font-size:12px; color:#c7d2fe; margin-top:6px;">
                        (UC-06) Bán Hàng & In Bill POS Tại Quầy
                    </div>
                </div>
            </div>

            <!-- Right Actors -->
            <div style="display:flex; flex-direction:column; gap:24px;">
                <div style="background:#1e293b; border:1px solid #818cf8; border-radius:10px; padding:14px; text-align:center;">
                    <div style="font-size:28px;">📦</div>
                    <strong style="color:#818cf8;">Warehouse Staff</strong>
                    <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Nhân viên tiếp nhận lệnh đóng gói & xuất kho</div>
                </div>
                <div style="background:#1e293b; border:1px solid #f43f5e; border-radius:10px; padding:14px; text-align:center;">
                    <div style="font-size:28px;">🛡️</div>
                    <strong style="color:#fb7185;">System Admin</strong>
                    <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Quản trị tài khoản, phân quyền RBAC & Catalog</div>
                </div>
            </div>
        </div>
        """
    },
    {
        "filename": "Class_Diagram.png",
        "title": "SƠ ĐỒ CLASS DIAGRAM 3 NGĂN CHI TIẾT & OOP",
        "subtitle": "Kế thừa, Hợp thành (Composition 1..*), Kết tập (Aggregation) và Bội số thực thể",
        "badge": "Session 07 - Class Diagram OOP",
        "content": """
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px; width:100%; height:100%;">
            <!-- Box 1: User & Customer -->
            <div style="background:#1e293b; border:1px solid #06b6d4; border-radius:8px; overflow:hidden; font-family:monospace; font-size:11px;">
                <div style="background:#0e7490; color:white; font-weight:bold; padding:8px; text-align:center;">&lt;&lt;abstract&gt;&gt; User</div>
                <div style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.1); color:#cbd5e1; line-height:1.5;">
                    # userId: String [PK]<br>
                    # username: String<br>
                    # passwordHash: String<br>
                    # fullName: String<br>
                    # phone: String<br>
                    # role: UserRole
                </div>
                <div style="padding:10px; color:#38bdf8; line-height:1.5;">
                    + login(pwd): Boolean<br>
                    + updateProfile(): Void
                </div>
                <div style="background:rgba(6,182,212,0.15); border-top:2px dashed #06b6d4; padding:8px;">
                    <div style="color:#38bdf8; font-weight:bold; text-align:center;">▲ Kế thừa: Customer</div>
                    <div style="color:#cbd5e1; margin-top:4px;">- loyaltyPoints: Integer<br>+ placeOrder(): Order<br>+ applyVoucher(code): Boolean</div>
                </div>
            </div>

            <!-- Box 2: Order & OrderItem -->
            <div style="background:#1e293b; border:1px solid #10b981; border-radius:8px; overflow:hidden; font-family:monospace; font-size:11px;">
                <div style="background:#047857; color:white; font-weight:bold; padding:8px; text-align:center;">Order</div>
                <div style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.1); color:#cbd5e1; line-height:1.5;">
                    - orderId: String [PK]<br>
                    - customerId: String [FK]<br>
                    - orderDate: DateTime<br>
                    - totalAmount: Double<br>
                    - status: OrderStatus
                </div>
                <div style="padding:10px; color:#34d399; line-height:1.5;">
                    + calculateTotal(): Double<br>
                    + confirmPayment(): Void
                </div>
                <div style="background:rgba(16,185,129,0.15); border-top:2px solid #10b981; padding:8px;">
                    <div style="color:#34d399; font-weight:bold; text-align:center;">◆ Composition (1..*): OrderItem</div>
                    <div style="color:#cbd5e1; margin-top:4px;">- productId: String [FK]<br>- quantity: Integer (&gt; 0)<br>- price: Double<br>+ getSubtotal(): Double</div>
                </div>
            </div>

            <!-- Box 3: Product, Category & Payment -->
            <div style="background:#1e293b; border:1px solid #818cf8; border-radius:8px; overflow:hidden; font-family:monospace; font-size:11px;">
                <div style="background:#4338ca; color:white; font-weight:bold; padding:8px; text-align:center;">Product (◇ Agg Category)</div>
                <div style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.1); color:#cbd5e1; line-height:1.5;">
                    - productId: String [PK]<br>
                    - productName: String<br>
                    - categoryId: String [FK]<br>
                    - unitPrice: Double<br>
                    - stockQuantity: Integer
                </div>
                <div style="padding:10px; color:#a5b4fc; line-height:1.5;">
                    + lockStock(qty, 15m): Boolean<br>
                    + deductStock(qty): Void
                </div>
                <div style="background:rgba(245,158,11,0.15); border-top:2px solid #f59e0b; padding:8px;">
                    <div style="color:#fbbf24; font-weight:bold; text-align:center;">Payment (1-1 với Order)</div>
                    <div style="color:#cbd5e1; margin-top:4px;">- paymentId: String [PK]<br>- method: PaymentMethod<br>- amount: Double<br>+ verifyCallback(ipn): Boolean</div>
                </div>
            </div>
        </div>
        """
    },
    {
        "filename": "Sequence_Order.png",
        "title": "SƠ ĐỒ SEQUENCE DIAGRAM: ĐẶT HÀNG & TRỪ TỒN KHO",
        "subtitle": "Lifelines, Activation Bars, Pessimistic Row Lock & Combined Fragments (loop, alt)",
        "badge": "Session 09 - Sequence Diagram",
        "content": """
        <div style="display:flex; flex-direction:column; gap:12px; width:100%; height:100%;">
            <!-- Header Lifelines -->
            <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:10px; text-align:center;">
                <div style="background:#0e7490; color:white; padding:8px; border-radius:6px; font-weight:bold; font-size:13px;">:CustomerUI</div>
                <div style="background:#047857; color:white; padding:8px; border-radius:6px; font-weight:bold; font-size:13px;">:OrderController</div>
                <div style="background:#b45309; color:white; padding:8px; border-radius:6px; font-weight:bold; font-size:13px;">:InventoryService</div>
                <div style="background:#4338ca; color:white; padding:8px; border-radius:6px; font-weight:bold; font-size:13px;">:PaymentService</div>
                <div style="background:#be123c; color:white; padding:8px; border-radius:6px; font-weight:bold; font-size:13px;">:Database Cluster</div>
            </div>

            <!-- Sequence Steps -->
            <div style="display:flex; flex-direction:column; gap:8px; font-family:monospace; font-size:12px;">
                <div style="background:#1e293b; padding:8px 14px; border-radius:6px; border-left:4px solid #06b6d4;">
                    <span style="color:#38bdf8; font-weight:bold;">1. CustomerUI ➔ OrderController:</span> submitOrder(cartItems, customerId, VNPay)
                </div>

                <div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:6px; padding:10px;">
                    <div style="color:#34d399; font-weight:bold;">[loop: Từng sản phẩm trong giỏ hàng]</div>
                    <div style="padding-left:14px; margin-top:4px; color:#cbd5e1;">
                        ➔ OrderController ➔ InventoryService: checkAndHoldStock(productId, qty, 15m)<br>
                        ➔ InventoryService ➔ Database: SELECT stockQuantity FROM Products FOR UPDATE
                    </div>
                </div>

                <div style="background:rgba(245,158,11,0.1); border:1px solid #f59e0b; border-radius:6px; padding:10px;">
                    <div style="color:#fbbf24; font-weight:bold;">[alt 1: Đủ tồn kho khả dụng]</div>
                    <div style="padding-left:14px; margin-top:4px; color:#fef08a;">
                        Database ➔ InventoryService: StockAvailable=TRUE ➔ OrderController: holdToken<br>
                        OrderController ➔ PaymentService: createPaymentRequest(orderId, totalAmount, VNPay)
                    </div>
                </div>

                <div style="background:rgba(244,63,94,0.1); border:1px solid #f43f5e; border-radius:6px; padding:10px;">
                    <div style="color:#fb7185; font-weight:bold;">[alt 2: Hết hàng hoặc tồn kho không đủ]</div>
                    <div style="padding-left:14px; margin-top:4px; color:#fca5a5;">
                        InventoryService ➔ OrderController: StockUnavailableException ➔ Rollback Hold<br>
                        OrderController ➔ CustomerUI: Trả lỗi HTTP 409 Conflict: "Sản phẩm vừa hết hàng!"
                    </div>
                </div>

                <div style="background:#1e293b; padding:8px 14px; border-radius:6px; border-left:4px solid #818cf8;">
                    <span style="color:#818cf8; font-weight:bold;">2. Webhook Callback Success:</span> PaymentService ➔ OrderController ➔ Database: COMMIT Transaction & Trừ kho chính thức
                </div>
            </div>
        </div>
        """
    },
    {
        "filename": "UI_Checkout.png",
        "title": "SƠ ĐỒ PHÁC THẢO GIAO DIỆN UI/UX WIREFRAME CHECKOUT",
        "subtitle": "Mô phỏng Giao diện Người dùng Đặt hàng & Thanh toán Đa kênh với Đồng hồ đếm ngược 15 Phút",
        "badge": "Session 13 - UI/UX Wireframe & Prototype",
        "content": """
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:16px; width:100%; height:100%;">
            <!-- Left: Checkout Form -->
            <div style="background:#1e293b; border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:16px; display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">
                    <strong style="color:#38bdf8; font-size:16px;">FastMart Checkout & Order Confirmation</strong>
                    <span style="background:#dc2626; color:white; font-size:11px; padding:3px 8px; border-radius:4px; font-weight:bold;">⏱️ Giữ hàng còn: 14:59</span>
                </div>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div>
                        <div style="font-size:11px; color:#94a3b8; margin-bottom:4px;">Họ và tên khách hàng *</div>
                        <input readonly value="Nguyễn Văn An" style="width:100%; background:#0f172a; border:1px solid #334155; color:white; padding:8px; border-radius:6px; font-size:12px;">
                    </div>
                    <div>
                        <div style="font-size:11px; color:#94a3b8; margin-bottom:4px;">Số điện thoại (10 chữ số) *</div>
                        <input readonly value="0987654321" style="width:100%; background:#0f172a; border:1px solid #334155; color:white; padding:8px; border-radius:6px; font-size:12px;">
                    </div>
                </div>

                <div>
                    <div style="font-size:11px; color:#94a3b8; margin-bottom:4px;">Địa chỉ nhận hàng (Giao tận nơi 2h) *</div>
                    <input readonly value="Số 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM" style="width:100%; background:#0f172a; border:1px solid #334155; color:white; padding:8px; border-radius:6px; font-size:12px;">
                </div>

                <div>
                    <div style="font-size:11px; color:#94a3b8; margin-bottom:6px;">Phương thức thanh toán tích hợp:</div>
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;">
                        <div style="background:rgba(6,182,212,0.15); border:1px solid #06b6d4; padding:8px; border-radius:6px; text-align:center; font-size:11px; font-weight:bold; color:#38bdf8;">✓ Ví VNPAY QR</div>
                        <div style="background:#0f172a; border:1px solid #334155; padding:8px; border-radius:6px; text-align:center; font-size:11px; color:#94a3b8;">Ví MoMo</div>
                        <div style="background:#0f172a; border:1px solid #334155; padding:8px; border-radius:6px; text-align:center; font-size:11px; color:#94a3b8;">Tiền mặt (POS/COD)</div>
                    </div>
                </div>
            </div>

            <!-- Right: Order Summary -->
            <div style="background:#1e293b; border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                    <strong style="color:#34d399; font-size:15px; display:block; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; margin-bottom:10px;">Tóm Tắt Giỏ Hàng (2 SP)</strong>
                    <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:8px;">
                        <span>Thịt ba chỉ bò Úc (500g) x 2</span>
                        <strong style="color:#f8fafc;">358,000 đ</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:8px;">
                        <span>Sữa tươi Vinamilk 100% x 3</span>
                        <strong style="color:#f8fafc;">108,000 đ</strong>
                    </div>
                    <div style="border-top:1px dashed #334155; padding-top:8px; margin-top:8px; display:flex; justify-content:space-between; font-size:12px; color:#fbbf24;">
                        <span>Voucher giảm giá (FAST50K):</span>
                        <strong>-50,000 đ</strong>
                    </div>
                </div>

                <div style="border-top:2px solid #06b6d4; padding-top:10px;">
                    <div style="display:flex; justify-content:space-between; font-size:14px; margin-bottom:10px;">
                        <span style="font-weight:bold;">TỔNG THANH TOÁN:</span>
                        <strong style="color:#38bdf8; font-size:18px;">416,000 đ</strong>
                    </div>
                    <button style="width:100%; background:linear-gradient(135deg,#06b6d4,#10b981); border:none; color:#090d16; font-weight:bold; padding:12px; border-radius:8px; font-size:13px; cursor:pointer;">
                        🔒 XÁC NHẬN ĐẶT HÀNG & THANH TOÁN
                    </button>
                </div>
            </div>
        </div>
        """
    },
    {
        "filename": "ERD_3NF.png",
        "title": "SƠ ĐỒ CƠ SỞ DỮ LIỆU ERD ĐẠT CHUẨN 3NF",
        "subtitle": "Chuẩn hóa loại bỏ mảng lặp (1NF), phụ thuộc một phần (2NF) và bắc cầu (3NF)",
        "badge": "Session 15 - Database Modeling & 3NF",
        "content": """
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:14px; width:100%; height:100%; font-family:monospace; font-size:11px;">
            <!-- Entity Users -->
            <div style="background:#1e293b; border:1px solid #06b6d4; border-radius:8px; overflow:hidden;">
                <div style="background:#0e7490; color:white; font-weight:bold; padding:6px 10px;">USERS (Người Dùng)</div>
                <div style="padding:10px; line-height:1.6; color:#cbd5e1;">
                    <span style="color:#38bdf8; font-weight:bold;">[PK] userId:</span> VARCHAR(20)<br>
                    username: VARCHAR(50) [UQ]<br>
                    passwordHash: VARCHAR(255)<br>
                    fullName: VARCHAR(100)<br>
                    phone: VARCHAR(15) [UQ]<br>
                    role: ENUM('CUST','CASH','WARE','ADM')
                </div>
            </div>

            <!-- Entity Categories -->
            <div style="background:#1e293b; border:1px solid #818cf8; border-radius:8px; overflow:hidden;">
                <div style="background:#4338ca; color:white; font-weight:bold; padding:6px 10px;">CATEGORIES (Danh Mục - 3NF)</div>
                <div style="padding:10px; line-height:1.6; color:#cbd5e1;">
                    <span style="color:#818cf8; font-weight:bold;">[PK] categoryId:</span> VARCHAR(20)<br>
                    categoryName: VARCHAR(100)<br>
                    description: TEXT<br>
                    <span style="color:#a5b4fc; font-size:10px;">(Tách khỏi Product để triệt tiêu phụ thuộc bắc cầu 3NF)</span>
                </div>
            </div>

            <!-- Entity Products -->
            <div style="background:#1e293b; border:1px solid #06b6d4; border-radius:8px; overflow:hidden;">
                <div style="background:#0e7490; color:white; font-weight:bold; padding:6px 10px;">PRODUCTS (Sản Phẩm)</div>
                <div style="padding:10px; line-height:1.6; color:#cbd5e1;">
                    <span style="color:#38bdf8; font-weight:bold;">[PK] productId:</span> VARCHAR(20)<br>
                    productName: VARCHAR(150)<br>
                    <span style="color:#fbbf24; font-weight:bold;">[FK] categoryId:</span> VARCHAR(20)<br>
                    unitPrice: DECIMAL(12,2)<br>
                    stockQuantity: INT (&gt;= 0)<br>
                    status: VARCHAR(20)
                </div>
            </div>

            <!-- Entity Orders -->
            <div style="background:#1e293b; border:1px solid #10b981; border-radius:8px; overflow:hidden;">
                <div style="background:#047857; color:white; font-weight:bold; padding:6px 10px;">ORDERS (Đơn Hàng)</div>
                <div style="padding:10px; line-height:1.6; color:#cbd5e1;">
                    <span style="color:#34d399; font-weight:bold;">[PK] orderId:</span> VARCHAR(20)<br>
                    <span style="color:#fbbf24; font-weight:bold;">[FK] customerId:</span> VARCHAR(20)<br>
                    orderDate: DATETIME<br>
                    totalAmount: DECIMAL(12,2)<br>
                    channel: ENUM('WEB','APP','POS')<br>
                    status: VARCHAR(30)
                </div>
            </div>

            <!-- Entity OrderItem (1NF & 2NF bridge) -->
            <div style="background:#0f172a; border:2px solid #f59e0b; border-radius:8px; overflow:hidden;">
                <div style="background:#b45309; color:white; font-weight:bold; padding:6px 10px;">ORDER_ITEMS (Chi Tiết Đơn - 1NF/2NF)</div>
                <div style="padding:10px; line-height:1.6; color:#fef08a;">
                    <span style="font-weight:bold;">[PK, FK] orderId:</span> VARCHAR(20)<br>
                    <span style="font-weight:bold;">[PK, FK] productId:</span> VARCHAR(20)<br>
                    quantity: INT (&gt; 0)<br>
                    price: DECIMAL(12,2)<br>
                    lineTotal: DECIMAL(12,2)<br>
                    <span style="color:#fbbf24; font-size:10px;">(Khóa chính kết hợp, xóa mảng lặp 1NF)</span>
                </div>
            </div>

            <!-- Entity Payments -->
            <div style="background:#1e293b; border:1px solid #f43f5e; border-radius:8px; overflow:hidden;">
                <div style="background:#be123c; color:white; font-weight:bold; padding:6px 10px;">PAYMENTS (Thanh Toán)</div>
                <div style="padding:10px; line-height:1.6; color:#cbd5e1;">
                    <span style="color:#fb7185; font-weight:bold;">[PK] paymentId:</span> VARCHAR(20)<br>
                    <span style="color:#fbbf24; font-weight:bold;">[FK] orderId:</span> VARCHAR(20) [1-1]<br>
                    method: ENUM('CASH','VNPAY','MOMO')<br>
                    amount: DECIMAL(12,2)<br>
                    status: VARCHAR(30)<br>
                    transactionNo: VARCHAR(50)
                </div>
            </div>
        </div>
        """
    }
]

html_template = """<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 750px;
    background: #090d16;
    color: #f8fafc;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    padding: 30px;
    overflow: hidden;
    position: relative;
    border: 3px solid #1e293b;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 10% 10%, rgba(6, 182, 212, 0.08) 0%, transparent 40%),
                      radial-gradient(circle at 90% 90%, rgba(99, 102, 241, 0.08) 0%, transparent 40%);
    pointer-events: none;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 15px;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }
  .header-left h1 {
    font-size: 22px;
    font-weight: 800;
    color: #38bdf8;
    letter-spacing: -0.5px;
  }
  .header-left p {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 4px;
  }
  .badge {
    background: rgba(6, 182, 212, 0.15);
    color: #38bdf8;
    border: 1px solid #06b6d4;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: bold;
  }
  .main-content {
    flex: 1;
    display: flex;
    position: relative;
    z-index: 1;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 12px;
    margin-top: 15px;
    font-size: 12px;
    color: #64748b;
    position: relative;
    z-index: 1;
  }
</style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="header">
    <div class="header-left">
      <h1>{{TITLE}}</h1>
      <p>{{SUBTITLE}}</p>
    </div>
    <span class="badge">{{BADGE}}</span>
  </div>
  <div class="main-content">
    {{CONTENT}}
  </div>
  <div class="footer">
    <span>📁 File: images/{{FILENAME}} • Hệ thống FastMart-Enterprise</span>
    <span>💡 Thay thế file này bằng ảnh vẽ từ Draw.io / StarUML của bạn</span>
  </div>
</body>
</html>"""

temp_html = os.path.abspath("temp_diagram.html")

for d in diagrams:
    filled_html = html_template.replace("{{TITLE}}", d["title"])\
                               .replace("{{SUBTITLE}}", d["subtitle"])\
                               .replace("{{BADGE}}", d["badge"])\
                               .replace("{{CONTENT}}", d["content"])\
                               .replace("{{FILENAME}}", d["filename"])
    
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(filled_html)
    
    target_png = os.path.join(images_dir, d["filename"])
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        f"--screenshot={target_png}",
        "--window-size=1200,750",
        f"file:///{temp_html.replace(os.sep, '/')}"
    ]
    subprocess.run(cmd, check=True)
    print(f"Generated: {d['filename']} -> {os.path.getsize(target_png)} bytes")

if os.path.exists(temp_html):
    os.remove(temp_html)

print("All 7 diagram PNGs successfully generated in images/ folder!")
