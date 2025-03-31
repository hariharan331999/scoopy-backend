require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Atlas Connected'))
    .catch(err => console.error('MongoDB Atlas Connection Error:', err));

// Root Route
app.get('/', (req, res) => {
    res.send('Backend API is running...');
});

// POST API Endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        const newContact = new Contact({
            firstName,
            lastName,
            email,
            phone,
            message
        });

        await newContact.save();
        res.status(201).json({ message: 'Contact saved successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
