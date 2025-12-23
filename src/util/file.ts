import multer from "multer";

export const bufferStorage = multer.memoryStorage(); // In this bufferStorage file directly stored in RAM so there is not path to it. so we need to manually write that file in server using writeFile method of node

const fileStorage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads")
    },
    filename(req, file, callback) {
        callback(null, `${Date.now().toString()}.jpg`)
    },
});

export const upload = multer({
    dest: 'uploads/', storage: bufferStorage
})