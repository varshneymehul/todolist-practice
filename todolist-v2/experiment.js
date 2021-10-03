//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const ObjectId = require('mongodb').ObjectID;
const app = express();
const _ = require('lodash');

app.set('view engine', 'ejs');
mongoose.connect("mongodb+srv://magneto769767:start123@cluster0.7rjie.mongodb.net/todolistDB",{ useUnifiedTopology: true , useNewUrlParser: true })
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const itemSchema = {
  name: String
}

const listSchema = {
  name:String,
  item : [itemSchema]
}

const Item = mongoose.model("item",itemSchema)

const List = mongoose.model("List" , listSchema)

const item1 = new Item({
  name:"buy grocery"
})
const item2 = new Item({
  name:"cook food"
})
const item3 = new Item({
  name:"eat food"
})

const defaultList = [item1,item2,item3] 

app.get("/", function(req, res) {

  Item.find(function (err,Founditems){
    if (Founditems.length === 0){
      Item.insertMany(defaultList, function (err){
        if (err) {
          console.log(err)
        }else{
          console.log("success")
        }
      })
      res.redirect("/")
    }else{
      res.render("list", {listTitle: "Today", newListItems: Founditems});
    }
  })


});

app.post("/", function(req, res){

  const itemName = req.body.newItem;  
  const nameOfList = req.body.list.slice(0,-1);
  const newitem = new Item({
    name: itemName
  })
  List.findOne({name:nameOfList},function (err,foundedlist){
    if (foundedlist === "Today"){
      newitem.save()
      res.redirect("/")
    }else{
      foundedlist.items.push(newitem);
      foundedlist.save()
      res.redirect("/"+nameOfList)
    }
  })

  
});

app.post("/delete",function(req,res){
  const checkedItem = req.body.checkbox;
  const listName = req.body.titlename;

  if (listName === "Today"){
    Item.findByIdAndRemove( ObjectId(checkedItem.trim()) , function (err){
      if (!err){
        console.log("sucessfully deleted checked item")
      }else{
        console.log(err)
      }
    })
    res.redirect("/")
  }else{
   List.findOneAndUpdate({name:listName},{$pull:{item : {_id :  ObjectId(checkedItem.trim())}}}, function (err,foundlist){
     if (!err){
       res.redirect("/"+ listName)
     }
   })
  }

  
})

app.get("/:customListName", function(req,res){
  const listName = _.capitalize(req.params.customListName);

  List.findOne({name:listName},function (err,foundList){
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: listName,
          item: defaultList
        })
        list.save()
        res.redirect("/"+ listName)
      }else{
        res.render("list",{listTitle: foundList.name , newListItems: foundList.item})
      }
    }
  })

 
})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

