import { AumationUtils } from './automations.utils.js';

const getLeadsFromKeywords = async keywords => {
  let allLeads = [];

  for (const kw of keywords) {
    console.log(`🔍 Searching for: ${kw}`);
    const ads = await AumationUtils.scrapeAdLibrary(kw);

    // Filter: remove those who have website links
    const leadsWithoutWebsite = ads.filter(ad => !ad.link.includes('.com'));

    allLeads.push(...leadsWithoutWebsite.map(ad => [ad.name, ad.link, kw]));
  }

  if (allLeads.length > 0) {
    await AumationUtils.appendToSheet(allLeads);
    return {
      message: `${allLeads.length} leads saved to sheet`,
      data: allLeads,
    };
  } else {
    return { message: 'No leads found without website', data: [] };
  }
};

export const AutomationService = {
  getLeadsFromKeywords,
};
