// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const webpack = require("webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const process = require("process");

const monacoWebpackPlugin = new MonacoWebpackPlugin({
    // features: [],
    // languages: [],
    customLanguages: [
        {
            label: "mysql",
            entry: "monaco-sql-languages/out/esm/mysql/mysql.contribution",
            worker: {
                id: "monaco-sql-languages/out/esm/mysql/mySQLWorker",
                entry: "monaco-sql-languages/out/esm/mysql/mysql.worker",
            },
        },
        {
            label: "flinksql",
            entry: "monaco-sql-languages/out/esm/flinksql/flinksql.contribution",
            worker: {
                id: "monaco-sql-languages/out/esm/flinksql/flinkSQLWorker",
                entry: "monaco-sql-languages/out/esm/flinksql/flinksql.worker",
            },
        },
        {
            label: "sparksql",
            entry: "monaco-sql-languages/out/esm/sparksql/sparksql.contribution",
            worker: {
                id: "monaco-sql-languages/out/esm/sparksql/sparkSQLWorker",
                entry: "monaco-sql-languages/out/esm/sparksql/sparksql.worker",
            },
        },
        {
            label: "hivesql",
            entry: "monaco-sql-languages/out/esm/hivesql/hivesql.contribution",
            worker: {
                id: "monaco-sql-languages/out/esm/hivesql/hiveSQLWorker",
                entry: "monaco-sql-languages/out/esm/hivesql/hivesql.worker",
            },
        },
        {
            label: "trinosql",
            entry: "monaco-sql-languages/out/esm/trinosql/trinosql.contribution",
            worker: {
                id: "monaco-sql-languages/out/esm/trinosql/TrinoSQLWorker",
                entry: "monaco-sql-languages/out/esm/trinosql/trinosql.worker",
            },
        },
        {
            label: "pgsql",
            entry: "monaco-sql-languages/out/esm/pgsql/pgsql.contribution",
            worker: {
                id: "monaco-sql-languages/out/esm/pgsql/PgSQLWorker",
                entry: "monaco-sql-languages/out/esm/pgsql/pgsql.worker",
            },
        },
        {
            label: "impalasql",
            entry: "monaco-sql-languages/out/esm/impalasql/impalasql.contribution",
            worker: {
                id: "monaco-sql-languages/out/esm/impalasql/impalaSQLWorker",
                entry: "monaco-sql-languages/out/esm/impalasql/impalasql.worker",
            },
        },
    ],
});

// eslint-disable-next-line no-undef
module.exports = {
    webpack: {
        plugins: [
            new webpack.DefinePlugin({
                "process.env.NODE_DEBUG": process.env.NODE_DEBUG,
            }),
            monacoWebpackPlugin,
        ],
    },
};
