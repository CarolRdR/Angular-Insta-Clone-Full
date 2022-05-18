import bcrypt from "bcryptjs";
import { User } from "../../model/user.model.js";
import { createToken } from "../../services/auth.js";
import { createError } from "../../services/errors.js";

export const registerUser = async (req, res, next) => {
  console.log(req.body);
  try {
    const encryptedPassword = bcrypt.hashSync(req.body.password);

    const userData = { ...req.body, password: encryptedPassword };

    const newUser = await User.create(userData);

    const token = createToken({
      name: newUser.name,
      id: newUser.id,
    });

    res.json({
      token,
      userName: newUser.name,
      id: newUser.id,
    });
  } catch (error) {
    next(createError(error));
  }
};
