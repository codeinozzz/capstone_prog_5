import express from 'express';
import cors from 'cors';
import { connectDatabase } from './infrastructure/database/connection.js';
import { MongoHotelRepository } from './infrastructure/database/mongodb/repositories/MongoHotelRepository.js';
import { MongoRoomRepository } from './infrastructure/database/mongodb/repositories/MongoRoomRepository.js';
import { createHotelController } from './infrastructure/web/controllers/hotelController.js';
import { createRoomController } from './infrastructure/web/controllers/roomController.js';
import { createHotelRoutes } from './infrastructure/web/routes/hotelRoutes.js';
import { createRoomRoutes } from './infrastructure/web/routes/roomRoutes.js';
import { createAuthRoutes } from './infrastructure/web/routes/authRoutes.js';
import { validateRequest } from './infrastructure/web/middleware/validator.js';
import { globalErrorHandler } from './infrastructure/web/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
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

const hotelRepository = new MongoHotelRepository();
const roomRepository = new MongoRoomRepository();

// Controllers
const hotelController = createHotelController(hotelRepository);
const roomController = createRoomController(roomRepository, hotelRepository);

// Routes setup
console.log('Setting up routes...');

// Authentication routes
app.use('/api/auth', createAuthRoutes());

app.use('/api/hotels', createHotelRoutes(hotelController));
app.use('/api/rooms', createRoomRoutes(roomController));

app.get('/', (req, res) => {
  res.json({
    message: 'Hotel Booking API with Keycloak Authentication',
    version: '2.0.0',
    status: 'Running',
    features: [
      'Hexagonal Architecture', 
      'Simple Monads', 
      'MongoDB', 
      'Functional Programming',
      'Keycloak Authentication'
    ],
    endpoints: {
      authentication: {
        config: '/api/auth/config',
        user: '/api/auth/user (protected)',
        verify: '/api/auth/verify (protected)',
        status: '/api/auth/status (optional)',
        help: '/api/auth/help'
      },
      business: {
        hotels: '/api/hotels',
        rooms: '/api/rooms'
      },
      system: {
        health: '/health',
        info: '/'
      }
    },
    keycloak: {
      realm: 'hotel-realm',
      authServer: 'http://localhost:8080',
      clientId: 'hotel-api'
    },
    quickStart: {
      '1_getToken': 'POST http://localhost:8080/realms/hotel-realm/protocol/openid-connect/token',
      '2_testAuth': 'GET /api/auth/user with Authorization: Bearer {token}',
      '3_useAPI': 'Use token with protected endpoints'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      api: 'UP',
      database: 'UP',
      keycloak: 'UP'
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
      console.log('Keycloak authentication enabled');
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