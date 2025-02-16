const mongoose = require ("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Ecommerce_website") 

connect.then(() => {
    console.log("Database connected successfully");
})
.catch(() => {
    console.log("Database connection failed");
})

// schema
const loginschema = new mongoose.Schema({
    name:{
        type: 'string',
        required:true
    },
    password: {
        type: 'string',
        required: true
    }
})

// modal
const customer = mongoose.model("customers", loginschema);

module.exports = customer;