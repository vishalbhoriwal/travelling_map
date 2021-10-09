const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');

const app = express();
app.use(express.json())
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Mongo is connected')
}).catch((err) => {
  console.log(err)
});

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);

app.listen(8080, () => {
  console.log('Server is running')
})