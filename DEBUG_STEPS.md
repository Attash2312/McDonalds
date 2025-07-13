# 🔍 Vercel Debugging Steps

## 🚨 Current Issue: Routes Not Working

Your Vercel deployment completed successfully, but the routes aren't working. Let's debug this step by step.

## 📋 Step-by-Step Debugging

### Step 1: Test Basic Server Functionality
Try these URLs in order:

1. **`https://your-domain.vercel.app/server-test`**
   - This route is directly in server.js
   - Should return: `{"message": "Server.js route working", "timestamp": "...", "environment": "production"}`
   - If this works → Server is running, issue is with route files
   - If this fails → Server has a fundamental issue

2. **`https://your-domain.vercel.app/ping`**
   - This route is in pageRoutes.js but has no dependencies
   - Should return: `{"message": "pong", "time": "..."}`
   - If this works → pageRoutes.js is loading, issue is with other routes
   - If this fails → pageRoutes.js has an issue

3. **`https://your-domain.vercel.app/debug`**
   - This route tests if pageRoutes.js is working
   - Should return: `{"message": "Debug route working", "timestamp": "...", "routes": "pageRoutes loaded successfully"}`

4. **`https://your-domain.vercel.app/health`**
   - This route tests database connection
   - Should return detailed health information

### Step 2: Check Vercel Function Logs
1. Go to **Vercel Dashboard** → **Your Project** → **Functions**
2. Click on **`server.js`**
3. Check the **Logs** tab
4. Look for any error messages

### Step 3: Check Environment Variables
1. Go to **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Verify these are set:
   ```
   MONGODB_URI=your-mongodb-connection-string
   SESSION_SECRET=your-secret-key
   NODE_ENV=production
   ```

### Step 4: Test Database Connection
If `/health` shows `"databaseConnected": false`:
1. Check your MongoDB Atlas cluster is running
2. Verify the connection string is correct
3. Check Network Access allows `0.0.0.0/0`

## 🔧 Quick Fixes to Try

### Fix 1: Force Redeploy
```bash
git add .
git commit -m "Add debugging routes"
git push
```

### Fix 2: Check if Views Exist
Make sure these files exist in your repository:
- `views/index.ejs`
- `views/layouts/main.ejs`
- `views/error.ejs`

### Fix 3: Test Local Development
Run locally to see if the issue is Vercel-specific:
```bash
npm start
```
Then visit `http://localhost:3000/ping`

## 🎯 Expected Results

### ✅ If Everything Works:
- `/server-test` → JSON response
- `/ping` → `{"message": "pong", "time": "..."}`
- `/debug` → JSON response
- `/health` → Health status with database info
- `/` → McDonald's homepage

### ❌ If Routes Don't Work:
- Check Vercel function logs for specific errors
- Verify environment variables are set
- Check if database connection is working

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot find module"
**Solution**: Check if all required files are in the repository

### Issue 2: "MongoServerSelectionError"
**Solution**: Set up MongoDB Atlas and add MONGODB_URI

### Issue 3: "View lookup failed"
**Solution**: Ensure all EJS template files exist

### Issue 4: "Internal Server Error"
**Solution**: Check Vercel function logs for specific error details

## 📞 Next Steps

1. **Try the test routes** in the order listed above
2. **Check Vercel logs** for specific error messages
3. **Report back** which routes work and which don't
4. **Share any error messages** from the logs

This will help us identify exactly where the issue is occurring! 