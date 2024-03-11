const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const mongodb=require('./config/mongodb');
const authRouter=require('./router/auth');
const cardRouter=require('./router/cardRouter');
const cardPublicRouter=require('./router/cardPublicRouter');
var cors = require('cors')
const authMiddleware = require('./middleware/auth');


app.use(cors()) 
app.use(express.json());
app.use(authRouter);
app.use("/share",cardPublicRouter);
app.use("/card",authMiddleware,cardRouter);

app.get("/health",(req,res)=>res.json({
    service:"pro manage server",
    status:"Active",
    time:new Date(),
}));

app.listen(port||3000, () => {
  console.log(`Server is running on port ${port}`);
});

