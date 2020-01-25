const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

// multer storage
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// init upload
const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("myImage");

// check file type
const checkFileType = (file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: images only");
  }
};

const app = express();

const port = process.env.PORT | 8080;

// ejs
app.set("view engine", "ejs");

// public
app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("index", { msg: err });
    } else {
      if (req.file === undefined) {
        res.render("index", { msg: "Error: No file selected" });
      } else {
        res.render("index", {
          msg: "File uploaded!",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
