import './style.css';
import { summarize } from './lib/gpa.js';
import { convertGrade } from './lib/grade.js';
import { getBrowserStorage, loadSubjects, saveSubjects } from './lib/storage.js';
import { addSubject, findSubject, removeSubject, updateSubject } from './lib/subjects.js';
import { validateSubjectInput } from './lib/validation.js';

const FIELDS = ['name', 'credits', 'grade'];

const storage = getBrowserStorage();

const state = {
  subjects: loadSubjects(storage),
  /** id môn đang sửa; null = chế độ Thêm. */
  editingId: null,
};

const form = document.getElementById('subject-form');
const formTitleEl = document.getElementById('form-title');
const submitButton = document.getElementById('submit-button');
const inputs = {
  name: document.getElementById('input-name'),
  credits: document.getElementById('input-credits'),
  grade: document.getElementById('input-grade'),
};
const errorEls = {
  name: document.getElementById('error-name'),
  credits: document.getElementById('error-credits'),
  grade: document.getElementById('error-grade'),
};
const rowsEl = document.getElementById('subject-rows');
const clearAllButton = document.getElementById('clear-all-button');
const emptyHintEl = document.getElementById('empty-hint');
const statEls = {
  gpa4: document.getElementById('stat-gpa4'),
  gpa10: document.getElementById('stat-gpa10'),
  classification: document.getElementById('stat-classification'),
  count: document.getElementById('stat-count'),
  credits: document.getElementById('stat-credits'),
  passed: document.getElementById('stat-passed'),
};
const EMPTY_VALUE = '—';

function formatNumber(value, digits) {
  return value.toLocaleString('vi-VN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function showErrors(errors) {
  for (const field of FIELDS) {
    const message = errors[field] ?? '';
    errorEls[field].textContent = message;
    inputs[field].setAttribute('aria-invalid', message ? 'true' : 'false');
  }
}

function clearForm() {
  form.reset();
  showErrors({});
  inputs.name.focus();
}

/** Cập nhật danh sách, lưu localStorage (F5) rồi vẽ lại. */
function commitSubjects(subjects) {
  state.subjects = subjects;
  saveSubjects(storage, state.subjects);
  render();
}

function setEditMode(id) {
  state.editingId = id;
  const isEditing = id !== null;
  formTitleEl.textContent = isEditing ? 'Sửa môn học' : 'Thêm môn học';
  submitButton.textContent = isEditing ? 'Lưu' : 'Thêm môn';
}

function exitEditMode() {
  setEditMode(null);
  clearForm();
}

function startEdit(id) {
  const subject = findSubject(state.subjects, id);
  if (!subject) return;
  setEditMode(id);
  inputs.name.value = subject.name;
  inputs.credits.value = String(subject.credits);
  inputs.grade.value = formatNumber(subject.grade10, 1);
  showErrors({});
  renderTable();
  inputs.name.focus();
}

function deleteSubject(id) {
  const subject = findSubject(state.subjects, id);
  if (!subject) return;
  if (!window.confirm(`Xoá môn "${subject.name}"?`)) return;
  if (state.editingId === id) exitEditMode();
  commitSubjects(removeSubject(state.subjects, id));
}

function createActionButton(label, action, id, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn btn-small ${className}`;
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = id;
  return button;
}

function renderSummary() {
  const summary = summarize(state.subjects);
  const isEmpty = summary.count === 0;
  statEls.gpa4.textContent = isEmpty ? EMPTY_VALUE : formatNumber(summary.gpa4, 2);
  statEls.gpa10.textContent = isEmpty ? EMPTY_VALUE : formatNumber(summary.gpa10, 2);
  statEls.classification.textContent = summary.classification ?? EMPTY_VALUE;
  statEls.count.textContent = String(summary.count);
  statEls.credits.textContent = String(summary.totalCredits);
  statEls.passed.textContent = String(summary.passedCredits);
  emptyHintEl.hidden = !isEmpty;
  clearAllButton.disabled = isEmpty;
}

function renderTable() {
  rowsEl.replaceChildren(
    ...state.subjects.map((subject) => {
      const row = document.createElement('tr');
      const { letter, point4 } = convertGrade(subject.grade10);
      const cells = [
        [subject.name, ''],
        [String(subject.credits), 'num'],
        [formatNumber(subject.grade10, 1), 'num'],
        [letter, 'num'],
        [formatNumber(point4, 1), 'num'],
      ];
      for (const [text, className] of cells) {
        const cell = document.createElement('td');
        cell.textContent = text;
        if (className) cell.className = className;
        row.append(cell);
      }
      const actionsCell = document.createElement('td');
      actionsCell.className = 'actions';
      actionsCell.append(
        createActionButton('Sửa', 'edit', subject.id, 'btn-secondary'),
        createActionButton('Xoá', 'delete', subject.id, 'btn-danger'),
      );
      row.append(actionsCell);
      if (subject.id === state.editingId) row.classList.add('is-editing');
      return row;
    }),
  );
}

function render() {
  renderTable();
  renderSummary();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = validateSubjectInput({
    name: inputs.name.value,
    credits: inputs.credits.value,
    grade: inputs.grade.value,
  });
  if (!result.ok) {
    showErrors(result.errors);
    const firstInvalid = FIELDS.find((field) => result.errors[field]);
    inputs[firstInvalid].focus();
    return;
  }
  if (state.editingId !== null) {
    // F4 – Lưu: môn đang sửa có thể đã bị xoá ở nơi khác thì chỉ thoát chế độ Sửa.
    const editingId = state.editingId;
    exitEditMode();
    if (findSubject(state.subjects, editingId)) {
      commitSubjects(updateSubject(state.subjects, editingId, result.value));
    } else {
      render();
    }
    return;
  }
  commitSubjects(addSubject(state.subjects, result.value));
  clearForm();
});

clearAllButton.addEventListener('click', () => {
  if (!window.confirm('Xoá toàn bộ môn học? Thao tác này không thể hoàn tác.')) return;
  if (state.editingId !== null) exitEditMode();
  commitSubjects([]);
});

rowsEl.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  if (button.dataset.action === 'edit') startEdit(button.dataset.id);
  if (button.dataset.action === 'delete') deleteSubject(button.dataset.id);
});

render();
