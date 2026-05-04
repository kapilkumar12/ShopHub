# 🛒 ShopHub Frontend

ShopHub ek modern full-stack e-commerce web application hai jisme users products browse, cart manage, checkout aur orders track kar sakte hain.

Yeh repository ShopHub ka **frontend (React-based)** part hai.

---

## 🚀 Features

### 🧑‍💻 User Features

* 🔐 Authentication (Login / Register)
* 🛍️ Product Listing & Product Details
* ❤️ Wishlist System
* 🛒 Cart Management (Add / Remove / Update Quantity)
* 💳 Checkout Page
* 📦 Order Placement (Cash on Delivery)
* 📄 Invoice Download (PDF)
* 📊 Price Breakdown (MRP, Discount, GST, Shipping)
* 🔔 Real-time Notifications (Socket.io)
* 📦 Order Tracking System
* ❌ Order Cancellation with Reason

---

## ⚠️ Pending Features

> Ye features abhi development me hain:

* ⚡ Direct Buy (Buy Now from product page)
* 💳 Online Payment Integration (Razorpay / Stripe)
* 📦 Delivery Status Automation
* 📊 Advanced Order Analytics

---

## 🏗️ Tech Stack

* ⚛️ React.js
* 🌐 React Router DOM
* 🎨 Tailwind CSS / Bootstrap
* 📡 Axios (API calls)
* 🔔 Socket.io-client
* 🔥 SweetAlert2 / React Hot Toast
* 📄 jsPDF + autoTable (Invoice generation)

---

## 📁 Project Structure

```
src/
│
├── components/       # Reusable UI components
├── pages/            # All pages (Cart, Checkout, Orders, etc.)
├── context/          # Global state (Auth, Cart, Wishlist)
├── services/         # API functions
├── utils/            # Helpers (invoice, etc.)
├── assets/           # Images & static files
└── App.jsx
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/kapilkumar12/ShopHub.git
cd shophub-frontend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

---

### 4️⃣ Run Project

```bash
npm run dev
```

App runs on:

```
http://localhost:5173
```

---

## 🔗 API Integration

Frontend connects with backend APIs:

* `/api/auth`
* `/api/products`
* `/api/cart`
* `/api/orders`

Backend must run on:

```
http://localhost:5000
```

---

## 📄 Invoice System

* PDF invoice generated using `jsPDF`
* Includes:

  * Product list
  * GST
  * Shipping cost
  * Total price

📌 Important:

* Invoice values **backend se aate hain**
* Frontend pe calculation avoid kiya gaya hai for accuracy

---

## 🖼️ Image Handling

Images render karte waqt:

```js
const BASE_URL = import.meta.env.VITE_API_URL;
```

```jsx
<img
  src={
    item?.productId?.images?.[0]?.url
      ? item.productId.images[0].url.startsWith("http")
        ? item.productId.images[0].url
        : `${BASE_URL}${item.productId.images[0].url}`
      : "/placeholder.png"
  }
/>
```

---

## 🐛 Common Issues & Fixes

### ❌ Image not showing

✔ Fix:

* Ensure image URL correct hai
* Backend static serve enabled ho:

```js
app.use("/uploads", express.static("uploads"));
```

---

### ❌ Invoice shows 0 values

✔ Reason:

* Order me subtotal, gst, shipping save nahi hua

✔ Fix:

* Backend me ye fields save karo:

```js
subtotal
gstAmount
shippingCost
totalPrice
```

---

### ❌ Checkout GST / Shipping undefined

✔ Fix:

* API response me correct keys bhejo:

```js
summary: {
  subtotal,
  gstAmount,
  shippingCost,
  total
}
```

---

## 📦 Future Improvements

* 💳 Razorpay / Stripe Payment Integration
* ⚡ Direct Buy Flow Optimization
* 📊 Admin Dashboard
* 🔍 Advanced Filters & Search
* 📱 Mobile Responsive Enhancements

---

## 👨‍💻 Author

Kapil Banshiwal

---

## ⭐ Support

Agar project pasand aaye to ⭐ star zaroor dena!

---

## 📜 License

MIT License
