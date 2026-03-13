require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const multer= require("multer");
const storage = multer.memoryStorage();
const pdfParse = require("pdf-parse");

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


app.post("/api/upload", upload.single("pdf"), async(req,res,next) => {
   try{
     if(!req.file){
        return res.status(400).json({
            message:"No File uploaded!"
        });
    }
     if(req.file?.mimetype !=="application/pdf"){
        return res.status(415).json({
            message:"Only PDF files are allowed."
        });
    }
    const pdfData = await pdfParse(req.file.buffer);
    
    res.status(200).json({
        success: true,
        message: "Upload route reached",
        fileReceived: !!req.file,
        textPreview: pdfData.text.slice(0,500),
        fileInfo:{
            originalname: req.file?.originalname,
            mimetype:req.file?.mimetype,
            size: Number(req.file?.size/(1024*1024)).toFixed(2) + " MB",
            hasBuffer: Boolean(req.file?.buffer),
           
        },
        numPages: pdfData.numpages,
        textPreview: pdfData.text.slice(0,500)
    });
    }
    catch(error){
        next(error);
    }
})

app.use((err,req,res,next) =>{
    const statusCode= err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    })
})


