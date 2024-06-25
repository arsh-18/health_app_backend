import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, role, photo, gender } = req.body;
  try {
    let user = null;
    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role == "doctor") {
      user = await Doctor.findOne({ email });
    }

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        photo,
        gender,
      });
    } else if (role == "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashedPassword,
        role,
        photo,
        gender,
      });
    }
    await user.save();
    res.status(200).json({ success: "true", message: "User successfully created" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
  } catch (err) {
    res.status(500).json({ success: "false", message: "Internal server error, try again" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await Doctor.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ status: 'false', message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    const { password: pwd, ...rest } = user._doc; // Remove password from the user data
    res.status(200).json({ success: "true", token, message: "Login Successful", data: rest });
  } catch (err) {
    res.status(500).json({ success: "false", message: "Failed to login" });
  }
};
