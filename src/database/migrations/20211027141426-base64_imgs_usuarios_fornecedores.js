'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('fornecedores', 'imagem', {
      type: Sequelize.BLOB('long')
    })
    await queryInterface.changeColumn('usuarios', 'imagem_perfil', {
      type: Sequelize.BLOB('long')
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('fornecedores', 'imagem')
    await queryInterface.changeColumn('usuarios', 'imagem_perfil', {
      type: Sequelize.STRING
    })
  }
};
