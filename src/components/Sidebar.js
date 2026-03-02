import React from 'react';

/**
 * Sidebar - V3 Fixed
 *
 * Bug fixed: Removed hardcoded SYSTEM/Health Check section.
 * The previous version added its own SYSTEM block AND testCases.js
 * already had a SYSTEM category — causing two identical sections.
 *
 * Now: ALL categories come exclusively from testCases.js.
 * SYSTEM category test clicks are routed to onHealthCheck handler.
 */
function Sidebar({ testCases, batchScenarios, onLoadTest, onLoadBatchScenario, onHealthCheck }) {
  const categories = [...new Set(Object.values(testCases).map(t => t.category))];

  const handleTestClick = (key, test) => {
    // Route SYSTEM tests to health check, everything else to loadTest
    if (test.category === 'SYSTEM') {
      if (onHealthCheck) onHealthCheck();
    } else {
      onLoadTest(key);
    }
  };

  return (
    <div className="sidebar">
      <h2>Quick Tests</h2>

      {categories.map(category => {
        const tests = Object.entries(testCases).filter(
          ([_, test]) => test.category === category
        );

        return (
          <div key={category} className="test-category">
            <h3>{category}</h3>
            {tests.map(([key, test]) => (
              <button
                key={key}
                className={`test-button ${test.critical ? 'critical' : ''}`}
                onClick={() => handleTestClick(key, test)}
                title={test.description || test.name}
              >
                {test.expectedStatus && (
                  <span className="status-pill">
                    {{ valid: '✅', invalid: '❌', undetermined: '⚠️' }[test.expectedStatus]}{' '}
                  </span>
                )}
                {test.name}
              </button>
            ))}
          </div>
        );
      })}

      {batchScenarios && Object.keys(batchScenarios).length > 0 && (
        <div className="test-category">
          <h3>BATCH SCENARIOS</h3>
          {Object.entries(batchScenarios).map(([key, scenario]) => (
            <button
              key={key}
              className="test-button batch-button"
              onClick={() => onLoadBatchScenario(key)}
            >
              {scenario.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sidebar;