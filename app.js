const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/myapi', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a sample route
app.get('/', (req, res) => {
  res.send('Hello, welcome to your API!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
