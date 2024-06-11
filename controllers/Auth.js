import 'dotenv/config';
import JWT from 'jsonwebtoken'

// my imports
import { User } from "../models/UserModel.js";
import { createHash, verifyHash } from '../utils/bcrypt.js';
import { Admin } from '../models/AdminModel.js';



// signup controller
export const postSignupController = async (req, res) => {
    const { name, lastName, username, password } = req.body;

    if (!name || !lastName || !username || !password) {
        return res.status(400).json({ "message": "BAD-REQUEST" });
    }

    try {

        let hashedPassword = createHash(password)

        const newUser = new User({
            firstName: name,
            lastName: lastName,
            userName: username,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();

        if (savedUser) {

            let payload = {
                id: savedUser._id
            }

            const accessToken = JWT.sign(payload, process.env.JWTKEY, { expiresIn: '30d' });

            return res.status(200).json({ "message": "success", "token": accessToken });
        } else {

            return res.status(400).json({ "message": "Unauthorized" });

        }
    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" });
    }
};


// login controller
export const postLoginController = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ "message": "BAD-REQUEST" });
    }

    try {
        const findingUser = await User.findOne({ userName: username });

        if (findingUser) {

            const hashedPasswordFromDB = findingUser.password;
            const result = await verifyHash(password, hashedPasswordFromDB)

            if (result) {

                let payload = {

                    id: findingUser._id

                }

                const accessToken = JWT.sign(payload, process.env.JWTKEY, { expiresIn: '30d' });

                res.status(200).json({ "message": "success", "token": accessToken });

            } else {
                res.status(401).json({ "message": "Unauthorized" });
            }
        } else {
            res.status(404).json({ "message": "Unauthorized" });
        }
    } catch (error) {
        res.status(500).json({ "message": "Internal Server Error" });
    }
};



// Verify JWT
export const VerifyJWTController = async (req, res) => {
    const authorizationHeader = req.headers['authorization'];

    if (authorizationHeader) {

        try {
            let decode = JWT.verify(authorizationHeader, process.env.JWTKEY);


            let userInfo = await User.findOne({ _id: decode.id }, { password: 0, _id: 0, __v: 0, userName: 0, lastName: 0 });

            res.status(200).json(userInfo)
        } catch (error) {
            res.status(404).json({ "message": "Unauthorized" })

        }

    } else {
        res.status(404).json({ "message": "header not found" })
    }
};

// Profile
export const VerifyProfileController = async (req, res) => {
    const authorizationHeader = req.headers['authorization'];

    if (authorizationHeader) {

        try {
            let decode = JWT.verify(authorizationHeader, process.env.JWTKEY)

            let userInfo = await User.findOne({ _id: decode.id }, { password: 0, _id: 0, __v: 0, userName: 0 });

            if (userInfo) {
                res.status(200).json({ userInfo })
            } else {
                res.status(404).json({ "message": "Unauthorized" })
            }
        } catch (e) {
            res.status(404).json({ "message": "Unauthorized" })
        }
    } else {
        res.status(404).json({ "message": "header not found" })
    }
};

//admin routes

export const adminAuthController = async (req, res) => {



    if (!req.body.password || !req.body.username) {
        res.status(400).json({ "message": "please provide username and password" })
    }


    let username = req.body.username
    let password = req.body.password



    let verifyAdmin = await Admin.findOne({ username, password })



    if (verifyAdmin) {

        let payload = {

            id: verifyAdmin.username

        }

        const accessToken = JWT.sign(payload, process.env.JWTKEY, { expiresIn: '10d' });

        res.status(200).json({ token: accessToken })
    } else {
        res.json({ "message": "bad request" })
    }

};

export const adminPassChangeController = async (req, res) => {

    
    try {
 
        if (!req.body.oldpassword || !req.body.newpassword) {
            return res.status(400).json({ "message": "Invalid request. Both oldpassword and newpassword are required." });
        }

      
        const { oldpassword, newpassword } = req.body;

        let admin = await Admin.findOne({ username : 'dilpreet174' , password: oldpassword });

  
  
        if (!admin) {
            return res.status(404).json({ "message": "invalid password" });
        }

      
        admin.password = newpassword;

   
        await admin.save();

       
        return res.status(200).json({ "message": "Password updated successfully." });
    } catch (error) {
    
        console.error(error);
        return res.status(500).json({ "message": "Internal server error." });
    }
};