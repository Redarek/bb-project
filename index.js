const express = require('express')
const bodyParser = require('body-parser');
const res = require('express/lib/response')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')

const PORT = process.env.PORT || 3000

const app = express()
const serv =  require('http').Server(app);

// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json()); 
app.use(express.json())
app.use("/auth", authRouter)

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/signup.html')
})
app.use('/client', express.static(__dirname + '/client'))

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://admin:admin@cluster0.kem9r.mongodb.net/bigbonch?retryWrites=true&w=majority`) //подключение БД
        serv.listen(PORT, () => console.log(`Server started on port ${PORT}`)) //запуск сервера
        const io = require('socket.io')(serv, {}) //socket io инициализация
        io.sockets.on('connection', function(socket) {
            console.log('socket connection')
        }) 
    } catch {
        console.log(e)
    }
}

start()