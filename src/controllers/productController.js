const Product = require('../models/product');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid'); // Import UUID library

// Validation Schema
const productValidationSchema = Joi.object({
    id: Joi.string().required(), // `id` is required
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    minStock: Joi.number(),
    maxStock: Joi.number()
});

// Create a Product
exports.createProduct = async (req, res) => {
    const { error } = productValidationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const productData = {
            ...req.body,
            id: req.body.id || uuidv4() // Generate unique `id` if not provided
        };

        // Check if the `id` already exists
        const existingProduct = await Product.findOne({ id: productData.id });
        if (existingProduct) return res.status(400).send('Product with this ID already exists.');

        const product = new Product(productData);
        await product.save();
        res.status(201).send('Product created');
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Update a Product
exports.updateProduct = async (req, res) => {
    const updates = req.body;

    try {
        // Check if the `id` is being updated and ensure uniqueness
        console.log("update product request called");
        
        if (updates.id) {
            const existingProduct = await Product.findOne({ id: updates.id, id: { $ne: req.params.id } });
            console.log(`existing product: ${JSON.stringify(existingProduct)}`);            
            if (existingProduct) return res.status(400).send('Product with this ID already exists.');
        }

        const product = await Product.findOneAndUpdate({ id: req.params.id }, updates, { new: true });
        if (!product) return res.status(404).send('Product not found');
        res.send(product);
    } catch (err) {
        console.log("error", err);
        
        res.status(500).send('Server error');
    }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
    console.log("req:", req);
    
    const { minPrice, maxPrice, inStock, name } = req.body;
    const filter = { deleted: false };
    // console.log();
    
    if (minPrice) filter.price = { ...filter.price, $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };
    if (inStock) filter.stock = { $gt: 0 };
    
    if (name) filter.name = new RegExp(name, 'i');
    console.log(`filter ${JSON.stringify(filter)}`);
    
    try {
        const products = await Product.find(filter);
        res.send(products);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Delete a Product (Soft Delete)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate({ id: req.params.id }, { deleted: true });
        if (!product) return res.status(404).send('Product not found');
        res.send('Product deleted');
    } catch (err) {
        res.status(500).send('Server error');
    }
};
