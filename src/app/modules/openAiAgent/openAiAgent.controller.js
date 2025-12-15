// ==================================================
// controllers/agentController.js
// ==================================================

import { openAiService } from './openAiAgent.service.js';

const programmerAgentController = async (req, res) => {
  try {
    const { prompt, contextSources } = req.body;

    const result = await openAiService.RunProgrammerAgent({
      prompt,
      contextSources,
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

export const openAiController = { programmerAgentController };
