import multer from "multer";
import { extname } from "path"

// configure Storage

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "uploads/");
    },
    filename:(req,file,cb) =>{
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`)
    },
})



//configure multer 

const upload = multer ({
    storage,
    limits:{fileSize: 2 * 1024 * 1024},
})

export default upload;