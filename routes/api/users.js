const express = require("express");
const { validateBody, auth, upload } = require("../../middlewares");
const { loginSchema, registerSchema, emailSchema } = require("../../models/user");
const { authCtrl } = require("../../controllers");

const router = express.Router();

router.post("/register", validateBody(registerSchema), authCtrl.register);

router.get("/verify/:verificationToken", authCtrl.verifyEmail);

router.post("/verify", validateBody(emailSchema), authCtrl.resendVerifyEmail)

router.post("/login", validateBody(loginSchema), authCtrl.login);

router.post("/logout", auth, authCtrl.logout);

router.get("/current", auth, authCtrl.getCurrent);

router.patch("/avatars", auth, upload.single("avatar"), authCtrl.updateAvatar)

module.exports = router;
