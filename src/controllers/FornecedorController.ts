import db from '../models';
import { Request, Response } from 'express';

class FornecedorController {

    static async getFornecedores(request: Request, response: Response) {
        try {

            const fornecedores = await db.Fornecedores.findAll();

            return response.status(200).json(fornecedores);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async getFornecedorById(request: Request, response: Response) {
        try {

            const { fornecedorId } = request.params;

            const fornecedor = await db.Fornecedores.findOne({ where: { id: Number(fornecedorId) } });
            if (!fornecedor) return response.status(404).json({ message: "Fornecedor not found" });

            return response.status(200).json(fornecedor);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async createFornecedor(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const {
                nome_empresa,
                cnpj,
                rua,
                bairro,
                numero,
                cep,
                complemento,
                cidade,
                estado,
                telefone,
                facebook,
                instagram,
                whatsapp
            } = request.body;

            if (!nome_empresa || !cnpj || !rua || !bairro || !numero || !cep  || !cidade || !estado || !telefone)
                return response.status(406).json({ message: "Missing fields. Check nome_empresa, cnpj, rua, bairro, numero, cep, cidade, estado or telefone" })
            
            const novoFornecedor = await db.Fornecedores.create({
                nome_empresa,
                cnpj,
                rua,
                bairro,
                numero,
                cep,
                complemento,
                cidade,
                estado,
                telefone,
                facebook,
                instagram,
                whatsapp,
                status: 1
            })

            return response.status(201).json(novoFornecedor);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updateFornecedor(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { fornecedorId } = request.params;
            const {
                nome_empresa,
                rua,
                bairro,
                numero,
                cep,
                complemento,
                cidade,
                estado,
                telefone,
                facebook,
                instagram,
                whatsapp
            } = request.body;

            if (!nome_empresa || !rua || !bairro || !numero || !cep  || !cidade || !estado || !telefone)
                return response.status(406).json({ message: "Missing fields. Check nome_empresa, cnpj, rua, bairro, numero, cep, cidade, estado or telefone" })
            
            const fornecedor = await db.Fornecedores.findOne({ where: { id: Number(fornecedorId) } });
            if (!fornecedor) return response.status(404).json({ message: "Fornecedor not found" });

            const updatedFornecedor = await fornecedor.update({
                nome_empresa,
                rua,
                bairro,
                numero,
                cep,
                complemento,
                cidade,
                estado,
                telefone,
                facebook,
                instagram,
                whatsapp
            })

            return response.status(200).json(updatedFornecedor);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async changeStatus(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { fornecedorId } = request.params;
            
            const fornecedor = await db.Fornecedores.findOne({ where: { id: Number(fornecedorId) } });
            if (!fornecedor) return response.status(404).json({ message: "Fornecedor not found" });

            const updatedFornecedor = await fornecedor.update({ status: !fornecedor.status });

            return response.status(200).json(updatedFornecedor);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

}

export default FornecedorController;