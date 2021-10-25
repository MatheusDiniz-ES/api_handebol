import db from '../models';
import { Request, Response } from 'express';
import deleteFile from '../utils/file';
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

function generateToken(params = {}) {
    return jwt.sign(params, String(secret), { expiresIn: 36000 });
}

class UsuarioAdminController {

    static async getAdmins(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const admins = await db.UsuariosAdmin.findAll();

            admins.map((adm: { senha: undefined }) => adm.senha = undefined)

            return response.status(200).json(admins);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async getAdminById(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { adminId } = request.params;

            const admin = await db.UsuariosAdmin.findOne({ where: { id: Number(adminId) } });
            if (!admin) return response.status(404).json({ message: "Admin not found" });

            admin.senha = undefined;

            return response.status(200).json(admin);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async createAdmin(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { usuario, senha, nome, email, telefone } = request.body;

            if(!usuario || !senha || !nome || !email || !telefone)
                return response.status(406).json({ message: "Missing field, verify usuario, senha, nome, email or telefone" });

            if (senha.length < 8)
                return response.status(406).json({ message: "Password must be at least 8 characters." })

            if (await db.UsuariosAdmin.findOne({ where: { usuario } }))
                return response.status(409).json({ message: "User already exists" });
            
            const hash = await bcrypt.hash(senha, 12);

            const novoAdmin = await db.UsuariosAdmin.create({
                usuario,
                senha: hash,
                nome,
                email,
                telefone,
                status: 1
            })

            novoAdmin.senha = undefined;

            return response.status(201).json(novoAdmin);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async auth(request: Request, response: Response) {
        try {

            const adminInfo = request.body;

            if (!adminInfo.email) return response.status(404).json({ message: "Missing email field" });

            const admin = await db.UsuariosAdmin.findOne({ where: { email: adminInfo.email } });
            if (!admin) return response.status(404).json({ message: 'Admin not found' });

            if (!await bcrypt.compare(adminInfo.senha, admin.senha))
                return response.status(400).json({ message: "Invalid password" });
            
            admin.senha = undefined;
            
            response.send({ admin, token: generateToken({ id: admin.id, adm: true }) });
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updateAdmin(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { adminId } = request.params;
            const { usuario, senha, nome, email, telefone } = request.body;

            const admin = await db.UsuariosAdmin.findOne({ where: { id: Number(adminId) } });
            if (!admin) return response.status(404).json({ message: "Admin not found" });

            if(!usuario || !senha || !nome || !email || !telefone)
                return response.status(406).json({ message: "Missing field, verify usuario, senha, nome, email or telefone" });

            if (senha.length < 8)
                return response.status(406).json({ message: "Password must be at least 8 characters." })

            const verificaUsuario = await db.UsuariosAdmin.findOne({ where: { usuario } })
            if (verificaUsuario && verificaUsuario.id != admin.id)
                return response.status(409).json({ message: "User already exists" });
            
            const hash = await bcrypt.hash(senha, 12);

            const updatedAdmin = await admin.update({
                usuario,
                senha: hash,
                nome,
                email,
                telefone
            })

            updatedAdmin.senha = undefined;

            return response.status(200).json(updatedAdmin);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updateProfileImage(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { adminId } = request.params;
            const file = request.file;

            if (!file) return response.status(406).json({ message: 'File error' });

            const admin = await db.UsuariosAdmin.findOne({ where: { id: Number(adminId) } });
            if (!admin) return response.status(404).json({ message: "Admin not found" });

            if (admin.imagem) deleteFile(admin.imagem);

            admin.imagem = file.path;
            admin.save();

            return response.status(200).json(admin);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async changeStatus(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { adminId } = request.params;
            
            const admin = await db.UsuariosAdmin.findOne({ where: { id: Number(adminId) } });
            if (!admin) return response.status(404).json({ message: "Admin not found" });

            const updatedAdmin = await admin.update({ status: !admin.status });

            return response.status(200).json(updatedAdmin);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

}

export default UsuarioAdminController;