// Loads Pyodide for Node tests. Pass indexURL explicitly: inside the test runner Pyodide's own guess of where its
// files live can be wrong (it worked locally but resolved to node_modules/src/js/ on CI).
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { loadPyodide } from 'pyodide';

const require = createRequire(import.meta.url);
export const loadPython = () => loadPyodide({ indexURL: dirname(require.resolve('pyodide/package.json')) + '/' });
