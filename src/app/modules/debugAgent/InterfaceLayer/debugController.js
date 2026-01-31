// modules/debugAgent/InterfaceLayer/debugController.js
import { ApiError } from '../../../utils/ApiError.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import { debugService } from '../ApplicationLayer/debugService.js';

class DebugController {
  /**
   * Analyze application details and provide comprehensive overview
   */
  async handleAnalyzeApplication(req, res, next) {
    try {
      const { applicationDetails, analysisDepth = 'standard' } = req.body;

      if (!applicationDetails) {
        throw new ApiError(400, 'Application details are required');
      }

      const analysis = await debugService.analyzeApplication(
        applicationDetails,
        analysisDepth,
      );

      return res
        .status(200)
        .json(
          new ApiResponse(200, analysis, 'Application analyzed successfully'),
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate architecture diagram and documentation
   */
  async handleGenerateArchitecture(req, res, next) {
    try {
      const { applicationDetails, diagramType = 'comprehensive' } = req.body;

      if (!applicationDetails) {
        throw new ApiError(400, 'Application details are required');
      }

      const architecture = await debugService.generateArchitecture(
        applicationDetails,
        diagramType,
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            architecture,
            'Architecture generated successfully',
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Diagnose specific issues in the application
   */
  async handleDiagnoseIssue(req, res, next) {
    try {
      const { applicationDetails, issueDescription, context } = req.body;

      if (!applicationDetails || !issueDescription) {
        throw new ApiError(
          400,
          'Application details and issue description are required',
        );
      }

      const diagnosis = await debugService.diagnoseIssue(
        applicationDetails,
        issueDescription,
        context,
      );

      return res
        .status(200)
        .json(new ApiResponse(200, diagnosis, 'Issue diagnosed successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Trace execution flow for debugging
   */
  async handleTraceExecution(req, res, next) {
    try {
      const { applicationDetails, executionPath, parameters } = req.body;

      if (!applicationDetails || !executionPath) {
        throw new ApiError(
          400,
          'Application details and execution path are required',
        );
      }

      const trace = await debugService.traceExecution(
        applicationDetails,
        executionPath,
        parameters,
      );

      return res
        .status(200)
        .json(new ApiResponse(200, trace, 'Execution traced successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Suggest fixes for identified issues
   */
  async handleSuggestFixes(req, res, next) {
    try {
      const { applicationDetails, issues, priority = 'high' } = req.body;

      if (!applicationDetails || !issues) {
        throw new ApiError(400, 'Application details and issues are required');
      }

      const fixes = await debugService.suggestFixes(
        applicationDetails,
        issues,
        priority,
      );

      return res
        .status(200)
        .json(new ApiResponse(200, fixes, 'Fixes suggested successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Analyze performance bottlenecks
   */
  async handleAnalyzePerformance(req, res, next) {
    try {
      const { applicationDetails, performanceMetrics } = req.body;

      if (!applicationDetails) {
        throw new ApiError(400, 'Application details are required');
      }

      const performanceAnalysis = await debugService.analyzePerformance(
        applicationDetails,
        performanceMetrics,
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            performanceAnalysis,
            'Performance analyzed successfully',
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Conduct security audit
   */
  async handleSecurityAudit(req, res, next) {
    try {
      const { applicationDetails, auditScope = 'full' } = req.body;

      if (!applicationDetails) {
        throw new ApiError(400, 'Application details are required');
      }

      const securityAudit = await debugService.conductSecurityAudit(
        applicationDetails,
        auditScope,
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            securityAudit,
            'Security audit completed successfully',
          ),
        );
    } catch (error) {
      next(error);
    }
  }
}

export const debugController = new DebugController();
