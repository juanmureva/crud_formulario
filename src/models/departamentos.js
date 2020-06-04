const mongoose = require('mongoose')
const Schema = mongoose.Schema

const departamentosSchema = new Schema({	
	codigo: {
		type: Number,
		required: true,
		min: [1, 'Debe introducir un artículo válido']
	},
	nombre: {
		type:String,
		required: true,
	}
});


// El primer argumento de model será la colección de Mongo
// recomendable en plural
module.exports = mongoose.model('departamentos', departamentosSchema)