const express = require('express')
const fs = require('fs')
const app = express()

app.get('/', ( req, res ) => {
    console.log('GET /')
    
    fs.readFile('./view/main.html', ( err, data ) => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end( data )
    })
})

app.post('/', ( req, res ) => {
    console.log('POST /')
    console.dir(req.body)
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end('thanks')
})

port = 80
app.listen( port );
console.log(`Listening at http://localhost:${port}`);