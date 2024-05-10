const mongoose  = require("mongoose");
const DB_URI = "mongodb://localhost:27017/superquizzer";

mongoose.connect(DB_URI)
.then(() => {console.log("DB Connect SuccesFully")})
.catch((error) => {console.log(error)})