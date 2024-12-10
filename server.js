const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());                      // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json());               // Parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Use routes for user authentication and weather
app.use('/auth', authRoutes);          // User auth routes (login, register)
app.use('/weather', weatherRoutes);    // Weather-related routes (get weather, manage favorites)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
