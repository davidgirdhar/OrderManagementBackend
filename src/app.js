const express = require('express');
const connectDB = require('./config/database');
const { initializeCronJobs } = require('./services/cronService');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const { PORT } = require('./config/config');

connectDB();
initializeCronJobs();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/orders', orderRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
