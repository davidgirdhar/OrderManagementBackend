const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config/config');
const { getLogger } = require('nodemailer/lib/shared');

exports.register = async (req, res) => {
    try {
        console.log("register called");
        
        const { name, email, password } = req.body;
        console.log("name",name,"email",email);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(400).send('Email already exists');
    }
};

exports.login = async (req, res) => {
    try {
        console.log("login called");
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Email not found');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid password');

        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        res.header('Authorization', `Bearer ${token}`).send('Logged in');
        console.log("res",res);
        
    } catch (err) {
        res.status(500).send('Server error');
    }
};
