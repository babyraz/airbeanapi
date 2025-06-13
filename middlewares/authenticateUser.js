import { verifyToken } from "../utils/index.js";
import { getUserById } from "../services/users.js";

// export async function authenticateUser(req, res, next) {
//     if(req.headers.authorization) {
//         const token = req.headers.authorization.replace('Bearer ', '');
//         const verification = verifyToken(token);
//         if(verification) {
//             next();

//         } else {
//             res.status(400).json({
//                 success : false,
//                 message : 'Invalid token'
//             });
//         }

//     } else {
//         res.status(400).json({
//             success : false,
//             message : 'No token provided'
//         });
//     }
// }

export async function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(400).json({
        success: false,
        message: 'No token provided'
      });
    }
  
    const token = authHeader.replace('Bearer ', '');
  
    try {
      const decoded = verifyToken(token); 
  
      if (!decoded?.userId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid token payload'
        });
      }
  
      const user = await getUserById(decoded.userId); 
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
  
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  }
