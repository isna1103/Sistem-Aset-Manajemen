const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./src/config/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRoutes = require('./src/routes');

// Default route
app.get('/', (req, res) => {
  res.send('Sistem Aset Manajemen API is running');
});

// API Routes
app.use('/api', apiRoutes);

// Sync DB
sequelize.sync()
  .then(() => {
    console.log('Database connected and synced...');
  })
  .catch(err => {
    console.error('Error connecting to DB:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
