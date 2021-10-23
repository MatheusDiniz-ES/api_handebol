import { Router } from 'express';
const fornecedoresRoutes = Router();

import FornecedorController from '../controllers/FornecedorController';
import auth from '../middleware/auth';

fornecedoresRoutes.use(auth);

fornecedoresRoutes.get('/', FornecedorController.getFornecedores);
fornecedoresRoutes.get('/:fornecedorId', FornecedorController.getFornecedorById);
fornecedoresRoutes.post('/', FornecedorController.createFornecedor);
fornecedoresRoutes.put('/:fornecedorId', FornecedorController.updateFornecedor);
fornecedoresRoutes.patch('/:fornecedorId/changeStatus', FornecedorController.changeStatus);

export default fornecedoresRoutes;