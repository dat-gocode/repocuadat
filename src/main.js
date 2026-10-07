import './style.css';
import { summarize } from './lib/gpa.js';
import { convertGrade } from './lib/grade.js';
import { addSubject } from './lib/subjects.js';
import { validateSubjectInput } from './lib/validation.js';

const FIELDS = ['name', 'credits', 'grade'];

const state = {
  subjects: [],
};

const form = document.getElementById('subject-form');
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
  state.subjects = addSubject(state.subjects, result.value);
  render();
  clearForm();
});

render();
