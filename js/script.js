// -------------------- Grade Points --------------------
const gradePoints = {
  "O": 10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
  "C": 5,
  "U": 0,
  "AB": 0
};

// Grade descriptions for tooltips
const gradeDescriptions = {
  "O": "Outstanding, 10 points",
  "A+": "Excellent, 9 points",
  "A": "Very Good, 8 points",
  "B+": "Good, 7 points",
  "B": "Average, 6 points",
  "C": "Pass, 5 points",
  "U": "Fail, 0 points",
  "AB": "Absent, 0 points"
};

// -------------------- Method 1: Load Subjects --------------------
function loadSubjects() {
  const sem = document.getElementById("semester").value;
  const tbody = document.querySelector("#subjectsTable tbody");
  tbody.innerHTML = "";

  if (!sem) return;

  curriculum[sem].forEach((sub, index) => {
    const row = `
      <tr>
        <td>${sub.code}</td>
        <td>${sub.name}</td>
        <td>${sub.credit}</td>
        <td class="grade-cell">
          <select id="grade-${index}" class="grade-select">
            <option value="O" title="${gradeDescriptions['O']}">O</option>
            <option value="A+" title="${gradeDescriptions['A+']}">A+</option>
            <option value="A" title="${gradeDescriptions['A']}">A</option>
            <option value="B+" title="${gradeDescriptions['B+']}">B+</option>
            <option value="B" title="${gradeDescriptions['B']}">B</option>
            <option value="C" title="${gradeDescriptions['C']}">C</option>
            <option value="U" title="${gradeDescriptions['U']}" class="fail-grade">U</option>
            <option value="AB" title="${gradeDescriptions['AB']}" class="fail-grade">AB</option>
          </select>
          <span class="tooltip">Select grade to see description</span>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// -------------------- Method 1: Calculate SGPA --------------------
function calculateSGPA() {
  const sem = document.getElementById("semester").value;
  let totalCredits = 0;
  let totalPoints = 0;
  let hasFail = false;

  curriculum[sem].forEach((sub, index) => {
    const grade = document.getElementById(`grade-${index}`).value;
    const point = gradePoints[grade];

    if (grade === "U" || grade === "AB") hasFail = true;

    totalCredits += sub.credit;
    totalPoints += sub.credit * point;
  });

  const sgpa = (totalPoints / totalCredits).toFixed(2);
  
  // Create calculation info with tooltip for SGPA
  const sgpaResultElement = document.getElementById("result");
  sgpaResultElement.innerHTML = `
    <span class="calculation-info">
      SGPA: ${sgpa}
      <span class="calc-tooltip">SGPA = Σ(Credit × Grade Point) / ΣCredits<br>Formula: Total Points Earned / Total Credits</span>
    </span>
    ${hasFail && parseFloat(sgpa) < 5 ? '<br><span style="color:red;">⚠ Warning: SGPA below 5.0 - Academic action may be required</span>' : ''}
  `;

  document.getElementById("warning").innerText =
    hasFail ? "⚠ Semester not cleared (U / AB detected)" : "";

  // -------------------- Auto-update Quick GPA --------------------
  const quickInput = document.getElementById(`quickGpa-${sem}`);
  if (quickInput) quickInput.value = sgpa;

  // Update Quick CGPA immediately
  calculateQuickCGPA();
  
  // Also update the chart
  setTimeout(updateSgpaChart, 100);
}

// -------------------- Method 2: Quick CGPA --------------------

// Semester credits are computed based on the active `curriculum` object
let semesterCredits = {};

function computeSemesterCredits() {
  semesterCredits = {};
  // Determine the highest numbered semester available in the current curriculum
  const semKeys = Object.keys(curriculum).map(k => parseInt(k)).filter(n => !isNaN(n));
  const maxSem = semKeys.length ? Math.max(...semKeys) : 8;
  for (let sem = 1; sem <= maxSem; sem++) {
    semesterCredits[sem] = (curriculum[sem] || []).reduce((sum, sub) => sum + (sub.credit || 0), 0);
  }
}

// Generate Quick GPA table dynamically based on current semester credits
function loadQuickGpaTable() {
  const tbody = document.querySelector("#quickGpaTable tbody");
  tbody.innerHTML = "";
  const maxSem = Object.keys(semesterCredits).length ? Math.max(...Object.keys(semesterCredits).map(k=>parseInt(k))) : 8;
  for (let sem = 1; sem <= maxSem; sem++) {
    const credits = semesterCredits[sem] || 0;
    const row = `
      <tr>
        <td>Semester ${sem}</td>
        <td>${credits}</td>
        <td><input type="number" step="0.01" id="quickGpa-${sem}" placeholder="e.g. 9.23"></td>
      </tr>
    `;
    tbody.innerHTML += row;
  }
}

// Switch active regulation (called by the regulation select element)
function switchRegulation() {
  const sel = document.getElementById('regulation');
  if (!sel) return;
  const reg = sel.value;
  if (window.curriculums && window.curriculums[reg]) {
    window.curriculum = window.curriculums[reg];
    curriculum = window.curriculum; // keep compatibility
    computeSemesterCredits();
    // Reset UI tables
    loadQuickGpaTable();
    document.querySelector('#subjectsTable tbody').innerHTML = '';
    document.getElementById('result').innerText = '';
    document.getElementById('quickResult').innerText = '';
    document.getElementById('warning').innerText = '';
    // Refresh chart
    setTimeout(updateSgpaChart, 100);
  }
}

// Calculate CGPA from Quick GPA
function calculateQuickCGPA() {
  let numerator = 0;
  let denominator = 0;

  for (let sem = 1; sem <= 8; sem++) {
    const input = document.getElementById(`quickGpa-${sem}`);
    if (input && input.value) {
      const gpa = parseFloat(input.value);
      numerator += gpa * semesterCredits[sem];
      denominator += semesterCredits[sem];
    }
  }

  if (denominator === 0) {
    document.getElementById("quickResult").innerText = "Enter GPA for at least one semester.";
    return;
  }

  const cgpa = (numerator / denominator).toFixed(2);
  
  // Create calculation info with tooltip for CGPA
  const cgpaResultElement = document.getElementById("quickResult");
  cgpaResultElement.innerHTML = `
    <span class="calculation-info">
      CGPA (Quick Method): ${cgpa}
      <span class="calc-tooltip">CGPA = Σ(Semester GPA × Semester Credits) / ΣCredits<br>Formula: Weighted average of all semester GPAs</span>
    </span>
  `;
  
  // Update the chart after calculation
  setTimeout(updateSgpaChart, 100); // Delay to ensure DOM updates are complete
}

// Chart variable to store the chart instance
let sgpaChart = null;

// Function to create/update the SGPA trend chart
function updateSgpaChart() {
  const ctx = document.getElementById('sgpaChart').getContext('2d');
  
  // Destroy existing chart if it exists
  if (sgpaChart) {
    sgpaChart.destroy();
  }
  
  // Prepare data for the chart
  const chartData = [];
  const labels = [];
  
  for (let sem = 1; sem <= 8; sem++) {
    const input = document.getElementById(`quickGpa-${sem}`);
    if (input && input.value) {
      const gpa = parseFloat(input.value);
      if (!isNaN(gpa)) {
        labels.push(`Sem ${sem}`);
        chartData.push(gpa);
      }
    }
  }
  
  // Create the chart
  sgpaChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'SGPA Trend',
        data: chartData,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#2ecc71',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'SGPA Trend Across Semesters'
        },
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              return `SGPA: ${context.parsed.y}`;
            },
            title: function(context) {
              return `Semester: ${context[0].label}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 0,
          max: 10,
          title: {
            display: true,
            text: 'SGPA Value'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Semester'
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

// -------------------- PDF Export Functionality --------------------
function exportToPDF() {
  // Check if jsPDF library is loaded
  if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
    alert('PDF library not loaded yet. Please wait and try again.');
    return;
  }
  
  // Using the jsPDF library that was added to the HTML
  const { jsPDF } = window.jspdf;
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('AI & DS CGPA Report', 20, 20);
  
  // Add date
  const today = new Date();
  doc.setFontSize(12);
  doc.text(`Generated on: ${today.toDateString()} at ${today.toLocaleTimeString()}`, 20, 35);
  
  // Add SGPA section if available
  const sgpaElement = document.getElementById('result');
  if (sgpaElement && sgpaElement.textContent && sgpaElement.textContent.includes('SGPA')) {
    // Extract just the SGPA value without HTML tags
    const sgpaMatch = sgpaElement.textContent.match(/SGPA:\s*(\d+\.\d+)/);
    const sgpaValue = sgpaMatch ? sgpaMatch[1] : sgpaElement.textContent.replace('SGPA: ', '');
    
    doc.setFontSize(16);
    doc.text('Semester GPA (SGPA)', 20, 50);
    doc.setFontSize(12);
    doc.text(`SGPA: ${sgpaValue}`, 20, 60);
    
    // Add the calculation details if available
    const selectedSemester = document.getElementById('semester').value;
    if (selectedSemester) {
      // Get the subjects for the selected semester
      const subjectRows = document.querySelectorAll('#subjectsTable tbody tr');
      if (subjectRows.length > 0) {
        let calcDetailsY = 70;
        doc.setFontSize(10);
        doc.text('Course Details:', 20, calcDetailsY);
        calcDetailsY += 6;
        
        // Add header
        doc.text('Course Code | Subject | Credits | Grade | Grade Pt | Credit×Pt', 20, calcDetailsY);
        calcDetailsY += 6;
        
        let totalCredits = 0;
        let totalPoints = 0;
        
        // Add each subject with its details
        for (let i = 0; i < subjectRows.length; i++) {
          const row = subjectRows[i];
          const cells = row.querySelectorAll('td');
          if (cells.length >= 4) { // Ensure we have all the columns
            const courseCode = cells[0].textContent;
            const subjectName = cells[1].textContent;
            const creditsText = cells[2].textContent;
            const gradeSelect = cells[3].querySelector('select');
            const grade = gradeSelect ? gradeSelect.value : 'N/A';
            
            // Get grade points
            const gradePoint = gradePoints[grade] || 0;
            const credit = parseInt(creditsText) || 0;
            const creditPoints = credit * gradePoint;
            
            totalCredits += credit;
            totalPoints += creditPoints;
            
            // Truncate long subject names to fit on page
            let displaySubject = subjectName.substring(0, 12);
            if (subjectName.length > 12) displaySubject += '...';
            
            doc.text(`${courseCode} | ${displaySubject} | ${credit} | ${grade} | ${gradePoint} | ${creditPoints}`, 20, calcDetailsY);
            calcDetailsY += 5;
            
            // Check if we're approaching bottom of page
            if (calcDetailsY > 250) {
              doc.addPage();
              calcDetailsY = 20;
            }
          }
        }
        
        // Add totals and formula
        calcDetailsY += 6;
        doc.text(`Total Credits: ${totalCredits} | Total Credit Points: ${totalPoints}`, 20, calcDetailsY);
        calcDetailsY += 6;
        doc.text(`Formula: ${totalPoints} / ${totalCredits} = ${sgpaValue}`, 20, calcDetailsY);
        
        // Update yPosition for the next section
        yPosition = calcDetailsY + 10;
      }
    }
  }
  
  // Add CGPA section if available
  const cgpaElement = document.getElementById('quickResult');
  if (cgpaElement && cgpaElement.textContent && cgpaElement.textContent.includes('CGPA')) {
    // Extract just the CGPA value
    const cgpaMatch = cgpaElement.textContent.match(/CGPA.*?:\s*(\d+\.\d+)/);
    const cgpaValue = cgpaMatch ? cgpaMatch[1] : cgpaElement.textContent.replace(/CGPA.*?:\s*/, '').replace(/[^\d.]/g, '');
    
    const yPos = (sgpaElement && sgpaElement.textContent && sgpaElement.textContent.includes('SGPA')) ? yPosition : 50;
    doc.setFontSize(16);
    doc.text('Cumulative GPA (CGPA)', 20, yPos + 10);
    doc.setFontSize(12);
    doc.text(`CGPA: ${cgpaValue}`, 20, yPos + 20);
    
    // Add CGPA calculation details
    let calcDetailsY = yPos + 30;
    doc.setFontSize(10);
    doc.text('CGPA Calculation Details:', 20, calcDetailsY);
    calcDetailsY += 6;
    
    // Show semester GPAs used in CGPA calculation
    let numerator = 0;
    let denominator = 0;
    
    for (let sem = 1; sem <= 8; sem++) {
      const input = document.getElementById(`quickGpa-${sem}`);
      if (input && input.value) {
        const gpa = parseFloat(input.value);
        if (!isNaN(gpa)) {
          const semCredits = semesterCredits[sem];
          const weightedGpa = gpa * semCredits;
          numerator += weightedGpa;
          denominator += semCredits;
          
          doc.text(`Sem ${sem}: ${gpa.toFixed(2)} × ${semCredits} cr = ${weightedGpa.toFixed(2)} pts`, 20, calcDetailsY);
          calcDetailsY += 5;
          
          // Check if we're approaching bottom of page
          if (calcDetailsY > 250) {
            doc.addPage();
            calcDetailsY = 20;
          }
        }
      }
    }
    
    // Add CGPA formula
    if (denominator > 0) {
      calcDetailsY += 5;
      doc.text(`Total: ${numerator.toFixed(2)} / ${denominator} = ${cgpaValue}`, 20, calcDetailsY);
      calcDetailsY += 5;
      doc.text(`Formula: CGPA = Σ(Semester GPA × Semester Credits) / ΣCredits`, 20, calcDetailsY);
      
      // Update yPosition for the next section
      yPosition = calcDetailsY + 15;
    }
  }
  
  // The yPosition was already set in the SGPA and CGPA sections above, so we continue from there

  // We already covered the detailed semester information in the previous sections
  // So we'll skip duplicating that information and move to the calculation notes
  // Just make sure we have adequate spacing
  yPosition += 20;
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(12);
  doc.text('Calculation Notes:', 20, yPosition);
  doc.setFontSize(10);
  doc.text('• SGPA = Σ(Credit × Grade Point) / ΣCredits', 20, yPosition + 8);
  doc.text('• CGPA = Σ(Semester GPA × Semester Credits) / ΣCredits', 20, yPosition + 16);

  // Save the PDF
  doc.save('CGPA_Report.pdf');
}

// Add event listener for PDF export button
// Wait for jsPDF library to be loaded before attaching event
function attachPdfButtonListener() {
  if (typeof window.jspdf !== 'undefined' && typeof window.jspdf.jsPDF !== 'undefined') {
    const pdfBtn = document.getElementById('pdfExportBtn');
    if(pdfBtn) {
      pdfBtn.addEventListener('click', exportToPDF);
    }
  } else {
    // Retry after a short delay
    setTimeout(attachPdfButtonListener, 500);
  }
}

// Try to attach the listener when DOM is loaded
window.addEventListener('DOMContentLoaded', attachPdfButtonListener);

// Also try to attach when the window fully loads
window.addEventListener('load', attachPdfButtonListener);

// -------------------- Initialize on Page Load --------------------
window.onload = () => {
  // Ensure the regulation selector (if present) matches the default curriculum
  const regSel = document.getElementById('regulation');
  if (regSel && window.curriculums) {
    // default to 2021 if available
    regSel.value = window.curriculums['2021'] ? '2021' : Object.keys(window.curriculums)[0];
  }

  computeSemesterCredits();
  loadQuickGpaTable();

  // Initialize chart after a brief delay to ensure DOM is ready
  setTimeout(updateSgpaChart, 500);
};
