import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Explicitly load .env.local

import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { structureTool } from 'sanity/structure';
import schemaTypes from './src/sanity/myportfolio/schemaTypes';
import { structure } from './src/sanity/myportfolio/structure';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = '2024-07-01'; // Or your actual API version

export default defineConfig({
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
