import db from '../models';
import { Request, Response } from 'express';

class CupomController {

    static async getCupons(request: Request, response: Response) {
        try {

            const cupons = await db.Cupons.findAll();

            return response.status(200).json(cupons);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async getCupomById(request: Request, response: Response) {
        try {

            const { cupomId } = request.params;

            const cupom = await db.Cupons.findOne({ where: { id: Number(cupomId) } });
            if (!cupom) return response.status(404).json({ message: "Cupom not found" });

            return response.status(200).json(cupom);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async getCuponsByFornecedor(request: Request, response: Response) {
        try {

            const { fornecedorId } = request.params;

            const fornecedor = await db.Fornecedores.findOne({
                where: { id: Number(fornecedorId) },
                attributes: ['id', 'nome_empresa', 'telefone', 'facebook', 'instagram', 'whatsapp', 'status'],
                include: [
                    {
                        model: db.Cupons,
                        as: 'fornecedor'
                    }
                ]
            });
            if (!fornecedor) return response.status(404).json({ message: "Fornecedor not found" });

            // const cupons = await db.Cupons.findAll({ where: { id_fornecedor: Number(fornecedorId) } });

            return response.status(200).json(fornecedor);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async createCupom(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { fornecedorId } = request.params;
            const {
                codigo,
                titulo,
                valor_desconto,
                descricao,
                validade
            } = request.body;

            if (!codigo || !titulo || !valor_desconto || !descricao || !validade)
                return response.status(406).json({ message: "Missing fields. Check codigo, titulo, valor_desconto, descricao or validade" })

            const fornecedor = await db.Fornecedores.findOne({ where: { id: Number(fornecedorId) } });
            if (!fornecedor) return response.status(404).json({ message: "Fornecedor not found" });

            const novoCupom = await db.Cupons.create({
                id_fornecedor: Number(fornecedorId),
                codigo,
                titulo,
                valor_desconto,
                descricao,
                validade,
                status: 1
            })

            return response.status(201).json(novoCupom);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updateCupom(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { cupomId } = request.params;
            const {
                codigo,
                titulo,
                valor_desconto,
                descricao,
                validade
            } = request.body;

            if (!codigo || !titulo || !valor_desconto || !descricao || !validade)
                return response.status(406).json({ message: "Missing fields. Check codigo, titulo, valor_desconto, descricao or validade" })

            const cupom = await db.Cupons.findOne({ where: { id: Number(cupomId) } });
            if (!cupom) return response.status(404).json({ message: "Cupom not found" });

            const updatedCupom = await cupom.update({
                codigo,
                titulo,
                valor_desconto,
                descricao,
                validade
            })

            return response.status(200).json(updatedCupom);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async changeStatus(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { cupomId } = request.params;
            const { status } = request.body;

            const cupom = await db.Cupons.findOne({ where: { id: Number(cupomId) } });
            if (!cupom) return response.status(404).json({ message: "Cupom not found" });

            const updatedCupom = await cupom.update({ status });

            return response.status(200).json(updatedCupom);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

}

export default CupomController;