import db from '../models';
import { Request, Response } from 'express';
import deleteFile from '../utils/file';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { secret } from '../config/auth.json';

function generateToken(params = {}) {
    return jwt.sign(params, secret, { expiresIn: 36000 });
}

class UsuarioController {

    static async getUsuarios(request: Request, response: Response) {
        try {

            const usuarios = await db.Usuarios.findAll();

            usuarios.map((user: { senha: undefined }) => user.senha = undefined)

            return response.status(200).json(usuarios);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async getUsuarioById(request: Request, response: Response) {
        try {

            const { usuarioId } = request.params;

            const usuario = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!usuario) return response.status(404).json({ message: "Usuario not found" });

            usuario.senha = undefined;

            return response.status(200).json(usuario);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async getUsersByAnaliseStatus(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const usuarios = await db.Usuarios.findAll({ where: { status: 2 } });

            usuarios.map((user: { senha: undefined }) => user.senha = undefined)

            return response.status(200).json(usuarios);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async createUsuario(request: Request, response: Response) {
        try {

            const { usuario, senha, nome, data_nascimento, telefone, email, cpf } = request.body;

            if(!usuario || !senha || !nome || !data_nascimento || !telefone || !email)
                return response.status(406).json({ message: "Missing field, verify usuario, senha, nome, data_nascimento, telefone or email" });

            if (senha.length < 8)
                return response.status(406).json({ message: "Password must be at least 8 characters." })
            
            if (await db.Usuarios.findOne({ where: { usuario } }))
                return response.status(409).json({ message: "User already exists" });
            
            const hash = await bcrypt.hash(senha, 12);
            
            const novoUsuario = await db.Usuarios.create({
                usuario,
                senha: hash,
                nome,
                data_nascimento,
                telefone,
                email,
                cpf,
                status: 2
            })

            novoUsuario.senha = undefined;

            return response.status(201).json(novoUsuario);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async createUsuarioWithAdmin(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { usuario, senha, nome, data_nascimento, telefone, email, cpf } = request.body;

            if(!usuario || !senha || !nome || !data_nascimento || !telefone || !email)
                return response.status(406).json({ message: "Missing field, verify usuario, senha, nome, data_nascimento, telefone or email" });

            if (senha.length < 8)
                return response.status(406).json({ message: "Password must be at least 8 characters." })
            
            if (await db.Usuarios.findOne({ where: { usuario } }))
                return response.status(409).json({ message: "User already exists" });
            
            const hash = await bcrypt.hash(senha, 12);
            
            const novoUsuario = await db.Usuarios.create({
                usuario,
                senha: hash,
                nome,
                data_nascimento,
                telefone,
                email,
                cpf,
                status: 1
            })

            novoUsuario.senha = undefined;

            return response.status(201).json(novoUsuario);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async auth(request: Request, response: Response) {
        try {

            const usuarioInfo = request.body;

            if (!usuarioInfo.usuario) return response.status(404).json({ message: "Missing usuario field" });

            const usuario = await db.Usuarios.findOne({ where: { usuario: usuarioInfo.usuario } })
            if (!usuario) return response.status(404).json({ message: 'User not found' });

            if (!await bcrypt.compare(usuarioInfo.senha, usuario.senha))
                return response.status(400).json({ message: "Invalid password" });
            
            usuario.senha = undefined;

            response.send({ usuario, token: generateToken({ id: usuario.id, adm: false }) });
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updateUser(request: Request, response: Response) {
        try {

            const { usuarioId } = request.params;
            const { usuario, senha, nome, telefone, email } = request.body;

            if(!usuario || !senha || !nome || !telefone || !email)
                return response.status(406).json({ message: "Missing field, verify usuario, senha, nome, data_nascimento, telefone or email" });

            if (senha.length < 8)
                return response.status(406).json({ message: "Password must be at least 8 characters." })
            
            const user = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!usuario) return response.status(404).json({ message: "Usuario not found" });

            const verificaUsuario = await db.Usuarios.findOne({ where: { usuario } })
            if (verificaUsuario && verificaUsuario.id != user.id)
                return response.status(409).json({ message: "User already exists" });
            
            const hash = await bcrypt.hash(senha, 12);

            const updatedUsuario = await user.update({
                usuario,
                senha: hash,
                nome,
                telefone,
                email
            })

            updatedUsuario.senha = undefined;

            return response.status(200).json(updatedUsuario);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updateProfileImage(request: Request, response: Response) {
        try {

            const { usuarioId } = request.params;
            const file = request.file;

            if (!file) return response.status(406).json({ message: 'File error' });

            const usuario = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!usuario) return response.status(404).json({ message: "Usuario not found" });

            if (usuario.imagem_perfil) deleteFile(usuario.imagem_perfil);

            usuario.imagem_perfil = file.path;
            usuario.save();

            return response.status(200).json(usuario);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async changeStatus(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { usuarioId } = request.params;
            const { status } = request.body;
            
            const usuario = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!usuario) return response.status(404).json({ message: "Usuario not found" });

            const updatedUsuario = await usuario.update({ status });

            return response.status(200).json(updatedUsuario);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async deleteUsuario(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { usuarioId } = request.params;

            const usuario = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!usuario) return response.status(404).json({ message: "Usuario not found" });

            usuario.senha = undefined;

            usuario.destroy();

            return response.status(204).json();
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

}

export default UsuarioController;