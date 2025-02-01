// router/cart.js
const express = require('express');
const router = express.Router();
const CartItem = require('../model/cart-model'); // Import the CartItem model

// Endpoint to add an item to the cart
router.post('/cart', async (req, res) => {
  const { name, price, imageSrc, quantity } = req.body;

  // Validate the data
  if (!name || !price || !imageSrc) {
    return res.status(400).json({ message: 'Missing product details.' });
  }

  try {
    // Create a new cart item
    const newItem = new CartItem({ name, price, imageSrc, quantity });
    await newItem.save(); // Save it to the database

    res.status(201).json({ message: 'Item added to cart', item: newItem });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Server Error: Unable to add item to cart.' });
  }
});
router.delete('/cart/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await CartItem.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ message: 'Server Error: Unable to remove item.' });
  }
});
// Optional: Endpoint to retrieve cart items
router.get('/cart', async (req, res) => {
  try {
    const items = await CartItem.find(); // Retrieve all cart items
    res.json(items);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Server Error: Unable to fetch cart items.' });
  }
});
// app.delete('/cart', async (req, res) => {
//   try {
//     await Cart.deleteMany({}); // This clears all cart items
//     res.status(200).send({ message: 'Cart cleared successfully' });
//   } catch (error) {
//     res.status(500).send({ error: 'Failed to clear cart' });
//   }
// });

module.exports = router;
