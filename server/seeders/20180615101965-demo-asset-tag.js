const { ipfs, tags } = require('./fixture');

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert(
      'asset_tag',
      tags
        .map(({ name }, index) => ({
          asset_fingerprint: Buffer.from(ipfs[index], 'hex'),
          tag_name: name,
        }))
        .concat(
          tags.map((tag, index) => ({
            asset_fingerprint: Buffer.from(ipfs[index], 'hex'),
            tag_name: 'fruit',
          }))
        )
        .concat(
          tags
            .filter(({ name }) => name.indexOf('berry') > -1)
            .map((tag, index) => ({
              asset_fingerprint: Buffer.from(ipfs[index], 'hex'),
              tag_name: 'berry',
            }))
        )
    ),
  down: (queryInterface) => queryInterface.bulkDelete('asset_tag', null, {}),
};
