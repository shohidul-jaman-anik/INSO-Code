// ==================================================
// controllers/agentController.js
// ==================================================

import { languageConvAgentService } from './languageConversion.service.js';

const languageConversionAgentController = async (req, res) => {
  try {
    const { prompt, language } = req.body;

    const result = await languageConvAgentService.RunProgrammerAgent({
      prompt,
      language,
    });
    console.log(result, 'result in controller');

    res.json({
      success: true,
      output: result.finalOutput,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const languageConversionController = {
  languageConversionAgentController,
};
