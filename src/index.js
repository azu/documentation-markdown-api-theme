// LICENSE : MIT
"use strict";

const remark = require('remark');
const toc = require('remark-toc');
const markdownAST = require('./markdown/simple-markdown-ast');
module.exports = function(comments, options, callback) {
    var processor = remark().use(toc);
    markdownAST(comments, options, function(err, ast) {
        var processedAST = processor.run(ast);
        return callback(null, processor.stringify(processedAST));
    });
};