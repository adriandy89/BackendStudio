const express           = require('express');
const router              = express.Router();
const customMdw           = require('../middleware/custom');
const SampleController    = require('../controllers/sample')
const UserController      = require('../controllers/user')
const ContratoController  = require('../controllers/contratos')
const FotoController  = require('../controllers/fotos')
const TipoContratoController  = require('../controllers/tipoContratos')
const AccesorioController  = require('../controllers/accesorios')

//Usuario
router.post('/login',UserController.login);
router.post('/register',UserController.register);
router.get('/usuarios', customMdw.ensureAuthenticated, UserController.obtenerUsuarios);
router.get('/usuarios/:id', customMdw.ensureAuthenticated, UserController.obtenerUsuario);
router.put('/usuarios/:id', customMdw.ensureAuthenticated, UserController.modificarModificar);
router.delete('/usuarios/:id', customMdw.ensureAuthenticated, UserController.eliminarUsuario);
//falta obtener todos los Usuarios

//Pruebas
router.get('/test', SampleController.unprotected);
router.get('/protected', customMdw.ensureAuthenticated, SampleController.protected);
router.get('/protected2', customMdw.ensureAuthenticated, SampleController.protected2);
//Contratos
router.get('/contratos', customMdw.ensureAuthenticated, ContratoController.obtenerContratos);
router.post('/contratos/pendientes', customMdw.ensureAuthenticated, ContratoController.obtenerContratosPendientes);
router.post('/estadisticas', customMdw.ensureAuthenticated, ContratoController.obtenerEstadisticas);
router.post('/contratos/intervalo', customMdw.ensureAuthenticated, ContratoController.obtenerContratosPendientesIntervalo);
router.post('/contratos/periodo', customMdw.ensureAuthenticated, ContratoController.obtenerContratosIntervalo);
router.post('/contratos/add', customMdw.ensureAuthenticated, ContratoController.nuevoContrato);
router.get('/contratos/:id', customMdw.ensureAuthenticated, ContratoController.obtenerContrato);
router.put('/contratos/:id', customMdw.ensureAuthenticated, ContratoController.modificarContrato);
router.delete('/contratos/:id', customMdw.ensureAuthenticated, ContratoController.eliminarContrato);
router.post('/contratos/fecha', customMdw.ensureAuthenticated, ContratoController.obtenerHoraTipoNombrePorFechaCita)
router.get('/contrato/numero', customMdw.ensureAuthenticated, ContratoController.obtenerNuevoNumeroContrato);
//Fotos
router.get('/fotos', customMdw.ensureAuthenticated, FotoController.obtenerFotos);
router.post('/fotos/add', customMdw.ensureAuthenticated, FotoController.nuevaFoto);
router.get('/fotos/:id', customMdw.ensureAuthenticated, FotoController.obtenerFoto);
router.put('/fotos/:id', customMdw.ensureAuthenticated, FotoController.modificarFoto);
router.delete('/fotos/:id', customMdw.ensureAuthenticated, FotoController.eliminarFoto);
//Tipos de Contratos
router.post('/tipocontratos/add', customMdw.ensureAuthenticated, TipoContratoController.nuevoTipoContrato);
router.get('/tipocontratos', customMdw.ensureAuthenticated, TipoContratoController.obtenerTipoContratos);
router.get('/tipocontratos/:id', customMdw.ensureAuthenticated, TipoContratoController.obtenerTipoContrato);
router.put('/tipocontratos/:id', customMdw.ensureAuthenticated, TipoContratoController.modificarTipoContrato);
router.delete('/tipocontratos/:id', customMdw.ensureAuthenticated, TipoContratoController.eliminarTipoContrato);
//Accesorios
router.post('/accesorios/add', customMdw.ensureAuthenticated, AccesorioController.nuevoAccesorio);
router.get('/accesorios', customMdw.ensureAuthenticated, AccesorioController.obtenerAccesorios);
router.get('/accesorios/:id', customMdw.ensureAuthenticated, AccesorioController.obtenerAccesorio);
router.put('/accesorios/:id', customMdw.ensureAuthenticated, AccesorioController.modificarAccesorio);
router.delete('/accesorios/:id', customMdw.ensureAuthenticated, AccesorioController.eliminarAccesorio);

module.exports = router;
