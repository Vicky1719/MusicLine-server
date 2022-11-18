const { expressjwt: jwt } = require("express-jwt");

const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: (req) => {
    // si el usuario no envia token, lanza un error
    if (req.headers === undefined || req.headers.authorization === undefined) {
      return null;
    }

    // si el token existe, extraelo del string y retornalo de la funcion
    const tokenArr = req.headers.authorization.split(" ");
    const tokenType = tokenArr[0];
    const token = tokenArr[1];

    if (tokenType !== "Bearer") {
      return null;
    }

    return token;
  },
});

const isAdmin = (req, res, next) => {
  if (req.payload.role !== "admin") {
    res.status(401).json({ errorMessage: "No eres Admin" });
    return;
  } else {
    next();
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
};
