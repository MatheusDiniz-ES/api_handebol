import { Router } from 'express';
const usuariosAdminsRoutes = Router();

import upload from '../config/uploadConfig';
import multer from 'multer';
const uploadImage = multer(upload('./assets/images/admins'));

import UsuarioAdminController from '../controllers/UsuarioAdminController';
import auth from '../middleware/auth';

usuariosAdminsRoutes.post('/auth', UsuarioAdminController.auth);

usuariosAdminsRoutes.use(auth);

usuariosAdminsRoutes.get('/', UsuarioAdminController.getAdmins);
usuariosAdminsRoutes.get('/:adminId', UsuarioAdminController.getAdminById);
usuariosAdminsRoutes.post('/', UsuarioAdminController.createAdmin);
usuariosAdminsRoutes.put('/:adminId', UsuarioAdminController.updateAdmin);
usuariosAdminsRoutes.patch('/:adminId', uploadImage.single('imagem'), UsuarioAdminController.updateProfileImage);
usuariosAdminsRoutes.patch('/:adminId/changeStatus', UsuarioAdminController.changeStatus);

export default usuariosAdminsRoutes;