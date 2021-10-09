const router = require('express').Router();
const User = require('../models/Users');
const bcrypt = require('bcrypt');

//register
router.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(hashedPassword);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.password
    })
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (error) {
    res.status(500).json(error);
  }
})

//login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json("Wrong username or password");
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      res.status(400).json("Wrong username or password");
    }

    //send res
    res.status(200).json({ _id: user._id, username: req.body.username });

  } catch (error) {
    res.status(500).json(error);
  }
})
module.exports = router;
