// LICENSE : MIT
"use strict";

const remark = require('remark');
const toc = require('remark-toc');
const markdownAST = require('./markdown/simple-markdown-ast');
const processor = remark().use(toc);
module.exports = function(comments, options, callback) {
    markdownAST(comments, options, function(err, ast) {
        const processedAST = processor.run(ast);
        return callback(null, processor.stringify(processedAST));
    });
};