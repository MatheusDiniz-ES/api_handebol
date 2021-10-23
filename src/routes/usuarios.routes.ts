import { Router } from 'express';
const usuariosRoutes = Router();

import upload from '../config/uploadConfig';
import multer from 'multer';
const uploadImage = multer(upload('./assets/images/usuarios'));

import UsuarioController from '../controllers/UsuarioController';
import auth from '../middleware/auth';

usuariosRoutes.post('/', UsuarioController.createUsuario);
usuariosRoutes.post('/auth', UsuarioController.auth);

usuariosRoutes.use(auth);

usuariosRoutes.get('/', UsuarioController.getUsuarios);
usuariosRoutes.get('/analise', UsuarioController.getUsersByAnaliseStatus);
usuariosRoutes.get('/:usuarioId', UsuarioController.getUsuarioById);
usuariosRoutes.post('/adminCreate', UsuarioController.createUsuarioWithAdmin);
usuariosRoutes.put('/:usuarioId', UsuarioController.updateUser);
usuariosRoutes.patch('/:usuarioId', uploadImage.single('imagem'), UsuarioController.updateProfileImage);
usuariosRoutes.patch('/:usuarioId/changeStatus', UsuarioController.changeStatus);
usuariosRoutes.delete('/:usuarioId', UsuarioController.deleteUsuario);

export default usuariosRoutes;