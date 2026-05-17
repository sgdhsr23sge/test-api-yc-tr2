require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3004;

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@postgres:5432/notifications', {
  dialect: 'postgres',
  logging: false
});

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'notifications', timestamps: false });

app.use(express.json());

app.post('/notifications', async (req, res) =&gt; {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/notifications', async (req, res) =&gt; {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) =&gt; {
  res.json({ status: 'ok' });
});

sequelize.sync({ alter: true }).then(() =&gt; {
  console.log('DB connected');
  app.listen(PORT, () =&gt; console.log(`Notification Service running on port ${PORT}`));
});
