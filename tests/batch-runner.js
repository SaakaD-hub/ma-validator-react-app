#!/usr/bin/env node

/**
 * Batch Test Runner for MA Immunization Validator
 * 
 * Usage:
 *   npm run batch-test
 *   npm run batch-test -- --scenario=mixedValidation
 *   npm run batch-test -- --all
 */

const axios = require('axios');
const { TEST_CASES, BATCH_SCENARIOS } = require('../src/data/testCases');

const API_BASE_URL = process.env.API_URL || 'http://localhost:8080';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class BatchTestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      errors: 0,
      tests: []
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async runHealthCheck() {
    this.log('\n🏥 Running Health Check...', 'cyan');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/validate/health`);
      if (response.status === 200) {
        this.log('✓ API is healthy', 'green');
        return true;
      }
    } catch (error) {
      this.log('✗ API health check failed', 'red');
      this.log(`  Error: ${error.message}`, 'red');
      return false;
    }
  }

  async runSingleTest(testKey, testCase) {
    try {
      const params = new URLSearchParams({
        state: testCase.params.state,
        schoolYear: testCase.params.schoolYear,
        responseMode: testCase.params.responseMode
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/validate/single?${params}`,
        testCase.data,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const passed = response.data.valid === testCase.expectedResult.valid;
      
      if (passed) {
        this.results.passed++;
        this.log(`  ✓ ${testCase.name}`, 'green');
      } else {
        this.results.failed++;
        this.log(`  ✗ ${testCase.name}`, 'red');
        this.log(`    Expected: ${testCase.expectedResult.valid}, Got: ${response.data.valid}`, 'yellow');
      }

      this.results.tests.push({
        name: testCase.name,
        passed,
        expected: testCase.expectedResult,
        actual: response.data
      });

      return passed;
    } catch (error) {
      this.results.errors++;
      this.log(`  ✗ ${testCase.name} - ERROR`, 'red');
      this.log(`    ${error.message}`, 'red');
      
      this.results.tests.push({
        name: testCase.name,
        passed: false,
        error: error.message
      });
      
      return false;
    }
  }

  async runBatchScenario(scenarioKey, scenario) {
    this.log(`\n📦 Running Batch Scenario: ${scenario.name}`, 'cyan');
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/validate/batch`,
        scenario.data,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const results = response.data.results;
      const validCount = results.filter(r => r.valid).length;
      const invalidCount = results.filter(r => !r.valid).length;

      this.log(`  Total Patients: ${results.length}`, 'blue');
      this.log(`  Valid: ${validCount}`, 'green');
      this.log(`  Invalid: ${invalidCount}`, 'yellow');

      if (scenario.expectedResults) {
        let passed = true;
        
        if (scenario.expectedResults.totalPatients !== undefined) {
          const totalMatch = results.length === scenario.expectedResults.totalPatients;
          passed = passed && totalMatch;
          if (!totalMatch) {
            this.log(`  ✗ Expected ${scenario.expectedResults.totalPatients} patients, got ${results.length}`, 'red');
          }
        }

        if (scenario.expectedResults.validCount !== undefined) {
          const validMatch = validCount === scenario.expectedResults.validCount;
          passed = passed && validMatch;
          if (!validMatch) {
            this.log(`  ✗ Expected ${scenario.expectedResults.validCount} valid, got ${validCount}`, 'red');
          }
        }

        if (passed) {
          this.results.passed++;
          this.log(`  ✓ Batch scenario passed`, 'green');
        } else {
          this.results.failed++;
          this.log(`  ✗ Batch scenario failed`, 'red');
        }

        return passed;
      } else {
        this.results.passed++;
        return true;
      }
    } catch (error) {
      this.results.errors++;
      this.log(`  ✗ Batch scenario ERROR: ${error.message}`, 'red');
      return false;
    }
  }

  async runAllSingleTests() {
    this.log('\n📋 Running All Single Tests...', 'bright');
    
    const categories = [...new Set(Object.values(TEST_CASES).map(t => t.category))];
    
    for (const category of categories) {
      if (category === 'System') continue; // Skip health check
      
      this.log(`\n${category}:`, 'cyan');
      
      const tests = Object.entries(TEST_CASES).filter(([_, test]) => test.category === category);
      
      for (const [key, test] of tests) {
        await this.runSingleTest(key, test);
        await this.sleep(100); // Small delay between tests
      }
    }
  }

  async runAllBatchTests() {
    this.log('\n📦 Running All Batch Scenarios...', 'bright');
    
    for (const [key, scenario] of Object.entries(BATCH_SCENARIOS)) {
      await this.runBatchScenario(key, scenario);
      await this.sleep(200); // Small delay between batches
    }
  }

  async runAll() {
    await this.runAllSingleTests();
    await this.runAllBatchTests();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  printSummary() {
    this.log('\n' + '='.repeat(60), 'bright');
    this.log('TEST SUMMARY', 'bright');
    this.log('='.repeat(60), 'bright');
    
    const total = this.results.passed + this.results.failed + this.results.errors;
    const passRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;
    
    this.log(`\nTotal Tests: ${total}`, 'blue');
    this.log(`Passed: ${this.results.passed}`, 'green');
    this.log(`Failed: ${this.results.failed}`, 'red');
    this.log(`Errors: ${this.results.errors}`, 'red');
    this.log(`Pass Rate: ${passRate}%`, passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red');
    
    if (this.results.failed > 0 || this.results.errors > 0) {
      this.log('\n❌ SOME TESTS FAILED', 'red');
      process.exit(1);
    } else {
      this.log('\n✅ ALL TESTS PASSED', 'green');
      process.exit(0);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const runner = new BatchTestRunner();

  console.log(colors.bright + '\n╔════════════════════════════════════════════╗' + colors.reset);
  console.log(colors.bright + '║   MA Immunization Validator Test Suite   ║' + colors.reset);
  console.log(colors.bright + '╚════════════════════════════════════════════╝' + colors.reset);

  // Check API health first
  const isHealthy = await runner.runHealthCheck();
  if (!isHealthy) {
    runner.log('\n❌ Cannot continue - API is not healthy', 'red');
    process.exit(1);
  }

  // Parse command line arguments
  const scenario = args.find(arg => arg.startsWith('--scenario='))?.split('=')[1];
  const runAll = args.includes('--all');
  const runSingle = args.includes('--single');
  const runBatch = args.includes('--batch');

  try {
    if (scenario) {
      // Run specific batch scenario
      if (BATCH_SCENARIOS[scenario]) {
        await runner.runBatchScenario(scenario, BATCH_SCENARIOS[scenario]);
      } else {
        runner.log(`\n❌ Unknown scenario: ${scenario}`, 'red');
        runner.log(`\nAvailable scenarios:`, 'yellow');
        Object.keys(BATCH_SCENARIOS).forEach(key => {
          runner.log(`  - ${key}`, 'yellow');
        });
        process.exit(1);
      }
    } else if (runAll) {
      // Run all tests
      await runner.runAll();
    } else if (runSingle) {
      // Run only single tests
      await runner.runAllSingleTests();
    } else if (runBatch) {
      // Run only batch tests
      await runner.runAllBatchTests();
    } else {
      // Default: run all tests
      await runner.runAll();
    }

    runner.printSummary();
  } catch (error) {
    runner.log(`\n❌ Fatal error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
