import { convertGrade } from './grade.js';
import { roundTo } from './number.js';

/** Ngưỡng xếp loại theo GPA hệ 4 (PRD F3), xét từ trên xuống. */
export const CLASSIFICATIONS = [
  { min: 3.6, label: 'Xuất sắc' },
  { min: 3.2, label: 'Giỏi' },
  { min: 2.5, label: 'Khá' },
  { min: 2.0, label: 'Trung bình' },
  { min: -Infinity, label: 'Yếu' },
];

/** Môn đạt khi điểm hệ 10 ≥ 4.0 (docs/flows.md, quy ước 4). */
export const PASS_GRADE10 = 4.0;

export function classify(gpa4) {
  return CLASSIFICATIONS.find((step) => gpa4 >= step.min).label;
}

/**
 * Tổng kết danh sách môn. Danh sách rỗng thì GPA và xếp loại là null (giao diện hiện "—").
 * @returns {{ count: number, totalCredits: number, passedCredits: number,
 *            gpa4: number|null, gpa10: number|null, classification: string|null }}
 */
export function summarize(subjects) {
  const count = subjects.length;
  if (count === 0) {
    return { count: 0, totalCredits: 0, passedCredits: 0, gpa4: null, gpa10: null, classification: null };
  }

  let totalCredits = 0;
  let passedCredits = 0;
  let weighted4 = 0;
  let weighted10 = 0;
  for (const { credits, grade10 } of subjects) {
    totalCredits += credits;
    if (grade10 >= PASS_GRADE10) passedCredits += credits;
    weighted4 += convertGrade(grade10).point4 * credits;
    weighted10 += grade10 * credits;
  }

  const gpa4 = roundTo(weighted4 / totalCredits, 2);
  const gpa10 = roundTo(weighted10 / totalCredits, 2);
  // Xếp loại theo GPA hệ 4 đã làm tròn – giá trị người dùng thấy (docs/flows.md, quy ước 5).
  return { count, totalCredits, passedCredits, gpa4, gpa10, classification: classify(gpa4) };
}
