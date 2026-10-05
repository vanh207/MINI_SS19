/* ===================================================================
   FASTMART-ENTERPRISE - DIAGRAM VIEWER & LIGHTBOX MODULE
   Quản lý chuyển đổi giữa Mô hình Tương tác & Ảnh Sơ Đồ trong folder images/
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDiagramSwitchers();
  initDiagramLightbox();
  initImagesFolderModal();
});

/**
 * Khởi tạo Modal Thư mục 7 Ảnh Sơ đồ
 */
function initImagesFolderModal() {
  const btnOpen = document.getElementById('btn-open-images-modal');
  const modal = document.getElementById('images-gallery-modal');
  const btnClose = document.getElementById('btn-close-images-modal');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/**
 * Khởi tạo các nút chuyển đổi (Interactive <-> Ảnh Sơ Đồ)
 */
function initDiagramSwitchers() {
  const switchers = document.querySelectorAll('.diagram-mode-switcher');
  
  switchers.forEach(switcher => {
    const buttons = switcher.querySelectorAll('.diagram-mode-btn');
    const slide = switcher.closest('.slide') || switcher.closest('.view-container');
    if (!slide) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const mode = btn.getAttribute('data-mode'); // 'interactive' | 'image'
        
        // Active button style
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle views within slide
        const interactiveView = slide.querySelector('.diagram-panel-interactive');
        const imageView = slide.querySelector('.diagram-panel-image');

        if (mode === 'image') {
          if (interactiveView) interactiveView.style.display = 'none';
          if (imageView) imageView.style.display = 'flex';
        } else {
          if (interactiveView) interactiveView.style.display = '';
          if (imageView) imageView.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Khởi tạo Lightbox phóng to ảnh sơ đồ
 */
function initDiagramLightbox() {
  // Tạo lightbox container nếu chưa có
  let lightbox = document.getElementById('diagram-lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'diagram-lightbox-modal';
    lightbox.className = 'diagram-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-dialog">
        <div class="lightbox-header">
          <div class="lightbox-info">
            <h4 id="lightbox-title" style="color: #38bdf8; font-size: 1rem; margin: 0;">Ảnh Sơ Đồ</h4>
            <span id="lightbox-subtitle" style="font-size: 0.78rem; color: #94a3b8;">Thư mục: images/</span>
          </div>
          <div class="lightbox-actions">
            <a id="lightbox-download-btn" href="#" download class="lightbox-btn" title="Tải ảnh về máy">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>Tải file</span>
            </a>
            <button id="lightbox-close-btn" class="lightbox-close-btn" title="Đóng (Esc)">&times;</button>
          </div>
        </div>
        <div class="lightbox-body">
          <img id="lightbox-img" src="" alt="Sơ đồ chi tiết">
        </div>
        <div class="lightbox-footer">
          <span>💡 Gợi ý: Bạn có thể thay đổi ảnh này bằng cách lưu ảnh vẽ mới vào thư mục <code>images/</code> với cùng tên file.</span>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const backdrop = lightbox.querySelector('.lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close-btn');

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    setTimeout(() => { lightbox.style.display = 'none'; }, 200);
  };

  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Gắn sự kiện click mở lightbox cho các ảnh sơ đồ
  document.querySelectorAll('.diagram-thumbnail-img').forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      const title = img.getAttribute('data-diagram-title') || img.getAttribute('alt') || 'Ảnh Sơ Đồ';
      openDiagramLightbox(src, title);
    });
  });
}

/**
 * Hàm mở Lightbox toàn màn hình
 */
window.openDiagramLightbox = function(src, title) {
  const lightbox = document.getElementById('diagram-lightbox-modal');
  if (!lightbox) return;

  const imgEl = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const subtitleEl = document.getElementById('lightbox-subtitle');
  const downloadBtn = document.getElementById('lightbox-download-btn');

  if (imgEl) imgEl.src = src;
  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = `Đường dẫn: ${src}`;
  if (downloadBtn) downloadBtn.href = src;

  lightbox.style.display = 'flex';
  setTimeout(() => {
    lightbox.classList.add('active');
  }, 10);
};
