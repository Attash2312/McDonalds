# Vercel Deployment Troubleshooting Guide

## 🚨 Common Internal Server Error Causes & Solutions

### 1. **Database Connection Issues**

**Problem**: MongoDB connection fails in serverless environment
**Solution**: 
- Ensure `MONGODB_URI` environment variable is set in Vercel
- Use MongoDB Atlas (cloud database) instead of local MongoDB
- Add `0.0.0.0/0` to MongoDB Atlas Network Access

**Check**: Visit `your-domain.vercel.app/health` to see database status

### 2. **Missing Environment Variables**

**Required Variables in Vercel Dashboard:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mcdonalds?retryWrites=true&w=majority
SESSION_SECRET=your-super-secret-session-key-here
NODE_ENV=production
```

**How to set them:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable with the correct value
3. Redeploy your application

### 3. **Session Configuration Issues**

**Problem**: Sessions not working in production
**Solution**: 
- Ensure `SESSION_SECRET` is set
- MongoDB session store is now properly configured
- Fallback to MemoryStore if MongoDB fails

### 4. **View Rendering Errors**

**Problem**: EJS templates not found
**Solution**: 
- Views path is correctly set in `server.js`
- All template files are included in deployment
- Layout files exist in `views/layouts/`

### 5. **Route Handler Errors**

**Problem**: Routes throwing unhandled errors
**Solution**: 
- All routes now have proper error handling
- Database operations wrapped in try-catch blocks
- Graceful fallbacks for missing data

## 🔧 Debugging Steps

### Step 1: Check Health Endpoint
Visit: `https://your-domain.vercel.app/health`

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "databaseState": 1,
  "databaseConnected": true,
  "mongodbUri": "Configured"
}
```

### Step 2: Check Test Endpoint
Visit: `https://your-domain.vercel.app/test`

This will show server status and database connection state.

### Step 3: Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on `server.js` function
3. Check the logs for specific error messages

### Step 4: Verify Environment Variables
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Ensure all required variables are set
3. Check that values are correct (no extra spaces, correct format)

## 🛠️ Recent Fixes Applied

### ✅ Database Connection
- Moved database connection to async function
- Better error handling for serverless environment
- Removed deprecated `bufferMaxEntries` option

### ✅ Session Management
- MongoDB session store with fallback
- Proper error handling for session creation
- Secure cookie configuration

### ✅ Error Handling
- Global error handler with JSON fallback
- Route-specific error handling
- Graceful degradation for missing data

### ✅ Vercel Configuration
- Added region specification (`iad1`)
- Proper function configuration
- Environment variable setup

## 🚀 Deployment Checklist

Before deploying to Vercel:

- [ ] MongoDB Atlas cluster is running
- [ ] Database user has read/write permissions
- [ ] Network access allows `0.0.0.0/0`
- [ ] Environment variables are set in Vercel
- [ ] All required files are committed to Git
- [ ] No local-only dependencies in `package.json`

## 🔍 Common Error Messages & Solutions

### "MongoServerSelectionError"
**Cause**: Database connection failed
**Solution**: Check MongoDB URI and network access

### "View lookup failed"
**Cause**: EJS template not found
**Solution**: Ensure all view files are in the repository

### "Session store not found"
**Cause**: MongoDB session store creation failed
**Solution**: Check MongoDB connection and session configuration

### "Internal Server Error"
**Cause**: Unhandled exception in route handler
**Solution**: Check function logs for specific error details

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the health endpoint** first
2. **Review Vercel function logs** for specific errors
3. **Verify environment variables** are correctly set
4. **Test database connection** using the test endpoint
5. **Check MongoDB Atlas** cluster status and network access

## 🎯 Quick Fix Commands

If you need to redeploy:
```bash
git add .
git commit -m "Fix Vercel deployment issues"
git push
```

Vercel will automatically redeploy when you push to your main branch.

## 📊 Monitoring Your Deployment

After deployment, monitor these endpoints:
- `/health` - Overall application health
- `/test` - Server and database status
- `/` - Main homepage
- `/menu` - Menu page (tests database queries)

If any of these fail, check the specific error in Vercel function logs. 