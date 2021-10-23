import db from '../models';
import { Request, Response } from 'express';

class EmpresaController {

    static async getEmpresas(request: Request, response: Response) {
        try {

            const empresas = await db.Empresa.findAll();

            return response.status(200).json(empresas);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async getEmpresaById(request: Request, response: Response) {
        try {

            const { empresaId } = request.params;

            const empresa = await db.Empresa.findOne({ where: { id: Number(empresaId) } });
            if (!empresa) return response.status(404).json({ message: "Empresa not found" });

            return response.status(200).json(empresa);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async createEmpresa(request: Request, response: Response) {
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

            const novaEmpresa = await db.Empresa.create({
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
            })

            return response.status(200).json(novaEmpresa);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updateEmpresa(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { empresaId } = request.params;
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
            
            const empresa = await db.Empresa.findOne({ where: { id: Number(empresaId) } });
            if (!empresa) return response.status(404).json({ message: "Empresa not found" });
            
            const updatedEmpresa = await empresa.update({
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

            return response.status(200).json(updatedEmpresa);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

}

export default EmpresaController;