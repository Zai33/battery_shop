import User from "../models/userModel.js";

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_number } = req.body;

    if (!name || !email || !phone_number) {
      return res.status(400).json({
        con: false,
        message: "Name, email and phone number are required",
      });
    }
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone_number,
      },
      { new: true, runValidators: true },
    );
    if (!updateUser) {
      return res.status(404).json({
        con: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      con: true,
      message: "User updated successfully",
      result: updateUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//local upload
export const updateUserImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({
        con: false,
        message: "No image uploaded",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        image: req.file.filename,
      },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({
        con: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      con: true,
      message: "Profile image updated successfully",
      result: user,
    });
  } catch (error) {
    console.error("Error updating user image:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

