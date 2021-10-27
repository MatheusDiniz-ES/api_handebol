import { Router } from 'express';
const fornecedoresRoutes = Router();

import upload from '../config/uploadConfig';
import multer from 'multer';
const uploadImage = multer(upload('./assets/images/usuarios'));

import FornecedorController from '../controllers/FornecedorController';
import auth from '../middleware/auth';

fornecedoresRoutes.use(auth);

fornecedoresRoutes.get('/', FornecedorController.getFornecedores);
fornecedoresRoutes.get('/:fornecedorId', FornecedorController.getFornecedorById);
fornecedoresRoutes.post('/', uploadImage.single('imagem'), FornecedorController.createFornecedor);
fornecedoresRoutes.put('/:fornecedorId', FornecedorController.updateFornecedor);
fornecedoresRoutes.patch('/:fornecedorId/changeStatus', FornecedorController.changeStatus);

export default fornecedoresRoutes;