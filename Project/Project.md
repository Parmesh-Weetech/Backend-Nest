# Furniture Renting System

## Overview

The **Furniture Renting System** is a platform that enables users to rent furniture for a specific period with a range of flexible options. The system is designed to provide a sustainable, convenient, and affordable way to access high-quality furniture. It also serves as a marketplace where users can rent products, vendors can sell furniture, and admins manage the entire platform.

This platform has multiple user roles with different permissions:

- **User:** Can view and buy products.
- **Vender:** Can add, edit, and manage their own products, as well as view their sales and earnings.
- **Admin:** Has full control over the platform, including managing users and vendors.

## Mission

Our mission is to make high-quality furniture accessible to everyone through flexible renting options. We believe in sustainability, convenience, and affordability.

---

## Technologies Used

- **Frontend:** React, Tailwind CSS, React-router-dom
- **Backend:** Node.js, NestJs, Express.js, JWT for authentication
- **Database:** PostgreSQL
- **Payment Gateway:** Razorpay
- **Security:** bcryptjs for password encryption, CORS for cross-origin requests
- **ORM:** TypeORM

---

## Features

### User Features

- **Signup & Login:** Users can sign up and log in to the platform (can register as either a regular user or a vendor).
- **Profile Management:** CRUD functionality to manage user profiles.
- **View Products:** Users can browse the furniture available for rent.
- **Rent Products:** Users can rent products for a specific period.
- **View Rental History:** Users can view the history of their rented products.

### Vendor Features

- **Signup & Login:** Vendors have separate login for selling products. A user can become a vendor by switching roles after logging in.
- **Profile Management:** CRUD functionality to manage their vendor profiles.
- **Manage Products:** Vendors can add, edit, and delete their own products.
- **Sales Insights:** Vendors can view their earnings, sales, and track product performance.

### Admin Features

- **Full System Access:** Admin has full control over the platform, including managing users, vendors, and products.
- **Manage Vendors & Users:** Admin can manage both vendors and users.
- **Platform Management:** Admin can address any issues, handle disputes, and solve platform-related problems.

---

## Roles and Permissions

### 1. User

- **Signup/Login:** Can sign up and log in as a regular user.
- **Profile Management:** Can create, read, update, and delete (CRUD) their profile.
- **View Products:** Can browse the list of available furniture and view product details.
- **Rent Products:** Can rent furniture for specific periods.

### 2. Vendor

- **Signup/Login:** Vendors need to sign up and log in to a separate vendor account.
- **Profile Management:** CRUD functionality to manage their vendor profiles.
- **Product Management:** Can add, edit, and delete products they own.
- **Sales Insights:** Can track their profits and losses related to product sales and rental.

### 3. Admin

- **Full Control:** Admin has full access to manage all aspects of the platform.
- **Manage Vendors and Users:** Admin can manage both vendors and users, approve/reject vendors, and resolve issues.
- **Platform Maintenance:** Admin resolves issues or problems occurring in the system.

---

## Getting Started

To get started with the development of this platform, follow the steps below:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies:**

   Navigate to the project directory and install the necessary dependencies:

   ```bash
   npm install
   ```

3. **Start the Development Server:**

   To start the server and view the app locally:

   ```bash
   npm start
   ```

---

## Contributing

Contributions are welcome! If you want to contribute to the project, please fork the repository and submit a pull request with your changes.

---

## DB Schema Design

The database schema for the Furniture Renting System consists of the following models:

### 1. **User Model**

Stores information about both regular users and vendors (since vendors are essentially users with special privileges).

```javascript
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "vendor", "admin"], default: "user" },
    profile: {
      name: { type: String },
      address: { type: String },
      phone: { type: String },
    },
    rentedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
```

### 2. **Product Model**

Stores information about furniture items listed by vendors for rent.

```javascript
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 1,
    },
    images: [
      {
        type: String,
      },
    ],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
```

### 3. **Order Model**

Stores order-related data when a user rents a product.

```javascript
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rentalPeriod: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    rentalDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
```

### 4. **Transaction Model**

Tracks financial transactions between the system and users.

```javascript
const transactionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "credit_card", "paypal"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["success", "failure"],
      required: true,
    },
    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
```
