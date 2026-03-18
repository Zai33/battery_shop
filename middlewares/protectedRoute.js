import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  try {
    //check access token in header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        con: false,
        message: "Unauthorized access, token missing",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded) {
      return res.status(401).json({
        con: false,
        message: "Unauthorized access, invalid token",
      });
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    // Find the user associated with the token
    // const user = await User.findById(decoded.userId).select("-password");
    // if (!user) {
    //   return res.status(401).json({
    //     con: false,
    //     message: "Unauthorized access, user not found",
    //   });
    // }

    // req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in protected route:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const roleBasedAccess = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        con: false,
        message: "Forbidden, you don't have permission to access this resource",
      });
    }
    next(); // Proceed to the next middleware or route handler
  };
};

// Function to check if the user is an admin
export const adminOnly = (req, res, next) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        con: false,
        message: "Forbidden, admin access only",
      });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in admin only route:", error);
    res.status(500).json({
      con: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
