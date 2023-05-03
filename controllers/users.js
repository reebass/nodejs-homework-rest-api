const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const { HttpError, controllersWrap, resizeAvatar, sendEmail } = require("../helpers");
const { SECRET_KEY, BASE_URL } = process.env;

const { User } = require("../models/user");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPasword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPasword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
  }

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};


const verifyEmail = async (req, res) => {
  const {verificationToken} = req.params;
  const user = await User.findOne({verificationToken});
  if(!user) {
    throw HttpError(404, 'User not found')
  }

  await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null});
  res.json({
    message: "Verification successful"
  })
}

const resendVerifyEmail = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
      throw HttpError(404, 'User not found')
    }
    if(user.verify) {
      throw HttpError(400, "Verification has already been passed")
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.json({
      message: "Verification email sent"
    })

}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if(!user.verify) {
    throw HttpError(403, "Email not varified");
  }



  const paswordCompare = await bcrypt.compare(password, user.password);
  if (!paswordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName);
  await fs.rename(tempUpload, resultUpload);
  await resizeAvatar(resultUpload, 250, 250);
  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: controllersWrap(register),
  verifyEmail: controllersWrap(verifyEmail),
  resendVerifyEmail: controllersWrap(resendVerifyEmail),
  login: controllersWrap(login),
  getCurrent: controllersWrap(getCurrent),
  logout: controllersWrap(logout),
  updateAvatar: controllersWrap(updateAvatar),
};
