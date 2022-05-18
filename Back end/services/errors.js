export const createError = (err, status = 500) => {
  const internalError = new Error("Internal " + err.name + ": " + err.message);
  internalError.status = status;
  return internalError;
};
export const catchErrors = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      //Validation Errors
      if (typeof err === "string") {
        res.status(400).json({
          message: err,
        });
      } else {
        next(err);
      }
    });
  };
};
export const notFound = (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
};
