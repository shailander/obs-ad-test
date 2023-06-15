// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

require("dotenv").config();
const mysql = require("mysql2/promise");

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Access the data sent in the request body
    const { timestamp, isActive, streamerTableName } = req.body;

    const insertQuery = `INSERT INTO ${streamerTableName} (timestamp,isActive) VALUES (?,?)`;
    const values = [timestamp, isActive];

    // Perform any necessary processing or validations here
    try {
      const connection = await mysql.createConnection(process.env.DATABASE_URL);
      await connection.query(insertQuery, values, (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          // Handle the error response
        } else {
          console.log("Insert successful", results);
          // Handle the success response
        }
      });

      connection.end();
    } catch (err) {
      console.log("Failed insertion");
    }

    // Return a JSON response with the data
    res
      .status(200)
      .json({ message: "Data received successfully", timestamp, isActive });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
