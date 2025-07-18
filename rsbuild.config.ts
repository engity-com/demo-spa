import * as fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

export default defineConfig({
    html: {
        title: 'Engity Demo',
        template: './src/index.html',
        appIcon: {
            name: 'Engity Demo',
            icons: [
                { size: 64, src: './src/assets/manifest/white-logo-only-on-accent-64.png' },
                { size: 128, src: './src/assets/manifest/white-logo-only-on-accent-128.png' },
                { size: 192, src: './src/assets/manifest/white-logo-only-on-accent-192.png' },
                { size: 256, src: './src/assets/manifest/white-logo-only-on-accent-256.png' },
                { size: 512, src: './src/assets/manifest/white-logo-only-on-accent-512.png' },
            ],
        },
        favicon: './src/assets/logo.svg',
    },
    source: {
        entry: {
            index: './src/index.tsx',
        },
    },
    tools: {
        postcss: (_, { addPlugins }) => {
            addPlugins([
                require('@tailwindcss/postcss')({ optimize: { minify: true } }),
                require('postcss-inline-svg'),
                require('postcss-mixins')({ mixinsDir: path.join(__dirname, 'src', 'mixins') }),
                require('postcss-nested'),
                require('@csstools/postcss-cascade-layers'),
            ]);
        },
    },
    output: {
        cleanDistPath: true,
        target: 'web',
        sourceMap: {
            css: true,
            js: 'inline-source-map',
        },
        distPath: {
            css: 'assets',
            js: 'assets',
            svg: 'assets',
            font: 'assets',
            image: 'assets',
            assets: 'assets',
            root: 'dist/dev',
        },
        legalComments: 'inline',
        manifest: true,
        polyfill: 'usage',
    },
    resolve: {
        alias: {
            '@': './src',
            '@environment': './src/environments/environment.ts',
        },
    },
    environments: {
        dev: {},
        green: {
            resolve: {
                alias: {
                    '@environment': './src/environments/environment.green.ts',
                },
            },
            output: {
                distPath: {
                    root: 'dist/green',
                },
                sourceMap: {
                    css: false,
                    js: false,
                },
            },
        },
        red: {
            resolve: {
                alias: {
                    '@environment': './src/environments/environment.red.ts',
                },
            },
            output: {
                distPath: {
                    root: 'dist/red',
                },
                sourceMap: {
                    css: false,
                    js: false,
                },
            },
        },
    },
    plugins: [
        pluginReact({
            // @ts-ignore
            enableProfiler: process.env.REACT_PROFILER === 'true',
            splitChunks: {
                react: false,
                router: false,
            },
        }),
        pluginSvgr({
            svgrOptions: {
                exportType: 'default',
                jsxRuntime: 'classic',
                typescript: true,
                svgoConfig: {
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    inlineStyles: {
                                        onlyMatchedOnce: false,
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        }),
    ],
    server: {
        host: 'local.engity.dev',
        port: 4200,
        https: {
            key: fs.readFileSync('.cache/server.pem'),
            cert: fs.readFileSync('.cache/server.crt'),
        },
    },
});
