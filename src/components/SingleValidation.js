import React from 'react';

/**
 * SingleValidation - V3
 * No structural changes needed - V3 params (includeDetails) are
 * handled by validationService.js automatically.
 */
function SingleValidation({ data, setData, onValidate, onClear }) {
  return (
    <div>
      <div className="info-box">
        <p>
          <strong>Tip:</strong> Click any test from the sidebar to auto-fill
          the form, or enter your own patient data below.
        </p>
      </div>

      {/* Patient ID + Birth Date */}
      <div className="grid-2">
        <div className="form-group">
          <label>Patient ID</label>
          <input
            type="text"
            value={data.id}
            onChange={(e) => setData({ ...data, id: e.target.value })}
            placeholder="patient-001"
          />
        </div>
        <div className="form-group">
          <label>Birth Date (YYYY-MM-DD)</label>
          <input
            type="text"
            value={data.birthDate}
            onChange={(e) => setData({ ...data, birthDate: e.target.value })}
            placeholder="2019-01-01"
          />
        </div>
      </div>

      {/* State + School Year */}
      <div className="grid-2">
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            value={data.state}
            onChange={(e) => setData({ ...data, state: e.target.value })}
            placeholder="MA"
          />
        </div>
        <div className="form-group">
          <label>School Year</label>
          <select
            value={data.schoolYear}
            onChange={(e) => setData({ ...data, schoolYear: e.target.value })}
          >
            <option value="preschool">Preschool</option>
            <option value="K-6">K-6</option>
            <option value="7-10">Grades 7-10</option>
            <option value="11-12">Grades 11-12</option>
            <option value="college">College</option>
          </select>
        </div>
      </div>

      {/* Immunizations */}
      <div className="form-group">
        <label>Immunizations (JSON Array)</label>
        <textarea
          value={data.immunization}
          onChange={(e) => setData({ ...data, immunization: e.target.value })}
          placeholder='[{"vaccineCode": "DTaP", "occurrenceDateTime": "2019-03-01"}]'
        />
      </div>

      {/* Exceptions */}
      <div className="form-group">
        <label>Exceptions (JSON Array - Optional)</label>
        <textarea
          value={data.exceptions}
          onChange={(e) => setData({ ...data, exceptions: e.target.value })}
          placeholder='[{"vaccineCode": "DTaP", "exceptionType": "RELIGIOUS_EXEMPTION"}]'
          style={{ minHeight: '100px' }}
        />
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="btn btn-primary" onClick={onValidate}>
          Validate Patient
        </button>
        <button className="btn btn-secondary" onClick={onClear}>
          Clear Form
        </button>
      </div>
    </div>
  );
}

export default SingleValidation;