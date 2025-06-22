const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Breakfast',
            'Chicken & Fish',
            'Crispy Chicken',
            'Wraps',
            'Happy Meal',
            'Extra Value Meals',
            'Value Meals',
            'Desserts',
            'Beverages',
            'McCafé',
            'Beef',
            'Fries & Sides'
        ]
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema); 