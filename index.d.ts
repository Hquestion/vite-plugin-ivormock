import { PluginOption } from "vite";

interface IVitePluginIvormockOptions {
    mockPath?: string;
    port?:number;
    prefix?: string;
}

declare module "vite-plugin-ivormock" {
    var ivormock: (options: IVitePluginIvormockOptions) => PluginOption;
    export default ivormock;
}