'use strict';

import {
  Model
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Usuario extends Model {

    static associate(models: any) {
    }
    
  };
  Usuario.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario: DataTypes.STRING,
    senha: DataTypes.STRING,
    imagem_perfil: DataTypes.STRING,
    nome: DataTypes.STRING,
    data_nascimento: DataTypes.DATEONLY,
    telefone: DataTypes.STRING,
    email: DataTypes.STRING,
    cpf: DataTypes.STRING,
    genero: DataTypes.INTEGER,
    tipo: DataTypes.INTEGER,
    data_validade: DataTypes.DATEONLY,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Usuarios',
    tableName: 'usuarios',
  });
  return Usuario;
};