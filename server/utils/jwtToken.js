import jwt from "jsonwebtoken";

export const generateToken = async (user, message, statusCode, res) => {
    
  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  // ✅ IMPORTANT: password remove before sending user
  user.password = undefined;

  return res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    })
    .json({
      success: true,
      message,
      token,
    //   user, // ✅ MUST SEND
    });
};
