const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const ABSPATH = path.format({
  dir: '<path_to_footages_directory>' //eg. C:/videostream/footages
});

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.htm'))
})


var router = express.Router();
var streamRoute = router.route('/stream');


streamRoute.post(function(req, res) {
    var paitentName = req.body.name;
    let files = fs.readdirSync(ABSPATH + "/" + paitentName);
    let sorted;
    if (files.length > 1) {
        sorted = files.sort((a, b) => {
            let s1 = fs.statSync(ABSPATH + "/" + paitentName + "/" + a);
            let s2 = fs.statSync(ABSPATH + "/" + paitentName + "/" + b);
            return s1.ctime < s2.ctime;
        });
    }

    var path = ABSPATH + "/" + paitentName + "/" + sorted[0];
    //console.log("file name - " + path);
    const stat = fs.statSync(path);
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ?
            parseInt(parts[1], 10) :
            fileSize - 1

        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, {
            start,
            end
        })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});

//now we need to apply our router here
app.use('/api', router);

//change port no accordingly
app.listen(3000, function() {
    console.log('Listening on port 3000!')
})