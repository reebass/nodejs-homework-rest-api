const express = require("express");
const { validateBody, auth } = require("../../middlewares");
const { loginSchema, registerSchema } = require("../../models/user");
const { authCtrl } = require("../../controllers");

const router = express.Router();

router.post("/register", validateBody(registerSchema), authCtrl.register);

router.post("/login", validateBody(loginSchema), authCtrl.login);

router.post("/logout", auth, authCtrl.logout);

router.get("/current", auth, authCtrl.getCurrent);

module.exports = router;
