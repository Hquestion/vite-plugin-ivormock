# vite-plugin-ivormock

Vite plugin for ivormock

> Ivormock is made for development. Please use it in development environment **only**.

## Install

```shell
npm install -D ivormock vite-plugin-ivormock
```

## Getting Start

In your `vite.config.js`：

```js
const ivormock = require("vite-plugin-ivormock");

export default {
    // ... 
    plugins: [
        //...
        ivormock({
            mockPath: "mock",   // mock file path, relative to project root
            port: 3456          // ivormock server port
        })
    ]
}
```