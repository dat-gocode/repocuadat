export function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/** Thêm môn vào cuối danh sách. Không sửa mảng gốc. */
export function addSubject(subjects, data, id = createId()) {
  return [...subjects, { id, ...data }];
}
