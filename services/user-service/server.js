require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@postgres:5432/users', {
  dialect: 'postgres',
  logging: false
});

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'users', timestamps: false });

app.use(express.json());

app.post('/users', async (req, res) =&gt; {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) =&gt; {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) =&gt; {
  res.json({ status: 'ok' });
});

sequelize.sync({ alter: true }).then(() =&gt; {
  console.log('DB connected');
  app.listen(PORT, () =&gt; console.log(`User Service running on port ${PORT}`));
});
