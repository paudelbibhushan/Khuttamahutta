const asyncHandler = require("../helpers/asyncHandler");
const Cart = require("../models/Cart");
const Shoes = require("../models/Shoes");
// sendResponse helper function 
const { sendResponse } = require('../helpers/response');
const e = require("express");
const ApiError = require('../errors/ApiError');

exports.updateCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity, name, price, photo } = req.body;

    const userId = req.user._id; //TODO: the logged in user id

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            //cart exists for user
            let productIdentity = cart.products.findIndex(p => p.productId == productId);
            if (productIdentity > -1) {
                //product exists in the cart, update the quantity
                let productItem = cart.products[productIdentity];
                if (productItem.quantity>1) {
                    productItem.quantity = productItem.quantity + quantity;
                    quantity > -1 ?
                        productItem.price = productItem.price + price :
                        productItem.price = productItem.price - price

                    cart.products[productIdentity] = productItem;
                }else if(productItem.quantity==1 && quantity==-1){
                    return next(
                        ApiError.notfound(`Quantity can't be -1 `)
                    )
                }else {
                    productItem.quantity = productItem.quantity + quantity;
                    productItem.price = productItem.price + price
                    cart.products[productIdentity] = productItem;
                }
            } else {
                    //product does not exists in cart, add new item
                    cart.products.push({ productId, name, price, photo });
            }
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            //product does not exists in cart, add new item
                //no cart for user, create new cart
                const newCart = await Cart.create({
                    userId,
                    products: [{ productId, name, price }]
                });


            return sendResponse(res, {
                status: "Sucess",
                data: newCart
            }, 200, 'application/json')
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

exports.deleteAllCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.deleteMany({userId: req.user._id})
    return sendResponse(res, {
        status: "Sucess",
        data: cart
    }, 200, 'application/json')
})

exports.deleteCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.body;

    const userId = req.user._id; //TODO: the logged in user id

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            //cart exists for user
            let productIdentity = cart.products.findIndex(p => p.productId == productId);
            if (productIdentity > -1) {
                //product exists in the cart, update the quantity
                let updatedCart = cart.products;
                await updatedCart.pull(cart.products[productIdentity]);
                cart.products = updatedCart;
            } else {
                //product does not exists in cart
                return next(
                    ApiError.unauthorized(`No product in cart available.`)
                )
            }
        } else {
            return next(
                ApiError.unauthorized(`No cart available.`)
            )
        }
        cart = await cart.save();
            return sendResponse(res, {
                status: "Sucess",
                data: cart
            }, 200, 'application/json')
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

//Fetch cart
exports.getCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.body;

    const userId = req.user._id; //TODO: the logged in user id
    let items;
    if(!userId){
        return next(
            new ApiError(400, `Id couldn't be found.`)
            )
    }

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            //cart exists for user
            items = cart.products;
        } else {
            return next(
                ApiError.unauthorized(`No cart available.`)
            )
        }
            return sendResponse(res, {
                status: "Sucess",
                data: items
            }, 200, 'application/json')
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

