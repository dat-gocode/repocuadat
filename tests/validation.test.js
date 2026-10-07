import { describe, expect, it } from 'vitest';
import {
  MESSAGES,
  validateCredits,
  validateGrade,
  validateName,
  validateSubjectInput,
} from '../src/lib/validation.js';

describe('validateName', () => {
  it('bỏ khoảng trắng 2 đầu', () => {
    expect(validateName('  Giải tích 1  ')).toEqual({ value: 'Giải tích 1' });
  });
  it('báo lỗi khi rỗng hoặc chỉ có khoảng trắng', () => {
    expect(validateName('')).toEqual({ error: MESSAGES.nameRequired });
    expect(validateName('   ')).toEqual({ error: MESSAGES.nameRequired });
    expect(validateName(undefined)).toEqual({ error: MESSAGES.nameRequired });
  });
  it('chấp nhận đúng 100 ký tự, báo lỗi 101 ký tự', () => {
    expect(validateName('a'.repeat(100))).toEqual({ value: 'a'.repeat(100) });
    expect(validateName('a'.repeat(101))).toEqual({ error: MESSAGES.nameTooLong });
  });
  it('tính độ dài sau khi bỏ khoảng trắng 2 đầu', () => {
    expect(validateName(`  ${'a'.repeat(100)}  `)).toEqual({ value: 'a'.repeat(100) });
  });
});

describe('validateCredits', () => {
  it('chấp nhận số nguyên từ 1 đến 10', () => {
    expect(validateCredits('1')).toEqual({ value: 1 });
    expect(validateCredits(' 10 ')).toEqual({ value: 10 });
  });
  it('báo lỗi khi rỗng', () => {
    expect(validateCredits('')).toEqual({ error: MESSAGES.creditsRequired });
  });
  it('báo lỗi khi không phải số nguyên', () => {
    for (const raw of ['abc', '3.0', '3,5', '2e1', '1 2']) {
      expect(validateCredits(raw)).toEqual({ error: MESSAGES.creditsNotInteger });
    }
  });
  it('báo lỗi khi ngoài khoảng 1–10', () => {
    for (const raw of ['0', '11', '-1']) {
      expect(validateCredits(raw)).toEqual({ error: MESSAGES.creditsOutOfRange });
    }
  });
});

describe('validateGrade', () => {
  it('chấp nhận dấu chấm và dấu phẩy', () => {
    expect(validateGrade('8.5')).toEqual({ value: 8.5 });
    expect(validateGrade('8,5')).toEqual({ value: 8.5 });
  });
  it('chấp nhận biên 0 và 10', () => {
    expect(validateGrade('0')).toEqual({ value: 0 });
    expect(validateGrade('10')).toEqual({ value: 10 });
  });
  it('làm tròn 1 chữ số thập phân', () => {
    expect(validateGrade('8.45')).toEqual({ value: 8.5 });
    expect(validateGrade('8,44')).toEqual({ value: 8.4 });
    expect(validateGrade('9.96')).toEqual({ value: 10 });
  });
  it('báo lỗi khi rỗng', () => {
    expect(validateGrade('  ')).toEqual({ error: MESSAGES.gradeRequired });
  });
  it('báo lỗi khi không phải số', () => {
    for (const raw of ['abc', '8.5.1', '8,5,1', '1e1', 'NaN']) {
      expect(validateGrade(raw)).toEqual({ error: MESSAGES.gradeNotNumber });
    }
  });
  it('báo lỗi khi ngoài khoảng 0–10, kiểm tra trước khi làm tròn', () => {
    for (const raw of ['-0.1', '10.01', '10.04', '11']) {
      expect(validateGrade(raw)).toEqual({ error: MESSAGES.gradeOutOfRange });
    }
  });
});

describe('validateSubjectInput', () => {
  it('trả về dữ liệu đã chuẩn hoá khi hợp lệ', () => {
    expect(validateSubjectInput({ name: ' Vật lý ', credits: '3', grade: '7,25' })).toEqual({
      ok: true,
      value: { name: 'Vật lý', credits: 3, grade10: 7.3 },
    });
  });
  it('gom lỗi của tất cả các ô', () => {
    expect(validateSubjectInput({ name: '', credits: '0', grade: 'x' })).toEqual({
      ok: false,
      errors: {
        name: MESSAGES.nameRequired,
        credits: MESSAGES.creditsOutOfRange,
        grade: MESSAGES.gradeNotNumber,
      },
    });
  });
  it('chỉ trả lỗi của ô sai', () => {
    expect(validateSubjectInput({ name: 'Toán', credits: '3', grade: '' })).toEqual({
      ok: false,
      errors: { grade: MESSAGES.gradeRequired },
    });
  });
});
