require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/contactDance', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 2000,
//   appName: 'mongosh 1.8.2'
// });

// const port = 8000;
const port = process.env.port || 3000;

mongoose.set('strictQuery', false);

// define mongoose schema
const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
  describe: String
});

const Contact = mongoose.model('Contact', contactSchema);

// EXPRESS SPECIFIC STUFF   
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded({ extended: true }));


// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory

// ENDPOINTS
app.get('/', (req, res) => {
  const params = {}
  res.status(200).render('home.pug', params);
})

app.get("/contact", (req, res) => {
  res.status(200).render('contact.pug');
});

app.post("/contact", (req, res) => {
  var myData = new Contact(req.body);
  myData.save().then(() => {
    res.send("This item has been saved to the database")
  }).catch(() => {
    res.status(400).send("item was not saved to the databse")
  });
})

const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  }
  catch (error) {
    console.log(error);
    process.exit(1);
  }
}
// START THE SERVER
app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
})
