const Order = require('../models/order');
const Product = require('../models/product');

// Create an Order
exports.createOrder = async (req, res) => {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).send('Products array is required and cannot be empty.');
    }

    try {
        // Validate product availability and stock
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).send(`Product with ID ${item.productId} not found.`);
            }
            if (product.stock < item.quantity) {
                return res.status(400).send(`Insufficient stock for product: ${product.name}`);
            }
        }

        // Deduct stock
        for (const item of products) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity },
            });
        }

        // Create the order
        const order = new Order({
            userId: req.user._id,
            products,
        });
        await order.save();
        res.status(201).send(order);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
        return res.status(400).send('Invalid status. Valid statuses are: Pending, Shipped, Delivered, Cancelled.');
    }

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).send('Order not found.');
        res.send(order);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Get All Orders for a User
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        res.send(orders);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Delete an Order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).send('Order not found.');
        res.send('Order deleted successfully.');
    } catch (err) {
        res.status(500).send('Server error');
    }
};
