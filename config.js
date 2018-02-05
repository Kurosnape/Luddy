/**
 * Copyright (C) 2018 Kurosnape <kurosnape@gmail.com> (https://kurosnape.co.kr/)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Copyright (C) 2018 Kurosnape <kurosnape@gmail.com> <https://twitter.com/Kurosnape>
 * 
 * Luddy 오픈 소스를 사용하실 때, 소스 코드를 무료로 배포해야 하며
 * 소스 코드를 용도에 따라 수정하실 수 있습니다. 변경된 소스 역시
 * 프로그램의 소스 코드를 반드시 공개 배포해야 하며 똑같은 라이센스를
 * 가져야 합니다. (즉, GNU GPL 라이센스를 명시해주세요.)
 */

const pkg = require('./package.json')

// Enable debug
exports.debug = true

/**
 * Declare whether to use whitelist
 * Enable Whitelist means ignore lock
 * 
 * @example
 *  exports.whitelist = ["Kurosnape", "Luddy"]
 */
exports.enableWhitelist = false
exports.whitelist = []

// Will be disable when use whitelist
exports.enableLock = true
exports.lock = "Luddy"

/**
 * If are running with production, you must be set your port to 80
 * or you want to run it with https, set to 443
 * 
 * Watch out! Using 443 port is
 * config will override `use_https` to true,
 * and import certificate that finding the path at `import_cert`
 * 
 * Server could not find your locale settings, will serve using Korean
 * Contributions or Improve translation are always welcome.
 */
exports.server_name = pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1)
exports.server_version = pkg.version
exports.server_description = pkg.description
exports.server_api_version = pkg.version.split('.').shift()
exports.port = 4822
exports.locale = "ko"
exports.use_https = false
exports.import_cert = []
exports.mongoUrl = "mongodb://localhost:27017"

// Lists of admins, operators
exports.administrator = ["Kurosnape"]
exports.operator = []

// Default pongs
exports.basic_home = {
  x: 20,
  y: 20
}
exports.basic_supply = 500

// Set Command Symbol
exports.command_begin = "/"
exports.admin_command_begin = "!"

/**
 * Declare whether to use decimal places
 * 
 * @example
 *  If have 3000 pongs and set the decimal places to 2,
 *  That's output: 3000.00 pongs
 */
exports.decimal_places = false

// Disallow any commands?
exports.disallow_commands = false

// Login Items
exports.passport = {
  google: {
    enable: false,
    clientId: '',
    clientSecret: '',
    callbackUrl: '/oauth/google/callback'
  },
  naver: {
    enable: true,
    clientId: 'Ub4BQ9yStAZzZvfpMuyF',
    clientSecret: 'pzIGdupULt',
    callbackUrl: '/oauth/naver/callback'
  },
  kakao: {
    enable: false,
    clientId: 'bed57c53db3295db6041cec9bd536df3',
    clientSecret: 'hOHyLpCOI2vBmTMkfZJp5SDTuCTJZMt1',
    callbackUrl: '/oauth/kakao/callback'
  },
  facebook: {
    enable: false,
    cliendId: '',
    clientSecret: '',
    callbackUrl: '/oauth/facebook/callback'
  },
  twitter: {
    enable: false,
    consumerKey: '',
    consumerSecret: '',
    callbackUrl: '/oauth/twitter/callback'
  }
}

// Front-end theme-color for support Android Chrome 39
exports.theme_color = '#09C'

/**
 * Set up whether to use google analytics (alias as GA) .
 * Override false when debug mode on
 * 
 * @return {boolean}
 */
exports.enableGA = false
exports.ga = {
  token: ''
}

// DO NOT TOUCH THIS
// 절대로 수정하지 마세요
exports.handle_hash = '$b_21^0Ch9'
exports.enableLock = (exports.enableWhitelist) ? false : exports.enableLock
// [Deprecated] 비밀번호를 (공백)으로 설정할 수도 있으므로 삭제
// exports.lock = (exports.enableLock && exports.lock !== '') ? exports.lock : "Luddy"
exports.enableGA = (exports.debug) ? false : exports.enableGA
if (exports.port == 443)
  exports.use_https = true
exports.assets_maxAge = 9000000

// Temporal
exports.passport.google.enable = false
exports.passport.kakao.enable = false
exports.passport.facebook.enable = false
exports.passport.twitter.enable = false

/* <!-- End of Config file --> */
