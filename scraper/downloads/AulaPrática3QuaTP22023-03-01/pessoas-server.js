var http = require('http')
var axios = require('axios')
var mypages = require('./mypages')
var fs = require('fs')

http.createServer(function (req, res) {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if(req.url == '/pessoas'){
        axios.get('http://localhost:3000/pessoas?_sort=nome&_order=asc')
            .then(function(resp){
                var pessoas = resp.data
                console.log("Recuperei " + pessoas.length + " registos")
        
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(mypages.genMainPage(pessoas, d))
            })
            .catch(erro => {
                console.log("Erro: " + erro)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end("<p>ERRO: " + erro + "</p>")
            })
    }
    else if(req.url.match(/p\d+/)){
        axios.get('http://localhost:3000/pessoas/' + req.url.substring(9))
            .then(function(resp){
                var pessoa = resp.data
                
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(mypages.genPessoaPage(pessoa, d))
            })
            .catch(erro => {
                console.log("Erro: " + erro)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end("<p>ERRO: " + erro + "</p>")
            })
    }
    else if(req.url == '/ordDesc'){
        axios.get('http://localhost:3000/pessoas')
            .then(function(resp){
                var pessoas = resp.data
                let pessoasOrdenadas = pessoas.sort(
                    (p1, p2) => (p1.nome < p2.nome) ? 1 : -1
                )
        
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(mypages.genMainPage(pessoasOrdenadas, d))
            })
            .catch(erro => {
                console.log("Erro: " + erro)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end("<p>ERRO: " + erro + "</p>")
            })
    }
    else if(req.url == '/w3.css'){
        fs.readFile('w3.css', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/css'})
            if(err){
                res.write("Erro na leitura do ficheiro: " + err)
            }
            else{
                res.write(data)
            }
            res.end()
        })
    }
    else{
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
        res.end("<p>ERRO: Operação não suportada...</p>")
    }
    
    
}).listen(7777)

console.log('Servidor à escuta na porta 7777...')

