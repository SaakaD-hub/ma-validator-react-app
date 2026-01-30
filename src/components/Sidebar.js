import React from 'react';

function Sidebar({ testCases, batchScenarios, onLoadTest, onLoadBatchScenario }) {
  // Group test cases by category
  const categories = [...new Set(Object.values(testCases).map(t => t.category))];

  return (
    <div className="sidebar">
      <h2>Quick Tests</h2>
      
      {categories.map(category => {
        const tests = Object.entries(testCases).filter(([_, test]) => test.category === category);
        
        return (
          <div key={category} className="test-category">
            <h3>{category}</h3>
            {tests.map(([key, test]) => (
              <button
                key={key}
                className={`test-button ${test.critical ? 'critical' : ''}`}
                onClick={() => onLoadTest(key)}
              >
                {test.name}
              </button>
            ))}
          </div>
        );
      })}

      <div className="test-category">
        <h3>Batch Scenarios</h3>
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
    </div>
  );
}

export default Sidebar;
