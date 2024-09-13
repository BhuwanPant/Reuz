const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

const corsOptions = {
  origin: 'https://reuz-2.onrender.com',
};

app.use(cors(corsOptions));

// Serve static files from the "images" directory
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json());

// Mock data
const phones = [
  { id: 1, brand: 'Apple', model: 'iPhone 12', image: 'https://w7.pngwing.com/pngs/186/863/png-transparent-apple-logo-apple-logo-computer-wallpaper-silhouette.png' },
  { id: 2, brand: 'Samsung', model: 'Galaxy S21', image: '/images/samsung.png' },
  { id: 3, brand: 'Google', model: 'Pixel 5', image: 'https://example.com/pixel5.jpg' },
];

app.get('/phones', (req, res) => {
  res.json(phones);
});

const phoneBrands = ['Apple', 'Samsung', 'Google', 'OnePlus'];
const phoneSeries = {
  Apple: ['iPhone 12', 'iPhone 13', 'iPhone 14'],
  Samsung: ['Galaxy S21', 'Galaxy S22', 'Galaxy S23'],
  Google: ['Pixel 6', 'Pixel 7'],
  OnePlus: ['OnePlus 9', 'OnePlus 10'],
};
const phoneVariants = ['64GB/4GB', '128GB/6GB', '256GB/8GB'];
const timeSlots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

// Get phone brands
app.get('/phone-brands', (req, res) => {
  res.json(phoneBrands);
});

// Get phone series for a specific brand
app.get('/phone-series/:brand', (req, res) => {
  const brand = req.params.brand;
  res.json(phoneSeries[brand] || []);
});

// Get phone variants
app.get('/phone-variants', (req, res) => {
  res.json(phoneVariants);
});

// Get time slots
app.get('/time-slots', (req, res) => {
  res.json(timeSlots);
});

// Estimate price
app.post('/estimate-price', (req, res) => {
  const { brand, series, variant } = req.body;
  const mockPrice = Math.floor(Math.random() * 50000) + 10000; // Random price between 10000 and 60000
  res.json({ price: mockPrice });
});

app.listen(port, () => {
  console.log(`Phone Selling API running at http://localhost:${port}`);
});
