# Luồng nghiệp vụ – GPA Tracker

Flowchart cho từng chức năng trong `PRD.md`, viết bằng Mermaid. Code ở giai đoạn 3 phải bám theo
các luồng này. Các quy ước chi tiết (khi PRD chưa nói rõ) nằm ở mục cuối "Quy ước diễn giải PRD".

Cấu trúc dữ liệu một môn học:

```
{ id: string, name: string, credits: number (1–10), grade10: number (0–10, 1 chữ số thập phân) }
```

Điểm chữ và điểm hệ 4 không lưu, luôn tính lại từ `grade10` bằng F2.

---

## 0. Luồng tổng quan

```mermaid
flowchart TD
    A([Mở trang]) --> B[F5: Tải danh sách từ localStorage]
    B --> C[Danh sách môn trong bộ nhớ]
    C --> D[Hiển thị bảng môn học<br/>mỗi dòng: tên, tín chỉ, điểm 10,<br/>điểm chữ + hệ 4 từ F2, nút Sửa/Xoá]
    D --> E[F3: Tính và hiển thị khối tổng kết]
    E --> F[/Chờ thao tác người dùng/]
    F -->|Thêm môn / Enter| G[F1: Thêm môn học]
    F -->|Nhấn Sửa, Lưu| H[F4: Sửa môn học]
    F -->|Nhấn Xoá| I[F4: Xoá môn học]
    F -->|Nhấn Xoá tất cả| J[F5: Xoá tất cả]
    G --> K{Danh sách có thay đổi?}
    H --> K
    I --> K
    J --> K
    K -->|Có| L[F5: Lưu vào localStorage]
    L --> D
    K -->|Không| F
```

---

## F1. Thêm môn học

Bước kiểm tra dữ liệu (khối "Validate form") dùng chung cho F1 và F4.

```mermaid
flowchart TD
    A([Nhấn Thêm môn hoặc Enter]) --> B[Xoá các thông báo lỗi cũ]
    B --> V[[Validate form]]
    V --> C{Có lỗi?}
    C -->|Có| D[Hiện lỗi tiếng Việt ngay dưới từng ô sai<br/>Giữ nguyên dữ liệu đã nhập<br/>Đặt con trỏ vào ô lỗi đầu tiên]
    D --> Z([Kết thúc, không thêm môn])
    C -->|Không| E{Đang ở chế độ Sửa?}
    E -->|Có| F[Chuyển sang luồng F4 – Lưu]
    E -->|Không| G[Tạo môn mới với id duy nhất<br/>thêm vào cuối danh sách]
    G --> H[F5: Lưu localStorage]
    H --> I[Vẽ lại bảng và tổng kết F3]
    I --> J[Xoá trắng form<br/>Đặt con trỏ vào ô Tên môn]
    J --> K([Kết thúc])
```

### Validate form (kiểm tra cả 3 ô, gom hết lỗi rồi mới hiển thị)

```mermaid
flowchart TD
    S([Bắt đầu validate]) --> N1[Tên = bỏ khoảng trắng 2 đầu]
    N1 --> N2{Tên rỗng?}
    N2 -->|Có| NE1[Lỗi Tên: Vui lòng nhập tên môn học]
    N2 -->|Không| N3{Dài hơn 100 ký tự?}
    N3 -->|Có| NE2[Lỗi Tên: Tên môn tối đa 100 ký tự]
    N3 -->|Không| NOK[Tên hợp lệ]

    NE1 --> C1
    NE2 --> C1
    NOK --> C1

    C1[Tín chỉ = bỏ khoảng trắng 2 đầu] --> C2{Rỗng?}
    C2 -->|Có| CE1[Lỗi Tín chỉ: Vui lòng nhập số tín chỉ]
    C2 -->|Không| C3{Là số nguyên?<br/>chỉ gồm chữ số}
    C3 -->|Không| CE2[Lỗi Tín chỉ: Số tín chỉ phải là số nguyên]
    C3 -->|Có| C4{Từ 1 đến 10?}
    C4 -->|Không| CE3[Lỗi Tín chỉ: Số tín chỉ phải từ 1 đến 10]
    C4 -->|Có| COK[Tín chỉ hợp lệ]

    CE1 --> G1
    CE2 --> G1
    CE3 --> G1
    COK --> G1

    G1[Điểm = bỏ khoảng trắng 2 đầu<br/>đổi dấu phẩy thành dấu chấm] --> G2{Rỗng?}
    G2 -->|Có| GE1[Lỗi Điểm: Vui lòng nhập điểm hệ 10]
    G2 -->|Không| G3{Là số hợp lệ?<br/>vd 8, 8.5, 8,5}
    G3 -->|Không| GE2[Lỗi Điểm: Điểm phải là một số]
    G3 -->|Có| G4{Từ 0 đến 10?}
    G4 -->|Không| GE3[Lỗi Điểm: Điểm phải từ 0 đến 10]
    G4 -->|Có| G5[Làm tròn 1 chữ số thập phân]
    G5 --> GOK[Điểm hợp lệ]

    GE1 --> R
    GE2 --> R
    GE3 --> R
    GOK --> R

    R{Có ô nào lỗi?} -->|Có| RE([Trả về danh sách lỗi theo từng ô])
    R -->|Không| ROK([Trả về dữ liệu đã chuẩn hoá:<br/>name, credits, grade10])
```

---

## F2. Quy đổi điểm

Đầu vào là `grade10` đã làm tròn 1 chữ số, nên các khoảng trong PRD (vd 8.0–8.4 và 8.5–10)
không có khe hở. So sánh từ trên xuống, gặp điều kiện đúng đầu tiên thì dừng.

```mermaid
flowchart TD
    A([Nhận grade10]) --> B{≥ 8.5?}
    B -->|Có| RA[A – 4.0]
    B -->|Không| C{≥ 8.0?}
    C -->|Có| RBp[B+ – 3.5]
    C -->|Không| D{≥ 7.0?}
    D -->|Có| RB[B – 3.0]
    D -->|Không| E{≥ 6.5?}
    E -->|Có| RCp[C+ – 2.5]
    E -->|Không| F{≥ 5.5?}
    F -->|Có| RC[C – 2.0]
    F -->|Không| G{≥ 5.0?}
    G -->|Có| RDp[D+ – 1.5]
    G -->|Không| H{≥ 4.0?}
    H -->|Có| RD[D – 1.0]
    H -->|Không| RF[F – 0.0]
    RA --> Z([Trả về điểm chữ, điểm hệ 4])
    RBp --> Z
    RB --> Z
    RCp --> Z
    RC --> Z
    RDp --> Z
    RD --> Z
    RF --> Z
```

---

## F3. Tính GPA và xếp loại

```mermaid
flowchart TD
    A([Danh sách môn thay đổi hoặc vừa tải trang]) --> B{Danh sách rỗng?}
    B -->|Có| E1[Tổng số môn = 0, Tổng tín chỉ = 0, Tín chỉ đạt = 0<br/>GPA hệ 4 = —, GPA hệ 10 = —, Xếp loại = —]
    E1 --> E2[Hiện dòng hướng dẫn:<br/>Hãy thêm môn học đầu tiên]
    E2 --> Z([Kết thúc])
    B -->|Không| C[Với từng môn: F2 lấy điểm hệ 4]
    C --> D[Tổng số môn = số phần tử<br/>Tổng tín chỉ = Σ tín chỉ<br/>Tín chỉ đạt = Σ tín chỉ các môn có grade10 ≥ 4.0]
    D --> F[GPA hệ 4 = Σ hệ 4 × tín chỉ / Σ tín chỉ<br/>GPA hệ 10 = Σ grade10 × tín chỉ / Σ tín chỉ<br/>Làm tròn 2 chữ số]
    F --> G{GPA hệ 4 ≥ 3.6?}
    G -->|Có| X1[Xuất sắc]
    G -->|Không| H{≥ 3.2?}
    H -->|Có| X2[Giỏi]
    H -->|Không| I{≥ 2.5?}
    I -->|Có| X3[Khá]
    I -->|Không| J{≥ 2.0?}
    J -->|Có| X4[Trung bình]
    J -->|Không| X5[Yếu]
    X1 --> K[Ẩn dòng hướng dẫn<br/>Hiển thị các chỉ số và xếp loại]
    X2 --> K
    X3 --> K
    X4 --> K
    X5 --> K
    K --> Z
```

---

## F4. Sửa và xoá môn học

### Sửa môn

```mermaid
flowchart TD
    A([Nhấn Sửa ở một dòng]) --> B[Ghi nhớ id môn đang sửa<br/>Đưa tên, tín chỉ, điểm lên form]
    B --> C[Đổi nút Thêm môn thành Lưu<br/>Xoá lỗi cũ, đặt con trỏ vào ô Tên môn]
    C --> D[/Người dùng chỉnh dữ liệu/]
    D --> E([Nhấn Lưu hoặc Enter])
    E --> V[[Validate form – giống F1]]
    V --> F{Có lỗi?}
    F -->|Có| G[Hiện lỗi dưới từng ô sai<br/>Vẫn ở chế độ Sửa]
    G --> D
    F -->|Không| H{Môn đang sửa còn tồn tại?}
    H -->|Không| I[Thoát chế độ Sửa<br/>Xoá trắng form, nút về Thêm môn]
    I --> Z([Kết thúc])
    H -->|Có| J[Cập nhật môn theo id, giữ nguyên vị trí]
    J --> K[F5: Lưu localStorage]
    K --> L[Vẽ lại bảng và tổng kết F3]
    L --> I
```

### Xoá môn

```mermaid
flowchart TD
    A([Nhấn Xoá ở một dòng]) --> B{Hộp xác nhận:<br/>Xoá môn tên môn?}
    B -->|Huỷ| Z([Kết thúc, không thay đổi])
    B -->|Đồng ý| C[Xoá môn theo id khỏi danh sách]
    C --> D{Môn này đang được sửa?}
    D -->|Có| E[Thoát chế độ Sửa<br/>Xoá trắng form, nút về Thêm môn]
    D -->|Không| F
    E --> F[F5: Lưu localStorage]
    F --> G[Vẽ lại bảng và tổng kết F3]
    G --> Z2([Kết thúc])
```

---

## F5. Lưu dữ liệu

### Tải dữ liệu khi mở trang

```mermaid
flowchart TD
    A([Mở trang]) --> B[Đọc localStorage key gpa-tracker:v1]
    B --> C{Đọc được?<br/>không ném lỗi}
    C -->|Không| R[Khởi tạo danh sách rỗng]
    C -->|Có| D{Có giá trị?}
    D -->|Không, null| R
    D -->|Có| E{JSON.parse thành công?}
    E -->|Không| R
    E -->|Có| F{Là mảng?}
    F -->|Không| R
    F -->|Có| G{Mọi phần tử hợp lệ?<br/>id là chuỗi, name/credits/grade10<br/>đúng quy tắc như F1}
    G -->|Không| R
    G -->|Có| H[Dùng danh sách đã đọc]
    R --> Z([Trả về danh sách – trang luôn hiển thị bình thường])
    H --> Z
```

### Lưu dữ liệu sau mỗi thay đổi

```mermaid
flowchart TD
    A([Danh sách vừa thay đổi:<br/>thêm, sửa, xoá, xoá tất cả]) --> B[JSON.stringify danh sách]
    B --> C[Ghi localStorage key gpa-tracker:v1]
    C --> D{Ghi thành công?}
    D -->|Có| Z([Kết thúc])
    D -->|Không: bị chặn hoặc đầy bộ nhớ| E[Ghi cảnh báo ra console<br/>App tiếp tục chạy với dữ liệu trong bộ nhớ]
    E --> Z
```

### Xoá tất cả

```mermaid
flowchart TD
    A([Nhấn Xoá tất cả]) --> B{Hộp xác nhận:<br/>Xoá toàn bộ môn học?}
    B -->|Huỷ| Z([Kết thúc, không thay đổi])
    B -->|Đồng ý| C[Danh sách = rỗng]
    C --> D[Thoát chế độ Sửa nếu đang sửa<br/>Xoá trắng form và lỗi]
    D --> E[F5: Lưu danh sách rỗng vào localStorage]
    E --> F[Vẽ lại bảng và tổng kết F3<br/>hiện dòng Hãy thêm môn học đầu tiên]
    F --> Z2([Kết thúc])
```

---

## Quy ước diễn giải PRD

Những điểm PRD chưa nói rõ, được chốt như sau (không thêm chức năng mới):

1. **Validate gom lỗi:** kiểm tra cả 3 ô một lần và hiện mọi lỗi cùng lúc, không dừng ở lỗi đầu tiên.
2. **Thứ tự kiểm tra điểm:** kiểm tra khoảng 0–10 trên giá trị người dùng nhập, sau đó mới làm tròn
   1 chữ số (vd `10.04` báo lỗi, không làm tròn thành `10.0`).
3. **Tín chỉ:** chỉ nhận chuỗi chữ số (vd `3`); `3.0`, `3,5`, `2e1` đều báo lỗi "phải là số nguyên".
4. **Tín chỉ đạt:** "điểm ≥ 4.0" hiểu là điểm hệ 10 ≥ 4.0, tức là môn không bị điểm F.
5. **Xếp loại:** dựa trên GPA hệ 4 đã làm tròn 2 chữ số (giá trị hiển thị cho người dùng).
6. **Dữ liệu hỏng:** chỉ cần một phần tử sai là coi cả dữ liệu hỏng và khởi tạo danh sách rỗng,
   đúng như PRD ghi.
7. **Ghi localStorage lỗi:** PRD không quy định thông báo, nên chỉ ghi cảnh báo ra console và app vẫn chạy.
