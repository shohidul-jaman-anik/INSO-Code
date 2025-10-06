import axios from "axios";
import fs from "fs";

const PARSR_URL = process.env.PARSR_URL || "http://localhost:3001/api";

export class ParsrService {
  static async parseFile(filePath) {
    try {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(filePath));
      formData.append("config", JSON.stringify({
        "clean": {
          "removeHeaders": true,
          "removeFooters": true
        },
        "extract": {
          "headings": true,
          "tables": true,
          "lists": true
        }
      }));

      const response = await axios.post(`${PARSR_URL}/document`, formData, {
        headers: formData.getHeaders(),
      });

      return response.data;
    } catch (err) {
      console.error("Error in ParsrService:", err.message);
      throw err;
    }
  }
}
