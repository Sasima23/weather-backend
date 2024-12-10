const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const City = require('../models/city');
const User = require('../models/user');
const router = express.Router();

// Middleware to protect routes (JWT authentication)
const authenticate = (req, res, next) => {
const token = req.headers['authorization']?.split(' ')[1];
if (!token) return res.status(403).json({ error: 'Access denied' });

jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
if (err) return res.status(403).json({ error: 'Invalid token' });
req.userId = decoded.userId;
next();
});
};
router.get('/forecast', auth, (req, res) => {
    // Fetch weather data from a third-party API
    res.json({ forecast: 'Sunny with a chance of rain' });
  });
  
  module.exports = router;
  
// Fetch weather data
router.get('/weather', async (req, res) => {
const city = req.query.city;
if (!city) return res.status(400).json({ error: 'City is required' });

try {
const apiKey = process.env.OPENWEATHERMAP_API_KEY;
const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
res.json(response.data);
} catch (error) {
res.status(500).json({ error: 'Error fetching weather data' });
}
});

// Add a city to favorites
router.post('/favorite', authenticate, async (req, res) => {
const { name, country } = req.body;
const city = new City({ name, country });
await city.save();

const user = await User.findById(req.userId);
user.favoriteCities.push(city._id);
await user.save();

res.status(201).json(city);
});

// Get all favorite cities
router.get('/favorites', authenticate, async (req, res) => {
const user = await User.findById(req.userId).populate('favoriteCities');
res.json(user.favoriteCities);
});

// Delete a city from favorites
router.delete('/favorite/:id', authenticate, async (req, res) => {
const { id } = req.params;
await City.findByIdAndDelete(id);

const user = await User.findById(req.userId);
user.favoriteCities = user.favoriteCities.filter(cityId => cityId.toString() !== id);
await user.save();

res.json({ message: 'City removed from favorites' });
});

module.exports = router;