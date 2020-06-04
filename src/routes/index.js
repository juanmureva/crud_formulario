const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')


// Obtenemos el modelo que está vinculado a la colección
const Articulos = require('../models/articulos')
const Ventas = require('../models/ventas')
const Departamentos = require('../models/departamentos')


router.get('/', async (req, res) => {
	res.render('inicio');
});

router.get('/articulos', async (req, res) => {
	const articulos = await Articulos.find()
	//console.log("articulos: "+JSON.stringify(articulos))
	res.render('f_articulos', {
		articulos
	})
})

router.get('/ventas', async (req, res) => {
	const ventas = await Ventas.find()
	res.render('ventas', {
		ventas
	})
})

router.post('/articulos', async (req, res) => {
	const articulo = new Articulos(req.body)
	await articulo.save((err, art) => {
		if (err) {  // tanto errores validadción mongoose como index mongodb
			res.render('errorPage', { // render a una vista, sin barra
				err
			})
		} else {
			res.redirect('/articulos') // redirect a una ruta url con barra
		}
	})
})



router.get('/borrar_articulo/:id', async (req, res) => { //símbolo : separa el parámetro
	const { id } = req.params
	console.log("id: "+id);
	//si hay ventas no borramos

	articulos = await Ventas.aggregate([
		{
			$unwind: "$articulos"
		},{
			$project:{
				fecha:1,
				articulos:1,
				codigo:"$articulos.codigo"
			}
		}
	]);

	ventas =  await Ventas.aggregate([
		{
			$unwind: "$articulos"
		},{
			$project:{
				fecha:1,
				articulos:1,
				codigo:"$articulos.codigo"
			}
		},{
			$match: {
				codigo: parseInt(id)
			}
		},{
			$group: {
				_id: "$codigo",
				numVentas: { $sum: 1 }
			}
		},{
			$project:{
				numVentas:1,
				_id:0				
			}
		}
	]);

	console.log("articulos1: "+JSON.stringify(articulos));
	console.log("ventas: "+JSON.stringify(ventas));
	if (ventas!=null && ventas.length>0 && ventas[0].numVentas>0) {
		console.log("no borramos nada");
		err="Existen ventas, no se puede borrar el articulo"
		res.render('errorPage', { // render a una vista, sin barra
			err
		})

	} else {
		await Articulos.deleteOne({_id: id})  //el mismo método de mongodb
	}

	res.redirect('/articulos')
})

router.get('/editar_articulo/:id', async (req, res) => { //símbolo : separa el parámetro
	const { id } = req.params
	const articulo = await Articulos.findOne({ _id: id })  //el mismo método de mongodb
	res.render('f_edit_articulos', {  // Si lo hago con find devuelve array aunque sea de un elemento
		articulo
	})
})

router.post('/actualiza_articulo/:id', async (req, res) => { //símbolo : separa el parámetro
	const { id } = req.params
	const opciones = { runValidators: true }; //para que activar validaciones en update
	await Articulos.updateOne({ _id: id }, req.body, opciones, (err, art) => {
		if (err) {  // tanto errores validadción mongoose como index mongodb
			res.render('errorPage', { // render a una vista, sin barra
				err
			})
		} else {
			res.redirect('/articulos') // redirect a una ruta url con barra
		}  //el mismo método de mongodb
	})
})

router.post('/addDepartamento', async (req, res) => {

	console.log("nombre: "+JSON.stringify(req.params.nombre))

	const departamento = new Departamentos(req.body)
	console.log("departamento: "+JSON.stringify(departamento))
	await departamento.save((err, art) => {
		if (err) {  // tanto errores validadción mongoose como index mongodb
			res.render('errorPage', { // render a una vista, sin barra
				err
			})
		} else {
			res.redirect('/departamentos') // redirect a una ruta url con barra
		}
	})
})


router.get('/departamentos', async (req, res) => {
	const departamentos = await Departamentos.find()
	console.log("departamentos: "+JSON.stringify(departamentos))
	res.render('departamentos', {
		departamentos
	})
})


router.get('/borrar_departamento/:id', async (req, res) => { //símbolo : separa el parámetro
	const { id } = req.params
	console.log("id: "+id);
	//si hay ventas no borramos

	
	await Departamentos.deleteOne({_id: id})  //el mismo método de mongodb	
	const departamentos = await Departamentos.find()

	console.log("departamentos: "+JSON.stringify(departamentos))
	res.render('departamentos', {
		departamentos
	})
})



module.exports = router
