import { AutomationService } from './automations.service.js';

const fetchAndSaveLeads = async (req, res) => {
  try {
    const { keywords } = req.body;
    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ error: 'keywords must be an array' });
    }

    const result = await AutomationService.getLeadsFromKeywords(keywords);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const AutomationController = {
  fetchAndSaveLeads,
};
