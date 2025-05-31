
    const API_BASE = 'http://localhost:3000/api/books';

  
    const booksContainer = document.getElementById('books-container');
    const addBookForm = document.getElementById('add-book-form');
    const messageDiv = document.getElementById('message');

    const editOverlay = document.getElementById('edit-overlay');
    const editBookForm = document.getElementById('edit-book-form');
    const editIdInput = document.getElementById('edit-id');
    const editTitleInput = document.getElementById('edit-title');
    const editAuthorInput = document.getElementById('edit-author');
    const editQtyInput = document.getElementById('edit-qty');
    const editDescriptionInput = document.getElementById('edit-description');
    const editCancelBtn = document.getElementById('edit-cancel-btn');

   
    function showMessage(text, type = 'info') {
      messageDiv.textContent = text;
      messageDiv.style.color = (type === 'error') ? 'crimson' : (type === 'success' ? 'green' : 'black');
      setTimeout(() => (messageDiv.textContent = ''), 3000);
    }

  
    async function fetchBooks() {
      try {
        const res = await axios.get(API_BASE);
        renderBooks(res.data);
      } catch (err) {
        console.error('Error fetching books:', err);
        showMessage('Failed to load books.', 'error');
      }
    }

    function renderBooks(books) {
      booksContainer.innerHTML = '';

      if (!Array.isArray(books) || books.length === 0) {
        booksContainer.innerHTML = '<p>No books available.</p>';
        return;
      }

      books.forEach((book) => {
        const card = document.createElement('div');
        card.className = 'book-card';

        // Left side: book info
        const infoDiv = document.createElement('div');
        infoDiv.className = 'book-info';

        const titleEl = document.createElement('h3');
        titleEl.textContent = book.Title;
        infoDiv.appendChild(titleEl);

        const authorEl = document.createElement('p');
        authorEl.innerHTML = `<strong>Author:</strong> ${book.Author}`;
        infoDiv.appendChild(authorEl);

        const qtyEl = document.createElement('p');
        qtyEl.innerHTML = `<strong>Qty:</strong> ${book.Qty}`;
        infoDiv.appendChild(qtyEl);

        const descEl = document.createElement('p');
        descEl.innerHTML = `<em>${book.Description}</em>`;
        infoDiv.appendChild(descEl);

        card.appendChild(infoDiv);

     
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

    
        const borrowBtn = document.createElement('button');
        borrowBtn.textContent = 'Borrow';
        if (book.Qty <= 0) borrowBtn.disabled = true;
        borrowBtn.addEventListener('click', () => {
          borrowBook(book.Title, book.Author, 1);
        });
        actionsDiv.appendChild(borrowBtn);

  
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', () => openEditModal(book));
        actionsDiv.appendChild(editBtn);

      
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteBook(book._id));
        actionsDiv.appendChild(deleteBtn);

        card.appendChild(actionsDiv);
        booksContainer.appendChild(card);
      });
    }

  
    async function addBook(event) {
      event.preventDefault();
      const form = event.target;
      const Title = form.Title.value.trim();
      const Author = form.Author.value.trim();
      const Qty = parseInt(form.Qty.value, 10);
      const Description = form.Description.value.trim();

      if (!Title || !Author || isNaN(Qty) || Qty <= 0) {
        showMessage('Title, Author & positive Qty required.', 'error');
        return;
      }

     
      try {
        const payload = { Title, Author, Qty };
        if (Description) payload.Description = Description;

        await axios.post(`${API_BASE}/take`, payload);
        showMessage('Book added / stock increased!', 'success');
        form.reset();
        fetchBooks();
      } catch (err) {
        console.error('Error adding/taking book:', err);
        const msg = err.response?.data?.error || 'Failed to add book.';
        showMessage(msg, 'error');
      }
    }

  
    async function borrowBook(Title, Author, borrowQty) {
      try {
        const payload = { Title, Author, Qty: borrowQty };
        const res = await axios.post(`${API_BASE}/borrow`, payload);
        showMessage(`Borrowed: "${res.data.Title}" (remaining: ${res.data.Qty})`, 'success');
        fetchBooks();
      } catch (err) {
        console.error('Error borrowing book:', err);
        const msg = err.response?.data?.error || 'Failed to borrow book.';
        showMessage(msg, 'error');
      }
    }

  
    async function deleteBook(bookId) {
      if (!confirm('Are you sure you want to delete this book?')) return;
      try {
        await axios.delete(`${API_BASE}/${bookId}`);
        showMessage('Book deleted.', 'success');
        fetchBooks();
      } catch (err) {
        console.error('Error deleting book:', err);
        showMessage('Failed to delete book.', 'error');
      }
    }

    // (D) Update (Edit) a book → PUT /api/books/:id
    async function submitEditForm(event) {
      event.preventDefault();
      const id = editIdInput.value;
      const Title = editTitleInput.value.trim();
      const Author = editAuthorInput.value.trim();
      const Qty = parseInt(editQtyInput.value, 10);
      const Description = editDescriptionInput.value.trim();

      if (!Title || !Author || isNaN(Qty) || Qty < 0 || !Description) {
        showMessage('All fields required (Qty ≥ 0).', 'error');
        return;
      }

      try {
        await axios.put(`${API_BASE}/${id}`, { Title, Author, Qty, Description });
        showMessage('Book updated successfully.', 'success');
        closeEditModal();
        fetchBooks();
      } catch (err) {
        console.error('Error updating book:', err);
        const msg = err.response?.data?.error || 'Failed to update book.';
        showMessage(msg, 'error');
      }
    }



    function openEditModal(book) {
      editIdInput.value = book._id;
      editTitleInput.value = book.Title;
      editAuthorInput.value = book.Author;
      editQtyInput.value = book.Qty;
      editDescriptionInput.value = book.Description;
      editOverlay.style.display = 'flex';
    }

    function closeEditModal() {
      editOverlay.style.display = 'none';
      editBookForm.reset();
    }

    editCancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeEditModal();
    });

    editBookForm.addEventListener('submit', submitEditForm);


    document.addEventListener('DOMContentLoaded', () => {
      addBookForm.addEventListener('submit', addBook);
      fetchBooks();
    });