/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    //   console.log(req.files);
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );
    //   console.log("filePath", filePath);
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    //   console.log("uploadresult: ",uploadResult);

    const bookFileName = files.file[0].filename;
    const bookfilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookfilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfd",
        format: "pdf",
      }
    );
    // console.log("bookFileUploadResult: ", bookFileUploadResult);

    const newBook = await bookModel.create({
      title,
      genre,
      author: "672ecf0433dd20520cbc5d55",
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    //delete temperory files in public
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookfilePath);

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    return next(createHttpError(500, "error while uploading the files."));
  }
};

export { createBook };
