const express = require('express');
const {User, Admin, Course} = require("../db/index");
const {SECRET} = require("../middleware/auth");
const {authenticateJwt} = require("../middleware/auth");
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/me',authenticateJwt, async (req, res) => {
  res.json({
    username:req.user.username
  })
})

router.post('/signup', async(req, res) => {
    // logic to sign up user
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(user){
      res.status(403).json({msg: "User already exist"});
    }else{
      const obj = {username: username, password: password};
      const newUser = new User(obj);
      newUser.save();
      const token = jwt.sign({username, role: 'user'}, SECRET, {expiresIn: '1h'});
      res.json({msg:"User signed up successfully", token});
    }
  });
  
  router.post('/login', async (req, res) => {
    // logic to log in user
    const {username, password} = req.headers;
    const user = await User.findOne({username, password});
    if(user)
    {
       const token = jwt.sign({username, role:'user'}, SECRET, {expiresIn: '1h'});
       res.json({msg:"Loggen in successfully", token});
    } else{
      res.status(403).json({msg:"Invalid username and password"});
    }
  });
  
  router.get('/courses',authenticateJwt, async (req, res) => {
    // logic to list all courses
    const course = await Course.find({published:true});
     res.json({course});
  });
  
  
  router.get('/course/:courseId', authenticateJwt, async (req,res) => {
    // logic to get single course 
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if(course){  
    res.json({course: course});
    } else {
      res.status(404).json({msg: "Course not found"});
    }
  })
  
  
  router.post('/courses/:courseId',authenticateJwt, async(req, res) => {
    // logic to purchase a course
    const { ObjectId } = require('mongoose').Types;
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (course) {
      const user = await User.findOne({ username: req.user.username });

      if (user) {
        // Check if the course is already purchased
       
        if (user.purchasedCourse.includes(new ObjectId(courseId))) {
          return res.json({ msg: 'Course already purchased' });
        }

        // Add the course to the user's purchasedCourse array
        user.purchasedCourse.push(courseId);

        // Save the user
        await user.save();

        return res.json({ msg: 'Course purchased successfully' });
      } else {
        return res.status(404).json({ msg: 'User not found' });
      }
    } else {
      return res.status(403).json({ msg: 'Course not exist' });
    }
  });
  
  router.get('/purchasedCourses',authenticateJwt, async (req, res) => {
    // logic to view purchased courses
    const user = await User.findOne({username: req.user.username}).populate('purchasedCourse');
    if(user){
      res.json({purchasedCourse: user.purchasedCourse || []});
    }else{
      res.status(403).json({msg: "User not found"});
    }
  });


  module.exports = router