const express = require('express');

// Controllers
const {
    getShoes,
    getShoe,
    createShoe,
    deleteShoe,
    updateShoe,
    getMyShoes
} = require('../controllers/shoes');

// Express router
const router = express.Router();

// Advance results
const advanceResults = require('../middlewares/advanceResults');
const { protect, authorization } = require('../middlewares/auth');
const Shoe = require('../models/Shoes');


router
    .route('/')
    .get(advanceResults(Shoe, ''), getShoes)
    .post(protect, authorization('admin'), createShoe)

router
    .route('/my')
    .get(protect, authorization('user', 'admin'), getMyShoes)

router
    .route('/:id')
    .get(getShoe)
    .delete(protect, authorization('admin'), deleteShoe)
    .put(protect, authorization('admin'), updateShoe)



module.exports = router;