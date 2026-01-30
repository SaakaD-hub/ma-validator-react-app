import React from 'react';

function BatchValidation({ data, setData, onValidate, onLoadExample, onClear }) {
  return (
    <div>
      <div className="info-box">
        <p><strong>Batch Validation:</strong> Submit multiple patients for validation at once. Each patient should have the same structure as single validation. Use the sidebar to load predefined batch scenarios!</p>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            value={data.state}
            onChange={(e) => setData({...data, state: e.target.value})}
            placeholder="MA"
          />
        </div>
        <div className="form-group">
          <label>School Year</label>
          <select
            value={data.schoolYear}
            onChange={(e) => setData({...data, schoolYear: e.target.value})}
          >
            <option value="preschool">Preschool</option>
            <option value="K-6">K-6</option>
            <option value="7-10">Grades 7-10</option>
            <option value="11-12">Grades 11-12</option>
            <option value="college">College</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Patients (JSON Array)</label>
        <textarea
          value={data.patients}
          onChange={(e) => setData({...data, patients: e.target.value})}
          placeholder='[{"id": "patient-001", "birthDate": "2019-01-01", "immunization": [...]}]'
          style={{minHeight: '300px'}}
        />
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={onValidate}>
          Validate Batch
        </button>
        <button className="btn btn-secondary" onClick={onLoadExample}>
          Load Example
        </button>
        <button className="btn btn-secondary" onClick={onClear}>
          Clear Form
        </button>
      </div>
    </div>
  );
}

export default BatchValidation;
