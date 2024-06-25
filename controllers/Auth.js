import "dotenv/config";
import JWT from "jsonwebtoken";
import { createHash, verifyHash } from "../utils/bcrypt.js";
import { pool } from "../db/database.js";
import { getUserDetails, loginUser, signUpUser } from "../db/commands.js";

export const postSignupController = async (req, res) => {
  const { firstname, lastname, username, password } = req.body;
  if (!firstname || !lastname || !username || !password) {
    return res.status(400).json({ message: "BAD-REQUEST" });
  }
  try {
    let hashedPassword = createHash(password);
    let [result] = await pool.query(signUpUser, [
      firstname,
      lastname,
      hashedPassword,
      username,
    ]);
    let id = result.insertId;

    if (id) {
      let payload = {
        id: id,
        username,
      };

      const accessToken = JWT.sign(payload, process.env.JWTKEY, {
        expiresIn: "30d",
      });

      return res
        .status(200)
        .json({ message: "success", token: accessToken, payload });
    } else {
      return res.status(400).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postLoginController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "BAD-REQUEST" });
  }
  try {
    const [rows] = await pool.query(loginUser, [username]);
    let passwordFromDb = rows[0].password;
    if (passwordFromDb) {
      const hashedPasswordFromDB = passwordFromDb;
      const result = await verifyHash(password, hashedPasswordFromDB);
      if (result) {
        let payload = {
          id: rows[0].id,
          username: rows[0].username,
        };
        const accessToken = JWT.sign(payload, process.env.JWTKEY, {
          expiresIn: "30d",
        });
        res.status(200).json({
          message: "success",
          token: accessToken,
          payload,
        });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const VerifyProfileController = async (req, res) => {
  const authorizationHeader = req.headers["authorization"];

  if (authorizationHeader) {
    try {
      let decode = JWT.verify(authorizationHeader, process.env.JWTKEY);
      let [rows] = await pool.query(getUserDetails, [decode.id]);
      if (rows) {
        let payload = { id: rows[0].id, username: rows[0].username };
        res.status(200).json({ payload });
      } else {
        res.status(404).json({ message: "Unauthorized" });
      }
    } catch (e) {
      res.status(404).json({ message: "Unauthorized" });
    }
  } else {
    res.status(404).json({ message: "header not found" });
  }
};
