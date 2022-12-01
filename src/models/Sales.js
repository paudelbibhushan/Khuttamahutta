const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    amount: Number,
        merchantEmail: String,
        merchantName: String,
        merchantMobile: String,
        type: String,
        user: String,
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

module.exports = mongoose.model("Sales", SalesSchema);