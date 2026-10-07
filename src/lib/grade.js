/** Bảng quy đổi theo PRD F2, xét từ trên xuống, gặp ngưỡng đúng đầu tiên thì dừng. */
export const GRADE_SCALE = [
  { min: 8.5, letter: 'A', point4: 4.0 },
  { min: 8.0, letter: 'B+', point4: 3.5 },
  { min: 7.0, letter: 'B', point4: 3.0 },
  { min: 6.5, letter: 'C+', point4: 2.5 },
  { min: 5.5, letter: 'C', point4: 2.0 },
  { min: 5.0, letter: 'D+', point4: 1.5 },
  { min: 4.0, letter: 'D', point4: 1.0 },
  { min: -Infinity, letter: 'F', point4: 0.0 },
];

/**
 * Quy đổi điểm hệ 10 (đã làm tròn 1 chữ số) sang điểm chữ và hệ 4.
 * @returns {{ letter: string, point4: number }}
 */
export function convertGrade(grade10) {
  const { letter, point4 } = GRADE_SCALE.find((step) => grade10 >= step.min);
  return { letter, point4 };
}
