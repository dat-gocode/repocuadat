import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  STORAGE_KEY,
  isValidStoredSubject,
  loadSubjects,
  saveSubjects,
} from '../src/lib/storage.js';

function createMemoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

const toan = { id: 'a', name: 'Toán', credits: 3, grade10: 8.5 };
const ly = { id: 'b', name: 'Lý', credits: 2, grade10: 0 };

afterEach(() => vi.restoreAllMocks());

describe('isValidStoredSubject', () => {
  it('chấp nhận môn hợp lệ', () => {
    expect(isValidStoredSubject(toan)).toBe(true);
    expect(isValidStoredSubject(ly)).toBe(true);
  });
  it.each([
    ['null', null],
    ['mảng', []],
    ['chuỗi', 'Toán'],
    ['thiếu id', { name: 'Toán', credits: 3, grade10: 8 }],
    ['id rỗng', { ...toan, id: '' }],
    ['id là số', { ...toan, id: 1 }],
    ['tên rỗng', { ...toan, name: '' }],
    ['tên có khoảng trắng 2 đầu', { ...toan, name: ' Toán ' }],
    ['tên quá 100 ký tự', { ...toan, name: 'a'.repeat(101) }],
    ['tín chỉ là chuỗi', { ...toan, credits: '3' }],
    ['tín chỉ lẻ', { ...toan, credits: 2.5 }],
    ['tín chỉ 0', { ...toan, credits: 0 }],
    ['tín chỉ 11', { ...toan, credits: 11 }],
    ['điểm là chuỗi', { ...toan, grade10: '8.5' }],
    ['điểm NaN', { ...toan, grade10: NaN }],
    ['điểm âm', { ...toan, grade10: -1 }],
    ['điểm > 10', { ...toan, grade10: 10.5 }],
    ['điểm 2 chữ số thập phân', { ...toan, grade10: 8.45 }],
  ])('từ chối: %s', (_, item) => {
    expect(isValidStoredSubject(item)).toBe(false);
  });
});

describe('loadSubjects', () => {
  it('đọc danh sách hợp lệ', () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: JSON.stringify([toan, ly]) });
    expect(loadSubjects(storage)).toEqual([toan, ly]);
  });
  it('bỏ các trường thừa', () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: JSON.stringify([{ ...toan, extra: 1 }]) });
    expect(loadSubjects(storage)).toEqual([toan]);
  });
  it('chưa có dữ liệu → []', () => {
    expect(loadSubjects(createMemoryStorage())).toEqual([]);
  });
  it('không có localStorage → []', () => {
    expect(loadSubjects(null)).toEqual([]);
  });
  it('đọc bị lỗi → []', () => {
    const storage = {
      getItem: () => {
        throw new Error('SecurityError');
      },
    };
    expect(loadSubjects(storage)).toEqual([]);
  });
  it.each([
    ['JSON hỏng', '{not json'],
    ['không phải mảng', JSON.stringify({ subjects: [] })],
    ['chuỗi JSON', JSON.stringify('abc')],
    ['null', 'null'],
    ['có một phần tử sai', JSON.stringify([toan, { ...ly, credits: 99 }])],
    ['trùng id', JSON.stringify([toan, { ...ly, id: 'a' }])],
  ])('dữ liệu hỏng (%s) → []', (_, raw) => {
    expect(loadSubjects(createMemoryStorage({ [STORAGE_KEY]: raw }))).toEqual([]);
  });
});

describe('saveSubjects', () => {
  it('ghi JSON vào key gpa-tracker:v1 và đọc lại được', () => {
    const storage = createMemoryStorage();
    expect(saveSubjects(storage, [toan, ly])).toBe(true);
    expect(storage.getItem('gpa-tracker:v1')).toBe(JSON.stringify([toan, ly]));
    expect(loadSubjects(storage)).toEqual([toan, ly]);
  });
  it('ghi danh sách rỗng', () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: JSON.stringify([toan]) });
    expect(saveSubjects(storage, [])).toBe(true);
    expect(loadSubjects(storage)).toEqual([]);
  });
  it('ghi lỗi (đầy bộ nhớ) → false, không ném lỗi', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const storage = {
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    expect(saveSubjects(storage, [toan])).toBe(false);
    expect(warn).toHaveBeenCalled();
  });
  it('không có localStorage → false', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(saveSubjects(null, [toan])).toBe(false);
  });
});
