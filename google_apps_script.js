/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - LƯU DỮ LIỆU ĐẶT LỊCH / BÁO GIÁ TỪ LANDING PAGE RÈCỌRD
 * =========================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT TỪNG BƯỚC:
 * 1. Mở Google Drive (drive.google.com) và tạo một "Google Trang tính" (Google Sheet) mới.
 * 2. Đặt tên Sheet, ví dụ: "RÈCỌRD - Danh Sách Đặt Lịch & Báo Giá".
 * 3. Trên thanh menu của Google Sheet, bấm:
 *    -> "Tiện ích mở rộng" (Extensions) > "Apps Script".
 * 4. Xóa toàn bộ mã mặc định trong tệp "Mã.gs" (hoặc "Code.gs"), sau đó COPY TOÀN BỘ NỘI DUNG TỆP NÀY và DÁN vào đó.
 * 5. Bấm biểu tượng "Lưu" (Ctrl + S).
 * 6. Bấm nút "Triển khai" (Deploy) ở góc trên bên phải > Chọn "Tùy chọn triển khai mới" (New deployment).
 * 7. Chọn loại triển khai: Bấm biểu tượng bánh răng (⚙️) bên cạnh "Chọn loại" > Chọn "Ứng dụng web" (Web App).
 * 8. Điền thông tin cấu hình:
 *    - Mô tả (Description): "Lưu đơn đặt lịch Rècọrd"
 *    - Thực thi dưới dạng (Execute as): "Tôi (email_cua_ban@gmail.com)"  <-- RẤT QUAN TRỌNG
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone)       <-- BẮT BUỘC ĐỂ KHÁCH GỬI ĐƯỢC
 * 9. Bấm "Triển khai" (Deploy).
 *    - Nếu Google yêu cầu cấp quyền: Bấm "Ủy quyền truy cập" (Authorize access) > Chọn tài khoản Google của bạn > 
 *      Bấm "Nâng cao" (Advanced) > Bấm "Đi tới [Tên dự án] (không an toàn)" > Bấm "Cho phép" (Allow).
 * 10. Copy dòng "URL của ứng dụng web" (Có dạng: https://script.google.com/macros/s/XXXXX.../exec).
 * 11. Dán URL đó vào biến `GOOGLE_SCRIPT_URL` trong file `js/main.js` của website!
 * =========================================================================
 */

// Hàm xử lý khi nhận request POST từ Ajax
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Đợi tối đa 30 giây để tránh xung đột khi nhiều người gửi cùng lúc
  lock.tryLock(30000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // Khởi tạo hàng tiêu đề nếu Sheet còn trống
    if (sheet.getLastRow() === 0) {
      setupSheetHeader(sheet);
    }

    // Lấy dữ liệu gửi lên (hỗ trợ cả x-www-form-urlencoded và JSON)
    var data = e.parameter;
    if (e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        data = parsed;
      } catch (err) {
        // Dữ liệu đã nằm trong e.parameter
      }
    }

    // Thu thập các trường thông tin
    var timestamp = data.time || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "HH:mm:ss dd/MM/yyyy");
    var name      = data.name || "";
    var phone     = data.phone ? "'" + data.phone : ""; // Thêm dấu ' để Sheet hiểu là text, không mất số 0 đầu
    var email     = data.email || "";
    var service   = data.service || "";
    var addon     = data.addon || "";
    var notes     = data.notes || "";
    var status    = "Chưa liên hệ";

    // Thêm dòng mới vào cuối bảng tính
    sheet.appendRow([
      timestamp,
      name,
      phone,
      email,
      service,
      addon,
      notes,
      status
    ]);

    // Trả về kết quả JSON thành công
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        message: "Lưu dữ liệu thành công!",
        data: { name: name, phone: data.phone, service: service }
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Trả về thông báo lỗi nếu có sự cố
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Hàm hỗ trợ test nhanh trên trình duyệt bằng GET
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "Google Apps Script RÈCỌRD Media đã sẵn sàng nhận dữ liệu POST!"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Hàm tự động trang trí hàng tiêu đề cho Google Sheet thật chuyên nghiệp
function setupSheetHeader(sheet) {
  var headers = [
    "Thời Gian Gửi",
    "Họ Và Tên",
    "Số Điện Thoại / Zalo",
    "Email",
    "Dịch Vụ Chính",
    "Dịch Vụ Phụ (Option)",
    "Ghi Chú Concept",
    "Trạng Thái Xử Lý"
  ];

  sheet.appendRow(headers);

  // Định dạng hàng tiêu đề (Dòng 1)
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#2563eb"); // Màu xanh Cobalt chuẩn thương hiệu RÈCỌRD
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);

  // Cố định dòng 1 khi cuộn chuột
  sheet.setFrozenRows(1);
}
