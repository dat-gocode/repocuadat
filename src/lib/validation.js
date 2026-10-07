import { roundTo } from './number.js';

export const NAME_MAX_LENGTH = 100;
export const CREDITS_MIN = 1;
export const CREDITS_MAX = 10;
export const GRADE_MIN = 0;
export const GRADE_MAX = 10;

export const MESSAGES = {
  nameRequired: 'Vui lòng nhập tên môn học',
  nameTooLong: `Tên môn tối đa ${NAME_MAX_LENGTH} ký tự`,
  creditsRequired: 'Vui lòng nhập số tín chỉ',
  creditsNotInteger: 'Số tín chỉ phải là số nguyên',
  creditsOutOfRange: `Số tín chỉ phải từ ${CREDITS_MIN} đến ${CREDITS_MAX}`,
  gradeRequired: 'Vui lòng nhập điểm hệ 10',
  gradeNotNumber: 'Điểm phải là một số',
  gradeOutOfRange: `Điểm phải từ ${GRADE_MIN} đến ${GRADE_MAX}`,
};

const INTEGER_PATTERN = /^[+-]?\d+$/;
const DECIMAL_PATTERN = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;

/** Trả về { value } nếu hợp lệ, ngược lại { error }. */
export function validateName(raw) {
  const name = String(raw ?? '').trim();
  if (name === '') return { error: MESSAGES.nameRequired };
  if (name.length > NAME_MAX_LENGTH) return { error: MESSAGES.nameTooLong };
  return { value: name };
}

export function validateCredits(raw) {
  const text = String(raw ?? '').trim();
  if (text === '') return { error: MESSAGES.creditsRequired };
  if (!INTEGER_PATTERN.test(text)) return { error: MESSAGES.creditsNotInteger };
  const credits = Number(text);
  if (credits < CREDITS_MIN || credits > CREDITS_MAX) {
    return { error: MESSAGES.creditsOutOfRange };
  }
  return { value: credits };
}

export function validateGrade(raw) {
  const text = String(raw ?? '').trim().replace(',', '.');
  if (text === '') return { error: MESSAGES.gradeRequired };
  if (!DECIMAL_PATTERN.test(text)) return { error: MESSAGES.gradeNotNumber };
  const grade = Number(text);
  // Kiểm tra khoảng trên giá trị người dùng nhập, rồi mới làm tròn (docs/flows.md, quy ước 2).
  if (grade < GRADE_MIN || grade > GRADE_MAX) return { error: MESSAGES.gradeOutOfRange };
  return { value: roundTo(grade, 1) };
}

/**
 * Validate cả form, gom mọi lỗi (docs/flows.md, quy ước 1).
 * @returns {{ ok: true, value: {name, credits, grade10} } | { ok: false, errors: {name?, credits?, grade?} }}
 */
export function validateSubjectInput({ name, credits, grade }) {
  const results = {
    name: validateName(name),
    credits: validateCredits(credits),
    grade: validateGrade(grade),
  };
  const errors = {};
  for (const [field, result] of Object.entries(results)) {
    if (result.error) errors[field] = result.error;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name: results.name.value,
      credits: results.credits.value,
      grade10: results.grade.value,
    },
  };
}
