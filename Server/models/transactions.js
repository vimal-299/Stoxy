import mongoose from "mongoose";
import CounterModel from './counter.js';

const TransactionsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: {type: Date,default: Date.now},
    tid: String,
    type:String,
    stock: String,
    quantity: Number,
    price:Number,
    amount: Number,
})

TransactionsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await CounterModel.findOneAndUpdate(
      { id: 'transaction_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const num = counter.seq.toString().padStart(3, '0');
    this.tid = `txn${num}`;
  }

  this.amount = this.price * this.quantity;
  next();
});

const TransactionsModel = mongoose.model('Transaction',TransactionsSchema)
export default TransactionsModel