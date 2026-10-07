import { describe, expect, it } from 'vitest';
import { addSubject, createId } from '../src/lib/subjects.js';

describe('addSubject', () => {
  it('thêm môn vào cuối danh sách và không sửa mảng gốc', () => {
    const list = [{ id: 'a', name: 'Toán', credits: 3, grade10: 8 }];
    const result = addSubject(list, { name: 'Lý', credits: 2, grade10: 7.5 }, 'b');
    expect(result).toEqual([
      { id: 'a', name: 'Toán', credits: 3, grade10: 8 },
      { id: 'b', name: 'Lý', credits: 2, grade10: 7.5 },
    ]);
    expect(list).toHaveLength(1);
  });
  it('tự tạo id khác nhau', () => {
    const result = addSubject(addSubject([], { name: 'A', credits: 1, grade10: 5 }), {
      name: 'B',
      credits: 1,
      grade10: 5,
    });
    expect(typeof result[0].id).toBe('string');
    expect(result[0].id).not.toBe(result[1].id);
    expect(createId()).not.toBe(createId());
  });
});
