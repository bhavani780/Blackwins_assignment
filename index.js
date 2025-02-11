
const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "contacts.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//Creating API endpoints

//GET METHOD
app.get("/contacts/", async (request, response) => {
  const getContactsQuery = `
    SELECT
      *
    FROM
      contacts
    ORDER BY
      contact_id;`;
  const contactsArray = await db.all(getContactsQuery);
  response.send(contactsArray);
});

//POST METHOD
app.post("/contacts/", async (request, response) => {
  const contactDetails = request.body;
  const {
    contactId,
    name,
    email,
    phoneno,
    address,
  } = contactDetails;
  const addContactQuery = `
    INSERT INTO
      book (name,email,phoneno,address)
    VALUES
      (
         ${contactId},
        '${name}',
        '${email}',
         ${phoneNo},
        '${address}',
      );`;

  const dbResponse = await db.run(addContactQuery);
  const contactId = dbResponse.lastID;
  response.send({ contactId: contactId });
});        

//PUT METHOD 
app.put("/contacts/:contactId/", async (request, response) => {
  const { contactId } = request.params;
  const contactDetails = request.body;
  const {
    contactId,
    name,
    email,
    phoneno,
    address,
  } = contactDetails;
  const updateContactQuery = `
    UPDATE
      contacts
    SET
      contact_id=${contactId},
      name='${name}',
      email='${email}',
      phoneno=${phoneno},
      address='${address}'
    WHERE
      contact_id = ${contactId};`;
  await db.run(updateContactQuery);
  response.send("Contact Updated Successfully");
});

//DELETE METHOD 
app.delete("/contacts/:contactId/", async (request, response) => {
  const { contactId } = request.params;
  const deleteContactQuery = `
    DELETE FROM
      contacts
    WHERE
      contact_id = ${contactId};`;
  await db.run(deleteContactQuery);
  response.send("Contact Deleted Successfully");
});

//GET METHOD 
app.get("/contacts/:contactId/", async (request, response) => {
  const { contactId } = request.params;
  const getContactQuery = `
    SELECT
     *
    FROM
     book
    WHERE
      contact_id = ${contactId};`;
  const contactsArray = await db.all(getContactQuery);
  response.send(contactsArray);
});
