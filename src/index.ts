import express from 'express';
import path from 'path';
import pdfRoutes from './routes/pdfRoutes';

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/pdf', pdfRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API documentation: http://localhost:${PORT}/`);
});
