require('dotenv').config()
const express = require('express');
const cors = require('cors')
const connectDb = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();
connectDb();
app.use(cors())
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
console.log(`server running at http://localhost:${PORT}`)
})



