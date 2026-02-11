// sanity.cli.js
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'yf7fdygw',
    dataset: 'production',
  },
  studioHost: 'engaweis',
  deployment: {
    autoUpdates: true,
  },
})
