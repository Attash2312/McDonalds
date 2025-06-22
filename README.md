# McDonald's Web Application

A full-stack web application for McDonald's with user authentication, menu management, cart functionality, order processing, and admin panel.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   PORT=3000
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Main site: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin/products` (requires admin login)

## 📋 Complete Route Documentation

### 🌐 **Public Routes (No Authentication Required)**

#### **Main Pages**
| Route | Method | Description | Access |
|-------|--------|-------------|---------|
| `/` | GET | Home page | Public |
| `/menu` | GET | Menu page with all available items | Public |
| `/about-our-food` | GET | About our food page | Public |
| `/your-right-to-know` | GET | Your right to know page | Public |
| `/our-app` | GET | Our app page | Public |
| `/family` | GET | Family page | Public |

#### **Authentication Pages**
| Route | Method | Description | Access |
|-------|--------|-------------|---------|
| `/auth/login` | GET | Login page | Public (redirects if logged in) |
| `/auth/register` | GET | Registration page | Public (redirects if logged in) |
| `/auth/test-connection` | GET | Database connection test | Public |

### 🔐 **Protected Routes (Authentication Required)**

#### **User Pages**
| Route | Method | Description | Access |
|-------|--------|-------------|---------|
| `/cart` | GET | Shopping cart page | Authenticated users |
| `/trending-now` | GET | Trending now page | Authenticated users |
| `/contact-us` | GET | Contact us page | Authenticated users |
| `/search` | GET | Search page | Authenticated users |
| `/locate-me` | GET | Locate me page | Authenticated users |
| `/checkout` | GET | Checkout page | Authenticated users |
| `/my-orders` | GET | User's order history | Authenticated users |
| `/my-orders/:id` | GET | Specific order details | Authenticated users |

#### **Cart Management**
| Route | Method | Description | Access |
|-------|--------|-------------|---------|
| `/cart/add/:productId` | POST | Add item to cart | Authenticated users |
| `/cart/update/:productId` | POST | Update cart item quantity | Authenticated users |
| `/cart/remove/:productId` | POST | Remove item from cart | Authenticated users |
| `/cart/place-order` | POST | Place order from cart | Authenticated users |

### 👑 **Admin Routes (Admin Authentication Required)**

#### **Product Management**
| Route | Method | Description | Access |
|-------|--------|-------------|---------|
| `/admin/products` | GET | List all products | Admin only |
| `/admin/products/add` | GET | Add product form | Admin only |
| `/admin/products/add` | POST | Handle add product | Admin only |
| `/admin/products/edit/:id` | GET | Edit product form | Admin only |
| `/admin/products/edit/:id` | POST | Handle edit product | Admin only |
| `/admin/products/delete/:id` | POST | Delete product | Admin only |

#### **Order Management**
| Route | Method | Description | Access |
|-------|--------|-------------|---------|
| `/admin/orders` | GET | List all orders | Admin only |
| `/admin/orders/:id/status` | POST | Update order status | Admin only |

### 🔑 **Authentication Routes**

#### **Registration & Login**
| Route | Method | Description | Access |
|-------|--------|-------------|---------|
| `/auth/register` | POST | Handle user registration | Public |
| `/auth/login` | POST | Handle user login | Public |
| `/auth/logout` | GET | Handle user logout | Authenticated users |

### 🍔 **Menu Routes**

#### **Menu API**
| Route | Method | Description | Access |
|-------|--------|-------------|---------|
| `/menu/api/items` | GET | Get all menu items (JSON) | Public |

## 🔧 **How to Access Everything**

### **1. Public Access (No Login Required)**
- Visit `http://localhost:3000` for the home page
- Browse the menu at `http://localhost:3000/menu`
- View informational pages like About, Family, etc.

### **2. User Access (Login Required)**
1. **Register/Login:**
   - Go to `http://localhost:3000/auth/login` or click "Login / Sign Up"
   - Create an account or login with existing credentials

2. **After Login:**
   - Access cart: `http://localhost:3000/cart`
   - View orders: `http://localhost:3000/my-orders`
   - Checkout: `http://localhost:3000/checkout`
   - Other protected pages: Contact Us, Search, Locate Me, etc.

### **3. Admin Access (Admin Login Required)**
1. **Create Admin User:**
   ```bash
   node scripts/createAdmin.js
   ```

2. **Login as Admin:**
   - Login with admin credentials
   - Access admin panel: `http://localhost:3000/admin/products`

3. **Admin Features:**
   - Manage products: Add, edit, delete menu items
   - View all orders: `http://localhost:3000/admin/orders`
   - Update order statuses

### **4. Database Management**
1. **Seed Menu Items:**
   ```bash
   node scripts/seedMenu.js
   ```

2. **Test Database Connection:**
   - Visit: `http://localhost:3000/auth/test-connection`

## 🛡️ **Security & Access Control**

### **Authentication Levels:**
- **Public:** No authentication required
- **User:** Must be logged in (regular user)
- **Admin:** Must be logged in AND have admin privileges

### **Middleware Protection:**
- `isAuthenticated`: Ensures user is logged in
- `isNotAuthenticated`: Ensures user is NOT logged in (for login/register pages)
- `isAdmin`: Ensures user is logged in AND has admin privileges

### **Session Management:**
- Sessions stored in MongoDB
- 24-hour session timeout
- Secure cookies in production

## 📁 **File Structure**

```
Project/
├── routes/           # Route handlers
│   ├── pageRoutes.js    # Main page routes
│   ├── authRoutes.js    # Authentication routes
│   ├── cart.js          # Cart management
│   ├── orders.js        # Order routes
│   ├── my-orders.js     # User order history
│   ├── admin.js         # Admin panel routes
│   └── menu.js          # Menu API routes
├── models/          # Database models
├── views/           # EJS templates
├── middleware/      # Authentication middleware
├── config/          # Configuration files
├── scripts/         # Database scripts
└── public/          # Static assets
```

## 🎯 **Key Features**

- ✅ **User Authentication** (Register/Login/Logout)
- ✅ **Menu Management** (Admin CRUD operations)
- ✅ **Shopping Cart** (Add/Remove/Update items)
- ✅ **Order Processing** (Place orders, view history)
- ✅ **Admin Panel** (Manage products and orders)
- ✅ **Responsive Design** (Mobile-friendly)
- ✅ **Session Management** (Secure user sessions)
- ✅ **Database Integration** (MongoDB with Mongoose)

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **Database Connection Error:**
   - Check MongoDB connection string in `.env`
   - Ensure MongoDB is running

2. **Authentication Issues:**
   - Clear browser cookies/session
   - Check user credentials in database

3. **Admin Access Denied:**
   - Run `node scripts/createAdmin.js` to create admin user
   - Ensure user has `isAdmin: true` in database

4. **Routes Not Working:**
   - Check server is running (`npm start`)
   - Verify route paths in browser URL
   - Check authentication requirements

### **Development Tips:**
- Use `console.log()` for debugging
- Check browser developer tools for errors
- Monitor server console for backend errors
- Test database connection at `/auth/test-connection`

---

**Happy Coding! 🍟🍔🍦** 