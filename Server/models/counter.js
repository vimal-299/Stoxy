import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const CounterModel = mongoose.model('Counter', counterSchema);
export default CounterModel;