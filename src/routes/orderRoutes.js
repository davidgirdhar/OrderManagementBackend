const express = require('express');
const authenticate = require('../middlewares/auth');
const {
    createOrder,
    updateOrderStatus,
    getUserOrders,
    deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

// Route to create a new order (protected)
router.post('/', authenticate, createOrder);

// Route to update the status of an order (protected)
router.put('/:id', authenticate, updateOrderStatus);

// Route to fetch all orders for a user (protected)
router.get('/', authenticate, getUserOrders);

// Route to delete an order (protected)
router.delete('/:id', authenticate, deleteOrder);

module.exports = router;
