'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('usuarios', 'genero', {
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('usuarios', 'tipo', {
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('usuarios', 'data_validade', {
      type: Sequelize.DATEONLY
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('usuarios', 'genero')
    await queryInterface.removeColumn('usuarios', 'tipo')
    await queryInterface.removeColumn('usuarios', 'data_validade')
  }
};
