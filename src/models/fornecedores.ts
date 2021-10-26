'use strict';

import {
  Model
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Fornecedores extends Model {
    
    static associate(models: any) {
      Fornecedores.hasMany(models.Cupons, {
        foreignKey: 'id_fornecedor',
        as: 'fornecedor'
      })
    }

  };
  Fornecedores.init({
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
    whatsapp: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Fornecedores',
    tableName: 'fornecedores'
  });
  return Fornecedores;
};