const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let database;

async function initDb() {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  database = client.db(process.env.DB_NAME);
  console.log("Connected to MongoDB");
}

function getDb() {
  if (!database) {
    throw new Error("Database not connected");
  }
  return database;
}

module.exports = {
  initDb,
  getDb
};
