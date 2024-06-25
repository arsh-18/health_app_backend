import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";


export const authenticate = async (req, res, next) => {
    // Get token from headers
    const authToken = req.headers.authorization;
  
    // Check if token exists and starts with "Bearer"
    if (!authToken || !authToken.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }
    
    try {
      // Remove "Bearer " from the token string
      const token = authToken.split(" ")[1];
      
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
      // Debugging: Log the decoded token
    //   console.log('Decoded Token:', decoded);
      
      // Attach user information to request object
      req.userId = decoded.id;
      req.role = decoded.role;
  
      // Proceed to the next middleware or route handler
    //   console.log(req.userId) // yahin par userId undefined ho jaa rahi hai

      next();
    } catch (err) {
    //   console.error('Error verifying token:', err);
  
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: "Token is expired" });
      } else {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }
    }
  };

export const restrict = (roles) => async (req, res, next) => {
    const userId = req.userId; // Access user ID from req.user (set by authenticate middleware)
    let user;
  
    try {
    //   console.log(`Finding user with ID: ${userId}`);
      
      const patient = await User.findById(userId);
      const doctor = await Doctor.findById(userId);
  
      if (patient) {
        user = patient;
      } else if (doctor) {
        user = doctor;
      }
  
      if (!user) {
        // console.log("User not found");
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // console.log(`User found: ${user}`);
      // console.log(`Required roles: ${roles}`);
      // console.log(`User role: ${user.role}`);
      
      if (!roles.includes(user.role)) {
        // console.log("User is not authorized");
        return res.status(401).json({ success: false, message: "You're not authorized" });
      }
  
      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      // console.error('Error in restrict middleware:', err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };