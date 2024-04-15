const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userDetails');

// Destructure the needed controller functions directly
const { createProfile, getAllProfiles, updateProfileComplete } = require('../controller/userController');

router.post("/register", async (req, res) => {
    try {
        const { fname, lname, email, password, userType } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fname,
            lname,
            email,
            password: hashedPassword,
            userType,
        });
        await newUser.save();
        res.status(201).json({ status: "ok", message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ status: "error", error: "Internal server error" });
    }
});

// Use the destructured functions directly
router.post('/profile', createProfile);
router.get('/profiles', getAllProfiles);
router.post('/updateProfileComplete', updateProfileComplete);

module.exports = router;
