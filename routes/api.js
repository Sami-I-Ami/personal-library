/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('dotenv').config();
const mongoose = require("mongoose");
const uri = process.env.DB;
const db = mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const Schema = mongoose.Schema;
const bookSchema = new Schema({
  title: {type: String, required: true},
  comments: [String]
});
const Book = mongoose.model("Book", bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, books) => {
        if (err) {
          res.send("error occured finding books");
          return console.log(err);
        }
        const bookList = books.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          }
        });
        res.json(bookList);
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        return;
      }
      const newBook = new Book({title, comments: []});
      newBook.save((err) => {
        if (err) {
          res.send("error occured saving book");
          return console.log(err);
        };
        res.json({
          _id: newBook._id,
          title: newBook.title
        });
      })
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, (err) => {
        if (err) {
          res.send("error occured deleting books");
          return console.log(err);
        }
        res.send("complete delete successful");
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(bookid, (err, book) => {
        if (err) {
          res.send("error occured finding book");
          return console.log(err);
        }
        if (!book) {
          res.send("no book exists");
          return;
        }
        const bookData = {
          _id: book._id,
          title: book.title,
          comments: book.comments
        };
        res.json(bookData);
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send("missing required field comment");
        return;
      }
      Book.findById(bookid, (err, book) => {
        if (err) {
          res.send("error occurred finding book");
          return console.log(err);
        }
        if (!book) {
          res.send("no book exists");
          return;
        }
        book.comments.push(comment);
        let successfulSave = true;
        book.save((err) => {
          if (err) {
            res.send("error saving new comment");
            successfulSave = false;
            return console.log(err);
          }
        });
        if (!successfulSave) {
          return;
        }
        const bookData = {
          _id: book._id,
          title: book.title,
          comments: book.comments
        };
        res.json(bookData);
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findByIdAndDelete(bookid, (err, book) => {
        if (err) {
          res.send("error occured finding book");
          return console.log(err);
        }
        if (!book) {
          res.send("no book exists");
          return;
        }
        res.send("delete successful");
      });
    });
  
};
