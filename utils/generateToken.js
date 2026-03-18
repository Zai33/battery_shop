import jwt from "jsonwebtoken";

export const generateToken = async (user) => {
  // generate access token
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );

  // generate refresh token
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "15d" },
  );
  
  return { accessToken, refreshToken };
};
