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
exports.port = 4822
exports.locale = "ko"
exports.use_https = false
exports.import_cert = []

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
  use_naver: true,
  use_twitter: true,
  use_facebook: true,
  use_kakao: true
}

// DO NOT TOUCH THIS
// 절대로 수정하지 마세요
exports.handle_hash = '$b_21^0Ch9'
exports.enableLock = (exports.enableWhitelist) ? false : exports.enableLock
exports.lock = (exports.enableLock && exports.lock !== '') ? exports.lock : "Luddy"
if (exports.port == 443)
  exports.use_https = true
exports.assets_maxAge = 9000000

/* <!-- End of Config file --> */
