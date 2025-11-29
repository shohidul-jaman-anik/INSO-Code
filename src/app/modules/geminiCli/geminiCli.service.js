import { spawn } from 'child_process';

const runGeminiCLI = prompt => {
  return new Promise((resolve, reject) => {
    let finalOutput = '';

    const process = spawn('gemini', ['generate-text', prompt]);

    process.stdout.on('data', data => {
      finalOutput += data.toString();
    });

    process.stderr.on('data', data => {
      console.error('Gemini CLI Error:', data.toString());
    });

    process.on('close', () => {
      resolve(finalOutput.trim());
    });

    process.on('error', err => {
      reject(err);
    });
  });
};

export const GeminiCliService = {
  runGeminiCLI,
};
