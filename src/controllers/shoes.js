// sendResponse helper function 
const {sendResponse} = require('../helpers/response');

// asyncHandler import 
const asyncHandler = require('../helpers/asyncHandler');

// Model shoe
const Shoes = require('../models/Shoes');
const ApiError = require('../errors/ApiError');

//@des      Get all Shoes
//@route    GET /api/v1/shoes
//@access   Public
exports.getShoes = asyncHandler( async (req, res, next) => {
    return sendResponse(res, res.advanceResults, 200, 'application/json')
})

//@des      Get single shoes
//@route    GET /api/v1/shoes/:id
//@access   Public
exports.getShoe = asyncHandler( async (req, res, next) => {
    let shoe = await Shoes.findById(req.params.id);

    if(!shoe){
        return next(
            ApiError.notfound(`id of ${req.params.id} couldn't found.`)
        )
    }
    shoe = await shoe.populate()
    return sendResponse(res, {
        status: "Sucess",
        data: shoe
    }, 200, 'application/json')
});

//@des      Create shoe 
//@route    POST /api/v1/shoes
//@access   Private: [admin, owner]
exports.createShoe = asyncHandler( async (req, res, next) => {
    console.log()
    req.body.user = req.user.id;
    req.body.uploadedBy = req.body.user._id

    const shoe = await Shoes.create(req.body);
    
    return sendResponse(res, {
        status: "Sucess",
        data: shoe
    }, 200, 'application/json')
});


//@des      Update shoe 
//@route    PUT /api/v1/shoes/:id
//@access   Private: [admin, owner]
exports.updateShoe = asyncHandler( async (req, res, next) => {
    let shoe = await Shoes.findById(req.params.id);
    
    if(!shoe){
        return next(
            new ApiError(400, `shoe of id ${req.params.id} couldn't be found.`)
            )
    }
    
    if(req.user.role !== 'admin'){
        return next(
            ApiError.unauthorized(`User of id ${req.npm.id} is unauthorized.`)
        )
    }

    shoe = await Shoes.findByIdAndUpdate(req.params.id, req.body)

    return sendResponse(res, {
        status: "Sucess",
        data: shoe
    }, 200, 'application/json')
    });

    
//@des      Delete shoe 
//@route    Delete /api/v1/shoes/:id
//@access   Private: [admin, owner]
exports.deleteShoe = asyncHandler( async (req, res, next) => {
    let shoe = await Shoes.findById(req.params.id);
    
    if(!shoe){
        return next(
            new ApiError(400, `shoe of id ${req.params.id} couldn't be found.`)
            )
    }
    
    if(req.user.role !== 'admin'){
        return next(
            ApiError.unauthorized(`User of id ${req.user.id} is unauthorized.`)
        )
    }

    await shoe.remove();
    
    return sendResponse(res, {
        status: "Sucess",
        data: [],
        message: 'Deletetion sucess.'
    }, 200, 'application/json')
});


//@des      Get all Shoes by the publisher
//@route    GET /api/v1/shoes/myShoes
//@access   Private: [admin, owner]
exports.getMyShoes = asyncHandler( async (req, res, next) => {
    // Find the shoe by userId

    console.log('my Shoes')
    const shoes = await Shoes.find({user: req.user._id})

    // If there is no Shoes
    if(!shoes){
        return next(
            ApiError.notfound(`Shoes not found for user ${req.user._id} `)
        )
    };

    return sendResponse(res, {
        status: "Sucess",
        data: shoes
    }, 200, 'application/json')
});