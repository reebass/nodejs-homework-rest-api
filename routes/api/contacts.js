const express = require("express");

const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../../models/contacts");

const Joi = require("joi");

const { HttpError } = require("../../helpers");

const router = express.Router();

const addShema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const updateShema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    console.log(contactId)
    const contact = await getContactById(contactId);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addShema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await addContact(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    res.json({ massage: "contact deleted" });
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = updateShema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(404, "Contact not found");
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
