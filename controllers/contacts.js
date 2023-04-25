const { HttpError, controllersWrap } = require("../helpers");

const { Contact } = require('../models/contact')


const getAll = async (req, res, next) => {
    const {_id: owner} = req.user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find({owner}, {skip, limit}).populate("owner", "email subscription -_id");;
    res.json(contacts);
};

const getById = async (req, res) => {
    const { contactId } = req.params;
    const {_id: owner} = req.user;
    const contact = await Contact.findById({contactId, owner});
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    res.json(contact);
};

const add = async (req, res) => {
    const {_id: owner} = req.user
    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result);

};

const deleteById = async (req, res) => {
    const { contactId } = req.params;
    const {_id: owner} = req.user;
    const contact = await Contact.findByIdAndRemove({contactId, owner});
    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    res.json({ massage: "contact deleted" });
};

const updateById = async (req, res) => {
    const { contactId } = req.params;
    const {_id: owner} = req.user;
    const result = await Contact.findByIdAndUpdate({contactId, owner}, req.body, {new: true});
    if (!result) {
      throw HttpError(404, "Contact not found");
    }
    res.json(result);
};

const updateFavorite = async (req, res) => {
    const { contactId } = req.params;
    const {_id: owner} = req.user;
    const result = await Contact.findByIdAndUpdate({contactId, owner}, req.body, {new: true});
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

