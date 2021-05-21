const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3005 } = process.env;
const app = express();

const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors')

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Ошибка 404. Ресурс не найден' });
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {});
