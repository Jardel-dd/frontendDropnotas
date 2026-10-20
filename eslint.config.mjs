import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
    ...nextVitals,
    {
        rules: {
            '@next/next/no-img-element': 'off',
            // Estas verificacoes do React Compiler foram introduzidas pelo Next 16.
            // O codigo atual ainda usa os padroes anteriores; mantemos o comportamento
            // do lint existente ate que essa migracao seja feita por componente.
            'react-hooks/immutability': 'off',
            'react-hooks/refs': 'off',
            'react-hooks/set-state-in-effect': 'off'
        }
    },
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])
]);
