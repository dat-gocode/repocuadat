export function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/** Thêm môn vào cuối danh sách. Không sửa mảng gốc. */
export function addSubject(subjects, data, id = createId()) {
  return [...subjects, { id, ...data }];
}

export function findSubject(subjects, id) {
  return subjects.find((subject) => subject.id === id) ?? null;
}

/** Cập nhật môn theo id, giữ nguyên vị trí. Không tìm thấy id thì trả về danh sách cũ. */
export function updateSubject(subjects, id, data) {
  if (!findSubject(subjects, id)) return subjects;
  return subjects.map((subject) => (subject.id === id ? { ...subject, ...data, id } : subject));
}

/** Xoá môn theo id. Không sửa mảng gốc. */
export function removeSubject(subjects, id) {
  return subjects.filter((subject) => subject.id !== id);
}
