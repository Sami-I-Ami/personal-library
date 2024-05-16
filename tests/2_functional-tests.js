/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
 /*
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  */
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    let testing_id = "";

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: "Wuthering Heights"})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isObject(res.body, 'response should be an object');
            assert.equal(res.body.title, 'Wuthering Heights', 'Book should have proper title');
            assert.property(res.body, '_id', 'Book should have _id');
            testing_id = res.body._id;
            done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: ""})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'missing required field title');
            done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
        });
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/1645468481c1eb2676bbf199')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, "text/html");
            assert.equal(res.text, "no book exists");
            done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${testing_id}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.isObject(res.body, 'response should be an object');
            assert.equal(res.body._id, testing_id, 'Book should contain correct _id');
            assert.equal(res.body.title, 'Wuthering Heights', 'Book should contain correct title');
            assert.property(res.body, 'comments', 'Book should contain comments');
            done();
        });
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${testing_id}`)
          .send({comment: "I like this book!"})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isObject(res.body, 'response should be an object');
            assert.equal(res.body.title, 'Wuthering Heights', 'Book should have proper title');
            assert.equal(res.body._id, testing_id, 'Book should have proper _id');
            assert.includeMembers(res.body.comments, ["I like this book!"], "Book should have comment");
            done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post(`/api/books/${testing_id}`)
          .send({comment: ""})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, "missing required field comment");
            done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/1645468481c1eb2676bbf199')
          .send({comment: "This is a book"})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, "no book exists");
            done();
        });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${testing_id}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, "delete successful");
            done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/1645468481c1eb2676bbf199')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, "no book exists");
            done();
        });
      });

    });

  });

});
