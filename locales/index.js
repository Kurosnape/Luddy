const locale = require('../config')['locale']

// Legacy Code
// const importer_legacy = (o) => Object.assign(...Object.keys(o).map( k => require(`./${locale}/${o[k]}.json`) ))
// const result_legacy = importer_legacy(['script', 'item'])

// from https://twitter.com/killofki/status/957897056277774337
const importer = ( ...ar ) => Object.assign(...ar.map( component => require(`./${locale}/${component}.json`) ))

const result = importer('server', 'script', 'item', 'map', 'mob', 'npc')
module.exports = result
