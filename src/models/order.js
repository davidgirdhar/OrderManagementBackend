const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    products: [
        {
            productId: mongoose.Schema.Types.ObjectId,
            quantity: Number,
        },
    ],
    status: { type: String, default: 'Pending' },
});
// const Order = mongoose.model('Order', orderSchema);
module.exports = mongoose.model('order', orderSchema);