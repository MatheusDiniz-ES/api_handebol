'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_fornecedor: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'fornecedores', key: 'id' },
        foreignKey: true,
      },
      codigo: {
        type: Sequelize.STRING
      },
      titulo: {
        type: Sequelize.STRING
      },
      valor_desconto: {
        type: Sequelize.FLOAT
      },
      descricao: {
        type: Sequelize.STRING
      },
      validade: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('cupons');
  }
};