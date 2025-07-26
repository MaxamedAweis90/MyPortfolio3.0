import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { structureTool } from 'sanity/structure';
import schemaTypes from './src/sanity/myportfolio/schemaTypes';
import { structure } from './src/sanity/myportfolio/structure';
import { projectId, dataset } from './env'; // 🔑 Import the pre-parsed values

export default defineConfig({
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2024-07-01' }),
  ],
});
