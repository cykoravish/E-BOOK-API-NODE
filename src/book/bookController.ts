/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
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
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

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
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "you can't update others book"));
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    let completeCoverImage = "";
    if (files.coverImage) {
      const fileName = files.coverImage[0].filename;

      const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
      );
      completeCoverImage = fileName;
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImage,
        folder: "book-covers",
        format: coverImageMimeType,
      });
      completeCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }
    let completeFileName = "";
    if (files.file) {
      const bookfilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        files.file[0].filename
      );
      const bookFileName = files.file[0].filename;
      completeFileName = bookFileName;
      const uploadResultPdf = await cloudinary.uploader.upload(bookfilePath, {
        resource_type: "raw",
        filename_override: completeFileName,
        folder: "book-pdfs",
        format: "pdf",
      });
      completeFileName = uploadResultPdf.secure_url;
      await fs.promises.unlink(bookfilePath);
    }
    const updatedBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        title: title,
        genre: genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeFileName ? completeFileName : book.file,
      },
      { new: true }
    );
    res.status(201).json(updatedBook);
  } catch (error) {
    return next(createHttpError(500, "error while uploading the files."));
  }
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ..todo -> add pagination
    const book = await bookModel.find();
    res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting books"));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.findById(bookId);
    if (!book) {
      return next(createHttpError(404, "Book Not Found"));
    }
    res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting book"));
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "No such book exists"));
    }

    //check access
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "you can't delete others book"));
    }

    // book-covers/ck9itp4t9tgyzn44mgm7
    //https://res.cloudinary.com/dwuohu2i5/image/upload/v1731150367/book-covers/zg98hod9per2nlcs2atx.png
    const coverFileSplits = book.coverImage.split("/");
    const coverImagePublicId =
      coverFileSplits.at(-2) + "/" + coverFileSplits.at(-1)?.split(".").at(-2);

    const bookFileSplits = book.file.split("/");
    const bookFilePublicId =
      bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);

    await cloudinary.uploader.destroy(coverImagePublicId);
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: "raw",
    });
    await bookModel.findByIdAndDelete(bookId);

    res.status(204).json({ message: "book deleted" });
  } catch (error) {
    return next(createHttpError(500, "Error while deleting book"));
  }
};

export { createBook, updateBook, listBooks, getSingleBook, deleteBook };
