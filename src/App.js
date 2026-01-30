import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SingleValidation from './components/SingleValidation';
import BatchValidation from './components/BatchValidation';
import ResultsDisplay from './components/ResultsDisplay';
import validationService from './services/validationService';
import { TEST_CASES, BATCH_SCENARIOS } from './data/testCases';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('single');
  const [apiUrl, setApiUrl] = useState('http://localhost:8080');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Single validation state
  const [singleData, setSingleData] = useState({
    id: '',
    birthDate: '',
    immunization: '',
    exceptions: '',
    state: 'MA',
    schoolYear: 'K-6',
    responseMode: 'detailed'
  });

  // Batch validation state
  const [batchData, setBatchData] = useState({
    state: 'MA',
    schoolYear: 'K-6',
    responseMode: 'detailed',
    patients: ''
  });

  // Handle API URL change
  const handleApiUrlChange = (url) => {
    setApiUrl(url);
    validationService.setBaseURL(url);
  };

  // Load test case from sidebar
  const loadTestCase = async (testKey) => {
    const test = TEST_CASES[testKey];
    if (!test) return;

    if (testKey === 'health') {
      await runHealthCheck();
      return;
    }

    setSingleData({
      id: test.data.id,
      birthDate: test.data.birthDate,
      immunization: JSON.stringify(test.data.immunization, null, 2),
      exceptions: test.data.exceptions ? JSON.stringify(test.data.exceptions, null, 2) : '',
      state: test.params.state,
      schoolYear: test.params.schoolYear,
      responseMode: test.params.responseMode
    });
    setActiveTab('single');
    setResult(null);
  };

  // Load batch scenario
  const loadBatchScenario = (scenarioKey) => {
    const scenario = BATCH_SCENARIOS[scenarioKey];
    if (!scenario) return;

    setBatchData({
      state: scenario.data.state,
      schoolYear: scenario.data.schoolYear,
      responseMode: scenario.data.responseMode,
      patients: JSON.stringify(scenario.data.patients, null, 2)
    });
    setActiveTab('batch');
    setResult(null);
  };

  // Run health check
  const runHealthCheck = async () => {
    setLoading(true);
    setResult(null);
    
    const response = await validationService.healthCheck();
    setResult({
      testName: 'Health Check',
      ...response
    });
    
    setLoading(false);
  };

  // Handle single validation
  const handleSingleValidation = async () => {
    setLoading(true);
    setResult(null);

    try {
      const immunizations = singleData.immunization ? JSON.parse(singleData.immunization) : [];
      const exceptions = singleData.exceptions ? JSON.parse(singleData.exceptions) : [];

      const payload = {
        id: singleData.id,
        birthDate: singleData.birthDate,
        immunization: immunizations,
        exceptions: exceptions.length > 0 ? exceptions : undefined
      };

      const params = {
        state: singleData.state,
        schoolYear: singleData.schoolYear,
        responseMode: singleData.responseMode
      };

      const response = await validationService.validateSingle(payload, params);
      setResult({
        testName: `Single Validation - ${singleData.id}`,
        ...response
      });
    } catch (error) {
      setResult({
        testName: 'Single Validation',
        success: false,
        error: error.message
      });
    }

    setLoading(false);
  };

  // Handle batch validation
  const handleBatchValidation = async () => {
    setLoading(true);
    setResult(null);

    try {
      const patients = JSON.parse(batchData.patients);

      const payload = {
        state: batchData.state,
        schoolYear: batchData.schoolYear,
        responseMode: batchData.responseMode,
        patients: patients
      };

      const response = await validationService.validateBatch(payload);
      setResult({
        testName: `Batch Validation - ${patients.length} patients`,
        ...response
      });
    } catch (error) {
      setResult({
        testName: 'Batch Validation',
        success: false,
        error: error.message
      });
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <Header />
      
      <div className="main-content">
        <Sidebar
          testCases={TEST_CASES}
          batchScenarios={BATCH_SCENARIOS}
          onLoadTest={loadTestCase}
          onLoadBatchScenario={loadBatchScenario}
        />

        <div className="content-area">
          <div className="api-url-config">
            <label>API Base URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => handleApiUrlChange(e.target.value)}
              placeholder="http://localhost:8080"
            />
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'single' ? 'active' : ''}`}
              onClick={() => setActiveTab('single')}
            >
              Single Validation
            </button>
            <button
              className={`tab ${activeTab === 'batch' ? 'active' : ''}`}
              onClick={() => setActiveTab('batch')}
            >
              Batch Validation
            </button>
          </div>

          {activeTab === 'single' && (
            <SingleValidation
              data={singleData}
              setData={setSingleData}
              onValidate={handleSingleValidation}
              onClear={() => {
                setSingleData({
                  id: '',
                  birthDate: '',
                  immunization: '',
                  exceptions: '',
                  state: 'MA',
                  schoolYear: 'K-6',
                  responseMode: 'detailed'
                });
                setResult(null);
              }}
            />
          )}

          {activeTab === 'batch' && (
            <BatchValidation
              data={batchData}
              setData={setBatchData}
              onValidate={handleBatchValidation}
              onLoadExample={() => loadBatchScenario('mixedValidation')}
              onClear={() => {
                setBatchData({
                  state: 'MA',
                  schoolYear: 'K-6',
                  responseMode: 'detailed',
                  patients: ''
                });
                setResult(null);
              }}
            />
          )}

          <ResultsDisplay
            result={result}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
