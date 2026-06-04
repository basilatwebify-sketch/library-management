"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [editingId, setEditingId] = useState(null);
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({
    title: "",
    author: "",
    isbn: "",
  });

  const API = "http://localhost:5000";

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/books`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async () => {
    if (!book.title || !book.author || !book.isbn) {
      alert("Fill all fields");
      return;
    }

    await axios.post(`${API}/books`, book);

    setBook({
      title: "",
      author: "",
      isbn: "",
    });

    fetchBooks();
  };

  const deleteBook = async (id) => {
    await axios.delete(`${API}/books/${id}`);
    fetchBooks();
  };

  const updateBook = async () => {
    await axios.put(`${API}/books/${editingId}`, book);

    setBook({
      title: "",
      author: "",
      isbn: "",
    });

    setEditingId(null);

    fetchBooks();
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "20px",
      }}
    >
      <h1>Library Management System</h1>

      <input
        placeholder="Title"
        value={book.title}
        onChange={(e) =>
          setBook({ ...book, title: e.target.value })
        }
        style={{ padding: "8px", margin: "5px" }}
      />

      <input
        placeholder="Author"
        value={book.author}
        onChange={(e) =>
          setBook({ ...book, author: e.target.value })
        }
        style={{ padding: "8px", margin: "5px" }}
      />

      <input
        placeholder="ISBN"
        value={book.isbn}
        onChange={(e) =>
          setBook({ ...book, isbn: e.target.value })
        }
        style={{ padding: "8px", margin: "5px" }}
      />

      <button
        onClick={
          editingId
            ? updateBook
            : addBook
        }
      >
        {editingId ? "Update Book" : "Add Book"}
      </button>

      <hr />

      <h2>Books</h2>

      {books.length === 0 ? (
        <p>No books found</p>
      ) : (
        books.map((b) => (
          <div
            key={b.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{b.title}</h3>
            <p>Author: {b.author}</p>
            <p>ISBN: {b.isbn}</p>

            <button
              onClick={() => {
                setBook({
                  title: b.title,
                  author: b.author,
                  isbn: b.isbn,
                });

                setEditingId(b.id);
              }}
            >
              Edit
            </button>

            <button onClick={() => deleteBook(b.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}