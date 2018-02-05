class Validator {
  /**
   * Boostrap Validator
   * 
   * @class Validator
   * @method bootstrap
   * @static
   * @return {Object}
   */
  public static bootstrap() {
    return new Validator()
  }

  /**
   * Normalize port into a number, string, or false
   * 
   * @method normalizePort
   * @param {val} port
   * @returns number | string | boolean
   */
  normalizePort(val: number | string): number | string | boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val

    if (isNaN(port)) {
      return val
    } else if (port >= 0) {
      return port
    } else {
      return false
    }
  }
}

export default Validator.bootstrap()
