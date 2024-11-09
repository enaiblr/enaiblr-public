import { registerRuntime } from 'next-pwa';

const runtime = await registerRuntime('service-worker');
if ('caches' in window) {
  await runtime.createHandler();
}
