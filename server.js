require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000,  // ⬅️ Increase timeout to 60 seconds
    socketTimeoutMS: 60000            // ⬅️ Increase socket timeout
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define Contact Schema
const ContactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

// API Endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ message: 'Contact saved successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
