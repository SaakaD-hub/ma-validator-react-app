import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ValidationService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });
  }

  async healthCheck() {
    try {
      const response = await this.client.get('/api/v1/validate/health');
      return { success: true, status: response.status, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async validateSingle(patient, params) {
    try {
      // Send both param names — backend may use either
      const queryParams = new URLSearchParams({
        state: params.state || 'MA',
        schoolYear: params.schoolYear || 'K-6',
        includeDetails: 'true',       // some backends use this
        responseMode: 'detailed',     // others use this
        detailed: 'true',             // belt-and-suspenders
      });

      const response = await this.client.post(
        `/api/v1/validate/single?${queryParams}`,
        patient
      );
      return { success: true, status: response.status, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async validateBatch(batchRequest) {
    try {
      const response = await this.client.post('/api/v1/validate/batch', batchRequest);
      return { success: true, status: response.status, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  setBaseURL(url) {
    this.client.defaults.baseURL = url;
  }

  handleError(error) {
    if (error.response) {
      const data = error.response.data;
      const message =
        data?.message ||
        data?.errors?.[0]?.defaultMessage ||
        data?.error ||
        (error.response.status === 400
          ? `Bad request (${error.response.status}) — check Patient ID and required fields`
          : `Server error (${error.response.status})`);
      return { success: false, status: error.response.status, error: message, data };
    } else if (error.request) {
      return {
        success: false,
        error: 'No response from server. Make sure Spring Boot is running on port 8080.',
      };
    } else {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }
}

export default new ValidationService();