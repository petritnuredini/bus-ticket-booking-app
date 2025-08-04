const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/usersModel");
require("dotenv").config();

mongoose.connect(process.env.mongo_url);

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      email: "petrit.nuredini@gmail.com",
    });

    if (existingAdmin) {
      // Update existing user to be admin
      await User.updateOne(
        { email: "petrit.nuredini@gmail.com" },
        { $set: { isAdmin: true } }
      );
      console.log("User updated to admin successfully");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Petrit@Admin", 6);

    const admin = new User({
      name: "Admin",
      email: "petrit.nuredini@gmail.com",
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error:", error);
  }
  process.exit();
};

createAdmin();
