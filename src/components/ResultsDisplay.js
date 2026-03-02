import React from 'react';

/**
 * ResultsDisplay - V3 Tri-State Validation Results
 * Shows full per-vaccine breakdown: satisfied (with why) + failed (with why not)
 */
function ResultsDisplay({ result, loading, error }) {

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="results-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Validating patient immunization records...</p>
        </div>
      </div>
    );
  }

  // ── API / Network Error ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="results-container">
        <div className="result-card error-card">
          <div className="result-header">
            <span className="status-badge badge-error">⚠️ CONNECTION ERROR</span>
          </div>
          <p className="error-message">{error}</p>
          <p className="error-hint">Make sure Spring Boot API is running on port 8080.</p>
        </div>
      </div>
    );
  }

  // ── No Result Yet ──────────────────────────────────────────────────────
  if (!result) {
    return (
      <div className="results-container">
        <div className="result-placeholder">
          <div className="placeholder-icon">📋</div>
          <p>Submit a patient to see validation results</p>
        </div>
      </div>
    );
  }

  // ── Determine tri-state status ─────────────────────────────────────────
  const status = result.status || (result.valid ? 'valid' : 'invalid');

  const statusConfig = {
    valid: {
      badge: '✅ VALID',
      badgeClass: 'badge-valid',
      cardClass: 'card-valid',
    },
    invalid: {
      badge: '❌ INVALID',
      badgeClass: 'badge-invalid',
      cardClass: 'card-invalid',
    },
    undetermined: {
      badge: '⚠️ UNDETERMINED',
      badgeClass: 'badge-undetermined',
      cardClass: 'card-undetermined',
    },
  };

  const config = statusConfig[status] || statusConfig.undetermined;

  return (
    <div className="results-container">
      <div className={`result-card ${config.cardClass}`}>

        {/* ── Status Header ─────────────────────────────────────────────── */}
        <div className="result-header">
          <span className={`status-badge ${config.badgeClass}`}>{config.badge}</span>
          <span className="patient-id-label">
            Patient: <code>{result.patientId}</code>
          </span>
        </div>

        {/* ── Message ───────────────────────────────────────────────────── */}
        {result.message && <p className="result-message">{result.message}</p>}

        {/* ── Metadata Summary ──────────────────────────────────────────── */}
        {result.metadata && (
          <div className="metadata-section">
            <h4>📊 Validation Summary</h4>
            <div className="metadata-grid">
              <div className="meta-item">
                <span className="meta-label">Total</span>
                <span className="meta-value">{result.metadata.totalRequirements}</span>
              </div>
              <div className="meta-item meta-satisfied">
                <span className="meta-label">✅ Satisfied</span>
                <span className="meta-value">{result.metadata.satisfiedRequirements}</span>
              </div>
              <div className="meta-item meta-unsatisfied">
                <span className="meta-label">❌ Failed</span>
                <span className="meta-value">{result.metadata.unsatisfiedRequirements}</span>
              </div>
              <div className="meta-item meta-undetermined">
                <span className="meta-label">⚠️ Unknown</span>
                <span className="meta-value">{result.metadata.undeterminedRequirements}</span>
              </div>
            </div>
            <div className="metadata-footer">
              <span>🕐 {new Date(result.metadata.validatedAt).toLocaleString()}</span>
              <span>📍 {result.metadata.state} · {result.metadata.schoolYear}</span>
              <span>v{result.metadata.validatorVersion}</span>
            </div>
          </div>
        )}

        {/* ── FAILED Requirements ────────────────────────────────────────── */}
        {result.unmetRequirements && result.unmetRequirements.length > 0 && (
          <div className="vaccine-breakdown-section">
            <h4 className="breakdown-heading breakdown-fail">❌ Requirements NOT Satisfied</h4>
            {result.unmetRequirements.map((req, i) => (
              <UnmetVaccineCard key={i} req={req} />
            ))}
          </div>
        )}

        {/* ── SATISFIED Requirements ─────────────────────────────────────── */}
        {result.satisfiedRequirements && result.satisfiedRequirements.length > 0 && (
          <div className="vaccine-breakdown-section">
            <h4 className="breakdown-heading breakdown-pass">✅ Requirements Satisfied</h4>
            {result.satisfiedRequirements.map((req, i) => (
              <SatisfiedVaccineCard key={i} req={req} />
            ))}
          </div>
        )}

        {/* ── No per-vaccine detail fallback ────────────────────────────── */}
        {(!result.unmetRequirements || result.unmetRequirements.length === 0) &&
         (!result.satisfiedRequirements || result.satisfiedRequirements.length === 0) &&
         result.metadata?.unsatisfiedRequirements > 0 && (
          <div className="no-detail-notice">
            <p>
              ⚠️ <strong>{result.metadata.unsatisfiedRequirements} requirement(s) failed</strong> but
              per-vaccine details are not included in this response.
            </p>
            <p className="error-hint">
              Ensure the backend returns <code>unmetRequirements</code> in detailed mode.
              Check that your controller maps <code>?responseMode=detailed</code> or
              <code>?includeDetails=true</code>.
            </p>
          </div>
        )}

        {/* ── Undetermined Conditions ────────────────────────────────────── */}
        {result.undeterminedConditions && result.undeterminedConditions.length > 0 && (
          <div className="vaccine-breakdown-section">
            <h4 className="breakdown-heading breakdown-warn">⚠️ Could Not Evaluate</h4>
            {result.undeterminedConditions.map((cond, i) => (
              <div key={i} className="requirement-item requirement-undetermined">
                <div className="req-header">
                  <span className="vaccine-tag">{cond.vaccineCode || 'General'}</span>
                  <span className="undetermined-reason">{cond.reason}</span>
                </div>
                {cond.condition && <p className="req-description"><strong>Condition:</strong> {cond.condition}</p>}
                {cond.details && <p className="req-description"><strong>Details:</strong> {cond.details}</p>}
                {cond.suggestion && (
                  <div className="suggestion-box">💡 <strong>Suggestion:</strong> {cond.suggestion}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Warnings ──────────────────────────────────────────────────── */}
        {result.warnings && result.warnings.length > 0 && (
          <div className="warnings-section">
            <h4>⚠️ Warnings</h4>
            <ul className="warnings-list">
              {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        {/* ── Success Banner ─────────────────────────────────────────────── */}
        {status === 'valid' && (
          <div className="success-banner">
            🎉 All immunization requirements met for{' '}
            <strong>{result.metadata?.schoolYear}</strong> in{' '}
            <strong>{result.metadata?.state}</strong>
          </div>
        )}

        {/* ── Raw JSON Toggle ────────────────────────────────────────────── */}
        <RawJsonToggle result={result} />
      </div>
    </div>
  );
}

// ── UNMET Vaccine Card ─────────────────────────────────────────────────────
function UnmetVaccineCard({ req }) {
  return (
    <div className="vaccine-card vaccine-card-fail">
      <div className="vaccine-card-header">
        <span className="vaccine-tag">{req.vaccineCode}</span>
        <span className="vaccine-status-pill fail">❌ FAILED</span>
        <span className="dose-count">
          {req.foundDoses} / {req.requiredDoses} doses found
        </span>
      </div>

      {/* What was required */}
      {req.description && (
        <div className="vaccine-rule-row">
          <span className="rule-label">📋 Required:</span>
          <span className="rule-text">{req.description}</span>
        </div>
      )}

      {/* What was found */}
      <div className="vaccine-rule-row">
        <span className="rule-label">🔍 Found:</span>
        <span className="rule-text rule-fail">
          {req.foundDoses} dose{req.foundDoses !== 1 ? 's' : ''} recorded
          {req.foundDoses < req.requiredDoses
            ? ` — need ${req.requiredDoses - req.foundDoses} more`
            : ''}
        </span>
      </div>

      {/* Why it failed */}
      {req.failureReason && (
        <div className="vaccine-rule-row">
          <span className="rule-label">❌ Why:</span>
          <span className="rule-text rule-fail">{req.failureReason}</span>
        </div>
      )}

      {/* Date condition failures */}
      {req.failedConditions && req.failedConditions.length > 0 && (
        <div className="vaccine-conditions">
          <span className="rule-label">❌ Conditions not met:</span>
          <ul className="conditions-list conditions-fail">
            {req.failedConditions.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      {/* Hint */}
      {req.suggestion && (
        <div className="suggestion-box">💡 <strong>To fix:</strong> {req.suggestion}</div>
      )}
    </div>
  );
}

// ── SATISFIED Vaccine Card ─────────────────────────────────────────────────
function SatisfiedVaccineCard({ req }) {
  return (
    <div className="vaccine-card vaccine-card-pass">
      <div className="vaccine-card-header">
        <span className="vaccine-tag">{req.vaccineCode}</span>
        <span className="vaccine-status-pill pass">✅ SATISFIED</span>
        <span className="dose-count">
          {req.foundDoses} dose{req.foundDoses !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* What was required */}
      {req.description && (
        <div className="vaccine-rule-row">
          <span className="rule-label">📋 Required:</span>
          <span className="rule-text">{req.description}</span>
        </div>
      )}

      {/* How satisfied */}
      {req.satisfiedVia && (
        <div className="vaccine-rule-row">
          <span className="rule-label">✅ Satisfied via:</span>
          <span className="rule-text rule-pass">{req.satisfiedVia}</span>
        </div>
      )}

      {/* Met conditions */}
      {req.metConditions && req.metConditions.length > 0 && (
        <div className="vaccine-conditions">
          <span className="rule-label">✅ Conditions met:</span>
          <ul className="conditions-list conditions-pass">
            {req.metConditions.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Raw JSON Toggle ────────────────────────────────────────────────────────
function RawJsonToggle({ result }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="raw-json-section">
      <button className="btn btn-raw-toggle" onClick={() => setOpen(o => !o)}>
        {open ? '▲ Hide' : '▼ Show'} Raw JSON Response
      </button>
      {open && (
        <pre className="raw-json">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}

export default ResultsDisplay;