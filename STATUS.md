# STATUS – GPA Tracker

## Trạng thái hiện tại
- **Giai đoạn:** 3 – Cài đặt và kiểm thử tự động (đang làm: xong F1–F4)
- **Cập nhật lần cuối:** 2026-10-07

| Giai đoạn | Trạng thái |
|-----------|------------|
| 1. Yêu cầu (PRD) | Xong |
| 2. Thiết kế luồng nghiệp vụ | Xong – `docs/flows.md` |
| 3. Cài đặt và kiểm thử tự động | Đang làm – F1–F4 đã merge vào `main` |
| 4. Kiểm thử người dùng | Chưa làm |
| 5. Deploy lên Vercel | Chưa làm |

- **URL production:** chưa có

## Quyết định kỹ thuật
| Ngày | Quyết định | Lý do |
|------|------------|-------|
| 2026-10-07 | Vite + HTML/CSS/JS thuần, test bằng Vitest, deploy Vercel | Theo PRD mục 3 |
| 2026-10-07 | Quy trình waterfall, flowchart viết bằng Mermaid trong `docs/flows.md` | Theo yêu cầu của người dùng |
| 2026-10-07 | Mỗi chức năng một nhánh riêng tạo từ `main`; chỉ merge vào `main` khi `npm test` và `npm run build` đều chạy thành công | Theo yêu cầu của người dùng, ghi trong `CLAUDE.md` |
| 2026-10-07 | Chốt 7 quy ước diễn giải các điểm PRD chưa nói rõ (gom lỗi validate, kiểm tra khoảng điểm trước khi làm tròn, tín chỉ đạt = điểm hệ 10 ≥ 4.0, xếp loại theo GPA đã làm tròn, ...) | Xem mục cuối `docs/flows.md`; không thêm chức năng |
| 2026-10-07 | Tạo nhánh `main` ở local từ `gpa-tracker` (chưa push) | Repo chưa có `main`; người dùng chọn phương án này |
| 2026-10-07 | Logic nghiệp vụ nằm trong `src/lib/` (không đụng DOM), `src/main.js` chỉ lo DOM; test trong `tests/` | Test được bằng Vitest, đúng `CLAUDE.md` |
| 2026-10-07 | Làm tròn bằng `roundTo()` (`toPrecision(12)` trước khi `Math.round`) | Tránh sai số dấu phẩy động, vd 8.45 → 8.5 |

## Thay đổi so với ban đầu
| Ngày | Thay đổi | Lý do | Ảnh hưởng (PRD/PLAN/code) |
|------|----------|-------|---------------------------|
| 2026-10-07 | Khởi tạo Vite + Vitest gộp chung vào nhánh F1 | Vitest báo lỗi khi chưa có test, nhánh khởi tạo riêng sẽ không qua được điều kiện merge (`npm test` thành công) | PLAN (git) |
| 2026-10-07 | Giao diện làm dần theo từng chức năng, mỗi nhánh F kèm phần giao diện của chức năng đó, thay vì một đầu việc "Giao diện" riêng ở cuối | Quy tắc mỗi chức năng một nhánh, merge khi đã hoàn chỉnh | PLAN giai đoạn 3 |

<!-- Mẫu ghi:
| Ngày | Thay đổi | Lý do | Ảnh hưởng (PRD/PLAN/code) |
-->
