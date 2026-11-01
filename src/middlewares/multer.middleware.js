import multer from "multer";


// file(just image for that time, i tahe this file)

const storage = multer.diskStorage({
    // to upload file on destination
    destination: function(req, file, cb){

        cb(null, "./public/temp")
    },


    // to configure the fie name
    filename: function(req, file, cb){

        cb(null, file.originalname)
    }
})

export const upload = multer({storage:storage})