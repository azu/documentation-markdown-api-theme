# documentation-markdown-api-theme

documentation's theme that output markdown.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install documentation-markdown-api-theme

## Usage

Convert `example.js` to Markdown API reference

```
$ documentation build --access public--theme documentation-markdown-api-theme -f html -o out.md example.js
```

Simulate `documentation readme` command using [add-text-to-markdown](https://github.com/azu/add-text-to-markdown "add-text-to-markdown"):

```sh
npm i -g add-text-to-markdown
documentation build --access public--theme documentation-markdown-api-theme -f html -o out.md example.js
echo out.md | add-text-to-markdown path/to/file.md --section "section name"
```

### Why using `-f html`

See https://github.com/documentationjs/documentation/issues/550

## Changelog

See [Releases page](https://github.com/azu/documentation-markdown-api-theme/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/documentation-markdown-api-theme/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
