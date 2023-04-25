const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HttpError, controllersWrap } = require("../helpers");
const { SECRET_KEY } = process.env;

const { User } = require("../models/user");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPasword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPasword });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const paswordCompare = await bcrypt.compare(password, user.password);
  if (!paswordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, {token})

  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};


const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).end();
};


module.exports = {
  register: controllersWrap(register),
  login: controllersWrap(login),
  getCurrent: controllersWrap(getCurrent),
  logout: controllersWrap(logout),
};
