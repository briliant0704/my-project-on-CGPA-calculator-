// FUL CGPA Calculator - dynamic rows, 5.0 scale

// mapping: score -> grade -> gp (5.0 scale)
//develped bt Abraham Brilliant-2025
function scoreToGrade(score){
  if (score === '' || score === null || isNaN(score)) return {grade:'', gp: null};
  score = Number(score);
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  if (score >= 70) return {grade:'A', gp:5};
  if (score >= 60) return {grade:'B', gp:4};
  if (score >= 50) return {grade:'C', gp:3};
  if (score >= 45) return {grade:'D', gp:2};
  if (score >= 40) return {grade:'E', gp:1};
  return {grade:'F', gp:0};
}

const coursesBody = document.getElementById('coursesBody');
const addRowBtn = document.getElementById('addRow');
const calculateBtn = document.getElementById('calculate');
const clearAllBtn = document.getElementById('clearAll');

// create initial row
addCourseRow();

addRowBtn.addEventListener('click', ()=> addCourseRow());

// event delegation for inputs and remove buttons
coursesBody.addEventListener('input', (e)=>{
  const tr = e.target.closest('tr');
  if (!tr) return;
  const scoreInput = tr.querySelector('.score');
  const gradeCell = tr.querySelector('.grade');
  const gpCell = tr.querySelector('.gp');

  if (e.target.classList.contains('score') || e.target.classList.contains('unit')){
    const s = scoreInput.value.trim();
    const {grade,gp} = scoreToGrade(s===''? null : Number(s));
    gradeCell.textContent = grade;
    gpCell.textContent = gp===null? '' : gp;
  }
});

coursesBody.addEventListener('click', (e)=>{
  if (e.target.classList.contains('remove')){
    const tr = e.target.closest('tr');
    tr.remove();
  }
});

calculateBtn.addEventListener('click', calculateCGPA);
clearAllBtn.addEventListener('click', ()=>{
  coursesBody.innerHTML = '';
  addCourseRow();
  document.getElementById('cgpa').textContent = '0.00';
  document.getElementById('totalUnits').textContent = '0';
  document.getElementById('sumUp').textContent = '0';
});

function addCourseRow(){
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="course" placeholder="e.g. MTH101"></td>
    <td><input type="number" class="unit" min="0" step="1" value="3"></td>
    <td><input type="number" class="score" min="0" max="100" placeholder="e.g. 72"></td>
    <td class="grade"></td>
    <td class="gp"></td>
    <td><button class="remove remove-btn">×</button></td>
  `;
  coursesBody.appendChild(tr);
}

function calculateCGPA(){
  const rows = Array.from(coursesBody.querySelectorAll('tr'));
  let totalUnits = 0;
  let sumUnitsTimesGp = 0;
  let anyInvalid=false;

  rows.forEach((tr, idx)=>{
    const unitVal = tr.querySelector('.unit').value.trim();
    const scoreVal = tr.querySelector('.score').value.trim();

    const units = Number(unitVal);
    const score = scoreVal === '' ? null : Number(scoreVal);

    if (isNaN(units) || units < 0){ anyInvalid=true; tr.classList.add('invalid'); return; }

    const {grade,gp} = scoreToGrade(score);
    // display grade and gp
    tr.querySelector('.grade').textContent = grade;
    tr.querySelector('.gp').textContent = gp===null? '': gp;

    if (gp===null){ anyInvalid=true; tr.classList.add('invalid'); return; }

    totalUnits += units;
    sumUnitsTimesGp += units * gp;
  });

  if (anyInvalid){
    alert('Please check your inputs. Make sure Units are numbers and Scores between 0 and 100.');
  }

  const cgpaEl = document.getElementById('cgpa');
  const totalUnitsEl = document.getElementById('totalUnits');
  const sumUpEl = document.getElementById('sumUp');

  const cgpa = totalUnits === 0 ? 0 : (sumUnitsTimesGp / totalUnits);

  cgpaEl.textContent = cgpa === 0 ? '0.00' : cgpa.toFixed(2);
  totalUnitsEl.textContent = totalUnits;
  sumUpEl.textContent = sumUnitsTimesGp;
}