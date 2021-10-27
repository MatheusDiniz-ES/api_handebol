import db from '../models';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import deleteFile from '../utils/file';
import fs from 'fs';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET;

function generateToken(params = {}, expiresIn: number) {
    return jwt.sign(params, String(secret), { expiresIn });
}

class UsuarioController {

    static async getUsuarios(request: Request, response: Response) {
        try {

            const usuarios = await db.Usuarios.findAll();

            usuarios.map((user: { senha: undefined }) => user.senha = undefined)
            usuarios.map((user: { imagem_perfil: undefined }) => user.imagem_perfil = undefined)

            return response.status(200).json(usuarios);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async getUsuarioById(request: Request, response: Response) {
        try {

            const { usuarioId } = request.params;

            const usuario = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!usuario) return response.status(404).json({ message: "Usuario not found" });

            const img = Buffer.from(usuario.imagem_perfil).toString("ascii")

            usuario.senha = undefined;
            usuario.imagem_perfil = img;

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

    static async getUsuariosAceitos(request: Request, response: Response) {
        try {

            const usuarios = await db.Usuarios.findAll({
                where: {
                    [Op.or]: [
                        { status: 0 },
                        { status: 1 }
                    ]
                } 
            });

            usuarios.map((user: { senha: undefined }) => user.senha = undefined)

            return response.status(200).json(usuarios);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async createUsuario(request: Request, response: Response) {
        try {

            const { nome, data_nascimento, telefone, email, cpf, genero, tipo } = request.body;

            if(!nome || !data_nascimento || !telefone || !email || !tipo)
                return response.status(406).json({ message: "Missing field, verify nome, data_nascimento, telefone or email" });

            if (await db.Usuarios.findOne({ where: { email } }))
                return response.status(409).json({ message: "Email already registered" });
            
            const novoUsuario = await db.Usuarios.create({
                usuario: null,
                senha: null,
                nome,
                data_nascimento,
                telefone,
                email,
                cpf,
                genero,
                tipo,
                status: 2
            })

            novoUsuario.usuario = undefined;
            novoUsuario.senha = undefined;

            return response.status(201).json(novoUsuario);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async createUsuarioWithAdmin(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { usuario, senha, nome, data_nascimento, telefone, email, cpf, genero, tipo, data_validade } = request.body;

            if(!usuario || !senha || !nome || !data_nascimento || !telefone || !email)
                return response.status(406).json({ message: "Missing field, verify usuario, senha, nome, data_nascimento, telefone or email" });

            if (senha.length < 8)
                return response.status(406).json({ message: "Password must be at least 8 characters." })
            
            if (await db.Usuarios.findOne({ where: { usuario } }))
                return response.status(409).json({ message: "User already exists" });
            
            if (await db.Usuarios.findOne({ where: { email } }))
                return response.status(409).json({ message: "Email already registered" });
            
            const hash = await bcrypt.hash(senha, 12);
            
            const novoUsuario = await db.Usuarios.create({
                usuario,
                senha: hash,
                nome,
                data_nascimento,
                telefone,
                email,
                cpf,
                genero,
                tipo,
                data_validade,
                status: 1
            })

            novoUsuario.senha = undefined;

            return response.status(201).json(novoUsuario);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async auth(request: Request, response: Response) {
        try {

            const usuarioInfo = request.body;

            if (!usuarioInfo.usuario) return response.status(400).json({ message: "Missing usuario field", status: 400 });

            const usuario = await db.Usuarios.findOne({ where: { usuario: usuarioInfo.usuario } })
            if (!usuario) return response.status(404).json({ message: 'User not found', status: 404 });

            if (!await bcrypt.compare(usuarioInfo.senha, usuario.senha))
                return response.status(400).json({ message: "Invalid password", status: 400 });
            
            usuario.senha = undefined;

            return response.status(200).json({ usuario, token: generateToken({ id: usuario.id, adm: false }, 36000), status: 200 })
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updateUser(request: Request, response: Response) {
        try {

            const { usuarioId } = request.params;
            const { usuario, nome, telefone, email } = request.body;

            if(!nome || !telefone || !email)
                return response.status(406).json({ message: "Missing field, verify usuario, senha, nome, data_nascimento, telefone or email" });
            
            const user = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!user) return response.status(404).json({ message: "Usuario not found" });

            if (usuario) {
                const verificaUsuario = await db.Usuarios.findOne({ where: { usuario } })
                if (verificaUsuario && verificaUsuario.id != user.id)
                    return response.status(409).json({ message: "User already exists" });
            }

            if (email) {
                const verificaEmail = await db.Usuarios.findOne({ where: { email } })
                if (verificaEmail && verificaEmail.id != user.id)
                    return response.status(409).json({ message: "Email already registered" });
            }

            const updatedUsuario = await user.update({
                usuario,
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
            // const file = request.file;
            const { imagem } = request.body;

            // if (!file) return response.status(406).json({ message: 'File error' });
            if (!imagem) return response.status(406).json({ message: 'Missing image' });

            const usuario = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!usuario) return response.status(404).json({ message: "Usuario not found" });
            
            // const b64 = Buffer.from(fs.readFileSync(file.path)).toString("base64")

            // if (usuario.imagem_perfil) deleteFile(usuario.imagem_perfil);

            // usuario.imagem_perfil = file.path;
            // usuario.imagem_perfil = b64;
            // usuario.save();

            const updatedUser = await usuario.update({ imagem_perfil: imagem });

            updatedUser.senha = undefined;
            updatedUser.imagem_perfil = Buffer.from(updatedUser.imagem_perfil).toString("ascii");

            return response.status(200).json(updatedUser);
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updatePassword(request: Request, response: Response) {
        try {

            const { usuarioId } = request.params;
            const { senha: novaSenha } = request.body;

            if(!novaSenha)
                return response.status(406).json({ message: "Missing field, verify 'senha'" });

            if (novaSenha.length < 8)
                return response.status(406).json({ message: "Password must be at least 8 characters." })

            const usuario = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!usuario) return response.status(404).json({ message: "Usuario not found" });

            const hash = await bcrypt.hash(novaSenha, 12);

            await usuario.update({ senha: hash });

            usuario.senha = undefined;

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

    static async acceptUsuario(request: Request, response: Response) {
        try {

            const { adm } = request.headers;
            if (!adm) return response.status(401).json({ message: "Requires administrator privileges" })

            const { usuarioId } = request.params;
            const { usuario, senha, data_validade } = request.body;

            if (senha.length < 8)
                return response.status(406).json({ message: "Password must be at least 8 characters." })
            
            if (await db.Usuarios.findOne({ where: { usuario } }))
                return response.status(409).json({ message: "User already exists" });

            const user = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!user) return response.status(404).json({ message: "Usuario not found" });

            const hash = await bcrypt.hash(senha, 12);

            await user.update({ usuario, senha: hash, status: 1, data_validade });

            user.senha = undefined;
            
            return response.status(200).json(user);
            
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

    static async forgotPassword(request: Request, response: Response) {
        try {

            const { email } = request.body;

            const usuario = await db.Usuarios.findOne({ where: { email } });
            if (!usuario) return response.status(404).json({ message: "Usuario not found" });

            const token = generateToken({ id: usuario.id, adm: false }, 900)

            var senha = Math.floor(Math.random() * 999999);
            const hash = await bcrypt.hash(""+senha, 12);

            var transporter = nodemailer.createTransport({
                host: 'smtp.hostinger.com.br',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: 'api@evolutionsoft.com.br',
                    pass: 'Api@2021'
                },
                tls: {
                    rejectUnauthorized: false
                }
            })

            var mailOptions = {
                from: 'api@evolutionsoft.com.br',
                to: email,
                subject: 'Redefinir Senha - Handebol Itapê',
                text: `Olá ${usuario.nome}.\nOuvimos dizer que você esqueceu sua senha, então criamos uma nova pra você. \nSegue abaixo sua nova senha.\n\n\ Senha: ${senha}`
            };

            transporter.sendMail(mailOptions, error => {
                if (error) {
                    return response.status(500).json({ response: error })
                } else {
                    Promise.resolve(usuario.update({ senha: hash })).then(() => {

                        return response.status(200).json({ response: 'Enviamos uma nova senha ao seu email, por favor verifique sua caixa de entrada!!!' });
                    })

                }
            });
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

}

export default UsuarioController;