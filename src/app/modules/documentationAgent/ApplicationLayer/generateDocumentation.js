// ApplicationLayer/generateDocumentation.js
const generateDocumentation = async (codeElements, config) => {
  const generatedDocs = [];

  for (const element of codeElements) {
    if (!element.hasDocumentation) {
      const doc = await generateDocForElement(element, config);
      generatedDocs.push({ element, documentation: doc });
    }
  }

  return {
    success: true,
    data: {
      generated: generatedDocs.length,
      documents: generatedDocs,
    },
  };
};

const generateDocForElement = async (element, config) => {
  // Template-based documentation generation
  const templates = {
    function: generateFunctionDoc,
    class: generateClassDoc,
    method: generateMethodDoc,
  };

  const generator = templates[element.elementType] || generateGenericDoc;
  return generator(element, config);
};

const generateFunctionDoc = (element, config) => {
  let doc = '/**\n * TODO: Add function description';

  if (element.parameters && element.parameters.length > 0) {
    doc += '\n';
    element.parameters.forEach(p => {
      doc += `\n * @param {${p.type || 'any'}} ${p.name} - ${p.description || 'TODO: Add description'}`;
    });
  }

  if (element.returnType) {
    doc += `\n * @returns {${element.returnType}} TODO: Add return description`;
  }

  doc += '\n */';
  return doc;
};

const generateClassDoc = (element, config) => {
  return `/**
 * ${element.name} class
 * TODO: Add class description
 */`;
};

const generateMethodDoc = (element, config) => {
  return generateFunctionDoc(element, config);
};

const generateGenericDoc = (element, config) => {
  return `/**
 * TODO: Add documentation for ${element.name}
 */`;
};

export const GenerateDocumentations = {
  generateDocumentation,
};
