import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { APP_ID, MCP_APPS_SPECIFICATION, translate } from '../src/index.js';

test('single identity and MCP Apps stable version are preserved', async () => {
  const plugin = JSON.parse(await readFile(new URL('../plugin.json', import.meta.url)));
  const contract = JSON.parse(await readFile(new URL('../tool-contract.json', import.meta.url)));
  assert.equal(plugin.pluginId, APP_ID);
  assert.equal(contract.pluginId, APP_ID);
  assert.equal(plugin.mcpApps.specification, MCP_APPS_SPECIFICATION);
  assert.deepEqual(plugin.artifacts, ['common', 'native-cli', 'web-wasm']);
});

test('tool returns the declared ui resource', () => {
  assert.deepEqual(translate({ text: ' hello ' }), {
    pluginId: APP_ID,
    resource: 'ui://fanying/main',
    text: 'hello',
  });
});

test('invalid and whitespace-only input use the Tool Contract error code', () => {
  for (const text of ['', '   ', '\n\t']) {
    assert.throws(() => translate({ text }), (error) => error.code === 'invalid_input');
  }
});

test('UI is a stable MCP App resource without a legacy bridge', async () => {
  const html = await readFile(new URL('../src/ui.html', import.meta.url), 'utf8');
  assert.match(html, /data-mcp-app-specification="2026-01-26"/);
  assert.match(html, /data-resource-uri="ui:\/\/fanying\/main"/);
  assert.doesNotMatch(html, /postMessage|iframe|sessionId|sdk[-_ ]?v1/i);
});
