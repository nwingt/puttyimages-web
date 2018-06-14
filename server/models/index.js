const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require('../../config/database');

const sequelize = new Sequelize({
  ...config.development,
  define: {
    underscored: true,
  },
  operatorsAliases: false,
  timezone: '+00:00',
});

const db = {};
const isTest = global.test !== undefined;
const modelPath = `${isTest ? '' : '../'}${__dirname}`; // Fix backpack fs path
const nonModelFile = ['index.js', 'base.js', 'validator.js'];

fs.readdirSync(__dirname).forEach((file) => {
  if (nonModelFile.includes(file)) {
    return;
  }

  const model = sequelize.import(path.join(modelPath, file));
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.asset.belongsTo(db.license, { foreignKey: 'fk_asset_license' });
db.license.hasMany(db.asset, { foreignKey: 'fk_asset_license' });

db.asset.belongsToMany(db.tag, {
  foreignKey: 'asset_fingerprint',
  through: 'asset_tag',
  timestamps: false,
});
db.tag.belongsToMany(db.asset, {
  foreignKey: 'tag_name',
  through: 'asset_tag',
  timestamps: false,
});

module.exports = db;
