import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mean_db++';

// Connect to MongoDB with proper error handling
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    status: 'OK',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Start server after MongoDB connection
const startServer = async () => {
  await connectToDatabase();
  
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`MongoDB URL: ${MONGODB_URI}`);
  });
};

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the application
startServer();

export default app;