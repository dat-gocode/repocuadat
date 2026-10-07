import { describe, expect, it } from 'vitest';
import {
  addSubject,
  createId,
  findSubject,
  removeSubject,
  updateSubject,
} from '../src/lib/subjects.js';

const toan = { id: 'a', name: 'Toán', credits: 3, grade10: 8 };
const ly = { id: 'b', name: 'Lý', credits: 2, grade10: 7.5 };
const hoa = { id: 'c', name: 'Hoá', credits: 4, grade10: 6 };

describe('addSubject', () => {
  it('thêm môn vào cuối danh sách và không sửa mảng gốc', () => {
    const list = [toan];
    const result = addSubject(list, { name: 'Lý', credits: 2, grade10: 7.5 }, 'b');
    expect(result).toEqual([toan, ly]);
    expect(list).toEqual([toan]);
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

describe('findSubject', () => {
  it('tìm theo id, không có thì trả về null', () => {
    expect(findSubject([toan, ly], 'b')).toBe(ly);
    expect(findSubject([toan, ly], 'x')).toBeNull();
  });
});

describe('updateSubject', () => {
  it('cập nhật đúng môn, giữ nguyên vị trí và id', () => {
    const list = [toan, ly, hoa];
    const result = updateSubject(list, 'b', { name: 'Vật lý', credits: 3, grade10: 9 });
    expect(result).toEqual([toan, { id: 'b', name: 'Vật lý', credits: 3, grade10: 9 }, hoa]);
    expect(list[1]).toEqual(ly);
  });
  it('không đổi id dù dữ liệu truyền vào có id khác', () => {
    const result = updateSubject([toan], 'a', { id: 'z', name: 'Toán 2', credits: 3, grade10: 8 });
    expect(result[0].id).toBe('a');
  });
  it('id không tồn tại thì trả về danh sách cũ', () => {
    const list = [toan];
    expect(updateSubject(list, 'x', { name: 'X', credits: 1, grade10: 1 })).toBe(list);
  });
});

describe('removeSubject', () => {
  it('xoá đúng môn theo id và không sửa mảng gốc', () => {
    const list = [toan, ly, hoa];
    expect(removeSubject(list, 'b')).toEqual([toan, hoa]);
    expect(list).toHaveLength(3);
  });
  it('id không tồn tại thì danh sách giữ nguyên nội dung', () => {
    expect(removeSubject([toan], 'x')).toEqual([toan]);
  });
});
