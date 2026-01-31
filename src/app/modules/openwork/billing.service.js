// ============================================
// USAGE TRACKING & BILLING
// ============================================

// services/billing.service.js
export const trackAIUsage = async (workspaceId, tokens, cost) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  
  if (!workspace) return;
  
  // Update workspace usage
  workspace.usage.apiCalls += 1;
  await workspace.save();
  
  // Create usage record for billing
  await AIUsageModel.create({
    workspaceId,
    tokens,
    cost,
    timestamp: new Date()
  });
  
  // Check if approaching limit
  const plan = await SubscriptionPlanModel.findById(workspace.subscription.planId);
  const limit = plan.limits.apiCalls;
  
  if (limit !== -1) {
    const usagePercentage = (workspace.usage.apiCalls / limit) * 100;
    
    if (usagePercentage >= 80 && usagePercentage < 90) {
      // Send warning email at 80%
      await sendEmail({
        to: workspace.owner.email,
        subject: 'AI Usage Warning - 80% Used',
        template: 'usage-warning',
        data: { percentage: 80, workspace: workspace.name }
      });
    } else if (usagePercentage >= 90 && usagePercentage < 100) {
      // Send critical warning at 90%
      await sendEmail({
        to: workspace.owner.email,
        subject: 'AI Usage Critical - 90% Used',
        template: 'usage-warning',
        data: { percentage: 90, workspace: workspace.name }
      });
    } else if (usagePercentage >= 100) {
      // Block further requests
      await sendEmail({
        to: workspace.owner.email,
        subject: 'AI Usage Limit Reached',
        template: 'usage-limit-reached',
        data: { workspace: workspace.name }
      });
    }
  }
};

// Calculate cost based on model
export const calculateTokenCost = (provider, model, tokens) => {
  const pricing = {
    anthropic: {
      'claude-opus-4.5': { input: 0.015, output: 0.075 },
      'claude-sonnet-4.5': { input: 0.003, output: 0.015 },
      'claude-haiku-4.5': { input: 0.0008, output: 0.004 }
    },
    openai: {
      'gpt-4o': { input: 0.005, output: 0.015 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
    },
    google: {
      'gemini-pro': { input: 0.0005, output: 0.0015 }
    }
  };
  
  const modelPricing = pricing[provider]?.[model] || { input: 0.001, output: 0.002 };
  
  // Estimate input/output split (60% input, 40% output)
  const inputTokens = tokens.input || Math.floor(tokens.total * 0.6);
  const outputTokens = tokens.output || Math.floor(tokens.total * 0.4);
  
  const cost = (inputTokens / 1000 * modelPricing.input) + 
               (outputTokens / 1000 * modelPricing.output);
  
  return parseFloat(cost.toFixed(6));
};
