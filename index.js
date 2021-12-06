const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer();
const ivormock = require("ivormock");

module.exports = function viteIvormockPlugin(options) {
    return {
        name: "ivormock",
        apply(config, { command }) {
            return command === "serve"
        },
        configureServer(server) {
            return function () {
                let promise;
                const cwd = process.cwd();
                let mockProject = ivormock.getPathProject(cwd);
                if (mockProject) {
                    /**
                     * 已存在项目，直接启动
                     */
                    promise = ivormock.stopServer(mockProject.name)
                        .then(() => {
                            ivormock.startServer(mockProject.name);
                        })
                        .then(() => {
                            console.log("ivormock: 服务已启动...")
                        });
                } else {
                    /**
                     * 不存在项目，先创建项目再启动
                     */
                    mockProject = ivormock.createProject({
                        name: process.env.npm_package_name,
                        base: cwd,
                        mockPath: options.mockPath,
                        port: options.port
                    });
                    promise = ivormock.startServer(mockProject.name).then(() => {
                        console.log("ivormock: 服务已启动...")
                    })
                }
                const prefix = options.prefix || "/mock";
                server.middlewares.use((req, res, next) => {
                    promise.then(() => {
                        if (req.url.startsWith(prefix)) {
                            req.url = req.url.replace(prefix, "/");
                            proxy.web(req, res, {
                                target: `http://localhost:${mockProject.usedPort || mockProject.port}`,
                                changeOrigin: true,
                            });
                        } else {
                            next();
                        }
                    });
                })
            }
        },
        buildEnd() {
            let mockProject = ivormock.getPathProject(cwd);
            if (mockProject) {
                ivormock.stopServer(mockProject.name);
            }
        }
    }
}