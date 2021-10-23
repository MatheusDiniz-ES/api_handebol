'use strict';

import {
  Model
} from'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Empresa extends Model {

    static associate(models: any) {
    }

  };
  Empresa.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome_empresa: DataTypes.STRING,
    cnpj: DataTypes.STRING,
    rua: DataTypes.STRING,
    bairro: DataTypes.STRING,
    numero: DataTypes.STRING,
    cep: DataTypes.STRING,
    complemento: DataTypes.STRING,
    cidade: DataTypes.STRING,
    estado: DataTypes.STRING,
    telefone: DataTypes.STRING,
    facebook: DataTypes.STRING,
    instagram: DataTypes.STRING,
    whatsapp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Empresa',
    tableName: 'empresas'
  });
  return Empresa;
};