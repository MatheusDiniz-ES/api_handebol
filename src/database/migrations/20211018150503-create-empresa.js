'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('empresas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome_empresa: {
        type: Sequelize.STRING
      },
      cnpj: {
        type: Sequelize.STRING
      },
      rua: {
        type: Sequelize.STRING
      },
      bairro: {
        type: Sequelize.STRING
      },
      numero: {
        type: Sequelize.STRING
      },
      cep: {
        type: Sequelize.STRING
      },
      complemento: {
        type: Sequelize.STRING
      },
      cidade: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.STRING
      },
      telefone: {
        type: Sequelize.STRING
      },
      facebook: {
        type: Sequelize.STRING
      },
      instagram: {
        type: Sequelize.STRING
      },
      whatsapp: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('empresas');
  }
};