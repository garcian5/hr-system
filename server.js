const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongodb_uri = process.env.MONGODB_URI;

// connect to mongodb
mongoose.connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// use routes
app.use('/company', require('./backend/routes/company'));
app.use('/department', require('./backend/routes/department'));
app.use('/employee', require('./backend/routes/employee'));
app.use('/image', require('./backend/routes/image'));

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
 }
);