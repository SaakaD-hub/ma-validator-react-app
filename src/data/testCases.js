// ─────────────────────────────────────────────────────────────────────────────
// MA Immunization Validator — Test Cases
//
// schoolYear values MUST match application.yml exactly:
//   "preschool" | "K-6" | "7-10" | "11-12" | "college"
//
// Immunizations use cvxCode (integer) — NOT vaccineCode (string)
//
// CVX Code Reference:
//   3   = MMR
//   8   = HepB (single antigen)
//   10  = IPV / Polio
//   20  = DTaP (single antigen)
//   21  = Varicella
//   49  = Hib (single antigen)
//   110 = Pediarix  → splits into DTaP + HepB + IPV
//   115 = Tdap
//   120 = Pentacel  → splits into DTaP + Hib + IPV
//   130 = Kinrix    → splits into DTaP + IPV
//   136 = MenACWY-D (Menactra)
//   147 = MenACWY-CRM (Menveo)
//   189 = Heplisav-B (2-dose adult HepB)
// ─────────────────────────────────────────────────────────────────────────────

export const TEST_CASES = {

  // ── System ────────────────────────────────────────────────────────────────
  health: {
    name: "Health Check",
    method: "GET",
    endpoint: "/api/v1/validate/health",
    category: "System",
    description: "Verify API is running and healthy"
  },

  // ── PRESCHOOL ─────────────────────────────────────────────────────────────
  // Requirements: Hib(4), DTaP(4), Polio(3), HepB(3),
  //               MMR(1 on/after 1st bday), Varicella(1 on/after 1st bday)

  preschoolFullyValid: {
    name: "Preschool - Fully Valid",
    category: "Preschool",
    description: "All 6 requirements via real-world combo vaccines CVX 120 + HepB + MMR + Varicella",
    state: "MA",
    schoolYear: "preschool",
    patient: {
      id: "preschool-fully-valid",
      birthDate: "2021-06-15",
      immunization: [
        { cvxCode: 120, occurrenceDateTime: "2021-09-15" }, // Pentacel: DTaP+Hib+IPV dose 1
        { cvxCode: 120, occurrenceDateTime: "2021-11-15" }, // Pentacel: DTaP+Hib+IPV dose 2
        { cvxCode: 120, occurrenceDateTime: "2022-01-15" }, // Pentacel: DTaP+Hib+IPV dose 3
        { cvxCode: 120, occurrenceDateTime: "2022-07-15" }, // Pentacel: DTaP+Hib+IPV dose 4
        { cvxCode: 8,   occurrenceDateTime: "2021-09-15" }, // HepB dose 1
        { cvxCode: 8,   occurrenceDateTime: "2021-11-15" }, // HepB dose 2
        { cvxCode: 8,   occurrenceDateTime: "2022-07-15" }, // HepB dose 3
        { cvxCode: 3,   occurrenceDateTime: "2022-07-15" }, // MMR — after 1st birthday (2022-06-15)
        { cvxCode: 21,  occurrenceDateTime: "2022-07-15" }  // Varicella — after 1st birthday
      ],
      exceptions: []
    },
    expectedResult: "VALID — 6/6 satisfied"
  },

  preschoolHibValid: {
    name: "Preschool - Hib Valid",
    category: "Preschool",
    description: "4-dose Hib series using single antigen CVX 49",
    state: "MA",
    schoolYear: "preschool",
    patient: {
      id: "preschool-hib-single",
      birthDate: "2021-06-15",
      immunization: [
        { cvxCode: 49, occurrenceDateTime: "2021-09-15" },
        { cvxCode: 49, occurrenceDateTime: "2021-11-15" },
        { cvxCode: 49, occurrenceDateTime: "2022-01-15" },
        { cvxCode: 49, occurrenceDateTime: "2022-07-15" }
      ],
      exceptions: []
    },
    expectedResult: "VALID — Hib 4-dose satisfied"
  },

  mmrEdgeValid: {
    name: "MMR ON 1st Birthday ⭐",
    category: "Preschool",
    description: "BOUNDARY: MMR given EXACTLY on 1st birthday — should PASS",
    state: "MA",
    schoolYear: "preschool",
    patient: {
      id: "mmr-on-birthday",
      birthDate: "2021-06-15",
      immunization: [
        { cvxCode: 3, occurrenceDateTime: "2022-06-15" } // exactly on 1st birthday
      ],
      exceptions: []
    },
    expectedResult: "VALID — MMR on exact 1st birthday"
  },

  mmrInvalid: {
    name: "MMR BEFORE 1st Birthday",
    category: "Preschool",
    description: "BOUNDARY: MMR given 1 day BEFORE 1st birthday — should FAIL",
    state: "MA",
    schoolYear: "preschool",
    patient: {
      id: "mmr-before-birthday",
      birthDate: "2021-06-15",
      immunization: [
        { cvxCode: 3, occurrenceDateTime: "2022-06-14" } // 1 day before 1st birthday
      ],
      exceptions: []
    },
    expectedResult: "INVALID — MMR before 1st birthday"
  },

  religiousExemption: {
    name: "Religious Exemption",
    category: "Preschool",
    description: "DTaP exempted via RELIGIOUS_EXEMPTION — should be VALID",
    state: "MA",
    schoolYear: "preschool",
    patient: {
      id: "preschool-religious-exempt",
      birthDate: "2021-06-15",
      immunization: [],
      exceptions: [
        { vaccineCode: "DTaP", exceptionType: "RELIGIOUS_EXEMPTION" }
      ]
    },
    expectedResult: "VALID — DTaP exempted"
  },

  // ── K-6 ───────────────────────────────────────────────────────────────────
  // schoolYear: "K-6"  ← capital K, dash, 6 — must match YAML exactly
  // Requirements: DTaP(5 or 4 if 4th on/after 4th bday), Polio(4),
  //               HepB(3), MMR(2 ≥28d apart), Varicella(2 ≥28d apart)

  k6FullyValid: {
    name: "K-6 - Fully Valid",
    category: "K-6",
    description: "All 5 K-6 requirements via CVX 120 + 110 + 130 combo vaccines",
    state: "MA",
    schoolYear: "K-6",
    patient: {
      id: "k6-fully-valid",
      birthDate: "2016-03-10",
      immunization: [
        { cvxCode: 120, occurrenceDateTime: "2016-06-10" }, // Pentacel: DTaP+Hib+IPV dose 1
        { cvxCode: 120, occurrenceDateTime: "2016-08-10" }, // Pentacel: DTaP+Hib+IPV dose 2
        { cvxCode: 120, occurrenceDateTime: "2016-10-10" }, // Pentacel: DTaP+Hib+IPV dose 3
        //{ cvxCode: 110, occurrenceDateTime: "2017-03-10" }, // Pediarix: DTaP+HepB+IPV dose 4
        { cvxCode: 130, occurrenceDateTime: "2020-06-10" }, // Kinrix: DTaP+IPV dose 5 (after 4th bday)
        { cvxCode: 8,   occurrenceDateTime: "2016-06-10" }, // HepB dose 1
        { cvxCode: 8,   occurrenceDateTime: "2016-08-10" }, // HepB dose 2
        { cvxCode: 8,   occurrenceDateTime: "2017-03-10" }, // HepB dose 3
        { cvxCode: 3,   occurrenceDateTime: "2017-04-10" }, // MMR dose 1 (after 1st bday)
        { cvxCode: 3,   occurrenceDateTime: "2022-06-01" }, // MMR dose 2 (28+ days later)
        { cvxCode: 21,  occurrenceDateTime: "2017-04-10" }, // Varicella dose 1
        { cvxCode: 21,  occurrenceDateTime: "2022-06-01" }  // Varicella dose 2
      ],
      exceptions: []
    },
    expectedResult: "VALID — 5/5 satisfied"
  },

  sarahJohnson: {
    name: "🔴 SARAH JOHNSON BUG",
    category: "K-6",
    critical: true,
    description: "CRITICAL: 4th DTaP ONE DAY before 4th birthday — must require 5th dose",
    state: "MA",
    schoolYear: "K-6",
    patient: {
      id: "sarah-johnson",
      birthDate: "2016-03-10",
      immunization: [
        { cvxCode: 20, occurrenceDateTime: "2016-06-10" },
        { cvxCode: 20, occurrenceDateTime: "2016-08-10" },
        { cvxCode: 20, occurrenceDateTime: "2016-10-10" },
        { cvxCode: 20, occurrenceDateTime: "2020-03-09" } // 1 day BEFORE 4th birthday (2020-03-10)
      ],
      exceptions: []
    },
    expectedResult: "INVALID — 4th DTaP before 4th birthday, needs 5th dose"
  },

  dtapOnBirthday: {
    name: "DTaP 4th ON 4th Birthday ⭐",
    category: "K-6",
    description: "BOUNDARY: 4th DTaP EXACTLY on 4th birthday — 4-dose alternate accepted",
    state: "MA",
    schoolYear: "K-6",
    patient: {
      id: "dtap-on-4th-birthday",
      birthDate: "2016-03-10",
      immunization: [
        { cvxCode: 20, occurrenceDateTime: "2016-06-10" },
        { cvxCode: 20, occurrenceDateTime: "2016-08-10" },
        { cvxCode: 20, occurrenceDateTime: "2016-10-10" },
        { cvxCode: 20, occurrenceDateTime: "2020-03-10" } // exactly on 4th birthday
      ],
      exceptions: []
    },
    expectedResult: "VALID — 4-dose alternate accepted"
  },

  dtapPrimaryRequirement: {
    name: "DTaP Primary Requirement",
    category: "K-6",
    description: "5-dose DTaP primary path — no birthday condition needed",
    state: "MA",
    schoolYear: "K-6",
    patient: {
      id: "dtap-5doses",
      birthDate: "2016-03-10",
      immunization: [
        { cvxCode: 20, occurrenceDateTime: "2016-06-10" },
        { cvxCode: 20, occurrenceDateTime: "2016-08-10" },
        { cvxCode: 20, occurrenceDateTime: "2016-10-10" },
        { cvxCode: 20, occurrenceDateTime: "2016-12-10" },
        { cvxCode: 20, occurrenceDateTime: "2020-03-09" } // 5th dose — primary path satisfied
      ],
      exceptions: []
    },
    expectedResult: "VALID — 5-dose primary satisfied"
  },

  mmrIntervalValid: {
    name: "MMR 28 Days Interval ⭐",
    category: "K-6",
    description: "BOUNDARY: MMR 2 doses exactly 28 days apart — should PASS",
    state: "MA",
    schoolYear: "K-6",
    patient: {
      id: "mmr-interval-valid",
      birthDate: "2016-03-10",
      immunization: [
        { cvxCode: 3, occurrenceDateTime: "2017-04-10" }, // dose 1 (after 1st bday)
        { cvxCode: 3, occurrenceDateTime: "2017-05-08" }  // dose 2 exactly 28 days later
      ],
      exceptions: []
    },
    expectedResult: "VALID — 28-day interval met"
  },

  mmrIntervalInvalid: {
    name: "MMR 14 Days (Invalid)",
    category: "K-6",
    description: "BOUNDARY: MMR 2 doses only 14 days apart — should FAIL",
    state: "MA",
    schoolYear: "K-6",
    patient: {
      id: "mmr-interval-invalid",
      birthDate: "2016-03-10",
      immunization: [
        { cvxCode: 3, occurrenceDateTime: "2017-04-10" }, // dose 1
        { cvxCode: 3, occurrenceDateTime: "2017-04-24" }  // dose 2 only 14 days later
      ],
      exceptions: []
    },
    expectedResult: "INVALID — interval only 14 days (need 28)"
  },

  // ── GRADES 7-10 ───────────────────────────────────────────────────────────
  // schoolYear: "7-10"
  // Requirements: Tdap(1), Polio(4), HepB(3), MMR(2), Varicella(2),
  //               MenACWY(1 on/after 10th birthday)

  grade7Valid: {
    name: "Grades 7-10 Valid",
    category: "Grades 7-10",
    description: "All 6 requirements including MenACWY after 10th birthday",
    state: "MA",
    schoolYear: "7-10",
    patient: {
      id: "g710-fully-valid",
      birthDate: "2011-09-05",
      immunization: [
        { cvxCode: 115, occurrenceDateTime: "2023-09-01" }, // Tdap (after 7th bday)
        { cvxCode: 10,  occurrenceDateTime: "2011-12-05" }, // Polio dose 1
        { cvxCode: 10,  occurrenceDateTime: "2012-02-05" }, // Polio dose 2
        { cvxCode: 10,  occurrenceDateTime: "2012-04-05" }, // Polio dose 3
        { cvxCode: 10,  occurrenceDateTime: "2015-11-05" }, // Polio dose 4 (after 4th bday)
        { cvxCode: 8,   occurrenceDateTime: "2011-12-05" }, // HepB dose 1
        { cvxCode: 8,   occurrenceDateTime: "2012-02-05" }, // HepB dose 2
        { cvxCode: 8,   occurrenceDateTime: "2012-08-05" }, // HepB dose 3
        { cvxCode: 3,   occurrenceDateTime: "2012-10-05" }, // MMR dose 1
        { cvxCode: 3,   occurrenceDateTime: "2017-09-01" }, // MMR dose 2
        { cvxCode: 21,  occurrenceDateTime: "2012-10-05" }, // Varicella dose 1
        { cvxCode: 21,  occurrenceDateTime: "2017-09-01" }, // Varicella dose 2
        { cvxCode: 136, occurrenceDateTime: "2022-01-10" }  // MenACWY after 10th bday (2021-09-05)
      ],
      exceptions: []
    },
    expectedResult: "VALID — 6/6 satisfied"
  },

  grade7MissingMenACWY: {
    name: "Grade 7-10 Missing MenACWY",
    category: "Grades 7-10",
    description: "NEGATIVE: All vaccines present except MenACWY",
    state: "MA",
    schoolYear: "7-10",
    patient: {
      id: "g710-no-menacwy",
      birthDate: "2011-09-05",
      immunization: [
        { cvxCode: 115, occurrenceDateTime: "2023-09-01" },
        { cvxCode: 10,  occurrenceDateTime: "2011-12-05" },
        { cvxCode: 10,  occurrenceDateTime: "2012-02-05" },
        { cvxCode: 10,  occurrenceDateTime: "2012-04-05" },
        { cvxCode: 10,  occurrenceDateTime: "2015-11-05" },
        { cvxCode: 8,   occurrenceDateTime: "2011-12-05" },
        { cvxCode: 8,   occurrenceDateTime: "2012-02-05" },
        { cvxCode: 8,   occurrenceDateTime: "2012-08-05" },
        { cvxCode: 3,   occurrenceDateTime: "2012-10-05" },
        { cvxCode: 3,   occurrenceDateTime: "2017-09-01" },
        { cvxCode: 21,  occurrenceDateTime: "2012-10-05" },
        { cvxCode: 21,  occurrenceDateTime: "2017-09-01" }
        // NO MenACWY
      ],
      exceptions: []
    },
    expectedResult: "INVALID — MenACWY missing"
  },

  // ── GRADES 11-12 ──────────────────────────────────────────────────────────
  // schoolYear: "11-12"
  // Requirements: Tdap(1), Polio(4), HepB(3), MMR(2), Varicella(2),
  //               MenACWY: 2 doses (2nd on/after 16th bday + ≥8 weeks)
  //                     OR: 1 dose if given on/after 16th birthday

  grade11AlternateValid: {
    name: "Grades 11-12 Alternate Valid",
    category: "Grades 11-12",
    description: "1 MenACWY dose AFTER 16th birthday — satisfies alternate path",
    state: "MA",
    schoolYear: "11-12",
    patient: {
      id: "g1112-menacwy-single-alt",
      birthDate: "2008-04-20",
      immunization: [
        { cvxCode: 136, occurrenceDateTime: "2024-05-01" } // after 16th birthday (2024-04-20)
      ],
      exceptions: []
    },
    expectedResult: "VALID — 1-dose alternate after 16th birthday"
  },

  grade11PrimaryValid: {
    name: "Grades 11-12 Primary Valid",
    category: "Grades 11-12",
    description: "Full 2-dose MenACWY: 2nd dose after 16th birthday + ≥8 weeks after 1st",
    state: "MA",
    schoolYear: "11-12",
    patient: {
      id: "g1112-primary-valid",
      birthDate: "2008-04-20",
      immunization: [
        { cvxCode: 115, occurrenceDateTime: "2022-09-01" }, // Tdap
        { cvxCode: 10,  occurrenceDateTime: "2008-07-20" }, // Polio 1
        { cvxCode: 10,  occurrenceDateTime: "2008-09-20" }, // Polio 2
        { cvxCode: 10,  occurrenceDateTime: "2008-11-20" }, // Polio 3
        { cvxCode: 10,  occurrenceDateTime: "2012-06-20" }, // Polio 4 (after 4th bday)
        { cvxCode: 8,   occurrenceDateTime: "2008-07-20" }, // HepB 1
        { cvxCode: 8,   occurrenceDateTime: "2008-09-20" }, // HepB 2
        { cvxCode: 8,   occurrenceDateTime: "2009-04-20" }, // HepB 3
        { cvxCode: 3,   occurrenceDateTime: "2009-05-20" }, // MMR 1
        { cvxCode: 3,   occurrenceDateTime: "2014-09-01" }, // MMR 2
        { cvxCode: 21,  occurrenceDateTime: "2009-05-20" }, // Varicella 1
        { cvxCode: 21,  occurrenceDateTime: "2014-09-01" }, // Varicella 2
        { cvxCode: 136, occurrenceDateTime: "2019-06-01" }, // MenACWY dose 1
        { cvxCode: 136, occurrenceDateTime: "2024-06-15" }  // MenACWY dose 2 (after 16th bday + 8 weeks)
      ],
      exceptions: []
    },
    expectedResult: "VALID — 6/6 satisfied"
  },

  // ── COLLEGE ───────────────────────────────────────────────────────────────
  // schoolYear: "college"
  // Requirements: Tdap(1), HepB(3), MMR(2), Varicella(2),
  //               MenACWY(1 if ≤21 and on/after 16th birthday)

  collegeValid: {
    name: "College Valid",
    category: "College",
    description: "All 5 college requirements satisfied",
    state: "MA",
    schoolYear: "college",
    patient: {
      id: "college-fully-valid",
      birthDate: "2004-08-12",
      immunization: [
        { cvxCode: 115, occurrenceDateTime: "2020-09-01" }, // Tdap
        { cvxCode: 8,   occurrenceDateTime: "2004-11-12" }, // HepB 1
        { cvxCode: 8,   occurrenceDateTime: "2005-01-12" }, // HepB 2
        { cvxCode: 8,   occurrenceDateTime: "2005-08-12" }, // HepB 3
        { cvxCode: 3,   occurrenceDateTime: "2005-09-12" }, // MMR 1 (after 1st bday)
        { cvxCode: 3,   occurrenceDateTime: "2010-09-01" }, // MMR 2
        { cvxCode: 21,  occurrenceDateTime: "2005-09-12" }, // Varicella 1
        { cvxCode: 21,  occurrenceDateTime: "2010-09-01" }, // Varicella 2
        { cvxCode: 136, occurrenceDateTime: "2021-09-01" }  // MenACWY after 16th bday (2020-08-12)
      ],
      exceptions: []
    },
    expectedResult: "VALID — 5/5 satisfied"
  },

  collegeVaricellaValid: {
    name: "College Varicella Valid",
    category: "College",
    description: "Varicella exempted via BIRTH_BEFORE_1980",
    state: "MA",
    schoolYear: "college",
    patient: {
      id: "college-varicella-1980",
      birthDate: "1979-06-01",
      immunization: [],
      exceptions: [
        { vaccineCode: "Varicella", exceptionType: "BIRTH_BEFORE_1980" }
      ]
    },
    expectedResult: "VALID — Varicella exempted by birth year"
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// BATCH SCENARIOS
//
// FLAT structure — App.js reads directly from top level:
//   scenario.state, scenario.schoolYear, scenario.patients
//
// Each patient uses:
//   id, birthDate, immunization (cvxCode array), exceptions
// ─────────────────────────────────────────────────────────────────────────────

export const BATCH_SCENARIOS = {

  mixedValidation: {
    name: "Mixed Validation - Valid & Invalid",
    description: "K-6: Patient 1 VALID (full doses), Patient 2 INVALID (only MMR)",
    state: "MA",
    schoolYear: "K-6",
    responseMode: "detailed",
    patients: [
      {
        id: "batch-valid-k6",
        birthDate: "2016-03-10",
        immunization: [
          { cvxCode: 120, occurrenceDateTime: "2016-06-10" },
          { cvxCode: 120, occurrenceDateTime: "2016-08-10" },
          { cvxCode: 120, occurrenceDateTime: "2016-10-10" },
          //{ cvxCode: 110, occurrenceDateTime: "2017-03-10" },
          { cvxCode: 130, occurrenceDateTime: "2020-06-10" },
          { cvxCode: 8,   occurrenceDateTime: "2016-06-10" },
          { cvxCode: 8,   occurrenceDateTime: "2016-08-10" },
          { cvxCode: 8,   occurrenceDateTime: "2017-03-10" },
          { cvxCode: 3,   occurrenceDateTime: "2017-04-10" },
          { cvxCode: 3,   occurrenceDateTime: "2022-06-01" },
          { cvxCode: 21,  occurrenceDateTime: "2017-04-10" },
          { cvxCode: 21,  occurrenceDateTime: "2022-06-01" }
        ],
        exceptions: []
      },
      {
        id: "batch-invalid-k6",
        birthDate: "2016-03-10",
        immunization: [
          { cvxCode: 3, occurrenceDateTime: "2017-04-10" },
          { cvxCode: 3, occurrenceDateTime: "2022-06-01" }
        ],
        exceptions: []
      }
    ],
    expectedResults: { totalPatients: 2, validCount: 1, invalidCount: 1 }
  },

  preschoolBatch: {
    name: "Preschool Batch",
    description: "Two preschool students both VALID via combo CVX codes",
    state: "MA",
    schoolYear: "preschool",
    responseMode: "detailed",
    patients: [
      {
        id: "preschool-batch-1",
        birthDate: "2021-01-10",
        immunization: [
          { cvxCode: 120, occurrenceDateTime: "2021-04-10" },
          { cvxCode: 120, occurrenceDateTime: "2021-06-10" },
          { cvxCode: 120, occurrenceDateTime: "2021-08-10" },
          { cvxCode: 120, occurrenceDateTime: "2022-01-15" },
          { cvxCode: 8,   occurrenceDateTime: "2021-04-10" },
          { cvxCode: 8,   occurrenceDateTime: "2021-06-10" },
          { cvxCode: 8,   occurrenceDateTime: "2022-01-15" },
          { cvxCode: 3,   occurrenceDateTime: "2022-02-01" }, // after 1st bday (2022-01-10)
          { cvxCode: 21,  occurrenceDateTime: "2022-02-01" }
        ],
        exceptions: []
      },
      {
        id: "preschool-batch-2",
        birthDate: "2020-06-20",
        immunization: [
          { cvxCode: 120, occurrenceDateTime: "2020-09-20" },
          { cvxCode: 120, occurrenceDateTime: "2020-11-20" },
          { cvxCode: 120, occurrenceDateTime: "2021-01-20" },
          { cvxCode: 120, occurrenceDateTime: "2021-07-01" },
          { cvxCode: 8,   occurrenceDateTime: "2020-09-20" },
          { cvxCode: 8,   occurrenceDateTime: "2020-11-20" },
          { cvxCode: 8,   occurrenceDateTime: "2021-07-01" },
          { cvxCode: 3,   occurrenceDateTime: "2021-07-01" }, // after 1st bday (2021-06-20)
          { cvxCode: 21,  occurrenceDateTime: "2021-07-01" }
        ],
        exceptions: []
      }
    ],
    expectedResults: { totalPatients: 2, validCount: 2, invalidCount: 0 }
  },

  edgeCasesBatch: {
    name: "Edge Cases Batch",
    description: "K-6: Sarah Johnson INVALID + Full Exemption VALID + DTaP on birthday VALID",
    state: "MA",
    schoolYear: "K-6",
    responseMode: "detailed",
    patients: [
      {
        id: "edge-sarah-johnson",
        birthDate: "2016-03-10",
        immunization: [
          { cvxCode: 20, occurrenceDateTime: "2016-06-10" },
          { cvxCode: 20, occurrenceDateTime: "2016-08-10" },
          { cvxCode: 20, occurrenceDateTime: "2016-10-10" },
          { cvxCode: 20, occurrenceDateTime: "2020-03-09" } // 1 day before 4th birthday
        ],
        exceptions: []
      },
      {
        id: "edge-full-exemption",
        birthDate: "2016-03-10",
        immunization: [],
        exceptions: [
          { vaccineCode: "DTaP",      exceptionType: "RELIGIOUS_EXEMPTION" },
          { vaccineCode: "Polio",     exceptionType: "RELIGIOUS_EXEMPTION" },
          { vaccineCode: "HepB",      exceptionType: "RELIGIOUS_EXEMPTION" },
          { vaccineCode: "MMR",       exceptionType: "RELIGIOUS_EXEMPTION" },
          { vaccineCode: "Varicella", exceptionType: "RELIGIOUS_EXEMPTION" }
        ]
      },
      {
        id: "edge-dtap-on-birthday",
        birthDate: "2016-03-10",
        immunization: [
          { cvxCode: 20, occurrenceDateTime: "2016-06-10" },
          { cvxCode: 20, occurrenceDateTime: "2016-08-10" },
          { cvxCode: 20, occurrenceDateTime: "2016-10-10" },
          { cvxCode: 20, occurrenceDateTime: "2020-03-10" } // exactly on 4th birthday
        ],
        exceptions: []
      }
    ],
    expectedResults: { totalPatients: 3, validCount: 2, invalidCount: 1 }
  },

  grade7to12Batch: {
    name: "Grades 7-12 Batch",
    description: "Grades 7-10: Patient 1 VALID (with MenACWY), Patient 2 INVALID (no MenACWY)",
    state: "MA",
    schoolYear: "7-10",
    responseMode: "detailed",
    patients: [
      {
        id: "g710-fully-valid",
        birthDate: "2011-09-05",
        immunization: [
          { cvxCode: 115, occurrenceDateTime: "2023-09-01" },
          { cvxCode: 10,  occurrenceDateTime: "2011-12-05" },
          { cvxCode: 10,  occurrenceDateTime: "2012-02-05" },
          { cvxCode: 10,  occurrenceDateTime: "2012-04-05" },
          { cvxCode: 10,  occurrenceDateTime: "2015-11-05" },
          { cvxCode: 8,   occurrenceDateTime: "2011-12-05" },
          { cvxCode: 8,   occurrenceDateTime: "2012-02-05" },
          { cvxCode: 8,   occurrenceDateTime: "2012-08-05" },
          { cvxCode: 3,   occurrenceDateTime: "2012-10-05" },
          { cvxCode: 3,   occurrenceDateTime: "2017-09-01" },
          { cvxCode: 21,  occurrenceDateTime: "2012-10-05" },
          { cvxCode: 21,  occurrenceDateTime: "2017-09-01" },
          { cvxCode: 136, occurrenceDateTime: "2022-01-10" } // MenACWY after 10th bday
        ],
        exceptions: []
      },
      {
        id: "g710-missing-menacwy",
        birthDate: "2011-09-05",
        immunization: [
          { cvxCode: 115, occurrenceDateTime: "2023-09-01" },
          { cvxCode: 10,  occurrenceDateTime: "2011-12-05" },
          { cvxCode: 10,  occurrenceDateTime: "2012-02-05" },
          { cvxCode: 10,  occurrenceDateTime: "2012-04-05" },
          { cvxCode: 10,  occurrenceDateTime: "2015-11-05" },
          { cvxCode: 8,   occurrenceDateTime: "2011-12-05" },
          { cvxCode: 8,   occurrenceDateTime: "2012-02-05" },
          { cvxCode: 8,   occurrenceDateTime: "2012-08-05" },
          { cvxCode: 3,   occurrenceDateTime: "2012-10-05" },
          { cvxCode: 3,   occurrenceDateTime: "2017-09-01" },
          { cvxCode: 21,  occurrenceDateTime: "2012-10-05" },
          { cvxCode: 21,  occurrenceDateTime: "2017-09-01" }
          // NO MenACWY
        ],
        exceptions: []
      }
    ],
    expectedResults: { totalPatients: 2, validCount: 1, invalidCount: 1 }
  }
};

export default { TEST_CASES, BATCH_SCENARIOS };