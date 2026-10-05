[Mini Project] Hệ thống Quản lý Chuỗi Bán lẻ & Đặt hàng Đa kênh FastMart-Enterprise

1. Mục tiêu

Trong bài thực hành tổng hợp Mini Project này, sinh viên sẽ đóng vai trò là Chuyên viên Phân tích Hệ thống (System Analyst - SA) để vận dụng toàn bộ kiến thức và kỹ năng đã học để đóng gói một Hồ sơ Đặc tả Yêu cầu Phần mềm (SRS) hoàn chỉnh, bao gồm:

Kiến trúc & Quy trình: Đánh giá điểm nghẽn hệ thống cũ (1-Tier/Monolithic), đề xuất mô hình kiến trúc 3 tầng (*3-Tier Architecture*: Presentation, Business Logic, Data Access) đáp ứng khả năng bảo mật và mở rộng.

Thu thập & Phân tích Yêu cầu: Xác định Stakeholders, xây dựng Bảng ma trận nhu cầu tra cứu, chuyển đổi phát biểu nghiệp vụ thành User Stories và phân loại Yêu cầu Chức năng (FR) / Yêu cầu Phi chức năng (NFR).

Mô hình hóa Quy trình & Chức năng: Vẽ sơ đồ Activity Diagram rẽ nhánh có làn công việc (Swimlanes), thiết kế sơ đồ Use Case Diagram (chứa quan hệ `<<include>>`, `<<extend>>`) và viết tệp text Đặc tả Use Case chi tiết.

Thiết kế Cấu trúc Kỹ thuật & Luồng Thông điệp: Trích xuất Class Diagram 3 ngăn (Access Modifiers, Multiplicity, Inheritance, Aggregation/Composition) từ Use Cases; xây dựng Sequence Diagram thể hiện tương tác thời gian thực giữa các đối tượng.

Giao diện & CSDL: Thiết kế phác thảo Giao diện Người dùng (UI/UX Wireframe/Mockup) từ Use Cases; chuyển đổi Class Diagram sang sơ đồ CSDL ERD đạt chuẩn 3NF.

Đóng gói Hồ sơ SRS: Xây dựng Hồ sơ Đặc tả Yêu cầu Phần mềm (SRS - Software Requirements Specification) hoàn chỉnh theo chuẩn quốc tế IEEE 830 / ISO 29148 (gồm Trang bìa, Change Log, Cấu trúc 4 Phần nội dung, Tiêu chuẩn trình bày SMART và Bảng ký duyệt nghiệm thu).

2. Mô tả Bài toán Nghiệp vụ Doanh nghiệp

FastMart là chuỗi bán lẻ đa kênh kinh doanh hàng tiêu dùng nhanh (FMCG) với 50 siêu thị thành viên và nền tảng bán hàng trực tuyến (Mobile App & Website). Nền tảng Monolithic cũ của FastMart đang gặp khủng hoảng nghiêm trọng:

Giờ cao điểm hoặc ngày hội khuyến mãi (Flash Sale), lượt truy cập tăng vọt khiến hệ thống bị treo, gây tràn CSDL và đứt gãy luồng thanh toán.

Nhân viên kho tại siêu thị và đội ngũ giao hàng không đồng bộ được tồn kho thời gian thực, dẫn đến tình trạng khách đặt mua nhưng kho đã hết hàng.

Tài liệu yêu cầu cũ rời rạc, thiếu tính hệ thống; đội ngũ lập trình (Dev) và kiểm thử (Tester) không có căn cứ chuẩn để làm việc, gây tranh chấp phạm vi khi nghiệm thu.

Ban Giám đốc FastMart quyết định giao nhiệm vụ cho đội ngũ System Analyst (SA) phân tích, thiết kế lại toàn bộ hệ thống mới mang tên FastMart-Enterprise (FastMart-GSP) và đóng gói thành một Hồ sơ Đặc tả Yêu cầu Phần mềm (SRS) chuẩn mực để bàn giao cho đội ngũ phát triển.

Yêu cầu Thực hành (Chia theo 4 Phần Tăng dần Độ khó)

Phần I: Phân tích Bối cảnh, Kiến trúc 3-Tier & Xác định Yêu cầu

1. Phân tích Kiến trúc 3 tầng (3-Tier Architecture):

Phân tích nhiệm vụ và các thành phần xử lý của *Presentation Layer* (Web Browser, Mobile App, POS Terminal), *Business Logic Layer* (API xử lý Đơn hàng, Tồn kho, Khuyến mãi, Thanh toán, Xác thực) và *Data Access Layer* (CSDL MySQL Master-Slave & Caching).

Giải thích 3 lý do vì sao mô hình 3 tầng giúp khắc phục triệt để nguy cơ nghẽn mạng và lộ CSDL của hệ thống cũ.

2. Thu thập Yêu cầu & Stakeholders Matrix:

Xác định 4 nhóm Stakeholders chính (`Ban Giám đốc FastMart`, `PM Dự án`, `Đội Lập trình Backend/Frontend`, `Đội Kiểm thử QA/Tester`). Lập Bảng Ma trận Nhu cầu tra cứu Hồ sơ SRS cho 4 nhóm này.

Chuyển đổi các nhu cầu thô từ khách hàng thành 3 User Stories đại diện cho 3 vai trò (`Khách hàng`, `Thu ngân POS`, `Quản lý Kho`).

Phân loại 4 Yêu cầu Chức năng (FR) và 4 Yêu cầu Phi chức năng (NFR về SLA Uptime, Latency, Mã hóa dữ liệu và Khả năng chịu tải đồng thời).

Phần II: Mô hình hóa Luồng Nghiệp vụ & Sơ đồ Use Case

1. Sơ đồ Activity Diagram với Swimlanes:

Vẽ sơ đồ Activity Diagram có làn công việc (Swimlanes) thể hiện quy trình nghiệp vụ *"Đặt hàng Đa kênh & Khóa tồn kho Tự động"*.

Phân chia rõ các làn: `Khách hàng (Client App)`, `Hệ thống Xử lý Nghiệp vụ (Business Layer)`, `Cổng Thanh toán (Payment Gateway)`, và `Hệ thống Kho (Warehouse)`.

2. Sơ đồ Use Case Diagram & Bảng Đặc tả:

Thiết kế sơ đồ Use Case Diagram tổng quan cho phân hệ Bán hàng & Đặt hàng FastMart.

Thể hiện rõ các Actor chính (`Customer`, `Cashier`, `Warehouse Staff`, `System Admin`) và các mối quan hệ `<<include>>` (ví dụ: *Xác thực người dùng*, *Kiểm tra tồn kho*) và `<<extend>>` (ví dụ: *Áp mã giảm giá Voucher*, *Thanh toán VNPay/Momo*).

Soạn thảo 01 Bảng Đặc tả Use Case chi tiết (Use Case Specification) cho Use Case cốt lõi *"Đặt hàng trực tuyến (Place Order)"* bao gồm: Primary Actor, Pre-conditions, Post-conditions, Main Flow (Luồng chính), Alternative Flow (Luồng rẽ nhánh) và Exception Flow (Luồng ngoại lệ).

Phần III: Thiết kế Kỹ thuật Chi tiết — Class, Sequence, UI/UX & ERD

1. Trích xuất Class Diagram:

Từ đặc tả Use Case, trích xuất và vẽ sơ đồ Class Diagram chi tiết cho phân hệ Đặt hàng & Sản phẩm.

Thể hiện đầy đủ 3 ngăn (Class Name, Attributes kèm Access Modifiers `+`/`-`/`#`, Operations/Methods).

Đảm bảo thể hiện đúng các mối quan hệ OOP: Kế thừa (Inheritance: `User` -> `Customer`/`Staff`), Quan hệ Kết hợp/Thành phần (Aggregation/Composition: `Order` -> `OrderItem`, `Product` -> `Category`) và Bội số (Multiplicity: `1..*`, `0..1`).

2. Thiết kế Sequence Diagram:

Vẽ sơ đồ Sequence Diagram thể hiện tương tác động cho luồng *"Xác nhận Đặt hàng & Trừ Tồn kho Thời gian thực"*.

Thể hiện đầy đủ: Lifelines (`CustomerUI`, `OrderController`, `InventoryService`, `PaymentService`, `Database`), các dạng thông điệp (Synchronous, Asynchronous, Return Message), Thanh kích hoạt (Activation Bar) và các khung điều khiển cấu trúc (`alt` rẽ nhánh kiểm tra tồn kho / thanh toán thất bại, `loop` duyệt danh sách sản phẩm).

3. Phác thảo UI/UX Wireframe:

Phác thảo Giao diện Người dùng (UI Wireframe/Mockup) màn hình *"Giỏ hàng & Thanh toán (Checkout Page)"* trên Web/Mobile.

Thể hiện rõ các thành phần UI cơ bản (Input field, Button, Dropdown, Table sản phẩm, Modal xác nhận) tương ứng với các bước trong Use Case Specification.

4. Thiết kế CSDL ERD đạt chuẩn 3NF:

Chuyển đổi Class Diagram sang sơ đồ CSDL ERD (Entity Relationship Diagram).

Xác định rõ Thực thể (Entities), Thuộc tính (Attributes), Khóa chính (Primary Key - PK), Khóa ngoại (Foreign Key - FK) và Mối quan hệ (1-1, 1-N, N-N).

Thực hiện chuẩn hóa dữ liệu 3NF (xóa bỏ thuộc tính lặp 1NF, phụ thuộc hàm một phần 2NF và phụ thuộc bắc cầu 3NF - tách bảng trung gian `OrderDetail`).

Phần IV: Chuẩn hóa & Đóng gói Hồ sơ SRS Hoàn chỉnh

Tiến hành tổng hợp toàn bộ các kết quả phân tích và thiết kế ở các phần trên để đóng gói thành một Hồ sơ Đặc tả Yêu cầu Phần mềm (SRS - Software Requirements Specification) hoàn chỉnh cho dự án FastMart-Enterprise v1.0 đạt chuẩn quốc tế IEEE 830 / ISO 29148, đáp ứng đầy đủ các tiêu chuẩn trình bày chuyên nghiệp:

1. Trang Bìa chuẩn mực: Điền đầy đủ 6 trường thông tin hành chính (Tên dự án, Mã tài liệu, Phiên bản v1.0, Ngày phát hành, Đơn vị thực hiện, Mức độ bảo mật).

2. Lịch sử Thay đổi (Change Log): Lập bảng theo dõi phiên bản tài liệu (chuyển đổi từ `v0.9 DRAFT` sang `v1.0 APPROVED`).

3. Cấu trúc 4 Phần Nội dung Chuẩn IEEE 830:

Phần 1: Giới thiệu (Introduction): Mục đích, Phạm vi hệ thống FastMart-Enterprise, Thuật ngữ & Từ viết tắt.

Phần 2: Mô tả Tổng quan (Overall Description): Bối cảnh kiến trúc 3-tier, Đổ bóng người dùng (User Classes), Ràng buộc môi trường & Công nghệ.

Phần 3: Yêu cầu Chi tiết (Specific Requirements): Danh mục Yêu cầu Chức năng (FR) có gán Mã ID (`FR-ORD-001`..), Danh mục Yêu cầu Phi chức năng (NFR) trình bày dạng câu SMART, Bảng đặc tả Use Case, Các sơ đồ kỹ thuật nhúng (UML Class/Sequence, UI Wireframe, ERD 3NF).

Phần 4: Phụ lục & Thuật ngữ (Appendices): Bảng từ vựng nghiệp vụ bán lẻ đa kênh, Quy trình kiểm soát thay đổi (CCB).

4. Bảng Ký duyệt Nghiệm thu (Approval Signatures): Thiết lập bảng chữ ký phê duyệt nghiệm thu 3 bên (`Khách hàng FastMart`, `PM Dự án`, `SA/BA Lead`).

Ràng buộc & Bẫy Dữ liệu (Constraints & Edge Cases)

Hồ sơ SRS và các sơ đồ thiết kế của sinh viên phải xử lý thành công 03 Bẫy dữ liệu dị biệt (Edge Cases) sau:

1. Bẫy 1 - Tranh chấp Tồn kho đồng thời (Race Condition): Hai khách hàng cùng bấm nút đặt mua sản phẩm cuối cùng trong kho tại cùng một thời điểm millisecond. Hệ thống phải có cơ chế khóa lạc quan/bi quan (Pessimistic/Optimistic Lock) tại Tầng Nghiệp vụ để tránh bán quá số lượng tồn kho (Over-selling).

2. Bẫy 2 - Gián đoạn Cổng Thanh toán (Payment Callback Timeout): Khách hàng đã bị trừ tiền trên ví VNPay nhưng mạng bị đứt khiến Webhook Callback không gửi về hệ thống FastMart. Luồng Sequence Diagram và Exception Flow trong Use Case phải thể hiện quy trình đối soát tự động (Reconciliation Service) sau 5 phút.

3. Bẫy 3 - Dữ liệu Giao dịch Dị biệt (Negative/Invalid Input): Khách hàng cố tình can thiệp API gửi số lượng sản phẩm âm (`quantity = -5`) hoặc mã Voucher đã hết hạn. Hệ thống phải có cơ chế Defensive Validation tại Tầng 2 để trả về mã lỗi thân thiện thay vì làm sập CSDL.

3. Đánh giá & Hướng dẫn Nộp bài

Hướng dẫn Nộp bài

Sản phẩm bàn giao: 01 Hồ sơ SRS hoàn chỉnh (dạng file `.md` hoặc `.docx`) cùng thư mục ảnh chứa toàn bộ các bản vẽ sơ đồ (`FastMart_3Tier.png`, `Activity_Order.png`, `UseCase_Diagram.png`, `Class_Diagram.png`, `Sequence_Order.png`, `UI_Checkout.png`, `ERD_3NF.png`).

Hình thức nộp: Nộp đường link GitHub Repository chứa toàn bộ sản phẩm Mini Project lên hệ thống LMS.

Bảng Tiêu chí Đánh giá (Rubric Tổng 100 Điểm)

| STT | Tiêu chí Đánh giá | Trọng số | Mô tả Mức đạt (100% Điểm) |
| --- | --- | --- | --- |
| 1 | **Phân tích Kiến trúc & Stakeholders (Phần I)** | 15% | Phân tích chính xác 3 tầng, làm rõ ưu điểm bảo mật/mở rộng; lập ma trận Stakeholders tra cứu chuẩn mực và phân loại đúng FR/NFR. |
| 2 | **Mô hình hóa Activity & Use Case (Phần II)** | 20% | Sơ đồ Activity rẽ nhánh đúng 4 làn Swimlanes; Use Case Diagram thể hiện đúng `<<include>>`/`<<extend>>`; Đặc tả Use Case chi tiết đủ luồng chính/nhánh/ngoại lệ. |
| 3 | **Thiết kế Chi tiết Class, Sequence, UI & ERD (Phần III)** | 35% | Class Diagram chuẩn 3 ngăn/mối quan hệ/bội số; Sequence Diagram thể hiện đầy đủ khung `alt`/`loop` và thông điệp động; UI Wireframe thể hiện đủ control; ERD đạt chuẩn 3NF. |
| 4 | **Bẫy Dữ liệu & Xử lý Ngoại lệ (Edge Cases)** | 10% | Đưa ra giải pháp phân tích và thiết kế xử lý thành công cả 3 bẫy dữ liệu (Tranh chấp tồn kho, Timeout thanh toán, Input âm/invalid). |
| 5 | **Đóng gói Hồ sơ SRS IEEE 830 / ISO 29148 (Phần IV)** | 20% | Hồ sơ SRS đạt chuẩn trình bày chuyên nghiệp: đầy đủ Trang bìa, History Log v1.0 APPROVED, Cấu trúc 4 phần, Ngôn ngữ SMART và Bảng ký duyệt 3 bên. |

