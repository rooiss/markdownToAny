const express = require('express');
const markdownpdf = require('markdown-pdf');
const Readable = require('stream').Readable;
const nodePandoc = require('node-pandoc');
// we need body parser to capture the text from the form
const bodyParser = require('body-parser');

var args, callback;
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

// set viewing engine to ejs
app.set('view engine', 'ejs');

// route for home page
app.get('/', function(req,res){
    res.render('index')
})

// route for downloading link
app.post('/download', function(req,res){
    const stream = new Readable;
    stream._read = () => {};
    // grabbing info from form
    var src = req.body.MD;
    // need to set header to know what the file type is
    res.setHeader('Content-Disposition', 'attachment');
    var formatSelect = req.body.formatSelect;
    console.log(formatSelect);
    // need to be able to choose the formatselect from the menu drop down and apply it to 
    if (formatSelect === 'DOC') {
        args = '-f markdown -t docx';
        callback = function (err, result) {
            if (err) {
                console.error('ah shit here we go again: ',err);
            }
            // console.log(result);
            res.send(result)
        }
        nodePandoc(src, args, callback);
    } else if (formatSelect === 'HTML') {
        args = '-f markdown -t html';
        callback = function (err, result) {
            if (err) {
                console.error('ah shit here we go again: ',err);
            }
            console.log(result);
            res.send(result)
        }
        nodePandoc(src, args, callback);
    } else if (formatSelect === 'PDF'){
        stream.pipe(markdownpdf())
        .pipe(res);
        stream.push(src);
        stream.push(null);
    }
})

// what port the local host is running on
app.listen(1337)
console.log('listening on port 1337...')

// res.end or res.send sends something to the browser res.send can send multiple times, res.end 