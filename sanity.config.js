import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './src/sanity/env'; // Ensure these are correctly exported
import schemaTypes from './src/sanity/schemaTypes/'; // Correct import for your schema types
import { structure } from './src/sanity/structure'; // Structure for the custom document structure

export default defineConfig({
  projectId, // Your Sanity project ID
  dataset,  // Your dataset name (e.g., 'production')
  schema: {
    types: schemaTypes, // Import your schema types correctly
  },
  plugins: [
    structureTool({ structure }), // Use the custom structure
    visionTool({ defaultApiVersion: apiVersion }), // Vision plugin with API version
  ],
});
