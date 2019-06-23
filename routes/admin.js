//ALL ADMINISTRATIVE ROUTES
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model("categories");

router.get('/', (req, res) => {
    res.render("admin/index")
})


router.get('/posts', (req, res) => {
    res.send("Posts Page")
})


router.get("/cat", (req, res) => {
    Category.find().then((categories) => {
        res.render("admin/categories", {categories: categories});
    }).catch((err) => {
        req.flash("error_msg", "There was an error listing Categories");
        res.redirect("/admin/cat")
    })
    
})


router.get("/cat/add", (req, res) => {
    res.render("admin/addcat")
})


router.post("/cat/new", (req, res) => {
    //Form Validation
        var errors = [];

        if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
            errors.push({text: "Invalid Name"})
        }

        if(req.body.name.length < 3){
            errors.push({text: "Category name too short"})
        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            errors.push({text: "Invalid Slug"})
        }

        if(errors.length > 0){
            res.render("admin/addcat", {errors: errors})
        }
        else{
            var newCategory = {
                name: req.body.name,
                slug: req.body.slug
            }
            new Category(newCategory).save().then(() => {
                req.flash("success_msg", "Succefully created Category");
                res.redirect("/admin/cat");
            }).catch((err) => {
                req.flash("error_msg", "There was an error creating the Category, try again");
                console.err("ERROR -> "+err)
            })
        }


    
})

router.post("/cat/edit", (req, res)=>{

    Category.findOne({_id: req.body.id}).then((category)=>{

        category.name = req.body.name;
        category.slug = req.body.slug;

        category.save().then(() => {
            req.flash("success_msg", "Category Successfully eddited");
            res.redirect("/admin/cat")
        }).catch((err)=>{
            req.flash("error_msg", "There was an internal error on saving Edit, try again")
            res.redirect("/admin/cat")
        })

    }).catch((err)=>{
        req.flash("error_msg", "There was an error on Category Edit")
    })

})


router.get("/cat/edit/:id", (req, res) => {
    Category.findOne({_id: req.params.id}).then((category) =>{
        res.render("admin/editcat", {category:category});
    }).catch((err)=>{
        req.flash("error_msg", "This Category does not exists")
        res.redirect("admin/cat")
    })
    
})



module.exports = router;

//Post.findAll({order: [['id', 'DESC']]}).then(function(posts){
   // res.render('home', {posts: posts});
//});