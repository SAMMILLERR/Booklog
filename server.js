require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const books    = require('./routes/book');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/books', books);

async function start() {
  try {
    console.log(process.env.MONGO_URL);
    console.log(process.env.PORT);
    await mongoose.connect(process.env.MONGO_URL);
    console.log('DB connected');
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (e) {
    console.error('Startup error:', e);
  }
}

start();
