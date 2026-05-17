require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/users', createProxyMiddleware({ target: 'http://user-service:3001', changeOrigin: true }));
app.use('/products', createProxyMiddleware({ target: 'http://product-service:3002', changeOrigin: true }));
app.use('/orders', createProxyMiddleware({ target: 'http://order-service:3003', changeOrigin: true }));
app.use('/notifications', createProxyMiddleware({ target: 'http://notification-service:3004', changeOrigin: true }));

app.get('/health', (req, res) =&gt; {
  res.json({ status: 'ok' });
});

app.listen(PORT, () =&gt; {
  console.log(`API Gateway running on port ${PORT}`);
});
