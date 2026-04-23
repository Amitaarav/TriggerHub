import swaggerAutogen from 'swagger-autogen';
import { configEnv } from './env-config.js';

const doc = {
  info: {
    title: 'Milanam API',
    description: 'Backend API for Milanam application',
    version: '1.0.0'
  },
  servers: [
    {
      url: `http://localhost:${configEnv.port}/api`,
      description: 'Development server'
    },
    {
      url: 'https://api.milanam.com/api',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        $email: "user@example.com",
        $role: "serviceSeeker"
      },
      Post: {
        $title: "Need Plumber",
        $description: "Fixing a leak in the kitchen sink",
        $category: "Plumbing",
        $location: "Bangalore",
        $budget: 500,
        $priority: "medium"
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

const outputFile = './src/swagger-output.json';
const routes = ['./src/app.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);