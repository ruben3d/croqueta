export default {
    entry: 'build/croqueta.js',
    targets: [{
            format: 'umd',
            moduleName: 'CROQUETA',
            dest: 'dist/croqueta.js'
        },
        {
            format: 'es',
            dest: 'dist/croqueta.module.js'
        }
    ]
};