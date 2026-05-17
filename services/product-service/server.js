require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3002;

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@postgres:5432/products', {
  dialect: 'postgres',
  logging: false
});

const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.NUMERIC(10,2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'products', timestamps: false });

app.use(express.json());

app.post('/products', async (req, res) =&gt; {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/products', async (req, res) =&gt; {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) =&gt; {
  res.json({ status: 'ok' });
});

sequelize.sync({ alter: true }).then(() =&gt; {
  console.log('DB connected');
  app.listen(PORT, () =&gt; console.log(`Product Service running on port ${PORT}`));
});
