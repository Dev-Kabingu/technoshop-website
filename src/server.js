const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const bcrypt = require ("bcrypt");
const dotenv = require('dotenv');
const customer = require("./config");

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
// static path
app.use(express.static("public"));

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.get("/home", (req, res) =>{
  res.render("home")
})
app.get("/", (req, res) =>{
    res.render("login");
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

// register user
app.post("/signup", async (req, res) =>{
  const username = req.body.username;
  const password = req.body.password;

 if(!username || !password){
  return res.status(400).send("Username and password are required");
 }
 const userExist = await customer.findOne({name:username});
 if(userExist){
  return res.status(400).send("User already exists");
 }

   try{
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // create new customer
  const newCustomer = new customer({
    name: username,
    password: hashedPassword
  })

    const customerData = await newCustomer.save();
   console.log("User signed up successfully", customerData);
   res.status(201).send("user registered successfully");
   }catch (error){
    console.error("Error sign up", error);
    res.status(500).send("Internal server error")
   }
});

// login 
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try{
    const user = await customer.findOne({name:username});
    if(!user){
      return res.status(400).send("Invalid credentials");
    }
    console.log("user logged in successfully");
    res.status(200).send("user logged in successfully");
  }catch (error){
    console.error("error logging in", error);
    res.status(500).send("internal server error");
  }
})
// after logging in
app.get('/index', (req, res) => {
  res.send("welcome to the home page");
})

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server listening to port: ${PORT}`);
});