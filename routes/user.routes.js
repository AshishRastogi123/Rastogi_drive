const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const UserModel = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const auth = require('../middleware/authe.middleware.js');
app = express();

router.get('/profile', (req, res) => {
    res.render('profile', { title: 'User Profile' });
    res.send("User route created") // Render the profile.ejs file
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


router.get("/resister", (req, res) => {
    res.render("resister")
}
);
router.post("/register",
    body("email").trim().isEmail().isLength({min:13}),
    body("password").trim().isLength({min:5}),
    body("user_name").trim().isLength({min:3}) ,
    async (req, res) => {
    console.log("REGISTER BODY:", req.body);
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
       return res.status(400).json({ 
        errors: errors.array(),
        message: "Invalid data"});
    }
    const {user_name, email, password} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    


    const newuser = await  UserModel.create({
        user_name,
        email, 
        password:hashedPassword, 
        });
    
    res.json(newuser);

    
}
);
router.get("/login", async (req, res) => {
    res.render("login")
});

router.post("/login",
    body("user_name").trim().isLength({min:3}),
    body("password").trim().isLength({min:5}),
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ 
        errors: errors.array(),
        message: "Invalid data"});
    }
    const {user_name, password} = req.body;

    const user = await UserModel.findOne({user_name:user_name});
    if (!user) {
        return res.status(404).json({
            message: "Username or password is incorrect"
        });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(404).json({
            message: "Username or password is incorrect"
        });
    }


    const token = jwt.sign({userId: user._id,
    user_name: user.user_name}, process.env.JWT_SECRET);
    res.cookie("token",token)
    res.redirect('/home');
}
);

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/user/login');
});

module.exports = router;