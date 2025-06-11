export function isAdmin(req, res, next){
    if (global.user?.role==="admin"){
        return next();
    }
    else {
        return next({
            status : 403,
            message : "User is not authorized"
        }
        )
    }
}