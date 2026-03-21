const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const { swaggerUi, swaggerDocument } = require('./config/swagger');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
const notFoundMiddleware = require('./middleware/notFound.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Alumni Influencer Marketplace API is running'
    });
});

app.use('/api', apiLimiter, routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;