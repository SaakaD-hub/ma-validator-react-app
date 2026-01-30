import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ValidationService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });
  }

  /**
   * Health check endpoint
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/api/v1/validate/health');
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Validate single patient
   */
  async validateSingle(patient, params) {
    try {
      const queryParams = new URLSearchParams({
        state: params.state || 'MA',
        schoolYear: params.schoolYear || 'K-6',
        responseMode: params.responseMode || 'detailed',
      });

      const response = await this.client.post(
        `/api/v1/validate/single?${queryParams}`,
        patient
      );

      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Validate batch of patients
   */
  async validateBatch(batchRequest) {
    try {
      const response = await this.client.post(
        '/api/v1/validate/batch',
        batchRequest
      );

      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        status: error.response.status,
        error: error.response.data?.message || 'Server error',
        data: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: 'No response from server. Make sure the API is running.',
      };
    } else {
      // Error in request setup
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Set API base URL dynamically
   */
  setBaseURL(url) {
    this.client.defaults.baseURL = url;
  }
}

export default new ValidationService();
