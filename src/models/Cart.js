const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    products: [
      {
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Shoes'
        },
        quantity: {
            type: Number,
            default: 1
        },
        name: String,
        price: Number,
        photo: {
          type: String,
          required: false
        },
      }
    ],
    active: {
      type: Boolean,
      default: true
    },
    modifiedOn: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);