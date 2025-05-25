import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    stock: String,
    fullname: String,
    currentprice: Number,
    buyprice: Number,
    quantity: Number,
    investedamount: Number,
    day_percent_change:Number,
    total_percent_change:Number,
})

PortfolioSchema.pre('save', function (next) {
  this.investedamount = this.buyprice * this.quantity;
  this.total_percent_change = Number((((this.currentprice-this.buyprice)/this.buyprice)*100).toFixed(2)) 
  next();
});

const PortfolioModel = mongoose.model('Portfolio',PortfolioSchema)

export default PortfolioModel