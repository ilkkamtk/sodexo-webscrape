import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
    },
  }),
);

app.use(cors());
app.use(express.json());

// serve public folder for apidoc
app.use(express.static('public'));

// serve uploads folder for images
app.use('/uploads', express.static('uploads'));

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Server is running!',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
