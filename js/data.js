// Collection of curriculums keyed by regulation year
const curriculums = {
  "2021": {
    1: [
      { code: "21EN101", name: "Professional English – I", credit: 4 },
      { code: "21MA101", name: "Matrices and Calculus", credit: 4 },
      { code: "21PH101", name: "Engineering Physics", credit: 3 },
      { code: "21CH101", name: "Engineering Chemistry", credit: 3 },
      { code: "21CS101", name: "Problem Solving and Python Programming", credit: 3 },
      { code: "21TA101", name: "Heritage of Tamils", credit: 1 },
      { code: "21CS102", name: "Problem Solving and Python Programming Laboratory", credit: 2 },
      { code: "21PC101", name: "Physics and Chemistry Laboratory", credit: 2 }
    ],

    2: [
      { code: "21EN102", name: "English – II", credit: 3 },
      { code: "21MA103", name: "Sampling Techniques and Numerical Methods", credit: 4 },
      { code: "21PH103", name: "Physics for Information Science", credit: 3 },
      { code: "21ME101", name: "Engineering Graphics", credit: 3 },
      { code: "21EE104", name: "Basic Electrical and Electronics Engineering for Information Science", credit: 3 },
      { code: "21AD101", name: "Programming Paradigm in C", credit: 3 },
      { code: "21CH103", name: "Environmental Science", credit: 2 },
      { code: "21TA102", name: "Tamils and Technology", credit: 1 },
      { code: "21EM101", name: "Engineering Practices Laboratory", credit: 2 },
      { code: "21AD102", name: "Programming Paradigm in C Laboratory", credit: 2 }
    ],

    3: [
      { code: "21MA203", name: "Discrete Mathematics", credit: 4 },
      { code: "21AD201", name: "Operating System Principles", credit: 3 },
      { code: "21AD203", name: "Data Structure Design using Python", credit: 3 },
      { code: "21AD205", name: "Principles of Artificial Intelligence", credit: 3 },
      { code: "21AD206", name: "Software Engineering Principles and Design", credit: 3 },
      { code: "21AD202", name: "Operating System Principles Laboratory", credit: 2 },
      { code: "21AD204", name: "Data Structure Design using Python Laboratory", credit: 2 }
    ],

    4: [
      { code: "21MA208", name: "Probability and Statistics", credit: 4 },
      { code: "21AD207", name: "Analysis of Algorithms", credit: 3 },
      { code: "21AD208", name: "Database Design and Engineering", credit: 3 },
      { code: "21AD210", name: "Computer Networking Principles", credit: 3 },
      { code: "21AD212", name: "Principles of Machine Learning", credit: 3 },
      { code: "21AD209", name: "Database Design and Engineering Laboratory", credit: 2 },
      { code: "21AD211", name: "Computer Networking Principles Laboratory", credit: 2 },
      { code: "21AD213", name: "Machine Learning Laboratory", credit: 2 }
    ],

    5: [
      { code: "21AD301", name: "Deep Learning Techniques", credit: 3 },
      { code: "21AD302", name: "Data Science and Analytics", credit: 3 },
      { code: "21AD304", name: "Full Stack Development", credit: 3 },
      { code: "21PADXX", name: "Professional Elective I", credit: 3 },
      { code: "21PADXX", name: "Professional Elective II", credit: 3 },
      { code: "21MCC01", name: "Constitution of India", credit: 0 },
      { code: "21EE001", name: "Internship", credit: 1 },
      { code: "21AD303", name: "Data Science and Analytics Laboratory", credit: 2 },
      { code: "21AD305", name: "Full Stack Development Laboratory", credit: 2 },
      { code: "21EN301", name: "Professional Communication Laboratory", credit: 1 }
    ],

    6: [
      { code: "21AD306", name: "Natural Language Processing", credit: 3 },
      { code: "21PADXX", name: "Professional Elective III", credit: 3 },
      { code: "21PADXX", name: "Professional Elective IV", credit: 3 },
      { code: "21OEXXX", name: "Open Elective I", credit: 3 },
      { code: "21OEXXX", name: "Open Elective II", credit: 3 },
      { code: "21MCC02", name: "Essence of Indian Traditional Knowledge", credit: 0 },
      { code: "21OCADXX", name: "One Credit Course", credit: 1 },
      { code: "21AD308", name: "Computer Vision", credit: 3 },
      { code: "21AD307", name: "Natural Language Processing Laboratory", credit: 2 }
    ],

    7: [
      { code: "21AD401", name: "Data Visualization", credit: 3 },
      { code: "21OEXXX", name: "Open Elective III", credit: 3 },
      { code: "21OEXXX", name: "Open Elective IV", credit: 3 },
      { code: "21AD402", name: "Data Visualization Laboratory", credit: 2 },
      { code: "21AD403", name: "Project Work I", credit: 2 }
    ],

    8: [
      { code: "21PADXX", name: "Professional Elective V", credit: 3 },
      { code: "21PADXX", name: "Professional Elective VI", credit: 3 },
      { code: "21AD404", name: "Project Work II", credit: 10 }
    ]
  },

  "2025": {
    // Semester 1 (Regulations 2025)
    1: [
      
      { code: "EN25C01", name: "Technical English", credit: 3 },
      { code: "MA25C01", name: "Linear Algebra and Calculus", credit: 4 },
      { code: "PH25C01", name: "Engineering Physics", credit: 3 },
      { code: "CH25C01", name: "Engineering Chemistry", credit: 3 },
      { code: "CS25C01", name: "Problem Solving using C Programming", credit: 3 },
      { code: "ME25C01", name: "Engineering Graphics and Design", credit: 3 },
      { code: "TA25C01", name: "Heritage of Tamils", credit: 1 },
      // Practicals
      { code: "CS25C02", name: "Programming in C Laboratory", credit: 2 },
      { code: "PC25C01", name: "Physics and Chemistry Laboratory", credit: 2 }
    ],

    // Semester 2 (Regulations 2025)
    2: [
      { code: "EN25C02", name: "English Proficiency and Soft Skill", credit: 3 },
      { code: "MA25C03", name: "Probability and Statistics", credit: 4 },
      { code: "PH25C02", name: "Physics for Information Science", credit: 3 },
      { code: "EE25Z01", name: "Digital Electronics and Measurements", credit: 4 },
      { code: "CS25C03", name: "Python with Foundation of Data Science", credit: 3 },
      { code: "CH25C02", name: "Environmental Science", credit: 2 },
      { code: "TA25C02", name: "Tamils and Technology", credit: 1 },
      // Practicals
      { code: "EE25Z05", name: "Digital Electronics and Measurements Laboratory", credit: 2 },
      { code: "CS25C04", name: "Python with Foundation of Data Science Laboratory", credit: 2 }
    ]
  }
};

// Expose the curriculums and set default active curriculum to 2021 for backward compatibility
window.curriculums = curriculums;
window.curriculum = curriculums["2021"];
// also provide a `curriculum` variable for older code to reference
var curriculum = window.curriculum;
