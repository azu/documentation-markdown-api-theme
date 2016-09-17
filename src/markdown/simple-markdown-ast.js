var u = require("unist-builder");
var formatType = require("documentation-theme-utils").formatType;
var hljs = require("highlight.js");
var unescapeHTML = require("unescape-html");
var remark = require("remark")();
var isNotUndefined = function(node) {
    return node !== undefined && node !== null && node !== false;
};
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
    var hljsOptions = (opts || {}).hljs || {},
        language = !hljsOptions.highlightAuto ? "javascript" : undefined;

    hljs.configure(hljsOptions);

    /**
     * Generate an AST chunk for a comment at a given depth: this is
     * split from the main function to handle hierarchially nested comments
     *
     * @param {number} depth nesting of the comment, starting at 1
     * @param {Object} comment a single comment
     * @returns {Object} remark-compatible AST
     */
    function generate(depth, comment) {
        function descriptionAsMarkdown(description, prefix) {
            if (!description) {
                return [];
            }
            if (description.children && description.children.length === 0) {
                return [];
            }
            if (prefix) {
                return [u('text', prefix)].concat(description.children)
            }
            return description.children;
        }

        var contain$destructuringParam = function(param) {
            // $0, $1
            return /^\$\d+$/.test(param.name) && param.type.name === "Object";
        };

        /**
         * create normal params
         * @param {Array} params
         * @returns {*|Array.<T>|Array}
         */
        var withoutDestructuringParam = function(params) {
            return params.filter(param => {
                return !contain$destructuringParam(param);
            });
        };
        var replacedDestructuringParamWithNormal = function($params, normalParams) {
            // replace $param with normal
            $params.forEach($param => {
                $param.properties = $param.properties.map($paramItem => {
                    var matchParam = normalParams.find(param => {
                        return `${$param.name}.${param.name}` === $paramItem.name;
                    });
                    if (matchParam) {
                        return matchParam;
                    } else {
                        return $paramItem;
                    }
                });
            });
            return $params;
        };

        /**
         * destructuring $0
         */
        function $paramList(params) {
            var normalParams = withoutDestructuringParam(params);
            return paramList(normalParams);
        }

        function paramList(params) {
            if (params.some(contain$destructuringParam)) {
                return $paramList(params);
            }
            return u("list", {ordered: false}, params.map(function(param) {
                var description = param.description ? descriptionAsMarkdown(param.description, " - ") : [];
                var defaultParameters = param.default ? [
                    u("paragraph", [
                        u("text", " (optional, default "),
                        u("inlineCode", param.default),
                        u("text", ")")
                    ])
                ] : [];
                var typeNodes = param.type ? [
                    u("text", ": "),
                    u("strong", formatType(param.type))
                ] : [];
                var inParagraph = [
                    u("inlineCode", param.name)
                ].concat(
                    typeNodes,
                    description,
                    defaultParameters).filter(isNotUndefined);
                var properties = param.properties ? paramList(param.properties) : undefined;
                var listItems = [
                    u("paragraph", inParagraph)
                ].concat(properties).filter(isNotUndefined);
                return u("listItem", listItems);
            }));
        }

        function paramSection(comment) {
            return !!comment.params && [
                    u("strong", [u("text", "Parameters")]),
                    paramList(comment.params)
                ];
        }

        function propertySection(comment) {
            return !!comment.properties && [
                    u("strong", [u("text", "Properties")]),
                    propertyList(comment.properties)
                ];
        }

        function propertyList(properties) {
            return u("list", {ordered: false},
                properties.map(function(property) {
                    var description = property.description ? descriptionAsMarkdown(property.description) : [];
                    return u("listItem", [
                        u("paragraph", [
                            u("inlineCode", property.name),
                            u("text", " "),
                            u("strong", formatType(property.type)),
                            u("text", " ")
                        ]
                            .concat(description)
                            .filter(isNotUndefined)),
                        property.properties && propertyList(property.properties)
                    ].filter(isNotUndefined));
                }));
        }

        function examplesSection(comment) {
            return !!comment.examples && [u("strong", [u("text", "Examples")])]
                    .concat(comment.examples.reduce(function(memo, example) {
                        language = hljsOptions.highlightAuto ?
                                   hljs.highlightAuto(example.description).language : "javascript";
                        return memo.concat(example.caption ?
                            [u("paragraph", [u("emphasis", example.caption)])] :
                            []).concat([u("code", {lang: language}, example.description)]);
                    }, []));
        }

        function returnsSection(comment) {
            return !!comment.returns && comment.returns.map(function(returns) {
                    var description = returns.description
                        ? descriptionAsMarkdown(returns.description, " - ")
                        : [];
                    var returnType = returns.type ? [
                        u("text", ": "),
                        u("strong", formatType(returns.type))
                    ] : [];
                    // if no return value, hidden
                    if (returnType.length === 0) {
                        return false;
                    }
                    return u("paragraph", [
                        u("text", "Returns")
                    ].concat(returnType, description).filter(isNotUndefined));
                });
        }

        function throwsSection(comment) {
            return !!comment.throws &&
                u("list", {ordered: false},
                    comment.throws.map(function(returns) {
                        var description = returns.description ? descriptionAsMarkdown(returns.description) : [];
                        return u("listItem", [
                            u("paragraph", [
                                u("text", "Throws "),
                                u("strong", formatType(returns.type)),
                                u("text", " ")
                            ].concat(description))
                        ]);
                    }));
        }

        function augmentsLink(comment) {
            return comment.augments && u("paragraph", [
                    u("strong", [
                        u("text", "Extends "),
                        u("text", comment.augments.map(function(tag) {
                            return tag.name;
                        }).join(", "))
                    ])
                ]);
        }

        function githubLink(comment) {
            return comment.context.github && u("paragraph", [
                    u("link", {
                        title: "Source code on GitHub",
                        url: comment.context.github
                    }, [
                        u("text", comment.context.path + ":" +
                            comment.context.loc.start.line + "-" +
                            comment.context.loc.end.line)
                    ])
                ]);
        }

        function metaSection(comment) {
            var meta = ["version", "since", "copyright", "author", "license"]
                .reduce(function(memo, tag) {
                    if (comment[tag]) {
                        memo.push({tag: tag, value: comment[tag]});
                    }
                    return memo;
                }, []);
            return !!meta.length && [u("strong", [u("text", "Meta")])].concat(
                    u("list", {ordered: false},
                        meta.map(function(item) {
                            return u("listItem", [
                                u("paragraph", [
                                    u("strong", [u("text", item.tag)]),
                                    u("text", ": " + item.value)
                                ])
                            ]);
                        })));
        }

        function stringifyNodes(children) {
            return children.map(function(node) {
                if (node.children) {
                    return stringifyNodes(node.children);
                } else {
                    return unescapeHTML(node.value);
                }
            }).join("");
        }

        // type node
        function stringifyType(type) {
            var typeNodeList = formatType(type);
            return stringifyNodes(typeNodeList);
        }

        // (param1: Type, param: Type)
        // return TextNode
        function paramPairString(params) {
            if (!Array.isArray(params)) {
                return "";
            }
            // When contain $, create { param } string
            if (params.some(contain$destructuringParam)) {
                const $paramList = params.filter(contain$destructuringParam);
                const normalParams = withoutDestructuringParam(params);
                const replacedDestructuringParams = replacedDestructuringParamWithNormal($paramList, normalParams);
                return replacedDestructuringParams.sort((a, b) => {
                    return a.name > b.name;
                }).map(function($param) {
                    // { foo, bar }
                    const paramNames = $param.properties.map(param => param.name);
                    return `{ ${paramNames.join(", ")} }`;
                }).join(", ");
            }
            var paramsStrings = params.map(function(param) {
                var name = param.name ? param.name : "";
                if (param.type) {
                    return name + ": " + stringifyType(param.type);
                } else {
                    return name;
                }
            });
            return paramsStrings.join(", ");
        }

        function returnTypeString(returns) {
            if (returns === undefined) {
                return "";
            }
            return returns.map(function(ret) {
                return stringifyType(ret.type);
            }).join(",");
        }

        function heading(comment) {
            var params = comment.params ? paramPairString(comment.params) : "";
            var returnType = returnTypeString(comment.returns);
            var headName = comment.name || "";
            // function( param ) : returnType
            if (comment.kind === 'function') {
                if (params.length > 0) {
                    headName += "(" + params + ")";
                } else {
                    headName += "()";
                }
                if (returnType.length > 0) {
                    headName += ": " + returnType;
                }
            }
            return u("heading", {depth: depth}, [u("inlineCode", headName)])
        }

        return []
            .concat(heading(comment))
            .concat(githubLink(comment))
            .concat(augmentsLink(comment))
            .concat(comment.description ? descriptionAsMarkdown(comment.description) : [])
            .concat(paramSection(comment))
            .concat(propertySection(comment))
            .concat(examplesSection(comment))
            .concat(throwsSection(comment))
            .concat(returnsSection(comment))
            .concat(metaSection(comment))
            .concat(!!comment.members.instance.length &&
                comment.members.instance.reduce(function(memo, child) {
                    return memo.concat(generate(depth + 1, child));
                }, []))
            .concat(!!comment.members.static.length &&
                comment.members.static.reduce(function(memo, child) {
                    return memo.concat(generate(depth + 1, child));
                }, []))
            .filter(isNotUndefined);
    }

    return callback(null, u("root", comments.reduce(function(memo, comment) {
        return memo.concat(generate(1, comment));
    }, [])));
}

module.exports = commentsToAST;
