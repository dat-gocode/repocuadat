import { describe, expect, it } from 'vitest';
import { classify, summarize } from '../src/lib/gpa.js';

const subject = (credits, grade10) => ({ id: `${credits}-${grade10}`, name: 'Môn', credits, grade10 });

describe('classify', () => {
  it.each([
    [4.0, 'Xuất sắc'],
    [3.6, 'Xuất sắc'],
    [3.59, 'Giỏi'],
    [3.2, 'Giỏi'],
    [3.19, 'Khá'],
    [2.5, 'Khá'],
    [2.49, 'Trung bình'],
    [2.0, 'Trung bình'],
    [1.99, 'Yếu'],
    [0, 'Yếu'],
  ])('GPA %s → %s', (gpa4, label) => {
    expect(classify(gpa4)).toBe(label);
  });
});

describe('summarize', () => {
  it('danh sách rỗng: các tổng bằng 0, GPA và xếp loại là null', () => {
    expect(summarize([])).toEqual({
      count: 0,
      totalCredits: 0,
      passedCredits: 0,
      gpa4: null,
      gpa10: null,
      classification: null,
    });
  });

  it('tính GPA có trọng số theo tín chỉ', () => {
    // hệ 4: (4.0*3 + 3.0*2) / 5 = 3.6 ; hệ 10: (9*3 + 7*2) / 5 = 8.2
    expect(summarize([subject(3, 9), subject(2, 7)])).toEqual({
      count: 2,
      totalCredits: 5,
      passedCredits: 5,
      gpa4: 3.6,
      gpa10: 8.2,
      classification: 'Xuất sắc',
    });
  });

  it('tín chỉ đạt chỉ tính môn có điểm hệ 10 ≥ 4.0', () => {
    const result = summarize([subject(3, 4.0), subject(2, 3.9), subject(4, 0)]);
    expect(result.totalCredits).toBe(9);
    expect(result.passedCredits).toBe(3);
  });

  it('làm tròn 2 chữ số', () => {
    // hệ 4: (3.5*1 + 3.0*2) / 3 = 3.1666… → 3.17 ; hệ 10: (8*1 + 7*2) / 3 = 7.333… → 7.33
    const result = summarize([subject(1, 8), subject(2, 7)]);
    expect(result.gpa4).toBe(3.17);
    expect(result.gpa10).toBe(7.33);
    expect(result.classification).toBe('Khá');
  });

  it('xếp loại theo GPA đã làm tròn', () => {
    // 39 tín chỉ điểm A (4.0) + 161 tín chỉ điểm B+ (3.5):
    // GPA thô = (4*39 + 3.5*161) / 200 = 3.5975 → làm tròn 3.6 → Xuất sắc
    const repeat = (n, credits, grade10) => Array.from({ length: n }, () => subject(credits, grade10));
    const list = [...repeat(3, 10, 9), subject(9, 9), ...repeat(16, 10, 8), subject(1, 8)];
    const result = summarize(list);
    expect(result.totalCredits).toBe(200);
    expect(result.gpa4).toBe(3.6);
    expect(result.classification).toBe('Xuất sắc');
  });
});
