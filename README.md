# 🛍️ ApnaStore Backend API

A production-ready RESTful API built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd apnastore-backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your values (MongoDB URI, JWT secrets, etc.)
```

### 3. Seed the Database
```bash
npm run seed
# Creates categories, 12 products, 1 admin, 1 demo user
```

### 4. Start the Server
```bash
npm run dev     # Development (nodemon)
npm start       # Production
```

Server runs on: `http://localhost:5000`
Health check:   `http://localhost:5000/health`

---

## 📁 Project Structure

```
apnastore-backend/
├── config/
│   ├── db.js           # MongoDB connection
│   └── logger.js       # Winston logger
├── controllers/
│   ├── auth.controller.js
│   ├── product.controller.js
│   ├── order.controller.js
│   ├── cart.controller.js
│   ├── review.controller.js
│   ├── user.controller.js
│   └── admin.controller.js
├── middleware/
│   ├── auth.js         # JWT protect / authorize
│   ├── errorHandler.js # Global error handler
│   ├── notFound.js     # 404 handler
│   └── validate.js     # express-validator helper
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   ├── Cart.js
│   └── Review.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── product.routes.js
│   ├── category.routes.js
│   ├── order.routes.js
│   ├── cart.routes.js
│   ├── review.routes.js
│   ├── payment.routes.js
│   ├── upload.routes.js
│   ├── wishlist.routes.js
│   └── admin.routes.js
├── utils/
│   ├── email.js        # Nodemailer templates
│   └── apiFeatures.js  # Query builder
├── scripts/
│   └── seed.js         # Database seeder
├── uploads/            # Local image storage
├── logs/               # Winston log files
├── server.js           # Entry point
├── .env.example
└── README.md
```

---

## 🔑 API Endpoints

### Auth  `/api/v1/auth`
| Method | Endpoint              | Description          | Auth |
|--------|-----------------------|----------------------|------|
| POST   | /register             | Register new user    | ❌   |
| POST   | /login                | Login & get tokens   | ❌   |
| POST   | /logout               | Clear cookies        | ❌   |
| POST   | /refresh-token        | Refresh access token | ❌   |
| POST   | /forgot-password      | Send reset email     | ❌   |
| POST   | /reset-password       | Reset password       | ❌   |
| GET    | /verify-email/:token  | Verify email         | ❌   |
| GET    | /me                   | Get current user     | ✅   |

### Products  `/api/v1/products`
| Method | Endpoint                   | Description             | Auth   |
|--------|----------------------------|-------------------------|--------|
| GET    | /                          | List all (with filters) | ❌     |
| GET    | /search/suggestions?q=     | Search suggestions      | ❌     |
| GET    | /:id                       | Single product          | ❌     |
| GET    | /:id/related               | Related products        | ❌     |
| POST   | /                          | Create product          | Admin  |
| PUT    | /:id                       | Update product          | Admin  |
| DELETE | /:id                       | Soft delete product     | Admin  |

### Orders  `/api/v1/orders`
| Method | Endpoint                    | Description        | Auth  |
|--------|-----------------------------|--------------------|-------|
| POST   | /                           | Place new order    | ✅    |
| GET    | /my-orders                  | User's orders      | ✅    |
| GET    | /track/:orderNumber         | Track by number    | ✅    |
| GET    | /:id                        | Order details      | ✅    |
| PUT    | /:id/cancel                 | Cancel order       | ✅    |
| PUT    | /:id/status                 | Update status      | Admin |

### Cart  `/api/v1/cart`
| Method | Endpoint              | Description     | Auth |
|--------|-----------------------|-----------------|------|
| GET    | /                     | Get cart        | ✅   |
| POST   | /                     | Add item        | ✅   |
| PUT    | /:itemId              | Update quantity | ✅   |
| DELETE | /:itemId              | Remove item     | ✅   |
| DELETE | /                     | Clear cart      | ✅   |
| POST   | /apply-coupon         | Apply coupon    | ✅   |

### Reviews  `/api/v1/products/:productId/reviews`
| Method | Endpoint     | Description      | Auth |
|--------|--------------|------------------|------|
| GET    | /            | Product reviews  | ❌   |
| POST   | /            | Write review     | ✅   |
| PUT    | /:id         | Edit review      | ✅   |
| DELETE | /:id         | Delete review    | ✅   |
| PUT    | /:id/helpful | Mark helpful     | ✅   |

### Users  `/api/v1/users`
| Method | Endpoint                    | Description       | Auth |
|--------|-----------------------------|-------------------|------|
| GET    | /profile                    | Get profile       | ✅   |
| PUT    | /profile                    | Update profile    | ✅   |
| PUT    | /change-password            | Change password   | ✅   |
| GET    | /dashboard                  | User dashboard    | ✅   |
| GET    | /wishlist                   | Wishlist items    | ✅   |
| POST   | /wishlist/:productId        | Toggle wishlist   | ✅   |
| POST   | /addresses                  | Add address       | ✅   |
| PUT    | /addresses/:id              | Update address    | ✅   |
| DELETE | /addresses/:id              | Remove address    | ✅   |

### Admin  `/api/v1/admin`  *(Admin only)*
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | /dashboard            | Stats & analytics   |
| GET    | /users                | All users (paginated)|
| GET    | /orders               | All orders          |
| GET    | /reviews/pending      | Unapproved reviews  |
| PUT    | /reviews/:id/approve  | Approve/reject      |

### Payments  `/api/v1/payments`
| Method | Endpoint       | Description            | Auth |
|--------|----------------|------------------------|------|
| POST   | /create-order  | Create Razorpay order  | ✅   |
| POST   | /verify        | Verify payment         | ✅   |

---

## 🔍 Product Filtering

```
GET /api/v1/products?category=<id>&minPrice=500&maxPrice=5000&rating=4&sort=price_asc&page=1&limit=12&search=headphones&badge=Hot&featured=true&inStock=true
```

Sort options: `price_asc`, `price_desc`, `rating`, `newest`, `popular`, `relevance`

---

## 🏷️ Coupon Codes

| Code      | Discount | Min Order |
|-----------|----------|-----------|
| APNA10    | 10% off  | ₹500      |
| WELCOME20 | 20% off  | ₹1,000    |
| SAVE50    | ₹50 off  | ₹300      |
| APNA100   | ₹100 off | ₹1,000    |

---

## 🔒 Security Features
- JWT access tokens (7d) + refresh tokens (30d) via cookies
- Bcrypt password hashing (12 salt rounds)
- Rate limiting (100 req/15min; 10 auth req/15min)
- Helmet HTTP headers
- MongoDB injection sanitization
- Account lockout after 5 failed logins (2hr lockout)
- Input validation with express-validator

---

## 🌱 Default Credentials (after seed)
- **Admin:** admin@apnastore.in / Admin@123
- **User:**  rahul@example.com / Password@123

---

## 📦 Tech Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **Email:** Nodemailer
- **Payments:** Razorpay
- **Logging:** Winston + Morgan
- **Validation:** express-validator
- **Security:** Helmet, cors, express-mongo-sanitize, express-rate-limit
