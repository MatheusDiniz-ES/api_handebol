'use strict';

import {
  Model
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class Cupons extends Model {

    static associate(models: any) {
      Cupons.belongsTo(models.Fornecedores, {
        foreignKey: 'id_fornecedor',
        as: 'fornecedor'
      })
    }

  };
  Cupons.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_fornecedor: DataTypes.INTEGER,
    codigo: DataTypes.STRING,
    titulo: DataTypes.STRING,
    valor_desconto: DataTypes.FLOAT,
    descricao: DataTypes.STRING,
    validade: DataTypes.DATEONLY,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cupons',
    tableName: 'cupons'
  });
  return Cupons;
};