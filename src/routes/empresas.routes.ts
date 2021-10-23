import { Router } from 'express';
const empresasRoutes = Router();

import EmpresaController from '../controllers/EmpresaController';
import auth from '../middleware/auth';

empresasRoutes.use(auth);

empresasRoutes.get('/', EmpresaController.getEmpresas);
empresasRoutes.get('/:empresaId', EmpresaController.getEmpresaById);
empresasRoutes.post('/', EmpresaController.createEmpresa);
empresasRoutes.put('/:empresaId', EmpresaController.updateEmpresa);

export default empresasRoutes;
