# metalsmith-pretty-serve

A metalsmith plugin to serve files without file extensions

## Description

There are lots of places you might want to host your metalsmith website. A bunch of these will provide you with pretty URLs by serving files without their `.html` file extensions, e.g. GitHub Pages. Rather than browsing to `/about.html`, and without changing the folder structure to the standard, permalink friendly (and ugly) `about/index.html`, you can browse straight to `/about`. Metalsmith-pretty-serve achieves the same end locally.

## Installation

    $ npm install metalsmith-pretty-serve

### Usage

#### metalsmith.json

```json
{
  "plugins": {
    "metalsmith-pretty-serve"
  }
}
```

#### Javascript

```js
metalsmith.use(serve());
```

#### Options

- `port`: sets the port on which the underlying express server will listen (defaults to 3001)

## License

MIT
