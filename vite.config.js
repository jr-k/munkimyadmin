import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import react from '@vitejs/plugin-react';

const devServerHost = process.env.VITE_DEV_SERVER_HOST ?? 'localhost';
const devServerPort = Number(process.env.VITE_DEV_SERVER_PORT ?? 4173);

function styledComponentDomClassNames() {
    const styledExportPattern = /^export const ([A-Za-z_$][\w$]*) = (styled(?:\.[A-Za-z_$][\w$]*|\([^)]+\)))/gm;

    return {
        name: 'munkitop-styled-component-dom-class-names',
        enforce: 'pre',
        transform(code, id) {
            if (!id.includes('/resources/js/') || !id.endsWith('/styled.ts')) {
                return null;
            }

            const transformed = code.replace(
                styledExportPattern,
                "export const $1 = $2.attrs({ className: '$1' })"
            );

            return transformed === code ? null : transformed;
        },
    };
}

export default defineConfig({
    plugins: [
        styledComponentDomClassNames(),
        laravel({
            input: ['resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        react({
            include: /resources\/js\/.*\.[tj]sx?$/,
            babel: {
                plugins: [
                    [
                        'babel-plugin-styled-components',
                        {
                            displayName: true,
                            fileName: false,
                        },
                    ],
                ],
            },
        }),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        origin: `http://${devServerHost}:${devServerPort}`,
        cors: true,
        hmr: {
            host: devServerHost,
            clientPort: devServerPort,
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
