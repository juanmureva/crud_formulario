const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articulosSchema = new Schema({
	_id: {
		type: Number,
		required: true,
		min: [1, 'Debe introducir un artículo válido']
	},
	departamento: {
		type: Number,
		min: 1,
		max: 8
	},
	nombre: String,
	precio: {
		type: Number,
		min: [1, 'No permitido menor de 1€'],
		max: 99999
	},
	cantidad: Number
});

// El primer argumento de model será la colección de Mongo
// recomendable en plural
module.exports = mongoose.model('articulos', articulosSchema)
