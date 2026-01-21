// InfrastructureLayer/markdownGenerator.js
const generateMarkdownDocumentation = (codeElements, projectName) => {
  let markdown = `# ${projectName} API Documentation\n\n`;
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;

  const byFile = groupByFile(codeElements);

  for (const [filePath, elements] of Object.entries(byFile)) {
    markdown += `## ${filePath}\n\n`;

    for (const element of elements) {
      markdown += generateElementMarkdown(element);
    }
  }

  return markdown;
};

const groupByFile = elements => {
  return elements.reduce((acc, el) => {
    if (!acc[el.filePath]) acc[el.filePath] = [];
    acc[el.filePath].push(el);
    return acc;
  }, {});
};

const generateElementMarkdown = element => {
  let md = `### ${element.name}\n\n`;

  if (element.documentation) {
    md += `${element.documentation}\n\n`;
  }

  if (element.parameters.length > 0) {
    md += `**Parameters:**\n\n`;
    for (const param of element.parameters) {
      md += `- \`${param.name}\` (${param.type})\n`;
    }
    md += '\n';
  }

  if (element.returnType) {
    md += `**Returns:** \`${element.returnType}\`\n\n`;
  }

  return md;
};

export const MarkdownGenerator = {
  generateMarkdownDocumentation,
};
