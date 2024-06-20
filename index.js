const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mentorship', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Middleware
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
