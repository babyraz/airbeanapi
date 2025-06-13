// export function isAdmin(req, res, next){
//     if (global.user?.role==="admin"){
//         return next();
//     }
//     else {
//         return next({
//             status : 403,
//             message : "User is not authorized"
//         }
//         )
//     }
// }

export function isAdmin(req, res, next) {
    if (req.user?.role === 'admin') {
      return next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'User is not authorized'
      });
    }
  }