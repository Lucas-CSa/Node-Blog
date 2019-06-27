//Modules Load
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require('./routes/admin');
    const path =  require('path');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');

//Config
    //Session
    app.use(session({
        secret: "s3cr3tK31",
        resave: true,
        saveUnitialized: true
    }))
    app.use(flash());
    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        next();
    })
    //Body Parser
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(bodyParser.json());
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout:"main"}));
        app.set('view engine', 'handlebars');
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp", {
            useNewUrlParser: true
        }).then(function(){
            console.log('MongoDB Up')
        }).catch((err) => {
            console.error("ERROR -> "+err)
        });
    //Public
    app.use(express.static(path.join(__dirname, "public")));
    

//Routes
    app.use("/admin", admin)


//Others
    const PORT = 8080;
    app.listen(PORT, () => {
        console.log("Server Up on https://localhost:"+PORT);
    })
