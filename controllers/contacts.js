const { HttpError, controllersWrap } = require("../helpers");

const { Contact } = require('../models')


const getAll = async (req, res, next) => {
    const contacts = await Contact.find();
    res.json(contacts);
};

const getById = async (req, res) => {
    const { contactId } = req.params;
    console.log(contactId);
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    res.json(contact);
};

const add = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);

};

const deleteById = async (req, res) => {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndRemove(contactId);
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    res.json({ massage: "contact deleted" });
};

const updateById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw HttpError(404, "Contact not found");
    }
    res.json(result);
};

const updateFavorite = async (req, res) => {
    const { contactId } = req.params;
    console.log(req.body)
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw HttpError(404, "Contact not found");
    }
    res.json(result);
};

module.exports = {
  getAll: controllersWrap(getAll),
  getById:  controllersWrap(getById),
  add: controllersWrap(add),
  deleteById: controllersWrap(deleteById),
  updateById: controllersWrap(updateById),
  updateFavorite: controllersWrap(updateFavorite)
}

