import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import menuRouter from './routes/menu.js';
import cartRouter from './routes/cart.js';
import orderRouter from './routes/orders.js';
import errorHandler from './middlewares/errorHandler.js';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT;
mongoose.connect(process.env.CONNECTION_STRING);
const database = mongoose.connection;

const swaggerDocs = YAML.load('./docs/docs.yml');


// Middlewares
app.use(express.json());

// Routes
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

database.on('error', (error) => console.log(error));
database.once('connected', () => {
    console.log('DB Connected');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

app.use(errorHandler);