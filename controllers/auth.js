import { db } from "../db.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const register = (req, res) => {

    //CHECK EXISTING USER
    const q = "SELECT * FROM users WHERE email = ? OR username = ?" //query

    db.query(q, [req.body.email, req.body.username], (err, data) => {    //while user is registering passing to db with query,and checks if the email or username already exists it returns err and data
        if (err) return res.status(500).json(err)
        if (data.length) return res.status(409).json("User already exists!")    //data.length = true means data matches i.e user exists

        //Hash password and create a new user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)"
        const values = [
            req.body.username,
            req.body.email,
            hash,
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json("User has been created!")
        })
    })
}

export const login = (req, res) => {
    //CHECK USER 
    const q = "SELECT * FROM users WHERE username = ?"

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.length === 0) return res.status(404).json("User not found!")    //0 means no user matching the username

        //If user found check password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);  //compares the user entered password with the data which is returned as an array and the 0th element includes the password

        if (!isPasswordCorrect) return res.status(400).json("Username or Password is incorrect")

        const token = jwt.sign({ id: data[0].id }, "jwtkey")    //creating jwt and passing over userId which is common in every tables and a secret key along with it
        const { password, ...other } = data[0]    //passing datas except password to be saved in cookie

        res.cookie("access_token", token, {     //creating a cookie name and its value and to be send only while http req is made
            httpOnly: true
        }).status(200).json(other)
    })
}

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out.")
}