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
6. **Important**: In Network Access, add `0.0.0.0/0` to allow connections from anywhere (or add Vercel's IP ranges)

### Step 2: Configure Vercel Environment Variables
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `SESSION_SECRET`: A random secret string for sessions (use a strong password)
   - `NODE_ENV`: Set to `production`

### Step 3: Redeploy
After setting the environment variables, redeploy your application.

## Recent Improvements Made

✅ **Database Connection**: Enhanced to handle serverless environments better
✅ **Session Storage**: Now uses MongoDB instead of MemoryStore for production
✅ **Error Handling**: Improved to prevent crashes in serverless environment
✅ **Server Configuration**: Optimized for Vercel's serverless functions

## Important Notes

- The application now uses MongoDB for session storage (production-ready)
- Database connections are managed efficiently for serverless environments
- Sessions will persist across serverless function invocations
- The app is now fully compatible with Vercel's serverless architecture

## Troubleshooting

If you still get connection errors:
1. **Check MongoDB Atlas**: Make sure your cluster is running and accessible
2. **Network Access**: Ensure your Atlas cluster allows connections from `0.0.0.0/0`
3. **Connection String**: Verify your MongoDB URI is correct and includes the database name
4. **User Permissions**: Ensure your database user has read/write permissions
5. **Environment Variables**: Double-check that all variables are set correctly in Vercel

## Testing Your Deployment

After setup, test these features:
- User registration and login
- Menu browsing
- Cart functionality
- Order placement
- Admin panel access

If any of these fail, check the Vercel function logs for specific error messages. 

## Additional Notes

- If you encounter view lookup errors, ensure that the views directory is explicitly set in your `server.js`:
  ```js
  const path = require('path');
  app.set('views', path.join(__dirname, 'views'));
  ```

- If you encounter MongoDB connection errors, ensure that the MongoDB connection options are updated in your `config/db.js`:
  ```js
  const conn = await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  ``` 