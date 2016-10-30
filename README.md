# documentation-markdown-api-theme

documentation's theme that output markdown.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install documentation-markdown-api-theme

## Usage

Convert `example.js` to Markdown API reference

    $ documentation build --access public --theme documentation-markdown-api-theme -f html -o out.md example.js

Simulate `documentation readme` command using [add-text-to-markdown](https://github.com/azu/add-text-to-markdown "add-text-to-markdown"):

```sh
npm i -g add-text-to-markdown
documentation build --access public --theme documentation-markdown-api-theme -f html -o out.md example.js
echo out.md | add-text-to-markdown path/to/file.md --section "section name" --write
```

### Real Usage

We want to create updatable API Usage to `README.md`

Install devDependencies:

```sh
npm install documentation-markdown-api-theme documentation add-text-to-markdown -D
```

Add npm run-script for updating `## Usage` section

```json
  ...
  "scripts": {
    "docs": "documentation build --access public --theme ./node_modules/documentation-markdown-api-theme/lib/index -f html -o out.md src/UIEventObserver.js && cat out.md | add-text-to-markdown README.md --section \"Usage\" --write; rm out.md",
    "prepublish": "npm run --if-present build && npm run docs"
  },
  "devDependencies": {
    "add-text-to-markdown": "^1.0.3",
    "documentation": "^4.0.0-beta11",
    "documentation-markdown-api-theme": "^1.0.2"
  },
  ...
```

Update `## Usage` section

```
npm run docs
```

### Why using `-f html`

See https://github.com/documentationjs/documentation/issues/550

## Real Example

See 

- [https://almin.js.org/docs/api/](https://almin.js.org/docs/api/)
- [azu/ui-event-observer: Provide performant way to subscribe to browser UI Events.](https://github.com/azu/ui-event-observer#usage "azu/ui-event-observer: Provide performant way to subscribe to browser UI Events.")

## Example Output

### `hello_destructuring({ name, age })`

hello with destructuring params

**Parameters**

-   `name`: **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**
-   `age`: **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**

### `hello(text: string): string`

**Parameters**

-   `text`: **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

Returns: **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - echo text

### `commentsToAST(comments: Array<Object>, opts: Object, callback: Function): undefined`

Given a hierarchy-nested set of `comments`, generate an remark-compatible
Abstract Syntax Tree usable for generating Markdown output

**Parameters**

-   `comments`: **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** - nested comment
-   `opts`: **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** - currently none accepted
-   `callback`: **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** - called with AST

Returns: **[undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)**

### `Person`

Person class

#### `constructor({ name })`

**Parameters**

-   `name`: **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - Person name

#### `getName(): string`

get person name

Returns: **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

## Changelog

See [Releases page](https://github.com/azu/documentation-markdown-api-theme/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/documentation-markdown-api-theme/issues).

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Author

-   [github/azu](https://github.com/azu)
-   [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
