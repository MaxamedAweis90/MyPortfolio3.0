// sanity.config.js
import { defineConfig } from 'sanity'
import { visionTool } from '@sanity/vision'
import { structureTool } from 'sanity/structure'
import schemaTypes from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  projectId: 'yf7fdygw',
  dataset: 'production',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2025-05-02' }),
  ],
})
