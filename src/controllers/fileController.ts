import type { Request, Response } from "express";
import FileModel from "../models/fileModel.ts";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

export const saveFile = async (req: Request, res: Response) => {
    try {
        if(req.file?.buffer) { // used when there is a buffer storage is used.
            const fileBuffer = req.file.buffer;

            const filePath = path.join(__dirname, 'uploads', Date.now() + path.extname(req.file.originalname));
            fs.writeFile(filePath, fileBuffer, (err) => {
                if (err) {
                    return res.status(500).send('Error saving file to disk');
                }

            });
            return res.status(200).send(`File uploaded and saved to disk at: ${filePath}`);
        }

        const file = new FileModel({
            file: req.file?.path
        })

        if (!file || file === undefined || file === null || !file.file) {
            return res.status(404).send('File not found.');
        }

        const fileContent = await file.save();

        res.status(201).json({ message: "File Uploaded Successfully.", file: fileContent })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getFile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const file = await FileModel.findById({ _id: id });

        if (!file || file === undefined || file === null || !file.file) {
            return res.status(404).send('File not found.');
        }

        
        res.sendFile(path.join(__dirname, file.file));

        // const pathToFile = path.join(__dirname, file.file);
        // const fileContent = fs.createReadStream(pathToFile);
        // fileContent.pipe(res); 
        
        /* this is streaming file data wihch has more speed and take less memory because it divides the file buffer in small parts and then render it so that take less memory
        There are lots of request are coming in one unit of time for getting file back so getting using sendFile is not efficient */

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const deleteFile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const file = await FileModel.findById(id);

        if(!file) {
            return res.status(404).send('File not found');
        }

        await FileModel.findByIdAndDelete(id);

        const filePath = path.join(__dirname, file.file);

        fs.unlink(filePath, (error) => {
            if (error) {
                console.error('Error deleting the file from file system:', error);
                return res.status(500).send('Error deleting file from file system');
            }
        });

        res.status(200).send('File deleted successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}