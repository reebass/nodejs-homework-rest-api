const express = require("express");
const ctrl = require("../../controllers");
const { validateBody, isValid } = require("../../middlewares");
const { addSchema, updateSchema, updateFavoriteSchema } = require("../../models");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:contactId", isValid, ctrl.getById);

router.post("/", validateBody(addSchema), ctrl.add);

router.delete("/:contactId", isValid, ctrl.deleteById);

router.put("/:contactId", isValid, validateBody(updateSchema), ctrl.updateById);

router.patch("/:contactId/favorite", isValid, validateBody(updateFavoriteSchema), ctrl.updateFavorite);

module.exports = router;
