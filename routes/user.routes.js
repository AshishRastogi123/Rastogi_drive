const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');

router.get('/profile', (req, res) => {
    res.render('profile', { title: 'User Profile' });
    res.send("User route created") // Render the profile.ejs file
});

router.get("/resister", (req, res) => {
    res.render("resister")
}
);
router.post("/register",
    body("email").trim().isEmail(),
    body("password").trim().isLength({min:3}),
    body("username").trim().isLength({min:3}) ,(req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
       return res.send("Invalid Data");
    }
    res.send(errors)
    console.log(req.body);
    
}
);


module.exports = router;