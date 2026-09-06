import jwt from "jsonwebtoken";
import { sendError } from "../utils/response.js";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return sendError(
            res,
            401,
            "UNAUTHORIZED",
            "Authentication required"
        );
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return sendError(
                res,
                401,
                "INVALID_TOKEN",
                "Invalid or expired token"
            );
        }

        req.user = {
            id: decoded.userId
        };

        next();
    });
};