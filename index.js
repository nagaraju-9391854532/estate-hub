if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express=require('express')
const app=express()
const ejsMate=require("ejs-mate")
const path=require("path")
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose=require('mongoose')
const passportSetup=require('./config/passport-setup')
const cookieSession = require('cookie-session');
const session=require('express-session')
const methodOverride = require('method-override')
const LocalStrategy = require('passport-local')
const User=require("./model/User")
const Plot=require("./model/plot");
const House=require("./model/house")



mongoose.connect("mongodb://127.0.0.1:27017/estatehub")

const db=mongoose.connection
db.on("error",console.error.bind(console,"connection error"))
db.once("open",()=>{
    console.log("database connected succesfully")
})

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    
  }));


// initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})


app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/home",(req,res)=>{
    res.render("home")
})


//***************************user routes************************ */

app.get("/login",(req,res)=>{
    res.render("users/login")
})
app.post("/login",passport.authenticate("local"),(req,res)=>{
   
    res.redirect("/");
})

app.get("/login/google",passport.authenticate("google",{
    scope:['profile','email']
}))
app.get("/login/google/redirect",passport.authenticate("google"),(req,res)=>{
    res.redirect("/")
})

app.get("/register",(req,res)=>{
    res.render("users/register")
})
app.post("/register",async(req,res)=>{
        const {email,username,password,mobile}=req.body;
        const user = new User({ email, username,mobile });
        const registeredUser = await User.register(user, password);
        console.log("registered")
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/');
        })

})
app.get("/logout",(req,res)=>{
    req.logout(function (err) {
    res.redirect('/home');
    });
})


//***********************posting routes*********************** */

app.get("/postproperty",(req,res)=>{
    res.redirect("/selectPropertyType")
})

app.get("/properties",async(req,res)=>{
  
    const houses=await House.aggregate([ { $sample: { size: 4 } } ]);
    const plots=await Plot.aggregate([ { $sample: { size: 4 } } ]);
    res.render("properties/show",{houses,plots})
})

app.get("/selectPropertyType",(req,res)=>{
    res.render("properties/selecttype");
})
app.post("/selectPropertyType",(req,res)=>{
    const {property}=req.body;
    res.render("properties/create",{property})
})


//**********************house routes*****************************//
app.post("/listProperty/house",async(req,res)=>{
    const house=new House(req.body.house);
    house.images=[{url:'https://res.cloudinary.com/dmsthnisw/image/upload/v1703066234/wwfkg1xcacfzw0ahcazy.jpg'},{url:'https://res.cloudinary.com/dmsthnisw/image/upload/v1703066346/indian-villa-design-interiors-for-your-home_pfgqhd.jpg'}]
    house.author=req.user;
    await house.save();
    console.log(house);
    res.redirect(`/properties/house/${house._id}`)
})

app.get("/properties/house/:id",async(req,res)=>{
    const house=await House.findById(req.params.id).populate({path:'author'}).populate('author');
    const propertytype="house";
    res.render("properties/showproperty",{propertytype,house});

})

app.get("/properties/house",async(req,res)=>{
    const houses=await House.find({});
    const propertytype="house"
    
    res.render("properties/index",{propertytype,houses})
})


app.get("/properties/house/:id/edit",async(req,res)=>{
 const { id } = req.params;
 const house = await House.findById(id)
    const property="house"
 res.render('properties/edit', {property, house });
})

app.put("/properties/house/:id",async(req,res)=>{
    const { id } = req.params;
    const house = await House.findByIdAndUpdate(id, { ...req.body.house });
    res.redirect(`/properties/house/${house._id}`)
})
app.delete("/properties/house/:id",async(req,res)=>{
    const { id } = req.params;
    await House.findByIdAndDelete(id);
    res.redirect('/properties');
})


//*****************************0plot routes*****************************//
app.post("/listProperty/plot",async(req,res)=>{
    const plot=new Plot(req.body.plot);
    plot.images=[{url:"https://img3.exportersindia.com/product_images/bc-full/2020/7/7535347/bbg-open-plots-1--1594884932.jpeg"},{url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUlOlpiozQ8RVr50PWdkrk0izO7HooWdK-8w&usqp=CAU"}]
    plot.author=req.user;
    console.log(plot);
    await plot.save();
    console.log(plot);
    res.redirect(`/properties/plot/${plot._id}`)
})

app.get("/properties/plot/:id",async(req,res)=>{
    const plot=await Plot.findById(req.params.id).populate({path:'author'}).populate('author');
    const propertytype="plot";
    res.render("properties/showproperty",{propertytype,plot});

})

app.get("/properties/plot",async(req,res)=>{
    const plots=await Plot.find({});
    const propertytype="plot"
    res.render("properties/index",{propertytype,plots})
})


app.get("/properties/plot/:id/edit",async(req,res)=>{
    const { id } = req.params;
    const plot = await Plot.findById(id)
       const property="plot"
    res.render('properties/edit', {property, plot });
   })
   
   app.put("/properties/plot/:id",async(req,res)=>{
       const { id } = req.params;
       const plot = await Plot.findByIdAndUpdate(id, { ...req.body.plot });
       res.redirect(`/properties/plot/${plot._id}`)
   })
   app.delete("/properties/plot/:id",async(req,res)=>{
       const { id } = req.params;
       await Plot.findByIdAndDelete(id);
       res.redirect('/properties');
   })



app.listen(3000,()=>{
    console.log("coonnected succesfully");
})