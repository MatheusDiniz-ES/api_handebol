import express from 'express';
import cors from 'cors';
import db from './models';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

import usuariosRoutes from './routes/usuarios.routes';
app.use('/usuarios', usuariosRoutes);

import empresasRoutes from './routes/empresas.routes';
app.use('/empresas', empresasRoutes);

import fornecedoresRoutes from './routes/fornecedores.routes';
app.use('/fornecedores', fornecedoresRoutes);

import cuponsRoutes from './routes/cupons.routes';
app.use('/cupons', cuponsRoutes);

import usuariosAdminsRoutes from './routes/usuariosadmins.routes';
app.use('/admins', usuariosAdminsRoutes);

app.listen(port, async () => {

    try {
        await db.sequelize.authenticate();

        console.log('Connection successful');
    } catch (error: any) {
        console.log(`Error: ${error.message}`);
    }

    console.log(`Server started on port ${port}`)
})