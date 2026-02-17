import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Register happy-dom BEFORE any testing-library modules evaluate
// (they check for `document` at module load time)
GlobalRegistrator.register();

// Dynamic imports ensure these run after the DOM is available
const { expect, afterEach } = await import('bun:test');
const matchers = await import('@testing-library/jest-dom/matchers');
const { cleanup } = await import('@testing-library/react');

expect.extend(matchers);

// Clean up DOM after each test — happy-dom doesn't auto-reset
afterEach(() => {
  cleanup();
});
