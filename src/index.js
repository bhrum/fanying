export const APP_ID = 'org.bhrum.fanying';
export const MCP_APPS_SPECIFICATION = '2026-01-26';

export function translate({ text } = {}) {
  if (typeof text !== 'string' || text.length === 0 || text.length > 4000) {
    const error = new Error('text must be a non-empty string up to 4000 characters');
    error.code = 'invalid_input';
    throw error;
  }
  return {
    pluginId: APP_ID,
    resource: 'ui://fanying/main',
    text: text.trim(),
  };
}
