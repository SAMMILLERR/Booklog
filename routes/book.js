const router = require('express').Router();
const Book   = require('../models/Book');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/take', async (req, res) => {
  try {
    const { Title, Author, Qty, Description } = req.body;
    if (!Title || !Author || typeof Qty !== 'number' || Qty <= 0)
      return res.status(400).json({ error: 'Title, Author & positive Qty required.' });
    let book = await Book.findOne({ Title, Author });
    if (!book) {
      if (!Description) return res.status(400).json({ error: 'Description required.' });
      book = await Book.create({ Title, Author, Qty, Description });
      return res.status(201).json(book);
    }
    book.Qty += Qty;
    await book.save();
    res.json(book);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/borrow', async (req, res) => {
  try {
    const { Title, Author, Qty } = req.body;
    if (!Title || !Author || typeof Qty !== 'number' || Qty <= 0)
      return res.status(400).json({ error: 'Title, Author & positive Qty required.' });
    const book = await Book.findOne({ Title, Author });
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    if (book.Qty < Qty) return res.status(400).json({ error: 'Insufficient stock.' });
    book.Qty -= Qty;
    await book.save();
    res.json(book);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { Title, Author, Qty, Description } = req.body;
    if (!Title || !Author || typeof Qty !== 'number' || Qty < 0 || !Description)
      return res.status(400).json({ error: 'All fields required.' });
    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      { Title, Author, Qty, Description },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Book not found.' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Book not found.' });
    res.json({ message: 'Book deleted.' });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
