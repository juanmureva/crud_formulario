const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// Obtenemos el modelo que está vinculado a la colección
const Ventas = require('../models/ventas')
const Articulos = require('../models/articulos')

router.get('/nueva', async (req, res) => {
	const ventaNueva = new Ventas()
	await ventaNueva.save()
	const venta = await consultaVenta(ventaNueva._id)

	//sacamos solo los articulos de los que haya algo que vender
	const articulos = await Articulos.find({"cantidad": {$gt:0}})

	console.log("articulos: "+JSON.stringify(articulos));
 	res.render('f_ventas', {
	 venta, articulos
 	}) // redirect a una ruta url con barra
})

router.get('/hello', async (req, res) => {
	res.send("hello")
})

router.get('/borrar_venta/:id', async (req, res) => {
	const  id  = req.params.id
	await Ventas.deleteOne({_id: id})
	const ventas = await Ventas.find()
	res.render('ventas', {
		ventas
	})
})



router.get('/detalle_venta/:id', async (req, res) => {
	const { id } = req.params
	console.log("\n\n\n--------------------------------------------------\n\n\n")
	console.log("id: "+id)
	console.log("\n\n\n--------------------------------------------------\n\n\n")
	const venta = await Ventas.aggregate([
		{
			$match: {
				_id: mongoose.Types.ObjectId(id)
			}
		},
	  {
	    $unwind: "$articulos"  // Para formar un documento por artículo
															// Si no hay artículos no hay documentos
	  },
	  {
	    $lookup: {
	      from: "articulos",
	      localField: "articulos.codigo",
	      foreignField: "_id",
	      as: "artVenta"
	    }
	  },
	  {
	      $unwind: "$artVenta" // Para deshacer el array que ha montado
	  },
	  {
	    $project: {
	      _id: 0,
	      refTicket: "$_id",
	      fecha: 1,
	      codigo: "$articulos.codigo",
	      nombre: "$artVenta.nombre",
	      precioUnidad: "$artVenta.precio",
	      cantidad: "$articulos.cantidad",
	      total: {$multiply: ["$artVenta.precio", "$articulos.cantidad"]}
	  	}
		}
	])
	console.log("venta: "+JSON.stringify(venta))
	if(venta ===undefined || venta.length==0){
		err="venta no efectuada"
		res.render('errorPage', { // render a una vista, sin barra
			err
		})
	}
	res.render('detalle_venta', {
		venta
	})
})



router.get('/continuaVentas/:id', async (req, res) => {
	const  { id }  = req.params
	const venta = await consultaVenta(id)
	const articulos = await Articulos.find()
	res.render('f_ventas', {
		venta, articulos
	})
})



router.get('/eliminarArticulo/:id/:idArt', async (req, res) => {
	const  id  = req.params.id
	const  idArt  = req.params.idArt
	const pull = {
		$pull: {
			articulos : {_id: idArt}
		}
	}
	await Ventas.updateOne({_id: id}, pull)
	const venta = await consultaVenta(id)
	const articulos = await Articulos.find()
	res.render('f_ventas', {
		venta, articulos
	})
})

router.post('/ventasArticulos', async (req, res) => {
	const venta = req.body
	const query = {
		_id: venta._id // en mongoose no admite ObjectId
	}
	let articulo = { // en mongoose crea un objeto con id
		codigo: venta.articulo,
		cantidad: venta.cantidad
	}
	const update = {
		    $push: {
		      articulos: { // en mongoose crea un objeto con id
		        codigo: venta.articulo,
		        cantidad: venta.cantidad
		      }
		    }
	}

	Ventas.findOne(query, async (err, art) => {

		if (err) {  // tanto errores validación mongoose como index mongodb

		}
		else{
			art.articulos.push(articulo)
				try {
					ventadb = await art.save();
					res.redirect('/ventas/continuaVentas/'+art._id)
					console.log(ventadb);
				}
				catch(err) {
					res.render('errorPage', { // render a una vista, sin barra
						err
					})
				}
		}
	})
})

router.get('/finalVenta/:id', async (req, res) => {
	const { id } = req.params
	console.log("\n\n\n--------------------------------------------------\n\n\n")
	console.log("id: "+id)
	console.log("\n\n\n--------------------------------------------------\n\n\n")
	const venta = await Ventas.aggregate([
		{
			$match: {
				_id: mongoose.Types.ObjectId(id)
			}
		},
	  {
	    $unwind: "$articulos"  // Para formar un documento por artículo
															// Si no hay artículos no hay documentos
	  },
	  {
	    $lookup: {
	      from: "articulos",
	      localField: "articulos.codigo",
	      foreignField: "_id",
	      as: "artVenta"
	    }
	  },
	  {
	      $unwind: "$artVenta" // Para deshacer el array que ha montado
	  },
	  {
	    $project: {
	      _id: 0,
	      refTicket: "$_id",
	      fecha: 1,
	      codigo: "$articulos.codigo",
	      nombre: "$artVenta.nombre",
	      precioUnidad: "$artVenta.precio",
	      cantidad: "$articulos.cantidad",
	      total: {$multiply: ["$artVenta.precio", "$articulos.cantidad"]}
	  	}
		}
	])
	console.log("venta: "+JSON.stringify(venta))
	if(venta ===undefined || venta.length==0){
		err="venta no efectuada"
		res.render('errorPage', { // render a una vista, sin barra
			err
		})
	}
	res.render('ticket', {
		venta
	})
})

router.get('/anularVenta/:id', async (req, res) => {
	const { id } = req.params
	const  venta  = await Ventas.deleteOne({_id: id})
	res.render('inicio');
})


let consultaVenta = async (id) => {
	console.log('Estoy en consulta: '+id)
		const venta = await Ventas.aggregate([
			{
				$match: {
				_id: mongoose.Types.ObjectId(id)
				}
			},
			{
				$project: {
					_id: 0,
					refTicket: "$_id",
					fecha: 1,
					articulos: 1
				}
			}
		])
		return venta[0]
}

module.exports = router
