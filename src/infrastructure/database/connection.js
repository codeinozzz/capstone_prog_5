import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin_sop:password123@localhost:27018/jala_agency?authSource=admin';
    
    await mongoose.connect(mongoUri);
    
    console.log('MongoDB Docker Connected');
    console.log(`Database: ${process.env.MONGO_DATABASE || 'jala_agency'}`);
    console.log(`Docker MongoDB running on port ${process.env.MONGO_PORT }`);
    console.log(`Mongo Express: http://localhost:8081`);
    
  } catch (error) {
    console.error('MongoDB connection error:', error);

    process.exit(1);
  }
};