


# 📚 BOOKLOG — Week 8 (Mongoose CRUD)

A minimal Express + Mongoose application demonstrating basic **Create**, **Read**, **Update**, and **Delete** operations on a "Book" collection. Built for **Week 8** of the Harkirat course.

---

## 🚀 Overview

### 🔧 Back-End (Express + Mongoose)

**Book Schema**
```js
{
  Title:       { type: String, required: true },
  Author:      { type: String, required: true },
  Qty:         { type: Number, required: true },
  Description: { type: String, required: true }
}
````

Routes are defined in `routes/book.js`.

---

## 📦 API Endpoints

### `GET /api/books`

Returns all books in the database.

---

### `POST /api/books/take`

Adds a new book or increases quantity of existing book.

**Body:**

```json
{
  "Title": "Clean Code",
  "Author": "Robert C. Martin",
  "Qty": 2,
  "Description": "..." // Required if new book
}
```

---

### `POST /api/books/borrow`

Borrows a book by reducing its quantity.

**Body:**

```json
{
  "Title": "Clean Code",
  "Author": "Robert C. Martin",
  "Qty": 1
}
```

---

### `PUT /api/books/:id`

Updates book details by ID.

**Body:**

```json
{
  "Title": "...",
  "Author": "...",
  "Qty": 4,
  "Description": "..."
}
```

---

### `DELETE /api/books/:id`

Deletes a book by ID.

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/your-username/simple-booklog.git
cd simple-booklog
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
MONGO_URL=<your-mongodb-uri>
PORT=3000
```

### 3. Start Server

```bash
npm run dev   # or: npm start
```

Visit: [http://localhost:3000/api/books](http://localhost:3000/api/books)

---

## 🌍 Front-End

Open `index.html` in your browser to use the interface.

---

## 📸 Screenshots

* Front-End UI:
 ![image](https://github.com/user-attachments/assets/150b7f69-055f-4e93-bff7-fe6599fd21c9)

* Architecture Diagram:
  ![image](https://github.com/user-attachments/assets/fbaa6a55-9867-4879-b1d9-30b4cf1b38b5)


---

## 📁 Project Structure

```
simple-booklog/
├── images/
│   ├── frontend.png
│   └── diagram.png
├── routes/
│   └── book.js
├── models/
│   └── Book.js
├── index.html
├── .env
├── server.js
└── README.md
```

---

> Made with ❤️ for learning and practice.


