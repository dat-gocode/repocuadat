# CLAUDE.md – GPA Tracker

Ứng dụng web tính GPA cho sinh viên. Yêu cầu chi tiết nằm trong `PRD.md`.
Công nghệ: Vite + HTML/CSS/JavaScript thuần, unit test bằng Vitest, deploy lên Vercel.

## Quy trình làm việc: Waterfall

Dự án đi tuần tự qua 5 giai đoạn. Chỉ chuyển sang giai đoạn sau khi giai đoạn trước đã xong
và được ghi nhận trong `STATUS.md`.

1. **Yêu cầu** – `PRD.md` là nguồn yêu cầu duy nhất. Không tự thêm hay bớt chức năng.
2. **Thiết kế luồng nghiệp vụ** – vẽ flowchart bằng cú pháp Mermaid (` ```mermaid `) cho từng
   chức năng F1–F5, lưu trong `docs/flows.md`. Flowchart phải thể hiện đủ các nhánh validation
   và xử lý lỗi trong PRD.
3. **Cài đặt và kiểm thử tự động** – code theo flowchart đã thiết kế. Logic nghiệp vụ (validation,
   quy đổi điểm, tính GPA, đọc/ghi localStorage) tách khỏi DOM để test được bằng Vitest.
   Giai đoạn chỉ xong khi `npm test` và `npm run build` đều chạy thành công.
4. **Kiểm thử người dùng** – do người dùng tự thực hiện. Claude dừng lại, báo cách chạy app
   (`npm run dev`) và chờ kết quả. Không tự đánh dấu giai đoạn này là xong.
5. **Deploy lên Vercel** – chỉ làm sau khi người dùng xác nhận kiểm thử đạt. Ghi URL công khai
   vào `STATUS.md`.

Lỗi phát hiện ở giai đoạn sau: quay lại giai đoạn tương ứng để sửa (thiết kế hoặc code),
rồi đi tiếp theo thứ tự.

## Quy tắc Git: mỗi chức năng một nhánh

- Mỗi chức năng (F1–F5) được làm trên một nhánh riêng, tạo từ `main` mới nhất
  (ví dụ: `feature/f1-nhap-mon-hoc`). Không code chức năng trực tiếp trên `main`.
- Chỉ merge nhánh vào `main` khi chức năng đã hoàn thành và không lỗi:
  `npm test` và `npm run build` đều chạy thành công.
- Merge xong thì quay về `main` cập nhật mới nhất trước khi tạo nhánh cho chức năng tiếp theo.

## Tài liệu dự án

- `PRD.md` – yêu cầu sản phẩm. Chỉ sửa khi người dùng yêu cầu.
- `PLAN.md` – kế hoạch theo từng giai đoạn, kèm các đầu việc. Đánh dấu `[x]` khi xong việc.
- `STATUS.md` – trạng thái hiện tại, các quyết định kỹ thuật và các thay đổi so với ban đầu.
  Cập nhật mỗi khi xong một đầu việc, đưa ra một quyết định kỹ thuật, hoặc thay đổi kế hoạch/yêu cầu.

## Quy ước

- Giao diện và thông báo lỗi bằng tiếng Việt.
- Mọi thay đổi so với PRD hoặc PLAN phải ghi vào mục "Thay đổi so với ban đầu" trong `STATUS.md`,
  kèm lý do.
