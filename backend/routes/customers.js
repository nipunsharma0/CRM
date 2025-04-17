const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { auth, adminAuth } = require('../middleware/auth');

// Get all customers (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { search, tags } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const customers = await Customer.find(query)
      .populate('enquiries')
      .sort({ lastContact: -1 });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
});

// Get single customer
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate({
        path: 'enquiries',
        populate: {
          path: 'productId',
          select: 'name type brand'
        }
      });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error: error.message });
  }
});

// Update customer (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, email, phone, company, tags, followUpDate } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        company,
        tags,
        followUpDate
      },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
});

// Add note to customer (admin only)
router.post('/:id/notes', adminAuth, async (req, res) => {
  try {
    const { content } = req.body;
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.notes.push({
      content,
      createdBy: req.user._id
    });

    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error adding note', error: error.message });
  }
});

// Update customer tags (admin only)
router.patch('/:id/tags', adminAuth, async (req, res) => {
  try {
    const { tags } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { tags },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating tags', error: error.message });
  }
});

// Update last contact date (admin only)
router.patch('/:id/last-contact', adminAuth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { lastContact: new Date() },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating last contact', error: error.message });
  }
});

module.exports = router; 