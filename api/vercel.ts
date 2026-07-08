import serverModule from './server_bundle.cjs';

// Vercel Node.js runtime expects the default export to be the handler
const handler = typeof serverModule === 'function' ? serverModule : (serverModule as any).default || serverModule;

export default handler;
