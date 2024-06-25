import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js"
import Doctors from "../models/DoctorSchema.js"


export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    // Log the incoming request details
    console.log("Update user request received");
    console.log("User ID:", id);
    console.log("Request body:", req.body);

    // Check if user exists before updating
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true } // Ensure validators are run
    );

    // Return the updated user
    return res.status(200).json({
      success: true,
      message: "Successfully Updated",
      data: updatedUser,
    });
  } catch (err) {
    // Log any error that occurs
    console.error("Error updating user:", err);
    return res.status(500).json({ success: false, message: "Failed to update" });
  }
};


export const deleteUser = async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await User.findByIdAndDelete(
        id,
      );
      res
        .status(200)
        .json({
          success: true,
          message: "Successfully deleted",
        });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to delete" });
    }
  };

  export const getSingleUser = async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await User.findById(id).select("-password");
      res
        .status(200)
        .json({
          success: true,
          message: "User found",
          data: user,
        });
    } catch (err) {
      res.status(404).json({ success: false, message: "No user found" });
    }
  };


  export const getAllUser = async (req, res) => {
  
    try {
      const users = await User.find({}).select("-password");
      res
        .status(200)
        .json({
          success: true,
          message: "Users found",
          data: users,
        });
    } catch (err) {
      res.status(404).json({ success: false, message: "Not found" });
    }
  };


  export const getUserProfile = async (req, res) => {
    const userId = req.userId;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const { password, ...rest } = user._doc;
      res.status(200).json({ success: true, message: 'Profile info is getting', data: rest });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Something went wrong, can not get', error: err.message });
    }

    
  };

export const getMyAppointments = async (req, res) => {
  try {
    // Step 1: Retrieve appointments from bookings for a specific user
    const bookings = await Booking.find({ user: req.userId });
    // console.log('Bookings:', bookings);

    // Step 2: Extract doctor IDs from appointment bookings
    const doctorIds = bookings.map(el => el.doctor.id);
    // console.log('Doctor IDs:', doctorIds);

    // Step 3: Retrieve doctors using doctor IDs
    const doctors = await Doctors.find({ _id: { $in: doctorIds } }).select('-password');
    // consol e.log('Doctors:', doctors);

    // Send the response
    res.status(200).json({ success: true, message: 'Appointments are getting', data: doctors });
  } catch (err) {
    console.error('Error in getMyAppointments:', err);
    res.status(500).json({ success: false, message: 'An error occurred', error: err.message });
  }
};

  
  