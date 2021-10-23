'use strict';

import {
  Model
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class UsuariosAdmin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  };
  UsuariosAdmin.init({
    usuario: DataTypes.STRING,
    senha: DataTypes.STRING,
    nome: DataTypes.STRING,
    imagem: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UsuariosAdmin',
    tableName: 'usuarios_admins'
  });
  return UsuariosAdmin;
};