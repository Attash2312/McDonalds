const mongoose = require('mongoose');
const MenuItem = require('../models/Menu');
require('dotenv').config();

const menuItems = [
    // Breakfast Items
    {
        name: 'Omelette McMuffin Meal',
        description: 'A delicious omelette with cheese in a toasted English muffin.',
        price: 5.99,
        image: '/images/mega-menu/breakfast-pk-new-.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Chicken Sausage McMuffin w/Egg Meal',
        description: 'Chicken sausage patty with egg and cheese on a toasted English muffin.',
        price: 6.49,
        image: '/images/mega-menu/breakfast-pk-new-.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Chicken Sausage McMuffin Meal',
        description: 'Chicken sausage patty with cheese on a toasted English muffin.',
        price: 5.99,
        image: '/images/mega-menu/breakfast-pk-new-.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Egg McMuffin Meal',
        description: 'Egg and cheese on a toasted English muffin.',
        price: 5.49,
        image: '/images/mega-menu/breakfast-pk-new-.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Egg & Cheese McMuffin Meal',
        description: 'Egg and cheese on a toasted English muffin.',
        price: 5.49,
        image: '/images/mega-menu/breakfast-pk-new-.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Chicken Muffin Meal',
        description: 'Chicken patty with cheese on a toasted English muffin.',
        price: 5.99,
        image: '/images/mega-menu/breakfast-pk-new-.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Hot Cakes',
        description: 'Three fluffy hot cakes served with butter and syrup.',
        price: 4.99,
        image: '/images/mega-menu/breakfast-pk-new-.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Big Breakfast',
        description: 'Scrambled eggs, sausage, hash browns, and hot cakes.',
        price: 7.99,
        image: '/images/mega-menu/breakfast-pk-new-.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Egg N\' Sausage Wrap',
        description: 'Scrambled eggs and sausage wrapped in a tortilla.',
        price: 5.99,
        image: '/images/mega-menu/breakfast-pk-new-.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Egg N\' Hashbrowns Wrap',
        description: 'Scrambled eggs and hash browns wrapped in a tortilla.',
        price: 5.99,
        image: '/images/mega-menu/breakfast-pk-new-.jpg',
        category: 'Breakfast'
    },
    {
        name: 'Omelette N\' Tomato Wrap',
        description: 'Omelette with tomato wrapped in a tortilla.',
        price: 5.99,
        image: '/images/mega-menu/breakfast-pk-new-.jpg',
        category: 'Breakfast'
    },

    // Chicken & Fish
    {
        name: 'McChicken',
        description: 'Crispy chicken patty topped with lettuce and creamy mayonnaise.',
        price: 4.99,
        image: '/images/mega-menu/chicken-and-fish.jpg',
        category: 'Chicken & Fish'
    },
    {
        name: 'Filet-O-Fish',
        description: 'Wild-caught fish fillet topped with tartar sauce and cheese.',
        price: 5.49,
        image: '/images/mega-menu/chicken-and-fish.jpg',
        category: 'Chicken & Fish'
    },

    // Crispy Chicken
    {
        name: 'Crispy Chicken Sandwich',
        description: 'Crispy chicken fillet topped with lettuce and creamy mayonnaise.',
        price: 5.99,
        image: '/images/mega-menu/chicken.png',
        category: 'Crispy Chicken'
    },
    {
        name: 'Spicy Crispy Chicken Sandwich',
        description: 'Spicy crispy chicken fillet topped with lettuce and creamy mayonnaise.',
        price: 5.99,
        image: '/images/mega-menu/chicken.png',
        category: 'Crispy Chicken'
    },

    // Wraps
    {
        name: 'Chicken Wrap',
        description: 'Crispy chicken fillet with lettuce and sauce wrapped in a tortilla.',
        price: 5.99,
        image: '/images/mega-menu/wraps.png',
        category: 'Wraps'
    },
    {
        name: 'Spicy Chicken Wrap',
        description: 'Spicy crispy chicken fillet with lettuce and sauce wrapped in a tortilla.',
        price: 5.99,
        image: '/images/mega-menu/wraps.png',
        category: 'Wraps'
    },

    // Happy Meal
    {
        name: 'Happy Meal - Hamburger',
        description: 'Hamburger, small fries, and a drink with a toy.',
        price: 4.99,
        image: '/images/mega-menu/happy-meals-pk-new.jpg',
        category: 'Happy Meal'
    },
    {
        name: 'Happy Meal - Cheeseburger',
        description: 'Cheeseburger, small fries, and a drink with a toy.',
        price: 5.49,
        image: '/images/mega-menu/happy-meals-pk-new.jpg',
        category: 'Happy Meal'
    },
    {
        name: 'Happy Meal - Chicken Nuggets',
        description: '4-piece chicken nuggets, small fries, and a drink with a toy.',
        price: 5.49,
        image: '/images/mega-menu/happy-meals-pk-new.jpg',
        category: 'Happy Meal'
    },

    // Value Meals
    {
        name: 'Big Mac Meal',
        description: 'Big Mac, medium fries, and a medium drink.',
        price: 8.99,
        image: '/images/mega-menu/extra-value-meals-pk-new.jpg',
        category: 'Value Meals'
    },
    {
        name: 'Quarter Pounder Meal',
        description: 'Quarter Pounder with Cheese, medium fries, and a medium drink.',
        price: 8.99,
        image: '/images/mega-menu/extra-value-meals-pk-new.jpg',
        category: 'Value Meals'
    },
    {
        name: 'McChicken Meal',
        description: 'McChicken, medium fries, and a medium drink.',
        price: 7.99,
        image: '/images/mega-menu/extra-value-meals-pk-new.jpg',
        category: 'Value Meals'
    },

    // Desserts
    {
        name: 'McFlurry - Oreo',
        description: 'Creamy vanilla soft serve with Oreo cookie pieces.',
        price: 3.99,
        image: '/images/mega-menu/desserts-pk-new.jpg',
        category: 'Desserts'
    },
    {
        name: 'McFlurry - M&M\'s',
        description: 'Creamy vanilla soft serve with M&M\'s chocolate candies.',
        price: 3.99,
        image: '/images/mega-menu/desserts-pk-new.jpg',
        category: 'Desserts'
    },
    {
        name: 'Apple Pie',
        description: 'Warm, flaky crust filled with sweet apple filling.',
        price: 1.99,
        image: '/images/mega-menu/desserts-pk-new.jpg',
        category: 'Desserts'
    },

    // Beverages
    {
        name: 'Coca-Cola',
        description: 'Refreshing Coca-Cola soft drink.',
        price: 1.99,
        image: '/images/mega-menu/beverages-pk-new.jpg',
        category: 'Beverages'
    },
    {
        name: 'Sprite',
        description: 'Lemon-lime flavored soft drink.',
        price: 1.99,
        image: '/images/mega-menu/beverages-pk-new.jpg',
        category: 'Beverages'
    },
    {
        name: 'Fanta Orange',
        description: 'Orange flavored soft drink.',
        price: 1.99,
        image: '/images/mega-menu/beverages-pk-new.jpg',
        category: 'Beverages'
    },

    // McCafé
    {
        name: 'Latte',
        description: 'Rich espresso with steamed milk and a light layer of foam.',
        price: 3.99,
        image: '/images/mega-menu/McCafe-pk-new.jpg',
        category: 'McCafé'
    },
    {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and a thick layer of foam.',
        price: 3.99,
        image: '/images/mega-menu/McCafe-pk-new.jpg',
        category: 'McCafé'
    },
    {
        name: 'Mocha',
        description: 'Espresso with chocolate and steamed milk.',
        price: 4.29,
        image: '/images/mega-menu/McCafe-pk-new.jpg',
        category: 'McCafé'
    },

    // Beef
    {
        name: 'Big Mac',
        description: 'Two 100% pure beef patties and Big Mac sauce sandwiched between a sesame seed bun.',
        price: 5.99,
        image: '/images/mega-menu/beef-img.jpg',
        category: 'Beef'
    },
    {
        name: 'Quarter Pounder with Cheese',
        description: 'Quarter pound of 100% pure beef with cheese, onions, pickles, mustard, and ketchup.',
        price: 5.99,
        image: '/images/mega-menu/beef-img.jpg',
        category: 'Beef'
    },
    {
        name: 'Double Cheeseburger',
        description: 'Two 100% pure beef patties with cheese, onions, pickles, mustard, and ketchup.',
        price: 4.99,
        image: '/images/mega-menu/beef-img.jpg',
        category: 'Beef'
    },

    // Fries & Sides
    {
        name: 'World Famous Fries',
        description: 'Our signature golden fries, crispy on the outside and fluffy on the inside.',
        price: 2.99,
        image: '/images/mega-menu/fries-and-sides.jpg',
        category: 'Fries & Sides'
    },
    {
        name: 'Chicken McNuggets - 6 piece',
        description: 'Bite-sized pieces of white meat chicken, breaded and fried.',
        price: 4.99,
        image: '/images/mega-menu/fries-and-sides.jpg',
        category: 'Fries & Sides'
    },
    {
        name: 'Chicken McNuggets - 10 piece',
        description: 'Bite-sized pieces of white meat chicken, breaded and fried.',
        price: 7.99,
        image: '/images/mega-menu/fries-and-sides.jpg',
        category: 'Fries & Sides'
    }
];

// Connect to MongoDB
const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mcdonalds', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Clear existing menu items
        console.log('Clearing existing menu items...');
        const deleteResult = await MenuItem.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing menu items`);
        
        // Insert new menu items
        console.log('Inserting new menu items...');
        const insertResult = await MenuItem.insertMany(menuItems);
        console.log(`Successfully inserted ${insertResult.length} menu items`);
        
        // Verify the insertion
        const count = await MenuItem.countDocuments();
        console.log(`Total menu items in database: ${count}`);
        
        // List all categories
        const categories = await MenuItem.distinct('category');
        console.log('Categories in database:', categories);
        
        // List items in each category
        for (const category of categories) {
            const items = await MenuItem.find({ category });
            console.log(`\nItems in ${category}:`, items.length);
            items.forEach(item => console.log(`- ${item.name}`));
        }
        
        console.log('\nDatabase seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeding function
seedDatabase(); 