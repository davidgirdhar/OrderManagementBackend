const cron = require('node-cron');
const Config = require('../models/config');
const Product = require('../models/product');
const Order = require('../models/order');

async function initializeCronJobs() {
    const minStockConfig = await Config.findOne({ key: 'minStock' });
    const pendingOrderHoursConfig = await Config.findOne({ key: 'pendingOrderHours' });

    const minStock = minStockConfig ? minStockConfig.value : 10;
    const pendingOrderHours = pendingOrderHoursConfig ? pendingOrderHoursConfig.value : 24;

    cron.schedule('0 0 * * *', async () => {
        const lowStockProducts = await Product.find({ stock: { $lt: minStock }, deleted: false });
        if (lowStockProducts.length) {
            console.log('Low stock notification logic');
        }
    });

    cron.schedule('0 * * * *', async () => {
        const pendingOrders = await Order.find({
            status: 'Pending',
            createdAt: { $lt: new Date(Date.now() - pendingOrderHours * 60 * 60 * 1000) },
        });
        if (pendingOrders.length) {
            console.log('Pending order reminder logic');
        }
    });
}

module.exports = { initializeCronJobs };
