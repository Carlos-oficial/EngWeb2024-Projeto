var http = require('http')
var meta = require('./aux')
var url = require('url')

var myServer = http.createServer(function (req, res) {
    console.log(req.method + " " + req.url + " " + meta.myDateTime())
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})

    var q = url.parse(req.url, true)
    res.write('True: <pre>' + JSON.stringify(q) + '</pre>')

    var q2 = url.parse(req.url, false)
    res.write('False: <pre>' + JSON.stringify(q2) + '</pre>')

    res.end()
})

myServer.listen(7777)
console.log("Servidor à escuta na porta 7777...")