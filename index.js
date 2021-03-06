const express = require("express");
const app = express();
const PORT = process.env.PORT || 80

const {getDuration} = require("./helpers/index");
const {getDateStringFormat} = require("./helpers/index")


// Url encoded middleware

app.use(express.urlencoded({extended:false}));

// Static middleware
app.use(express.static("static"));

// Engine
app.set("view engine", "hbs");

let data = require("./dummydata");


// GET
app.get("/",(req,res)=>{
    const isPostNotThere = data.length == 0 ? true : false;
   res.render("home", {data,isPostNotThere})
}); 

app.get("/single/:id",(req,res)=>{
    const id = req.params.id;
    const User = data.filter(item => item.id == id)[0];
    res.render("single", {User:User});
});

app.get("/addmyproject",(req,res)=>{
    res.render("addproject")    
});

app.get("/contact",(req,res)=>{
    res.render("contact")
});

// POST
app.post("/postmyproject",(req,res)=>{

    const duration = getDuration(req.body.startDate,req.body.endDate);
    const stringDate = getDateStringFormat(req.body.startDate) + " - " + getDateStringFormat(req.body.endDate);
    const tech = [
        {node: req.body.node? true : false},
        {react: req.body.react? true : false},
        {js:req.body.js? true : false},
        {css:req.body.css? true : false}
    ];
    const imageUrl = "/images/pexels-pixabay-220453.jpg";

    
    const newData = {id: data.length == 0 ? 0 : Number(data[data.length - 1].id) + 1, title:req.body.title, 
                    startDate:req.body.startDate, endDate:req.body.endDate, 
                    stringDate:stringDate , duration: duration, 
                    description:req.body.description, tech:tech, img:imageUrl};

    data.push(newData);
    

    res.redirect("/");
});

// DELETE
app.get("/deletemyproject/:id",(req,res)=>{

    
    const id = Number(req.params.id);
    data = data.filter(item => item.id !== id);
    

    res.redirect("/");
})

// EDIT
     // get edit form page
app.get("/editproject/:id", (req,res)=>{
       const id = req.params.id;
       const dataToEdit = data.find(item => item.id == id);
    
       res.render("editproject", {dataToEdit})
});
    //  submit form from edit page
app.post("/editmyproject/:id",(req,res)=>{

    const id = Number(req.params.id);
    const updatedData = req.body;

    const duration = getDuration(updatedData.startDate,updatedData.endDate);
    const stringDate = getDateStringFormat(updatedData.startDate) + " - " + getDateStringFormat(updatedData.endDate);
    const tech = [
        {node: updatedData.node? true : false},
        {react: updatedData.react? true : false},
        {js: updatedData.js? true : false},
        {css: updatedData.css? true : false}
    ];
    const imageUrl = "/images/pexels-pixabay-220453.jpg";


    const newData = {id:id, title:updatedData.title, 
        startDate:updatedData.startDate, endDate:updatedData.endDate, 
        stringDate:stringDate , duration: duration, 
        description:updatedData.description, tech:tech, img:imageUrl};


    data = data.map(item => {if(item.id == id){
        return newData
    }else{
        return item
    }});

    res.redirect("/")

})






app.listen(PORT, ()=>{
    console.log(`Connected to ${PORT}`)
})
