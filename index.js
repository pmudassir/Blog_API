import express from "express";
import postRoutes from "./routes/posts.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express()

app.use(express.json())
app.use(cookieParser())

//handling image uploads using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload')    //all the files will be save in this dir
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
      },
})

const upload = multer({ storage: storage })

app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file
    console.log(file);
    res.status(200).json(file && file.filename)
})

app.use("/api/posts", postRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.listen(8800, () => {
    console.log("Connected to DB!");
})