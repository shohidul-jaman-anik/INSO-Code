// InfrastructureLayer/openApiGenerator.js
const generateOpenAPISpec = (apiElements, projectInfo) => {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: projectInfo.name,
      version: projectInfo.version || '1.0.0',
      description: projectInfo.description || '',
    },
    paths: {},
  };

  for (const element of apiElements) {
    if (element.isApiEndpoint) {
      const path = element.path || `/${element.name}`;
      const method = element.method?.toLowerCase() || 'get';

      if (!spec.paths[path]) spec.paths[path] = {};

      spec.paths[path][method] = {
        summary: element.name,
        description: element.documentation || '',
        parameters: element.parameters.map(p => ({
          name: p.name,
          in: p.in || 'query',
          required: p.required || false,
          schema: { type: p.type || 'string' },
        })),
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
        },
      };
    }
  }

  return spec;
};

export const OpenApiGenerator = {
  generateOpenAPISpec,
};
