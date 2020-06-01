const express = require('express')
const router = express.Router()

// Obtenemos el modelo que está vinculado a la colección
const Articulos = require('../models/articulos')
const Ventas = require('../models/ventas')


router.get('/', async (req, res) => {
	res.render('inicio');
});

router.get('/articulos', async (req, res) => {
	const articulos = await Articulos.find()
	res.render('f_articulos', {
		articulos
	})
})

router.post('/articulos', async (req, res) => {
   const articulo = new Articulos(req.body)
	 await articulo.save( (err, art) => {
		 if (err) {  // tanto errores validadción mongoose como index mongodb
			 res.render('errorPage', { // render a una vista, sin barra
				 err
			 })
		 }else{
			 res.redirect('/articulos') // redirect a una ruta url con barra
		 }
 	})
})

router.get('/borrar_articulo/:id', async (req, res) => { //símbolo : separa el parámetro
	const { id } = req.params
	/*vemos si hay ventasSchema
	//si hay ventas no borramos

	articulos=await Ventas.aggregate([
		{
			$unwind:"$articulos"
	},{
		$match:
	}
]).pretty();

	articulos=await Articulos.aggregate([
		{

	}]);
console.log(articulos);

	if(true){
console.log("no borramos nada");

	}else{
			//await Articulos.deleteOne({_id: id})  //el mismo método de mongodb
	}
*/
 	res.redirect('/articulos')
})

router.get('/editar_articulo/:id', async (req, res) => { //símbolo : separa el parámetro
	const { id } = req.params
	const  articulo  = await Articulos.findOne({_id: id})  //el mismo método de mongodb
	res.render('f_edit_articulos', {  // Si lo hago con find devuelve array aunque sea de un elemento
		articulo
	})
})

router.post('/actualiza_articulo/:id', async (req, res) => { //símbolo : separa el parámetro
	const { id } = req.params
	const opciones = { runValidators: true }; //para que activar validaciones en update
	await Articulos.updateOne( {_id: id}, req.body, opciones, (err, art) => {
				if (err) {  // tanto errores validadción mongoose como index mongodb
					res.render('errorPage', { // render a una vista, sin barra
						err
					})
				}else{
					res.redirect('/articulos') // redirect a una ruta url con barra
				}  //el mismo método de mongodb
		})
})

module.exports = router
