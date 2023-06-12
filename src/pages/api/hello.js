// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

require("dotenv").config();
const mysql = require("mysql2");

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Access the data sent in the request body
    const { timestamp, isVisible } = req.body;
    console.log(timestamp, isVisible, "isVisible");

    const insertQuery = "INSERT INTO test (timestamp,isVisible) VALUES (?,?)";
    const values = [timestamp, isVisible];

    // Perform any necessary processing or validations here
    try {
      const connection = mysql.createConnection(process.env.DATABASE_URL);
      await new Promise((res, rej) => {
        connection.query(insertQuery, values, (error, results) => {
          if (error) {
            rej("NO");
            console.error("Error executing query:", error);
            // Handle the error response
          } else {
            res("Yes");
            console.log("Insert successful", results);
            // Handle the success response
          }
        });
      });
      connection.end();
    } catch (err) {
      console.log("Failed insertion");
    }

    // Return a JSON response with the data
    res
      .status(200)
      .json({ message: "Data received successfully", timestamp, isVisible });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
