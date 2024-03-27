const jwt = require("jsonwebtoken");

exports.verifyTokenMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      console.log("Received token:", token);
      jwt.verify(
        token,
        process.env.JWT_SECRET || "yourFallbackSecretKey",
        (err, decodedUser) => {
          if (err) {
            console.log("Token verification error:", err);
            if (err.name === "TokenExpiredError") {
              // Handle expired token specifically
              return res.status(401).json({ success: false, message: "Token expired" });
            } else {
              // Handle other token verification errors
              return res.status(403).json({ success: false, message: "Token is not valid" });
            }
          }
          console.log("Decoded user:", decodedUser);
          if (!decodedUser || !decodedUser._id) {
            console.log("Decoded token does not contain user _id");
            return res.status(400).json({
              success: false,
              message: "Invalid token payload: Missing user _id",
            });
          }

          req.user = decodedUser;
          next();
        }
      );
    } else {
      console.log("No authentication header provided");
      return res.status(401).json({
        success: false,
        message: "Authentication header not provided (Token)",
      });
    }
  } catch (error) {
    console.error("Error in verifyTokenMiddleware:", error);
    next(error);
  }
};
