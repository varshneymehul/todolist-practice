const express = require('express');

const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

const {
  json,
  urlencoded
} = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

const items = ["Buy some food!", "Cook the food", "Eat the food!"];
const workListItems = [];
app.set('view engine', 'ejs'); //this line tells the application to set eJS as its view engine. 
/*
 * Very important!
 */

app.get('/', function (req, res) {
 const day = date.getDate();
  console.log(items)
  res.render('list', {
    listTitle: day, //  nameOfDay is the letiable that has to be used in eJS document and day is the letiable that has to be rendered in eJS document (day has been set by JS code)

    newListItems: items,
  });
});

app.get("/work", function (req, res) {
  res.render('list', {
    listTitle: "Work",

    newListItems: workListItems,
  })
})

app.get("/about", function(req,res){
  res.render("about")
})

app.post("/work", function (req, res) {})

app.post("/", function (req, res) {
  let item = req.body.listItem;
  if (req.body.list === "Work") {

    workListItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    console.log(items);


    res.redirect("/"); // triggers the home route "/" in app.get() 
  }
});

app.listen(port, function () {
  console.log('Example app listening on port')
})