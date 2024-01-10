import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {

      on('before:browser:launch', (browser, browserLaunchOptions) => {
        browserLaunchOptions.args.push('--disable-gpu')
        return browserLaunchOptions
      })

    },
  }
});
