import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import axios from "axios"
import nodeCron from "node-cron"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import StockModel from "./models/stock.js"
import PortfolioModel from "./models/portfolio.js"
import WishlistModel from "./models/wishlist.js"
import TransactionsModel from "./models/transactions.js"
import userModel from "./models/user.js"

const app = express()
app.use(express.json())
dotenv.config();

const corsoptions = {
  origin: ["https://stoxy-fawn.vercel.app"]
}
app.use(cors(corsoptions))

const PORT = process.env.PORT
const APIKEY = process.env.APIKEY
const JWT_SECRET = process.env.JWT_SECRET
const uri = process.env.MONGOURL;
mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() =>
    console.log('Connected to MongoDB Atlas!'),
    app.listen(PORT, () => {
      console.log(`Stoxy listening on port ${PORT}`)
    })
  )
  .catch((err) => console.error('MongoDB Atlas connection error:', err));

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.get('/allstocks', async (req, res) => {
  try {
    const stocks = await StockModel.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Wishlist Requests starts
app.get('/wishlist-items', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const all_wishlist_stocks = await WishlistModel.find({ user: userId });
    res.json(all_wishlist_stocks);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/wishlist', authMiddleware, async (req, res) => {
  const { stock } = req.query;
  const userId = req.user.userId;

  try {
    const existing = await WishlistModel.findOne({ stock, user: userId });

    if (existing) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error checking wishlist' });
  }
})

app.post('/add-to-wishlist', authMiddleware, async (req, res) => {
  try {
    const { stock, fullname } = req.body
    const userId = req.user.userId;
    WishlistModel.findOne({ stock: stock, user: userId })
      .then(
        stocks => {
          if (!stocks) {
            const new_wish_stock = new WishlistModel({ stock, fullname, user: userId })
            new_wish_stock.save()
            res.json({ message: "stock successfully added to wishlist", stock: new_wish_stock })
          }
        }
      )
  } catch (error) {
    console.log("Failed to add the stock to wishlist", error.message)
    res.json({ error: 'Failed to add the stock to wishlist' })
  }
})

app.delete('/delete-from-wishlist', authMiddleware, async (req, res) => {
  try {
    const { stock, fullname } = req.body
    const userId = req.user.userId;
    const deletestock = await WishlistModel.findOne({ stock: stock, user: userId })
    await WishlistModel.deleteOne({ _id: deletestock._id });

    res.json({ message: 'Stock removed from wishlist', stock: deletestock });
  } catch (error) {
    res.json({ error: 'Failed to remove the stock from wishlist' })
  }
})
// Wishlist Requests ends


// Portfolio Requests starts
app.post('/add-to-portfolio', authMiddleware, async (req, res) => {
  try {
    const { stock, fullname, buyprice, quantity, currentprice, day_percent_change } = req.body
    const userId = req.user.userId;
    PortfolioModel.findOne({ stock: stock, user: userId })
      .then(stocks => {
        if (!stocks) {
          const new_port_stock = new PortfolioModel({ stock, fullname, buyprice, quantity, currentprice, day_percent_change, user: userId })
          new_port_stock.save()
          res.json("Stock successfully added to portfolio")
        }
        else {
          const newquantity = quantity + stocks.quantity
          const avgbuy = Number((((quantity * buyprice) + (stocks.quantity * stocks.buyprice)) / (quantity + stocks.quantity)).toFixed(2))
          stocks.quantity = newquantity
          stocks.buyprice = avgbuy
          stocks.currentprice = stocks.currentprice
          stocks.fullname = stocks.fullname
          stocks.investedamount = Number((stocks.buyprice * stocks.quantity).toFixed(2))
          stocks.save()
          res.json("Stock successfully added to portfolio")
        }
      })
  } catch (error) {
    console.log("Failed to add stock to portfolio", error.message)
    res.json({ error: 'Failed to add stock to portfolio' })
  }
})

app.get('/my-holdings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const holdings = await PortfolioModel.find({ user: userId })
    res.json(holdings)
  }
  catch (error) {
    res.json({ error: 'unable to fetch holdings' })
  }
})

app.delete('/remove-from-portfolio', authMiddleware, async (req, res) => {
  try {
    const { stock, fullname, sellprice, quantity, currentprice } = req.body;
    const userId = req.user.userId;
    const holding = await PortfolioModel.findOne({ stock, user: userId });

    if (!holding) {
      return res.status(404).json({ error: 'Holding not found' });
    }

    if (holding.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough quantity to sell' });
    }

    if (holding.quantity === quantity) {
      await PortfolioModel.deleteOne({ _id: holding._id });
    } else {
      holding.quantity -= quantity;
      holding.investedamount -= Number((quantity * holding.buyprice).toFixed(2))
      await holding.save();
    }

    return res.status(200).json({ message: 'Sell successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while processing sell request' });
  }
});
//Portfolio requests end

//Transactions requests start
app.post('/buy-transaction', authMiddleware, async (req, res) => {
  try {
    const { stock, price, quantity } = req.body
    const userId = req.user.userId;
    const type = 'Buy'
    const new_transaction = new TransactionsModel({ type, stock, price, quantity, user: userId })
    new_transaction.save()
    res.json("Transaction successful")
  } catch (error) {
    console.log("didnt add", error.message)
    res.json({ error: 'Transaction process failed' })
  }
});


app.post('/sell-transaction', authMiddleware, async (req, res) => {
  try {
    const { stock, price, quantity } = req.body
    const userId = req.user.userId;
    const type = 'Sell'
    const new_transaction = new TransactionsModel({ type, stock, price, quantity, user: userId })
    new_transaction.save()
    res.json("Transaction successful")
  } catch (error) {
    console.log("didnt add", error.message)
    res.json({ error: 'Transaction process failed' })
  }
})

app.get('/all-transactions', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const trans = await TransactionsModel.find({ user: userId })
    res.json(trans)
  }
  catch (error) {
    res.json({ error: 'unable to fetch transactions' })
  }
})
//Transactions requests start

//Real data requests start
app.get('/api/stock/:name', async (req, res) => {
  const queryName = req.params.name

  try {
    const { data } = await axios.get('https://stock.indianapi.in/stock', {
      params: { name: queryName },
      headers: { 'X-Api-Key': APIKEY }
    });
    res.json(data);
  } catch (err) {
    console.error('API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

const fetchAndUpdatePrice = async (stockName, stockId) => {
  try {
    const { data } = await axios.get('https://stock.indianapi.in/stock', {
      params: { name: stockName },
      headers: { 'X-Api-Key': APIKEY }
    });

    const latestPrice = data?.currentPrice.NSE
    const latestPercent = data?.percentChange

    if (latestPrice && latestPercent) {
      await PortfolioModel.updateOne({ _id: stockId }, { currentprice: latestPrice }, { day_percent_change: latestPercent });
    }
  } catch (err) {
    console.error(`Error updating ${stockName}:`, err.response?.data || err.message);
  }
};

nodeCron.schedule('0 10 * * *', async () => {
  try {
    const holdings = await PortfolioModel.find();

    for (const holding of holdings) {
      const stockName = holding.stock;
      const stockId = holding._id;
      await fetchAndUpdatePrice(stockName, stockId);
    }
  } catch (err) {
    console.error('Error fetching holdings:', err);
  }
});
// End


// User 
app.post("/user-signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new userModel({ name, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: "User created" });
});

app.post("/user-login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d", });

  res.json({ token });
});

app.get("/user-profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userModel.find({ _id: userId })
    res.json(user)
  }
  catch (error) {
    res.json(error.message)
    console.log(error)
  }
})