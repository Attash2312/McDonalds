# Vercel Deployment Setup Guide

## Environment Variables Required

You need to set up the following environment variables in your Vercel project:

### 1. Database Configuration
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mcdonalds?retryWrites=true&w=majority
```

### 2. Session Configuration
```
SESSION_SECRET=your-super-secret-session-key-here
```

### 3. Environment
```
NODE_ENV=production
```

## Steps to Fix the Database Connection Issue

### Step 1: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user with read/write permissions
5. Get your connection string from the "Connect" button

### Step 2: Configure Vercel Environment Variables
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `SESSION_SECRET`: A random secret string for sessions
   - `NODE_ENV`: Set to `production`

### Step 3: Redeploy
After setting the environment variables, redeploy your application.

## Important Notes

- The application now handles serverless environments better
- Database connections are managed more efficiently
- Session storage warning is shown but won't crash the app
- The app will work with MongoDB Atlas cloud database

## Troubleshooting

If you still get connection errors:
1. Make sure your MongoDB Atlas cluster is running
2. Check that your IP address is whitelisted in Atlas (or use 0.0.0.0/0 for all IPs)
3. Verify your connection string is correct
4. Ensure your database user has the right permissions 