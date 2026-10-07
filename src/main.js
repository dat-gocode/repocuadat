import './style.css';
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

function render() {
  rowsEl.replaceChildren(
    ...state.subjects.map((subject) => {
      const row = document.createElement('tr');
      const cells = [
        [subject.name, ''],
        [String(subject.credits), 'num'],
        [formatNumber(subject.grade10, 1), 'num'],
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
