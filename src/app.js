const path = require('path')
const express = require ('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')  //Para pasar los campos del form

const app = express()

// conectar a la BD
const atlasURL =
'mongodb+srv://user:******@cluster0-*******mongodb.net/test?retryWrites=true&w=majority'
const localURL =
'mongodb://localhost:27017/test'
mongoose.connect(localURL,
        {useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => console.log('Conectado a la BD'))
    .catch(error => console.log(error))

//importar rutas
const indexRoutes = require('./routes/index')
const ventasRoutes = require('./routes/ventas')

//configuraciones
app.set('port',  process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())  // Para pasar los campos del formulario
app.use(bodyParser.urlencoded({ extended: true }))

//routes
app.use('/', indexRoutes)
app.use('/ventas', ventasRoutes)

// arrancando el servidor
app.listen (app.get('port'), () => {
    console.log(`Servidor en puerto ${app.get('port')}`)
})
