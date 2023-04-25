const express = require("express");
const {contactCtrl} = require("../../controllers");
const { validateBody, isValid, auth } = require("../../middlewares");
const { addSchema, updateSchema, updateFavoriteSchema } = require("../../models/contact");

const router = express.Router();

router.get("/", auth, contactCtrl.getAll);

router.get("/:contactId", auth, isValid, contactCtrl.getById);

router.post("/", auth, validateBody(addSchema), contactCtrl.add);

router.delete("/:contactId", auth, isValid, contactCtrl.deleteById);

router.put("/:contactId", auth, isValid, validateBody(updateSchema), contactCtrl.updateById);

router.patch("/:contactId/favorite", auth, isValid, validateBody(updateFavoriteSchema), contactCtrl.updateFavorite);

module.exports = router;
