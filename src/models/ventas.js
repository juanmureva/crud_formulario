const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ventasSchema = new Schema({
	fecha: {
		type: Date,
		default: Date.now
	},
	formaPago: String,
	articulos: [{
		codigo: {
			type: Number,
			min: [1, 'Debe introducir un artículo válido']
		},
		cantidad: {
			type: Number,
			max: 9999
		}
	}]
});

// El primer argumento de model será la colección de Mongo
// recomendable en plural
module.exports = mongoose.model('ventas', ventasSchema)
