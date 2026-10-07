# PLAN – GPA Tracker

Kế hoạch theo mô hình waterfall (xem `CLAUDE.md`). Các giai đoạn làm tuần tự.

## Giai đoạn 1 – Yêu cầu
- [x] Viết `PRD.md` (chức năng F1–F5, yêu cầu phi chức năng)

## Giai đoạn 2 – Thiết kế luồng nghiệp vụ (Mermaid flowchart)
Lưu tại `docs/flows.md`.
- [x] Luồng tổng quan: mở app → tải dữ liệu → hiển thị bảng và GPA
- [x] F1 – Thêm môn học, gồm các nhánh validation (tên, tín chỉ, điểm)
- [x] F2 – Quy đổi điểm hệ 10 → điểm chữ → hệ 4
- [x] F3 – Tính GPA, xếp loại, trường hợp chưa có môn
- [x] F4 – Sửa môn (chế độ Sửa/Lưu) và xoá môn (có xác nhận)
- [x] F5 – Lưu/tải localStorage, xử lý dữ liệu hỏng, "Xoá tất cả"

## Giai đoạn 3 – Cài đặt và kiểm thử tự động
Thứ tự theo phụ thuộc trong PRD: F1 → F2 → F3 → F4 → F5.
- [x] Khởi tạo dự án Vite (JS thuần) + Vitest, scripts `dev`, `build`, `test`
- [x] F1 – Validation và thêm môn + unit test
- [x] F2 – Hàm quy đổi điểm + unit test (biên của từng khoảng điểm)
- [x] F3 – Tính GPA, làm tròn, xếp loại + unit test
- [x] F4 – Sửa/xoá môn + unit test
- [ ] F5 – Lưu/tải localStorage, dữ liệu hỏng, xoá tất cả + unit test
- [ ] Giao diện: form, bảng, khối tổng kết, thông báo lỗi tiếng Việt
- [ ] Responsive (màn hình ≥ 360px)
- [ ] `npm test` và `npm run build` chạy thành công

## Giai đoạn 4 – Kiểm thử người dùng (người dùng thực hiện)
- [ ] Bàn giao: hướng dẫn chạy `npm run dev`
- [ ] Người dùng kiểm thử F1–F5 trên máy tính và điện thoại
- [ ] Sửa lỗi phát hiện (nếu có) và người dùng xác nhận đạt

## Giai đoạn 5 – Deploy lên Vercel
- [ ] Cấu hình và deploy lên Vercel
- [ ] Kiểm tra URL công khai hoạt động
- [ ] Ghi URL vào `STATUS.md`
