import { ParsrService } from "./parsr.service.js";

export class ParsrController {
  static async parseDocument(req, res) {
    try {
      const file = req.file; // uploaded file (via multer)
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const parsedData = await ParsrService.parseFile(file.path);
      return res.status(200).json(parsedData);
    } catch (err) {
      console.error("Error in controller:", err);
      return res.status(500).json({ error: "Failed to process document" });
    }
  }
}
