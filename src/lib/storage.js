import { roundTo } from './number.js';
import {
  CREDITS_MAX,
  CREDITS_MIN,
  GRADE_MAX,
  GRADE_MIN,
  validateName,
} from './validation.js';

export const STORAGE_KEY = 'gpa-tracker:v1';

/** Lấy localStorage; trình duyệt chặn truy cập (vd chế độ riêng tư) thì trả về null. */
export function getBrowserStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Một môn đọc từ localStorage phải thoả cùng quy tắc như F1. */
export function isValidStoredSubject(item) {
  if (item === null || typeof item !== 'object' || Array.isArray(item)) return false;
  const { id, name, credits, grade10 } = item;
  if (typeof id !== 'string' || id === '') return false;
  if (typeof name !== 'string' || validateName(name).value !== name) return false;
  if (!Number.isInteger(credits) || credits < CREDITS_MIN || credits > CREDITS_MAX) return false;
  if (typeof grade10 !== 'number' || !Number.isFinite(grade10)) return false;
  if (grade10 < GRADE_MIN || grade10 > GRADE_MAX || roundTo(grade10, 1) !== grade10) return false;
  return true;
}

/**
 * Đọc danh sách môn. Mọi trường hợp lỗi/hỏng đều trả về [] để trang vẫn hiển thị bình thường
 * (docs/flows.md, F5 – Tải dữ liệu).
 */
export function loadSubjects(storage) {
  let raw;
  try {
    raw = storage?.getItem(STORAGE_KEY) ?? null;
  } catch {
    return [];
  }
  if (raw === null) return [];

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data) || !data.every(isValidStoredSubject)) return [];
  if (new Set(data.map((item) => item.id)).size !== data.length) return [];
  return data.map(({ id, name, credits, grade10 }) => ({ id, name, credits, grade10 }));
}

/** Ghi danh sách môn. Ghi lỗi (bị chặn, đầy bộ nhớ) thì trả về false, không ném lỗi. */
export function saveSubjects(storage, subjects) {
  try {
    if (!storage) throw new Error('localStorage không khả dụng');
    storage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    return true;
  } catch (error) {
    console.warn('Không lưu được dữ liệu vào localStorage:', error);
    return false;
  }
}
