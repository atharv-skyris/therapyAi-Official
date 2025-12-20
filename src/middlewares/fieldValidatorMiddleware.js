import appError from "../utils/appErrorUtils.js";

function fieldValidator(requiredField, route = "auth") {
  return (req, res, next) => {
    console.log("field validator");
    console.log(requiredField);

    if (
      requiredField.some((field) => {
        const value = req.body[field];
        console.log("field:", field, "value:", value);

        if (!value) {
          return true;
        }

        if (typeof value === "string" && value.trim().length === 0) {
          return true;
        }

        if (typeof value === "number" && isNaN(value)) {
          return true;
        }

        return false;
      })
    ) {
      return next(new appError("All fields are required", 400));
    }

    console.log("all required fields are present");
    return next();
  };
}

export default fieldValidator;
