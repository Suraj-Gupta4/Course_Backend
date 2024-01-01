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

  router.post('/signup', async (req, res) => {
    // logic to sign up admin
    const {username, password} = req.body;
    const admin = await Admin.findOne({username});
  
    if(admin)
    {
      res.status(403).json({msg : "Admin already exist"});
    }else{
      const obj = {username: username, password: password};
      const newAdmin = new Admin(obj);
      
      newAdmin.save();
      
      const token = jwt.sign({username, role:admin}, SECRET, {expiresIn: '1h'});
  
      res.json({msg: "Admin created successfully", token});
    }
  
  });
  
  router.post('/login', async (req, res) => {
    // logic to log in admin
    const {username, password} = req.headers;
    const admin = await Admin.findOne({username, password});
    if(admin)
    {
      const token = jwt.sign({username, role:admin}, SECRET, {expiresIn: '1h'});
      res.json({msg: "Logged in successfully", token});
    }else {
      res.status(403).json({msg:"Invalid username and password"});
    }
  });
  

  router.post('/courses', authenticateJwt, async (req, res) => {
    // logic to create a course
    const course = req.body;
    const newCourse = new Course(course);
    await newCourse.save();
  
    const admin = await Admin.findOne({username:req.user.username});
    admin.createdCourse.push(newCourse);
    await admin.save();
    
    res.json({msg:"Course created successfully", courseID: newCourse.id});
  });
  

  router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
    // logic to edit a course
    const courseId = req.params.courseId;
    const course = await Course.findByIdAndUpdate(courseId, req.body, {new: true});
    if(course)
    {
      res.json({msg: "Course update successfully",
                 course:course});
    }else {
      res.json({msg:"Course not found"});
    }
  
  });
  
  router.get('/courses',authenticateJwt, async (req, res) => {
    // logic to get all courses
     const admin = await Admin.findOne({username:req.user.username}).populate('createdCourse');
     const course = admin.createdCourse
     res.json({msg: "All courses", course});
  });
  
  
  router.get('/course/:courseId',authenticateJwt, async (req, res) => {
    // logic to get single courses
    const courseID = req.params.courseId;
    
    const course =await Course.findById(courseID);
  
    if(course){
    res.json({msg:"A course",
             course:course});
    } else {
      res.json({msg:"Course not found"});
    }
  });
  
module.exports = router
