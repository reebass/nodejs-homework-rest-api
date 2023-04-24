const {isValidObjectId} = require("mongoose");
const { HttpError } = require("../helpers");

const isValid = (req, __, next) => {
    const {contactId} = req.params
    if (!isValidObjectId(contactId)) {
        next(HttpError(404, `${contactId} is not valid id`))
    }
    
    next()

}

module.exports = isValid