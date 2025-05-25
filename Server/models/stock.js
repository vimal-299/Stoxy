import mongoose from "mongoose"
const StockSchema = new mongoose.Schema({
  SYMBOL: String,
  NAMEOFCOMPANY: String,
  DATEOFLISTING: String,
  ISINNUMBER: String,
  FACEVALUE: Number
});
const StockModel = mongoose.model('Stock',StockSchema)
export default StockModel