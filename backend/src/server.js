const app = require('./app');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./utils/db');
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});