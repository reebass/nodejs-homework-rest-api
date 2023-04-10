const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

async function reedContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}
function updateContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts), "utf-8");
}

async function listContacts() {
  const contacts = await reedContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await reedContacts();
  const contact = contacts.find((conatact) => conatact.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await reedContacts();
  const indexContact = contacts.findIndex(({ id }) => id === contactId);
  if (indexContact === -1) {
    return null;
  }

  const result = contacts.splice(indexContact, 1);
  updateContacts(contacts);
  return result;
}

async function addContact({ name, email, phone }) {
  const contacts = await reedContacts();
  const id = nanoid();
  const newContacts = { id, name, email, phone };
  contacts.unshift(newContacts);
  await updateContacts(contacts);
  return newContacts;
}

async function updateContact(contactId, data) {
  const contacts = await reedContacts();
  const idx = contacts.findIndex((conatact) => conatact.id === contactId);
  if (idx === -1) {
    return null;
  }
  contacts[idx] = { ...contacts[idx], ...data };
  await updateContacts(contacts);
  return contacts[idx];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
