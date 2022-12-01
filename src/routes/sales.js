const express = require('express');
const {
    getSales,
    addSales
} = require("../controllers/sales");

// Express router
const router = express.Router();
const { protect} = require('../middlewares/auth');

router
    .route('/')
    .post(protect,addSales)
    .get(protect,getSales)

module.exports = router;