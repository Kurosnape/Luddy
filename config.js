// Copyright (c) 2018  <Kurosnape>
//
// 이 프로그램은 자유 소프트웨어입니다. 소프트웨어의 피양도자는
// 자유 소프트웨어 재단의 GNU General Public License의 규정에 의해서
// 이 프로그램을, 개작된 2차적 프로그램과 함께 또는 개별적으로
// 재배포할 수 있습니다.
//
// 이 프로그램은 보다 유용하게 사용될 수 있으리라는 희망에서 배포되고
// 있지만 제품에 대한 어떠한 형태의 보증도 제공하지 않습니다. 보다
// 자세한 사항에 대해서는 GNU General Public License를 참고하시기
// 바랍니다.
//
// <http://www.gnu.org/licenses/>

const pkg = require('./package.json')

//  If run with production, you must be set your port to 80
// or you want to use it with certificate, set port to 443
// It automatically recognize your intent, transform to Production Mode
//
//  Be careful! if the port set to 443,
// the server override `use_https` to true,
// and import certicates that finding the path at `import_cert` variable.
//
//  If server could not find your locale, will serve using Korean
// Contributions or Improve translation are always welcome.
//
//  How to import your certicates
// It's your choice. It can be absoulte or relative path
// @example
//  exports.import_cert = ["cert/your_own_key.key", "cert/your_own_cert.crt"]
exports.server_name = pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1);
exports.server_version = pkg.version
exports.server_description = pkg.description
exports.port = 4822
exports.locale = "ko"
exports.use_https = false
exports.import_cert = []

exports.basie_supply = 500

// Decide whether to use of decimal places
// @example 
//  If have 3000 pongs and set the decimal places to 2
//  That's output: 3000.00 pongs
exports.decimal_places = false