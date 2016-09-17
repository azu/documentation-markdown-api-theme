/**
 * hello with destructuring params
 * @param {string} name
 * @param {number} age
 * @public
 */
function hello_destructuring({name, age}) {

}
/**
 *
 * @param {string} text
 * @returns {string} echo text
 * @public
 */
function hello(text) {
    return text;
}


/**
 * secret
 * @param number secret
 * @private
 */
function _private(number) {

}

/**
 * Given a hierarchy-nested set of `comments`, generate an remark-compatible
 * Abstract Syntax Tree usable for generating Markdown output
 *
 * @param {Array<Object>} comments nested comment
 * @param {Object} opts currently none accepted
 * @param {Function} callback called with AST
 * @returns {undefined}
 * @public
 */
function commentsToAST(comments, opts, callback) {

}

/**
 * Person class
 * @public
 */
class Person {
    /**
     * @param {string} name Person name
     * @public
     */
    constructor({name}) {
        this.name = name;
    }

    /**
     * get person name
     * @returns {string}
     * @public
     */
    getName(){
        return this.name;
    }
}