import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './openapiRegistry.js';

import './userDocs.js';

const generateOpenApiSpec = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Dynamic Express TypeScript API',
      version: '1.0.0',
      description:
        'Interactive API playground compiled dynamically straight out of Zod validation schemas.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local Dev Environment' }],
  });
};

const openapiSpecification = generateOpenApiSpec();
export default openapiSpecification;
