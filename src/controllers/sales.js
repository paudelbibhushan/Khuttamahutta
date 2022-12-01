const asyncHandler = require("../helpers/asyncHandler");
const Cart = require("../models/Cart");
const Shoes = require("../models/Shoes");
// sendResponse helper function 
const { sendResponse } = require('../helpers/response');
const e = require("express");
const ApiError = require('../errors/ApiError');
const Sales = require("../models/Sales");
const sendTokenResponse = require("../helpers/sentTokenResponse");


exports.addSales = asyncHandler(async (req, res, next) => {
    const { amount, merchantEmail, merchantName, type, user } = req.body;
    const id = req.user._id
    console.log(req.body)

    const sale = await Sales.create({
        user: id,
        amount, merchantEmail, merchantName, type, user: user
    });
    return sendResponse(res, {
        status: "Sucess",
        data: sale
    }, 200, 'application/json');
});

exports.getSales = asyncHandler(async (req, res, next) => {
    const sales = await Sales.find()
    return sendResponse(res, {
        status: "Sucess",
        data: sales
    }, 200, 'application/json')
})