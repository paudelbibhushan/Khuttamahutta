const express = require('express');
const {
    updateCart,
    deleteCart,
    getCart,
    deleteAllCart
} = require("../controllers/cart.controller");

// Express router
const router = express.Router();
const { protect} = require('../middlewares/auth');

router
    .route('/')
    .post(protect,updateCart)
    .delete(protect, deleteCart)
    .get(protect,getCart)
router.route('/all').delete(protect, deleteAllCart)

module.exports = router;