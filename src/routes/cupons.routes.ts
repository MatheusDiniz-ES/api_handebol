import { Router } from "express";
const cuponsRoutes = Router();

import CupomController from "../controllers/CupomController";
import auth from "../middleware/auth";

cuponsRoutes.use(auth);

cuponsRoutes.get('/', CupomController.getCupons);
cuponsRoutes.get('/:cupomId', CupomController.getCupomById);
cuponsRoutes.get('/fornecedor/:fornecedorId', CupomController.getCuponsByFornecedor);
cuponsRoutes.post('/fornecedor/:fornecedorId', CupomController.createCupom);
cuponsRoutes.put('/:cupomId', CupomController.updateCupom);
cuponsRoutes.patch('/:cupomId/changeStatus', CupomController.changeStatus);

export default cuponsRoutes;