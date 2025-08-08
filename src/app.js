import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './infrastructure/database/connection.js';
import { DependencyFactory } from './infrastructure/factories/DependencyFactory.js';
import { validateRequest } from './infrastructure/web/middleware/validator.js';
import { globalErrorHandler } from './infrastructure/web/middleware/errorHandler.js';
import { specs, swaggerUi } from './infrastructure/docs/swagger.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
dotenv.config();

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:5173', 'http://127.0.0.1:5500'],
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.headers.authorization) {
    console.log('Authorization header present');
  }
  next();
});

app.use(validateRequest);

const factory = new DependencyFactory();
const { routes } = factory.createAll();

console.log('Setting up routes...');

app.use('/api/auth', routes.auth);
app.use('/api/hotels', routes.hotels);
app.use('/api/rooms', routes.rooms);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/api-docs.json', (req, res) => {
  res.json(specs);
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hotel Booking API with Clerk Authentication',
    version: '2.0.0',
    status: 'Running',
    features: [
      'Hexagonal Architecture', 
      'Simple Monads', 
      'MongoDB', 
      'Functional Programming',
      'Clerk Authentication',
      'Swagger Documentation'
    ],
    endpoints: {
      authentication: {
        user: 'GET /api/auth/user (protected)',
        status: 'GET /api/auth/status (optional)',
        users: 'GET /api/auth/users (protected)',
        config: 'GET /api/auth/config (public)',
        help: 'GET /api/auth/help'
      },
      business: {
        hotels: '/api/hotels',
        rooms: '/api/rooms'
      },
      system: {
        health: '/health',
        info: '/',
        docs: '/api-docs',
        docsJson: '/api-docs.json'
      }
    },
    authentication: {
      provider: 'Clerk',
      type: 'JWT Bearer Token',
      frontend: 'Use Clerk components for login/signup',
      documentation: 'https://clerk.com/docs'
    },
    documentation: {
      swagger: 'http://localhost:3000/api-docs',
      json: 'http://localhost:3000/api-docs.json'
    },
    quickStart: {
      '1_setup_frontend': 'Install @clerk/clerk-react or @clerk/clerk-js',
      '2_add_components': 'Use <SignIn>, <SignUp>, <UserButton>',
      '3_api_calls': 'Clerk automatically adds auth headers',
      '4_view_docs': 'Visit http://localhost:3000/api-docs'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      api: 'UP',
      database: 'UP',
      clerk: 'UP'
    }
  });
});

app.use(globalErrorHandler);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requestedPath: req.originalUrl
  });
});

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Clerk authentication enabled');
      console.log(`API info: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Auth help: http://localhost:${PORT}/api/auth/help`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer().catch(console.error);

export default app;