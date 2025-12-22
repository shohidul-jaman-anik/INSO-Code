// ==================================================
// controllers/agentController.js
// ==================================================

import { openAiService } from './openAiAgent.service.js';

const programmerAgentController = async (req, res) => {
  try {
    const { prompt: task, language: targetLanguage } = req.body;
   
    if (!task || task.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Task/prompt is required.',
      });
    }

    if (!targetLanguage || targetLanguage.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Target programming language is required.',
      });
    }

    const result = await openAiService.RunProgrammerAgent({
      task,
      targetLanguage,
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
