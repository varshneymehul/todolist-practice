//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const app = express();
const _ = require('lodash')
const date = require(__dirname + "/date.js");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin:test123@cluster0.clibr.mongodb.net/todolistDB', {
  useNewUrlParser: true
})

const itemsSchema = {
  name: String,
}

const Item = mongoose.model("item", itemsSchema)
const item1 = new Item({
  name: "Welcome to your todolist ⚠",
})
const item2 = new Item({
  name: "Hit the ➕ button to add a new item.",
})
const item3 = new Item({
  name: "<< Hit this to delete an item",
})

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
}

const List = mongoose.model("list", listSchema)

const day = date.getDate();
app.get("/", function (req, res) {


  Item.find({}, function (err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) { // insertMany method has two parameters, 1: array to be inserted, 2: callback
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully added item')
        }
      })
      res.redirect("/")
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems,
      });
    }
  })

});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const listName = req.body.list;

  const newItem = new Item({
    name: itemName,
  })

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function (err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName)
    })
  }

});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkedBox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Success')
        res.redirect("/")
      }

    })
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, function (err, foundList) {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully deleted item')
        res.redirect("/" + listName)
      }
    }) // $pull is an operator, here we are pulling from our items array (after we have found the list name) and then it pulls the item that has the ID corresponding to our checkedItemId, this pull operator *deletes* the item that we are pulling from array
  }
})

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({
    name: customListName
  }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        })

        list.save();
        res.redirect("/" + customListName)

      } else {
        // Show an existing list

        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        })
      }
    }
  })


})

app.get("/about", function (req, res) {
  res.render("about");
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started successfully");
});