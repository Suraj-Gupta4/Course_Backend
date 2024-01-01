const mongoose  = require('mongoose');

// Define mongoose schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourse :[{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
  });
  
  const adminSchema = new mongoose.Schema({
    username:String,
    password:String,
    createdCourse :[{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
  });
  
  const courseSchema = new mongoose.Schema({
    title: String,
    description : String,
    price : Number,
    imageLink : String,
    published: Boolean
  });
  
  // Define mongoose model
  const User = mongoose.model('User', userSchema);
  const Admin = mongoose.model('Admin', adminSchema);
  const Course = mongoose.model('Course', courseSchema);

  module.exports = {
    User,
    Admin,
    Course
  }