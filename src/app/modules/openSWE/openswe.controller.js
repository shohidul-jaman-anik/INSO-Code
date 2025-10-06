import { OpenSWEService } from "./openswe.service.js";

export class OpenSWEController {
  static async analyze(req, res) {
    try {
      const { repoUrl } = req.body;
      const result = await OpenSWEService.analyzeRepo(repoUrl);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async applyChange(req, res) {
    try {
      const { changeRequest } = req.body;
      const result = await OpenSWEService.applyCodeChange(changeRequest);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
