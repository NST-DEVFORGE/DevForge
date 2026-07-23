import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// Next 16 dropped `next lint` and ESLint 9 requires flat config, so this
// replaces the former .eslintrc.json. eslint-config-next 16 ships flat config
// directly — FlatCompat is not needed and in fact chokes on it.
export default [
    { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "public/**"] },
    ...coreWebVitals,
    ...typescript,
];
