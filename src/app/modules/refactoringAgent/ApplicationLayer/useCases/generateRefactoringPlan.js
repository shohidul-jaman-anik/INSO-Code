// modules/refactoringAgent/ApplicationLayer/useCases/generateRefactoringPlan.js
import { refactoringFactory } from '../../DomainLayer/factories/refactoringFactory.js';

const generateRefactoringPlan = async (codeSmells, config = {}) => {
  try {
    const tasks = [];

    for (const smell of codeSmells) {
      const task = refactoringFactory.createRefactoringTask({
        type: mapSmellToRefactoringType(smell.type),
        filePath: smell.filePath,
        description: smell.description,
        originalCode: '', // Will be loaded when applying
        lineStart: smell.lineStart,
        lineEnd: smell.lineEnd,
        priority: smell.severity,
        estimatedImpact: calculateImpact(smell),
      });

      tasks.push(task);
    }

    return {
      success: true,
      data: {
        totalTasks: tasks.length,
        estimatedTimeMinutes: calculateEstimatedTime(tasks),
        tasks: tasks.sort((a, b) => b.estimatedImpact - a.estimatedImpact),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

const mapSmellToRefactoringType = smellType => {
  const mapping = {
    long_method: 'extract_function',
    duplicated_code: 'remove_duplication',
    complex_conditional: 'simplify_conditional',
    magic_number: 'extract_constant',
    dead_code: 'remove_dead_code',
    long_parameter_list: 'introduce_parameter_object',
  };
  return mapping[smellType] || 'refactor';
};

const calculateImpact = smell => {
  const impactMap = { critical: 10, high: 8, medium: 5, low: 3 };
  return impactMap[smell.severity] || 5;
};

const calculateEstimatedTime = tasks => {
  const timePerTask = {
    extract_function: 30,
    remove_duplication: 45,
    simplify_conditional: 20,
    remove_dead_code: 15,
    modernize_syntax: 15,
  };

  return tasks.reduce((total, task) => {
    return total + (timePerTask[task.type] || 20);
  }, 0);
};

export { generateRefactoringPlan };
