# STATUS – GPA Tracker

## Trạng thái hiện tại
- **Giai đoạn:** 3 – Cài đặt và kiểm thử tự động (chưa bắt đầu)
- **Cập nhật lần cuối:** 2026-10-07

| Giai đoạn | Trạng thái |
|-----------|------------|
| 1. Yêu cầu (PRD) | Xong |
| 2. Thiết kế luồng nghiệp vụ | Xong – `docs/flows.md` |
| 3. Cài đặt và kiểm thử tự động | Chưa làm |
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

## Thay đổi so với ban đầu
_Chưa có thay đổi._

<!-- Mẫu ghi:
| Ngày | Thay đổi | Lý do | Ảnh hưởng (PRD/PLAN/code) |
-->
