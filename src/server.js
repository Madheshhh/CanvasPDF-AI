require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const multer= require("multer");
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {fileSize: 10 * 1024 * 1024}
});

app.use(cors());
app.use(express.json());

app.get("/api/health",(req,res) => {
    res.status(200).json({
        ok: true,
        message: "API is running",
        timestamp: new Date().toISOString()
    });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});


app.post("/api/upload", upload.single("pdf"), (req,res) => {
    res.status(200).json({
        message: "Upload route reached",
        fileRecieved: !!req.file
    });
})