const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({    
    id: { type: String, unique: true},
    name: String,
    description: String,
    price: Number,
    stock: Number,
    minStock: Number,
    maxStock: Number,
    deleted: { type: Boolean, default: false },
});
// const Product = mongoose.model('Product', productSchema);
module.exports = mongoose.model('product', productSchema);