const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const otherRouter = require('./routes/other');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  family: 4,
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64a73ebf81a6167a2d02f94d',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use(otherRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});