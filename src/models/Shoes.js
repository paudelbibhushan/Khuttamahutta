const mongoose = require('mongoose');
const slugify = require('slugify');
const ApiError = require('../errors/ApiError');

// Custom validator for mongooseSchema 
const uniqueNameValidator = () =>  async function(v){
    const count = await mongoose.models.Shoes.countDocuments({name: v });
    if(count > 0){
        return Promise.reject(new ApiError(409, `Duplicate name`))
    }
}

const ShoesSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Shoes name is required.'],
        unique: true,
        validate: {
            // Validation for unique name
            validator: uniqueNameValidator()
        }
    },
    brand: {
        type: String, 
        required: [true, 'brand name is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required.']
    },
    currency:{
        type: String,
        required: [true, 'Currency is required'],
        default: "Rs."
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must cannot be more than 10']
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    description: {
        type: String,
        default: 'No Description',
        required: true
    },
    category:{
      type: String,
      enum: ['male','female','unisex'],
      required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    uploadedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

// Create bootcamp slug from the name 
ShoesSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});



module.exports = mongoose.model('Shoes', ShoesSchema);
