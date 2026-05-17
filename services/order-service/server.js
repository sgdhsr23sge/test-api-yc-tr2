require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3003;

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@postgres:5432/orders', {
  dialect: 'postgres',
  logging: false
});

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  total_amount: { type: DataTypes.NUMERIC(10,2), allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'orders', timestamps: false });

app.use(express.json());

app.post('/orders', async (req, res) =&gt; {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/orders', async (req, res) =&gt; {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) =&gt; {
  res.json({ status: 'ok' });
});

sequelize.sync({ alter: true }).then(() =&gt; {
  console.log('DB connected');
  app.listen(PORT, () =&gt; console.log(`Order Service running on port ${PORT}`));
});
