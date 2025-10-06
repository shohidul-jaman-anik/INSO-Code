import axios from 'axios';

const OPEN_SWE_BASE_URL = process.env.OPEN_SWE_URL || 'http://localhost:8000'; // OpenSWE running port

export class OpenSWEService {
  static async analyzeRepo(repoUrl) {
    try {
      const response = await axios.post(`${OPEN_SWE_BASE_URL}/analyze`, {
        repo_url: repoUrl,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'OpenSWE request failed',
      );
    }
  }

  static async applyCodeChange(changeRequest) {
    try {
      const response = await axios.post(`${OPEN_SWE_BASE_URL}/apply-change`, {
        change_request: changeRequest,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'OpenSWE request failed',
      );
    }
  }
}
