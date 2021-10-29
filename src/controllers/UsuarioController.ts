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

            const img = usuario.imagem_perfil ? Buffer.from(usuario.imagem_perfil).toString("ascii") : ""

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

            if(!nome || !data_nascimento || !telefone || !email)
                return response.status(400).json({ message: "Missing field, verify nome, data_nascimento, telefone or email" });

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
                tipo: null,
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
                return response.status(403).json({ message: "Invalid password", status: 403 });
            
            usuario.senha = undefined;

            if(usuario.imagem_perfil){
                usuario.imagem_perfil = Buffer.from(usuario.imagem_perfil).toString("ascii");
            }

            return response.status(200).json({ usuario, token: generateToken({ id: usuario.id, adm: false }, 36000), status: 200 })
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updateUser(request: Request, response: Response) {
        try {

            const { usuarioId } = request.params;
            const { usuario: clientUser, nome, telefone, email, genero, tipo, data_validade } = request.body;

            if(!telefone || !email)
                return response.status(406).json({ message: "Missing field, verify usuario, senha, nome, data_nascimento, telefone or email", status: 406 });
            
            const user = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!user) return response.status(404).json({ message: "Usuario not found", status: 404 });

            if (clientUser) {
                const verificaUsuario = await db.Usuarios.findOne({ where: { usuario: clientUser } })
                if (verificaUsuario && verificaUsuario.id != user.id)
                    return response.status(409).json({ message: "User already exists", status: 409 });
            }

            if (email) {
                const verificaEmail = await db.Usuarios.findOne({ where: { email } })
                if (verificaEmail && verificaEmail.id != user.id)
                    return response.status(409).json({ message: "Email already registered", status:409 });
            }

            const usuario = await user.update({
                usuario: clientUser,
                nome,
                telefone,
                email,
                genero,
                tipo,
                data_validade
            })

            usuario.senha = undefined;


            return response.status(200).json({ usuario, status: 200 });
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updateProfileImage(request: Request, response: Response) {
        try {

            const { usuarioId } = request.params;
            // const file = request.file;
            const { imagem } = request.body;

            // if (!file) return response.status(406).json({ message: 'File error' });
            if (!imagem) return response.status(400).json({ message: 'Missing image', status: 400 });

            const user = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!user) return response.status(404).json({ message: "Usuario not found", status: 404 });
            
            // const b64 = Buffer.from(fs.readFileSync(file.path)).toString("base64")

            // if (usuario.imagem_perfil) deleteFile(usuario.imagem_perfil);

            // user.imagem_perfil = file.path;
            // user.imagem_perfil = b64;
            // user.save();

            const usuario = await user.update({ imagem_perfil: imagem });

            usuario.senha = undefined;
            usuario.imagem_perfil = Buffer.from(usuario.imagem_perfil).toString("ascii");

            return response.status(200).json({ usuario, status: 200 });
            
        } catch (error: any) { return response.status(500).json({ message: error.message }) }
    }

    static async updatePassword(request: Request, response: Response) {
        try {

            const { usuarioId } = request.params;
            const { senha, novaSenha } = request.body;

            if(!novaSenha)
                return response.status(400).json({ message: "Missing field, verify 'senha'", status: 400 });

            if (novaSenha.length < 8)
                return response.status(406).json({ message: "Password must be at least 8 characters.", status: 406 })

            const usuario = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!usuario) return response.status(404).json({ message: "Usuario not found", status: 404 });

            if (!await bcrypt.compare(senha, usuario.senha))
                return response.status(403).json({ message: "Invalid password", status: 403 });

            const hash = await bcrypt.hash(novaSenha, 12);

            await usuario.update({ senha: hash });

            usuario.senha = undefined;
            usuario.imagem_perfil = undefined;

            return response.status(200).json({ usuario, status: 200 });
            
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
            const { usuario, senha, tipo, data_validade } = request.body;

            if (senha.length < 8)
                return response.status(406).json({ message: "Password must be at least 8 characters." })
            
            if (await db.Usuarios.findOne({ where: { usuario } }))
                return response.status(409).json({ message: "User already exists" });

            const user = await db.Usuarios.findOne({ where: { id: Number(usuarioId) } });
            if (!user) return response.status(404).json({ message: "Usuario not found" });

            const hash = await bcrypt.hash(senha, 12);

            await user.update({ usuario, senha: hash, status: 1, tipo, data_validade });

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

            var senha = Math.floor(Math.random() * 999999);
            const hash = await bcrypt.hash(""+senha, 12);

            var transporter = nodemailer.createTransport({
                host: 'smtp.hostinger.com.br',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: 'api@evolutionsoft.com.br',
                    pass: '@#EvolutionApi@2021#@'
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