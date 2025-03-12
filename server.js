const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

    app.use("/api/auth", require("./router/authRoutes"));
    app.use("/api/mining", require("./router/miningRoutes"));
    app.use("/api/alerts", require("./router/alertRoutes"));

    
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
