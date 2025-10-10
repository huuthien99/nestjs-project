import { NodeVM } from 'vm2';
import puppeteer from 'puppeteer';

export async function runSandbox(script: string) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();

  const vm = new NodeVM({
    console: 'inherit',
    sandbox: { browser, page },
    require: { external: true },
    wrapper: 'commonjs',
  });

  try {
    const wrappedScript = `
      module.exports = (async () => {
        try {
          ${script}
        } catch (err) {
          console.error("Flow runtime error:", err);
          throw err;
        }
      })();
    `;

    const result = vm.run(wrappedScript, 'vm.js');

    await result;
  } catch (err) {
    console.error('VM error:', err);
  } finally {
    await browser.close();
  }
}
