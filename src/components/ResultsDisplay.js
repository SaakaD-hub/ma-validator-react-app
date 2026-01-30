import React from 'react';

function ResultsDisplay({ result, loading }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Validating...</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const isValid = result.data?.valid;
  const isBatch = result.data?.results;

  return (
    <div className={`results-container ${isValid ? 'result-valid' : 'result-invalid'}`}>
      <div className="result-header">
        <h3>{result.testName || 'Validation Results'}</h3>
        {result.success && result.data && typeof result.data === 'object' && 'valid' in result.data && (
          <span className={`status-badge ${result.data.valid ? 'status-valid' : 'status-invalid'}`}>
            {result.data.valid ? '✓ VALID' : '✗ INVALID'}
          </span>
        )}
      </div>

      {!result.success && (
        <div className="error-box">
          <h4>❌ Error</h4>
          <p>{result.error}</p>
        </div>
      )}

      {/* Single validation unmet requirements */}
      {result.success && result.data?.unmetRequirements && result.data.unmetRequirements.length > 0 && (
        <div className="unmet-requirements">
          <h4 style={{marginBottom: '12px', color: '#dc2626'}}>Unmet Requirements:</h4>
          {result.data.unmetRequirements.map((req, idx) => (
            <div key={idx} className="unmet-item">
              <h4>{req.vaccineCode}</h4>
              <p>{req.description}</p>
              <p style={{fontSize: '12px', marginTop: '4px'}}>
                Required: {req.requiredDoses} | Found: {req.foundDoses}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Batch validation results */}
      {result.success && isBatch && (
        <div className="batch-results">
          <div className="batch-summary">
            <h4>Batch Summary:</h4>
            <p>Total Patients: {result.data.results.length}</p>
            <p>Valid: {result.data.results.filter(p => p.valid).length}</p>
            <p>Invalid: {result.data.results.filter(p => !p.valid).length}</p>
          </div>
          
          <div className="unmet-requirements">
            <h4 style={{marginBottom: '12px'}}>Individual Results:</h4>
            {result.data.results.map((patient, idx) => (
              <div 
                key={idx} 
                className="unmet-item" 
                style={{borderLeftColor: patient.valid ? '#10b981' : '#ef4444'}}
              >
                <h4 style={{color: patient.valid ? '#065f46' : '#dc2626'}}>
                  {patient.patientId} - {patient.valid ? '✓ VALID' : '✗ INVALID'}
                </h4>
                {patient.unmetRequirements && patient.unmetRequirements.length > 0 && (
                  <div style={{marginTop: '8px'}}>
                    <p style={{fontWeight: 600, marginBottom: '4px'}}>
                      {patient.unmetRequirements.length} unmet requirement(s):
                    </p>
                    {patient.unmetRequirements.map((req, reqIdx) => (
                      <p key={reqIdx} style={{fontSize: '12px', marginLeft: '12px'}}>
                        • {req.vaccineCode}: {req.description}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JSON response viewer */}
      {result.data && (
        <div className="json-viewer">
          <h4>Full Response:</h4>
          <div className="json-display">
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;
