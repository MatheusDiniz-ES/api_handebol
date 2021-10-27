import { Router } from 'express';
const usuariosRoutes = Router();

import upload from '../config/uploadConfig';
import multer from 'multer';
const uploadImage = multer(upload('./assets/images/usuarios'));

import UsuarioController from '../controllers/UsuarioController';
import auth from '../middleware/auth';

usuariosRoutes.post('/', UsuarioController.createUsuario);
usuariosRoutes.post('/auth', UsuarioController.auth);
usuariosRoutes.post('/redefineSenha', UsuarioController.forgotPassword);

usuariosRoutes.use(auth);

usuariosRoutes.get('/', UsuarioController.getUsuarios);
usuariosRoutes.get('/analise', UsuarioController.getUsersByAnaliseStatus);
usuariosRoutes.get('/accepted', UsuarioController.getUsuariosAceitos);
usuariosRoutes.get('/:usuarioId', UsuarioController.getUsuarioById);
usuariosRoutes.post('/adminCreate', UsuarioController.createUsuarioWithAdmin);
usuariosRoutes.put('/:usuarioId', UsuarioController.updateUser);
usuariosRoutes.patch('/:usuarioId', uploadImage.single('imagem'), UsuarioController.updateProfileImage);
usuariosRoutes.patch('/:usuarioId/updatePassword', UsuarioController.updatePassword);
usuariosRoutes.patch('/:usuarioId/changeStatus', UsuarioController.changeStatus);
usuariosRoutes.patch('/:usuarioId/acceptUser', UsuarioController.acceptUsuario);
usuariosRoutes.delete('/:usuarioId', UsuarioController.deleteUsuario);

export default usuariosRoutes;