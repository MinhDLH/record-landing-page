/**
 * RÈCỌRD MEDIA AGENCY - LIGHT STUDIO JAVASCRIPT INTERACTIONS
 * Pure Vanilla JS, lightweight, responsive, performant
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Sticky Navbar Glass & Scroll Progress
  const navbar = document.getElementById('main-navbar');
  const scrollProgressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar glass effect (Light mode)
    if (scrollY > 30) {
      navbar.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-slate-200/80');
      navbar.classList.remove('bg-transparent');
    } else {
      navbar.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-slate-200/80');
      navbar.classList.add('bg-transparent');
    }

    // Scroll progress bar
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollY / docHeight) * 100;
      scrollProgressBar.style.width = `${progress}%`;
    }
  });

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenuDrawer.classList.contains('hidden');
      if (isOpen) {
        mobileMenuDrawer.classList.add('hidden');
        document.body.style.overflow = '';
      } else {
        mobileMenuDrawer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
      if (window.lucide) window.lucide.createIcons();
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('hidden');
        document.body.style.overflow = '';
      });
    });
  }



  // 5. Portfolio Category Filter (Light theme classes)
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active style
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-500/20', 'border-blue-600');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });
      btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-500/20', 'border-blue-600');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'block';
          card.classList.add('animate__animated', 'animate__fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const ans = otherItem.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });

  // 7. Pricing Selection to Booking Form
  const selectPlanBtns = document.querySelectorAll('.select-plan-btn');
  const serviceSelect = document.getElementById('service-select');
  const notesTextarea = document.getElementById('concept-notes');

  selectPlanBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const planName = btn.getAttribute('data-plan') || '';

      // Scroll to booking form
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Populate form
      if (serviceSelect && planName) {
        let matched = false;
        const pLower = planName.toLowerCase();

        for (let i = 0; i < serviceSelect.options.length; i++) {
          const optText = serviceSelect.options[i].text.toLowerCase();
          const optVal = serviceSelect.options[i].value.toLowerCase();
          if (optText.includes(pLower) || pLower.includes(optVal) || optVal.includes(pLower)) {
            serviceSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }

        if (!matched) {
          for (let i = 0; i < serviceSelect.options.length; i++) {
            const optVal = serviceSelect.options[i].value.toLowerCase();
            if (
              (pLower.includes('sự kiện') && optVal.includes('sự kiện')) ||
              (pLower.includes('cá nhân') && optVal.includes('cá nhân')) ||
              (pLower.includes('video') && optVal.includes('video')) ||
              (pLower.includes('thường') && optVal.includes('thường')) ||
              (pLower.includes('hỏa tốc') && optVal.includes('hỏa tốc')) ||
              (pLower.includes('premier') && optVal.includes('premier'))
            ) {
              serviceSelect.selectedIndex = i;
              break;
            }
          }
        }
      }

      if (notesTextarea) {
        notesTextarea.value = `Khách hàng quan tâm đến: ${planName}. Mong muốn được tư vấn chi tiết concept và thời gian quay chụp.`;
        notesTextarea.focus();
      }

      showToast(`Đã chọn: ${planName}. Vui lòng hoàn tất thông tin!`, 'info');
    });
  });

  // 7b. Interactive Service Dropdown Cards (Touch & Click Support)
  const serviceCards = document.querySelectorAll('.service-card-interactive');
  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't toggle if clicking an interactive element inside
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) {
        return;
      }
      const isOpen = card.classList.contains('is-open');
      serviceCards.forEach(c => {
        if (c !== card) c.classList.remove('is-open');
      });
      card.classList.toggle('is-open', !isOpen);
    });
  });

  // 7c. Event Tab Switcher (Cần Edit vs K° Cần Edit)
  const eventTabBtns = document.querySelectorAll('.event-tab-btn');
  eventTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetTabId = btn.getAttribute('data-tab');

      eventTabBtns.forEach(b => {
        b.classList.remove('active', 'bg-white', 'text-indigo-600', 'shadow-sm');
        b.classList.add('text-slate-700');
      });
      btn.classList.add('active', 'bg-white', 'text-indigo-600', 'shadow-sm');
      btn.classList.remove('text-slate-700');

      document.querySelectorAll('.event-tab-content').forEach(content => {
        content.classList.add('hidden');
      });
      const activeContent = document.getElementById(targetTabId);
      if (activeContent) {
        activeContent.classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
      }
    });
  });





  // 7d. Add-on Selection to Booking Form
  const addonSelect = document.getElementById('addon-select');
  const addonCards = document.querySelectorAll('.addon-card');

  addonCards.forEach(card => {
    card.addEventListener('click', () => {
      const addonData = card.getAttribute('data-addon') || '';

      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }

      if (addonSelect && addonData) {
        for (let i = 0; i < addonSelect.options.length; i++) {
          if (addonSelect.options[i].value === addonData || addonSelect.options[i].text.includes(addonData)) {
            addonSelect.selectedIndex = i;
            break;
          }
        }
      }

      showToast(`Đã chọn thêm dịch vụ phụ: ${addonData}`, 'info');
    });
  });

  // =========================================================================
  // 8. CẤU HÌNH & XỬ LÝ SUBMIT FORM BẰNG JQUERY AJAX + SWEETALERT2
  // =========================================================================

  // Dán URL Web App của bạn từ Google Apps Script vào đây:
  // Ví dụ: const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxTGP2NTFe-S7Ki5ARMA7C-LuXBkNUOFLF8_-BS5d3kUYyT0ItStNrjad71heaFFtk/exec';

  $('#booking-form').on('submit', function (e) {
    e.preventDefault();

    const name = $('#client-name').val() ? $('#client-name').val().trim() : '';
    const phone = $('#client-phone').val() ? $('#client-phone').val().trim() : '';
    const email = $('#client-email').val() ? $('#client-email').val().trim() : '';
    const service = $('#service-select').val();
    const addon = $('#addon-select').val();
    const notes = $('#concept-notes').val() ? $('#concept-notes').val().trim() : '';

    // 1. VALIDATION: Bắt buộc nhập Họ và Tên
    if (!name) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa nhập Họ và Tên!',
        text: 'Vui lòng cho RÈCỌRD biết họ tên của bạn để tiện xưng hô nhé.',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Đã hiểu'
      }).then(() => {
        $('#client-name').focus();
      });
      return false;
    }

    if (name.length < 2) {
      Swal.fire({
        icon: 'warning',
        title: 'Họ và Tên quá ngắn!',
        text: 'Vui lòng nhập đầy đủ họ và tên hợp lệ.',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Sửa lại'
      }).then(() => {
        $('#client-name').focus();
      });
      return false;
    }

    // 2. VALIDATION: Bắt buộc nhập Số điện thoại và đúng định dạng VN
    if (!phone) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa nhập Số điện thoại!',
        text: 'Vui lòng cung cấp số điện thoại hoặc Zalo để chúng mình liên hệ tư vấn.',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Đã hiểu'
      }).then(() => {
        $('#client-phone').focus();
      });
      return false;
    }

    // Loại bỏ khoảng trắng và dấu gạch nối trong SĐT để kiểm tra định dạng
    const phoneClean = phone.replace(/[\s\-\.]/g, '');
    const phoneRegex = /^(0|\+84|84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(phoneClean)) {
      Swal.fire({
        icon: 'error',
        title: 'Số điện thoại không đúng!',
        text: 'Số điện thoại phải gồm 10 chữ số (VD: 0949853015 hoặc 09xx xxx xxx).',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Kiểm tra lại'
      }).then(() => {
        $('#client-phone').focus();
      });
      return false;
    }

    // 3. VALIDATION: Bắt buộc chọn Loại dịch vụ chính
    if (!service || service === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa chọn Dịch vụ chính!',
        text: 'Vui lòng chọn loại dịch vụ chính mà bạn đang có nhu cầu quay chụp.',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Chọn dịch vụ'
      }).then(() => {
        $('#service-select').focus();
      });
      return false;
    }

    // 4. HIỂN THỊ LOADING VỚI SWEETALERT2 & DISABLE NÚT
    const $submitBtn = $(this).find('button[type="submit"]');
    const originalBtnHtml = $submitBtn.html();
    $submitBtn.prop('disabled', true);

    Swal.fire({
      title: 'Đang gửi yêu cầu...',
      html: 'Hệ thống đang chuyển thông tin đặt lịch của bạn đến RÈCỌRD.<br>Vui lòng đợi trong giây lát!',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = {
      name: name,
      phone: phoneClean,
      email: email || 'Không cung cấp',
      service: service,
      addon: addon || 'Không chọn',
      notes: notes || 'Không có ghi chú',
      time: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    };

    // Kiểm tra nếu chưa cấu hình GOOGLE_SCRIPT_URL (chế độ Demo / Hướng dẫn)
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === '' || GOOGLE_SCRIPT_URL.includes('AKfycbx...')) {
      setTimeout(() => {
        $submitBtn.prop('disabled', false).html(originalBtnHtml);
        $('#booking-form')[0].reset();

        Swal.fire({
          icon: 'success',
          title: 'Đăng Ký Thành Công! 🎉',
          html: `
            <div class="text-left text-xs sm:text-sm text-slate-700 space-y-1.5 mt-3 p-3.5 bg-slate-100 rounded-xl border border-slate-200">
              <p>👤 <b>Họ tên:</b> ${name}</p>
              <p>📞 <b>Số điện thoại:</b> ${phoneClean}</p>
              ${email && email !== 'Không cung cấp' ? `<p>✉️ <b>Email:</b> ${email}</p>` : ''}
              <p>🎯 <b>Dịch vụ chính:</b> ${service}</p>
              ${addon ? `<p>➕ <b>Option phụ:</b> ${addon}</p>` : ''}
              ${notes ? `<p>📝 <b>Ghi chú:</b> ${notes}</p>` : ''}
            </div>
            <p class="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 mt-3 font-medium text-left">
              ℹ️ <i>Ghi chú cấu hình: Bạn chưa dán link Google Apps Script vào biến <code>GOOGLE_SCRIPT_URL</code> trong file <code>js/main.js</code>. Khi bạn dán link vào, toàn bộ dữ liệu này sẽ được tự động ghi thẳng vào Google Sheet!</i>
            </p>
          `,
          confirmButtonColor: '#2563eb',
          confirmButtonText: 'Đã Hiểu & Đóng'
        });
      }, 1000);
      return;
    }

    // 5. GỬI DỮ LIỆU QUA JQUERY AJAX ĐẾN GOOGLE APPS SCRIPT
    $.ajax({
      url: GOOGLE_SCRIPT_URL,
      method: 'POST',
      data: formData,
      dataType: 'json',
      success: function (response) {
        $submitBtn.prop('disabled', false).html(originalBtnHtml);
        $('#booking-form')[0].reset();

        Swal.fire({
          icon: 'success',
          title: 'Đăng Ký Thành Công! 🎉',
          html: `
            <p class="text-slate-600 text-sm">Cảm ơn bạn <b>${name}</b>!</p>
            <p class="text-slate-600 text-sm mt-1">Thông tin đặt lịch dịch vụ <b>${service}</b> đã được lưu vào Google Sheet của RÈCỌRD.</p>
            <p class="text-xs text-blue-600 font-bold mt-3">Ekip sẽ liên hệ lại qua SĐT/Zalo <b>${phoneClean}</b> trong vòng 2 giờ làm việc!</p>
          `,
          confirmButtonColor: '#2563eb',
          confirmButtonText: 'Hoàn Tất'
        });
      },
      error: function (xhr, status, error) {
        $submitBtn.prop('disabled', false).html(originalBtnHtml);

        // Xử lý trường hợp Google Apps Script trả 302 redirect (dữ liệu ĐÃ ghi vào Sheet thành công)
        if (xhr.status === 0 || xhr.status === 200) {
          $('#booking-form')[0].reset();
          Swal.fire({
            icon: 'success',
            title: 'Đăng Ký Thành Công! 🎉',
            html: `
              <p class="text-slate-600 text-sm">Cảm ơn bạn <b>${name}</b>!</p>
              <p class="text-slate-600 text-sm mt-1">Yêu cầu tư vấn của bạn đã được ghi nhận trên Google Sheet.</p>
              <p class="text-xs text-blue-600 font-bold mt-3">Ekip sẽ liên hệ với bạn qua SĐT <b>${phoneClean}</b> sớm nhất!</p>
            `,
            confirmButtonColor: '#2563eb',
            confirmButtonText: 'Tuyệt vời'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Có lỗi xảy ra!',
            html: `Không thể kết nối đến Google Sheet (${error || 'Lỗi mạng'}). Vui lòng liên hệ trực tiếp Hotline/Zalo: <b>0949 853 015</b> để được hỗ trợ nhanh nhất.`,
            confirmButtonColor: '#2563eb',
            confirmButtonText: 'Đã hiểu'
          });
        }
      }
    });
  });

  // Toast Function
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const colors = {
      success: 'bg-emerald-600 border-emerald-500 text-white',
      error: 'bg-rose-600 border-rose-500 text-white',
      warning: 'bg-amber-600 border-amber-500 text-white',
      info: 'bg-blue-600 border-blue-500 text-white'
    };

    const toast = document.createElement('div');
    toast.className = `px-5 py-4 rounded-xl shadow-xl border text-sm font-medium flex items-center gap-3 animate__animated animate__fadeInRight ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="ml-auto opacity-75 hover:opacity-100">&times;</button>
    `;

    toast.querySelector('button').addEventListener('click', () => {
      toast.remove();
    });

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('animate__fadeInRight');
      toast.classList.add('animate__fadeOutRight');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // 9. Quick Booking Modal (if opened via button)
  window.openBookingModal = (defaultService = '') => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (defaultService && serviceSelect) {
      serviceSelect.value = defaultService;
    }
  };
});
