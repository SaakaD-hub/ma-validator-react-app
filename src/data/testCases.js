// All test cases for MA Immunization Validator
export const TEST_CASES = {
  health: {
    name: "Health Check",
    method: "GET",
    endpoint: "/api/v1/validate/health",
    category: "System",
    description: "Verify API is running and healthy"
  },
  
  // ============= PRESCHOOL TESTS =============
  preschoolHibValid: {
    name: "Preschool - Hib Valid",
    category: "Preschool",
    description: "1 Hib dose satisfies preschool requirement",
    data: {
      id: "preschool-001",
      birthDate: "2022-03-15",
      immunization: [
        { vaccineCode: "Hib", occurrenceDateTime: "2022-05-15" }
      ]
    },
    params: { state: "MA", schoolYear: "preschool", responseMode: "detailed" },
    expectedResult: { valid: true }
  },
  
  preschoolDTaPValid: {
    name: "Preschool - DTaP Valid",
    category: "Preschool",
    description: "4 DTaP doses for preschool",
    data: {
      id: "preschool-dtap-001",
      birthDate: "2020-01-15",
      immunization: [
        { vaccineCode: "DTaP", occurrenceDateTime: "2020-03-15" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2020-05-15" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2020-07-15" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2024-02-01" }
      ]
    },
    params: { state: "MA", schoolYear: "preschool", responseMode: "detailed" },
    expectedResult: { valid: true }
  },

  mmrEdgeValid: {
    name: "MMR ON 1st Birthday ⭐",
    category: "Preschool",
    description: "EDGE CASE: Dose exactly on 1st birthday should be valid",
    data: {
      id: "mmr-edge-valid",
      birthDate: "2023-01-15",
      immunization: [
        { vaccineCode: "MMR", occurrenceDateTime: "2024-01-15" }
      ]
    },
    params: { state: "MA", schoolYear: "preschool", responseMode: "detailed" },
    expectedResult: { valid: true }
  },

  mmrInvalid: {
    name: "MMR BEFORE 1st Birthday",
    category: "Preschool",
    description: "NEGATIVE TEST: Dose 5 days before birthday should fail",
    data: {
      id: "mmr-invalid",
      birthDate: "2023-01-15",
      immunization: [
        { vaccineCode: "MMR", occurrenceDateTime: "2024-01-10" }
      ]
    },
    params: { state: "MA", schoolYear: "preschool", responseMode: "detailed" },
    expectedResult: { valid: false }
  },

  religiousExemption: {
    name: "Religious Exemption",
    category: "Preschool",
    description: "0 doses + valid exemption should be COMPLIANT",
    data: {
      id: "exemption-001",
      birthDate: "2022-03-15",
      immunization: [],
      exceptions: [
        { vaccineCode: "DTaP", exceptionType: "RELIGIOUS_EXEMPTION" }
      ]
    },
    params: { state: "MA", schoolYear: "preschool", responseMode: "detailed" },
    expectedResult: { valid: true }
  },

  // ============= K-6 TESTS =============
  sarahJohnson: {
    name: "🔴 SARAH JOHNSON BUG",
    category: "K-6",
    critical: true,
    description: "CRITICAL: 4 DTaP doses, 4th dose 61 days before 4th birthday - should FAIL",
    data: {
      id: "sarah-johnson",
      birthDate: "2019-01-01",
      immunization: [
        { vaccineCode: "DTaP", occurrenceDateTime: "2019-03-01" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2019-05-01" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2019-07-01" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2022-11-01" }
      ]
    },
    params: { state: "MA", schoolYear: "K-6", responseMode: "detailed" },
    expectedResult: { valid: false }
  },

  dtapOnBirthday: {
    name: "DTaP 4th ON 4th Birthday ⭐",
    category: "K-6",
    description: "EDGE CASE: 4th dose exactly on 4th birthday should be valid",
    data: {
      id: "dtap-valid",
      birthDate: "2019-01-01",
      immunization: [
        { vaccineCode: "DTaP", occurrenceDateTime: "2019-03-01" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2019-05-01" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2019-07-01" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2023-01-01" }
      ]
    },
    params: { state: "MA", schoolYear: "K-6", responseMode: "detailed" },
    expectedResult: { valid: true }
  },

  dtapPrimaryRequirement: {
    name: "DTaP Primary Requirement",
    category: "K-6",
    description: "5 doses meets primary requirement regardless of dates",
    data: {
      id: "dtap-5doses",
      birthDate: "2019-01-01",
      immunization: [
        { vaccineCode: "DTaP", occurrenceDateTime: "2019-03-01" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2019-05-01" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2019-07-01" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2019-09-01" },
        { vaccineCode: "DTaP", occurrenceDateTime: "2020-01-15" }
      ]
    },
    params: { state: "MA", schoolYear: "K-6", responseMode: "detailed" },
    expectedResult: { valid: true }
  },

  mmrIntervalValid: {
    name: "MMR 28 Days Interval ⭐",
    category: "K-6",
    description: "EDGE CASE: Exactly 28 days between doses should be valid",
    data: {
      id: "mmr-interval-valid",
      birthDate: "2019-01-01",
      immunization: [
        { vaccineCode: "MMR", occurrenceDateTime: "2020-02-01" },
        { vaccineCode: "MMR", occurrenceDateTime: "2020-02-29" }
      ]
    },
    params: { state: "MA", schoolYear: "K-6", responseMode: "detailed" },
    expectedResult: { valid: true }
  },

  mmrIntervalInvalid: {
    name: "MMR 14 Days (Invalid)",
    category: "K-6",
    description: "NEGATIVE TEST: Only 14 days between doses should fail",
    data: {
      id: "mmr-interval-invalid",
      birthDate: "2019-01-01",
      immunization: [
        { vaccineCode: "MMR", occurrenceDateTime: "2020-02-01" },
        { vaccineCode: "MMR", occurrenceDateTime: "2020-02-15" }
      ]
    },
    params: { state: "MA", schoolYear: "K-6", responseMode: "detailed" },
    expectedResult: { valid: false }
  },

  // ============= GRADES 7-10 TESTS =============
  grade7Valid: {
    name: "Grades 7-10 Valid",
    category: "Grades 7-10",
    description: "Tdap + MenACWY both after 10th birthday",
    data: {
      id: "grade7-001",
      birthDate: "2014-03-15",
      immunization: [
        { vaccineCode: "Tdap", occurrenceDateTime: "2024-04-01" },
        { vaccineCode: "MenACWY", occurrenceDateTime: "2024-04-01" }
      ]
    },
    params: { state: "MA", schoolYear: "7-10", responseMode: "detailed" },
    expectedResult: { valid: true }
  },

  grade7MissingMenACWY: {
    name: "Grade 7-10 Missing MenACWY",
    category: "Grades 7-10",
    description: "NEGATIVE TEST: Tdap valid but missing MenACWY",
    data: {
      id: "grade7-missing",
      birthDate: "2014-03-15",
      immunization: [
        { vaccineCode: "Tdap", occurrenceDateTime: "2024-04-01" }
      ]
    },
    params: { state: "MA", schoolYear: "7-10", responseMode: "detailed" },
    expectedResult: { valid: false }
  },

  // ============= GRADES 11-12 TESTS =============
  grade11AlternateValid: {
    name: "Grades 11-12 Alternate Valid",
    category: "Grades 11-12",
    description: "1 MenACWY dose after 16th birthday satisfies alternate",
    data: {
      id: "grade11-001",
      birthDate: "2010-05-10",
      immunization: [
        { vaccineCode: "MenACWY", occurrenceDateTime: "2026-06-01" }
      ]
    },
    params: { state: "MA", schoolYear: "11-12", responseMode: "detailed" },
    expectedResult: { valid: true }
  },

  grade11PrimaryValid: {
    name: "Grades 11-12 Primary Valid",
    category: "Grades 11-12",
    description: "2 MenACWY doses meets primary requirement",
    data: {
      id: "grade11-002",
      birthDate: "2010-05-10",
      immunization: [
        { vaccineCode: "MenACWY", occurrenceDateTime: "2020-06-01" },
        { vaccineCode: "MenACWY", occurrenceDateTime: "2025-08-01" }
      ]
    },
    params: { state: "MA", schoolYear: "11-12", responseMode: "detailed" },
    expectedResult: { valid: true }
  },

  // ============= COLLEGE TESTS =============
  collegeValid: {
    name: "College Valid",
    category: "College",
    description: "2 MMR doses with proper interval",
    data: {
      id: "college-001",
      birthDate: "2006-08-20",
      immunization: [
        { vaccineCode: "MMR", occurrenceDateTime: "2007-09-01" },
        { vaccineCode: "MMR", occurrenceDateTime: "2008-09-01" }
      ]
    },
    params: { state: "MA", schoolYear: "college", responseMode: "detailed" },
    expectedResult: { valid: true }
  },

  collegeVaricellaValid: {
    name: "College Varicella Valid",
    category: "College",
    description: "2 Varicella doses for college",
    data: {
      id: "college-002",
      birthDate: "2006-08-20",
      immunization: [
        { vaccineCode: "Varicella", occurrenceDateTime: "2007-09-01" },
        { vaccineCode: "Varicella", occurrenceDateTime: "2008-09-01" }
      ]
    },
    params: { state: "MA", schoolYear: "college", responseMode: "detailed" },
    expectedResult: { valid: true }
  }
};

// Batch test scenarios
export const BATCH_SCENARIOS = {
  mixedValidation: {
    name: "Mixed Validation - Valid & Invalid",
    description: "Batch of 5 patients with mix of valid/invalid results",
    data: {
      state: "MA",
      schoolYear: "K-6",
      responseMode: "detailed",
      patients: [
        {
          id: "batch-001-valid",
          birthDate: "2019-01-01",
          immunization: [
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-03-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-05-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-07-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-09-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2020-01-15" }
          ]
        },
        {
          id: "batch-002-invalid",
          birthDate: "2019-01-01",
          immunization: [
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-03-01" }
          ]
        },
        {
          id: "batch-003-valid-alternate",
          birthDate: "2019-01-01",
          immunization: [
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-03-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-05-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-07-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2023-01-01" }
          ]
        },
        {
          id: "batch-004-exemption",
          birthDate: "2019-01-01",
          immunization: [],
          exceptions: [
            { vaccineCode: "DTaP", exceptionType: "RELIGIOUS_EXEMPTION" }
          ]
        },
        {
          id: "batch-005-invalid-date",
          birthDate: "2019-01-01",
          immunization: [
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-03-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-05-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-07-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2022-11-01" }
          ]
        }
      ]
    },
    expectedResults: {
      totalPatients: 5,
      validCount: 3,
      invalidCount: 2
    }
  },

  preschoolBatch: {
    name: "Preschool Batch",
    description: "10 preschool students with various compliance levels",
    data: {
      state: "MA",
      schoolYear: "preschool",
      responseMode: "detailed",
      patients: [
        {
          id: "preschool-batch-001",
          birthDate: "2022-01-15",
          immunization: [
            { vaccineCode: "DTaP", occurrenceDateTime: "2022-03-15" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2022-05-15" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2022-07-15" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2026-02-01" }
          ]
        },
        {
          id: "preschool-batch-002",
          birthDate: "2022-02-10",
          immunization: [
            { vaccineCode: "Hib", occurrenceDateTime: "2022-04-10" }
          ]
        },
        {
          id: "preschool-batch-003",
          birthDate: "2022-03-20",
          immunization: [
            { vaccineCode: "MMR", occurrenceDateTime: "2023-03-20" },
            { vaccineCode: "Varicella", occurrenceDateTime: "2023-03-20" }
          ]
        },
        {
          id: "preschool-batch-004",
          birthDate: "2022-04-01",
          immunization: []
        },
        {
          id: "preschool-batch-005",
          birthDate: "2022-05-15",
          immunization: [
            { vaccineCode: "HepB", occurrenceDateTime: "2022-05-16" },
            { vaccineCode: "HepB", occurrenceDateTime: "2022-06-16" },
            { vaccineCode: "HepB", occurrenceDateTime: "2022-11-16" }
          ]
        },
        {
          id: "preschool-batch-006",
          birthDate: "2022-06-01",
          immunization: [
            { vaccineCode: "Polio", occurrenceDateTime: "2022-08-01" },
            { vaccineCode: "Polio", occurrenceDateTime: "2022-10-01" },
            { vaccineCode: "Polio", occurrenceDateTime: "2023-01-01" }
          ]
        },
        {
          id: "preschool-batch-007",
          birthDate: "2022-07-10",
          immunization: [],
          exceptions: [
            { vaccineCode: "MMR", exceptionType: "MEDICAL_CONTRAINDICATION" }
          ]
        },
        {
          id: "preschool-batch-008",
          birthDate: "2022-08-15",
          immunization: [
            { vaccineCode: "MMR", occurrenceDateTime: "2023-08-10" }
          ]
        },
        {
          id: "preschool-batch-009",
          birthDate: "2022-09-01",
          immunization: [
            { vaccineCode: "Varicella", occurrenceDateTime: "2023-09-01" }
          ]
        },
        {
          id: "preschool-batch-010",
          birthDate: "2022-10-01",
          immunization: [
            { vaccineCode: "DTaP", occurrenceDateTime: "2022-12-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2023-02-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2023-04-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2026-11-01" }
          ]
        }
      ]
    },
    expectedResults: {
      totalPatients: 10
    }
  },

  edgeCasesBatch: {
    name: "Edge Cases Batch",
    description: "Critical edge cases including birthdays and intervals",
    data: {
      state: "MA",
      schoolYear: "K-6",
      responseMode: "detailed",
      patients: [
        {
          id: "edge-dtap-on-birthday",
          birthDate: "2019-01-01",
          immunization: [
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-03-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-05-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-07-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2023-01-01" }
          ]
        },
        {
          id: "edge-dtap-day-before-birthday",
          birthDate: "2019-01-01",
          immunization: [
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-03-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-05-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2019-07-01" },
            { vaccineCode: "DTaP", occurrenceDateTime: "2022-12-31" }
          ]
        },
        {
          id: "edge-mmr-28-days",
          birthDate: "2019-01-01",
          immunization: [
            { vaccineCode: "MMR", occurrenceDateTime: "2020-02-01" },
            { vaccineCode: "MMR", occurrenceDateTime: "2020-02-29" }
          ]
        },
        {
          id: "edge-mmr-27-days",
          birthDate: "2019-01-01",
          immunization: [
            { vaccineCode: "MMR", occurrenceDateTime: "2020-02-01" },
            { vaccineCode: "MMR", occurrenceDateTime: "2020-02-28" }
          ]
        },
        {
          id: "edge-polio-on-4th-birthday",
          birthDate: "2019-01-01",
          immunization: [
            { vaccineCode: "Polio", occurrenceDateTime: "2019-03-01" },
            { vaccineCode: "Polio", occurrenceDateTime: "2019-05-01" },
            { vaccineCode: "Polio", occurrenceDateTime: "2023-01-01" }
          ]
        }
      ]
    },
    expectedResults: {
      totalPatients: 5,
      validCount: 3,
      invalidCount: 2
    }
  },

  grade7to12Batch: {
    name: "Grades 7-12 Batch",
    description: "Middle and high school students",
    data: {
      state: "MA",
      schoolYear: "7-10",
      responseMode: "detailed",
      patients: [
        {
          id: "grade7-complete",
          birthDate: "2014-03-15",
          immunization: [
            { vaccineCode: "Tdap", occurrenceDateTime: "2024-04-01" },
            { vaccineCode: "MenACWY", occurrenceDateTime: "2024-04-01" }
          ]
        },
        {
          id: "grade8-tdap-only",
          birthDate: "2013-05-20",
          immunization: [
            { vaccineCode: "Tdap", occurrenceDateTime: "2023-06-01" }
          ]
        },
        {
          id: "grade9-menacwy-only",
          birthDate: "2012-08-10",
          immunization: [
            { vaccineCode: "MenACWY", occurrenceDateTime: "2022-09-01" }
          ]
        },
        {
          id: "grade10-both-valid",
          birthDate: "2011-11-30",
          immunization: [
            { vaccineCode: "Tdap", occurrenceDateTime: "2022-01-15" },
            { vaccineCode: "MenACWY", occurrenceDateTime: "2022-01-15" }
          ]
        },
        {
          id: "grade7-tdap-before-10th",
          birthDate: "2014-03-15",
          immunization: [
            { vaccineCode: "Tdap", occurrenceDateTime: "2024-01-01" },
            { vaccineCode: "MenACWY", occurrenceDateTime: "2024-04-01" }
          ]
        }
      ]
    },
    expectedResults: {
      totalPatients: 5
    }
  }
};

export default { TEST_CASES, BATCH_SCENARIOS };
