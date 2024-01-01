const express = require('express');
const mongoose  = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const app = express();
const adminRoute = require("./routes/admin");
const userRoute = require("./routes/user");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/admin", adminRoute);
app.use("/users", userRoute);


// connect to mongoDB
const dbUser=process.env.DB_USERNAME;
const dbPass=process.env.DB_PASSWORD;
mongoose.connect("mongodb+srv://"+`${dbUser}`+":"+`${dbPass}`+"@cluster0.u68qefn.mongodb.net/course", 
                  { useNewUrlParser: true, useUnifiedTopology: true});


app.listen(PORT, () => {
    console.log('Server is listening on port 3000');
});
                                    