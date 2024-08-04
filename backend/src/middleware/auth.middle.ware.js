import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  const token =
    req.cookies["auth_token"] ||
    req.header("Authorization")?.replace("Bearer ", "");

  console.log(`token is`, token);
  if (!token) {
    return res.status(401).json({ message: " user unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);

    if (!decoded) {
      return res.status(401, "Unauthorized, please login to continue");
    }
    req.userId = decoded.userId;
    console.log(`decoded`, req.userId);

    const user = await User.findById(req.userId);
    console.log(user);

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    req.userId = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export const verifyRole = (roles) => {
  return (req, res, next) => {
    console.log(req.userId.role);
    if (!roles.includes(req.userId.role)) {
      console.log(`HELLO`, req.userId.role);
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
