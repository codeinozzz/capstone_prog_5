import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Booking API',
      version: '2.0.0',
      description: 'API for hotel and room management with Keycloak authentication'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
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
        Hotel: {
          type: 'object',
          required: ['name', 'location', 'description'],
          properties: {
            id: {
              type: 'string',
              description: 'Hotel unique identifier'
            },
            name: {
              type: 'string',
              minLength: 3,
              description: 'Hotel name'
            },
            location: {
              type: 'string',
              minLength: 3,
              description: 'Hotel location'
            },
            description: {
              type: 'string',
              minLength: 10,
              description: 'Hotel description'
            },
            rating: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: 'Hotel rating'
            },
            amenities: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Hotel amenities'
            }
          }
        },
        Room: {
          type: 'object',
          required: ['hotelId', 'type', 'capacity', 'price'],
          properties: {
            id: {
              type: 'string',
              description: 'Room unique identifier'
            },
            hotelId: {
              type: 'string',
              description: 'Hotel identifier'
            },
            type: {
              type: 'string',
              enum: ['individual_1', 'individual_2', 'individual_3', 'suite_2', 'suite_family'],
              description: 'Room type'
            },
            capacity: {
              type: 'integer',
              minimum: 1,
              maximum: 4,
              description: 'Room capacity'
            },
            beds: {
              type: 'string',
              description: 'Bed configuration'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Room price per night'
            },
            available: {
              type: 'boolean',
              description: 'Room availability'
            },
            amenities: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Room amenities'
            }
          }
        },
        RoomType: {
          type: 'object',
          properties: {
            value: {
              type: 'string',
              description: 'Room type value'
            },
            label: {
              type: 'string',
              description: 'Room type label'
            },
            capacity: {
              type: 'integer',
              description: 'Room capacity'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object'
            },
            total: {
              type: 'integer'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./src/infrastructure/web/routes/hotelRoutes.js', './src/infrastructure/web/routes/roomRoutes.js']
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };