import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SingleValidation from './components/SingleValidation';
import BatchValidation from './components/BatchValidation';
import ResultsDisplay from './components/ResultsDisplay';
import validationService from './services/validationService';
import { TEST_CASES as testCases, BATCH_SCENARIOS as batchScenarios } from './data/testCases';
import './styles/App.css';

const DEFAULT_SINGLE = {
  id: '',
  birthDate: '',
  state: 'MA',
  schoolYear: 'preschool',
  immunization: '[]',
  exceptions: '',
};

const DEFAULT_BATCH = {
  state: 'MA',
  schoolYear: 'preschool',
  patients: '[]',
};

function App() {
  const [activeTab, setActiveTab]   = useState('single');
  const [baseURL, setBaseURL]       = useState('http://localhost:8080');
  const [singleData, setSingleData] = useState(DEFAULT_SINGLE);
  const [batchData, setBatchData]   = useState(DEFAULT_BATCH);
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [apiError, setApiError]     = useState(null);

  const handleBaseURLChange = (url) => {
    setBaseURL(url);
    validationService.setBaseURL(url);
  };

  // ── Load sidebar test case ──────────────────────────────────────────────
  const handleLoadTest = (key) => {
    const test = testCases[key];
    if (!test) return;

    console.log('[handleLoadTest] key:', key);
    console.log('[handleLoadTest] full test object:', JSON.stringify(test, null, 2));

    /*
     * Supports all common testCases.js layouts:
     *
     * Layout A (nested patient):  { name, category, patient: { id, birthDate, immunization, ... } }
     * Layout B (flat):            { name, category, id, birthDate, immunization, ... }
     * Layout C (patientData):     { name, category, patientData: { id, birthDate, ... } }
     * Layout D (data/params):     { name, category, data: { id, ... }, params: { state, schoolYear } }
     */
    const patientObj =
      test.patient     ||   // Layout A ← preferred new format
      test.patientData ||   // Layout C
      test.data        ||   // Layout D
      test;                 // Layout B ← flat fallback

    const id =
      patientObj.id        ||
      patientObj.patientId ||
      key;

    const birthDate =
      patientObj.birthDate   ||
      patientObj.dob         ||
      patientObj.dateOfBirth ||
      '';

    const rawImmunizations =
      patientObj.immunization  ||
      patientObj.immunizations ||
      patientObj.vaccinations  ||
      [];

    const immunizationStr =
      typeof rawImmunizations === 'string'
        ? rawImmunizations
        : JSON.stringify(rawImmunizations, null, 2);

    const rawExceptions =
      patientObj.exceptions ||
      patientObj.exemptions ||
      null;

    const exceptionsStr = rawExceptions
      ? (typeof rawExceptions === 'string'
          ? rawExceptions
          : JSON.stringify(rawExceptions, null, 2))
      : '';

    // FIX: check test.state first (new flat layout), then params, then patientObj
    const state      = test.state      || test.params?.state      || patientObj.state      || 'MA';
    const schoolYear = test.schoolYear || test.params?.schoolYear || patientObj.schoolYear || 'preschool';

    console.log('[handleLoadTest] → id:', id);
    console.log('[handleLoadTest] → birthDate:', birthDate);
    console.log('[handleLoadTest] → state:', state, '/ schoolYear:', schoolYear);

    setSingleData({ id, birthDate, state, schoolYear, immunization: immunizationStr, exceptions: exceptionsStr });
    setResult(null);
    setApiError(null);
    setActiveTab('single');
  };

  // ── Load batch scenario ─────────────────────────────────────────────────
  // FIX: supports both flat structure { state, schoolYear, patients }
  //      and old nested structure     { data: { state, schoolYear, patients } }
  const handleLoadBatchScenario = (key) => {
    const scenario = batchScenarios[key];
    if (!scenario) return;

    // New flat format has patients directly on scenario
    // Old nested format has everything inside scenario.data
    const scenarioData = scenario.patients ? scenario : (scenario.data || scenario);
    const patients = scenarioData.patients || [];

    setBatchData({
      state:      scenarioData.state      || 'MA',
      schoolYear: scenarioData.schoolYear || 'preschool',
      patients:   JSON.stringify(patients, null, 2),
    });
    setResult(null);
    setApiError(null);
    setActiveTab('batch');
  };

  // ── Single Validate ─────────────────────────────────────────────────────
  const handleSingleValidate = async () => {
    setLoading(true);
    setResult(null);
    setApiError(null);

    if (!singleData.id || !singleData.id.trim()) {
      setApiError('Patient ID is required — please enter an ID or load a test case.');
      setLoading(false);
      return;
    }

    try {
      let immunizations = [];
      if (singleData.immunization?.trim()) {
        immunizations = JSON.parse(singleData.immunization);
      }

      let exceptions = undefined;
      if (singleData.exceptions?.trim()) {
        exceptions = JSON.parse(singleData.exceptions);
      }

      const patient = {
        id:           singleData.id.trim(),
        birthDate:    singleData.birthDate || undefined,
        immunization: immunizations,
        ...(exceptions && { exceptions }),
      };

      console.log('[validateSingle] sending:', JSON.stringify(patient, null, 2));

      const response = await validationService.validateSingle(patient, {
        state:      singleData.state,
        schoolYear: singleData.schoolYear,
      });

      console.log('[validateSingle] response:', JSON.stringify(response, null, 2));

      if (response.success) {
        setResult(response.data);
      } else {
        setApiError(response.error || 'Validation failed');
        if (response.data) setResult(response.data);
      }
    } catch (e) {
      setApiError(`JSON parse error: ${e.message}. Check immunization / exceptions format.`);
    } finally {
      setLoading(false);
    }
  };

  // ── Batch Validate ──────────────────────────────────────────────────────
  // FIX: added responseMode: 'detailed' — backend @NotBlank requires this field
  const handleBatchValidate = async () => {
    setLoading(true);
    setResult(null);
    setApiError(null);

    try {
      const patients = JSON.parse(batchData.patients);
      const response = await validationService.validateBatch({
        state:        batchData.state,
        schoolYear:   batchData.schoolYear,
        responseMode: 'detailed',
        patients,
      });

      if (response.success) {
        setResult(response.data);
      } else {
        setApiError(response.error || 'Batch validation failed');
        if (response.data) setResult(response.data);
      }
    } catch (e) {
      setApiError(`JSON parse error: ${e.message}. Check patients format.`);
    } finally {
      setLoading(false);
    }
  };

  // ── Clear ───────────────────────────────────────────────────────────────
  const handleClear = () => {
    activeTab === 'single' ? setSingleData(DEFAULT_SINGLE) : setBatchData(DEFAULT_BATCH);
    setResult(null);
    setApiError(null);
  };

  // ── Health Check ────────────────────────────────────────────────────────
  const handleHealthCheck = async () => {
    setLoading(true);
    setResult(null);
    setApiError(null);
    const response = await validationService.healthCheck();
    setLoading(false);
    if (response.success) {
      setResult({ _healthCheck: true, ...response.data });
    } else {
      setApiError(response.error);
    }
  };

  const getStatusSummary = () => {
    if (!result || result._healthCheck) return null;
    const s = result.status;
    if (s === 'valid')        return { label: '✅ VALID',   cls: 'summary-valid' };
    if (s === 'invalid')      return { label: '❌ INVALID', cls: 'summary-invalid' };
    if (s === 'undetermined') return { label: '⚠️ UNKNOWN', cls: 'summary-undetermined' };
    return null;
  };

  const statusSummary = getStatusSummary();

  return (
    <div className="app">
      <Header baseURL={baseURL} onBaseURLChange={handleBaseURLChange} />
      <div className="app-layout">
        <Sidebar
          testCases={testCases}
          batchScenarios={batchScenarios}
          onLoadTest={handleLoadTest}
          onLoadBatchScenario={handleLoadBatchScenario}
          onHealthCheck={handleHealthCheck}
        />
        <main className="main-content">
          <div className="tab-bar">
            <button
              className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
              onClick={() => setActiveTab('single')}
            >
              Single Validation
            </button>
            <button
              className={`tab-btn ${activeTab === 'batch' ? 'active' : ''}`}
              onClick={() => setActiveTab('batch')}
            >
              Batch Validation
            </button>
            {statusSummary && (
              <span className={`result-summary-badge ${statusSummary.cls}`}>
                {statusSummary.label}
              </span>
            )}
          </div>

          <div className="form-panel">
            {activeTab === 'single' ? (
              <SingleValidation
                data={singleData}
                setData={setSingleData}
                onValidate={handleSingleValidate}
                onClear={handleClear}
              />
            ) : (
              <BatchValidation
                data={batchData}
                setData={setBatchData}
                onValidate={handleBatchValidate}
                onClear={handleClear}
              />
            )}
          </div>

          <ResultsDisplay result={result} loading={loading} error={apiError} />
        </main>
      </div>
    </div>
  );
}

export default App;