// sanity.cli.js
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'yf7fdygw',     // 👈 Your actual project ID
    dataset: 'production'      // 👈 Your dataset
  },
  studioHost: 'engaweis-studio',
  autoUpdates: true
})
