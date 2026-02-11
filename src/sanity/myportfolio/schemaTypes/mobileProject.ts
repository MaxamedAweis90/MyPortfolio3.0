import { orderRankField } from '@sanity/orderable-document-list';
import type { Rule } from 'sanity';

export default {
  name: 'mobileProject',
  title: 'Mobile Project',
  type: 'document',
  fields: [
    orderRankField({ type: 'mobileProject' }),
    { name: 'title', title: 'Title', type: 'string', validation: (Rule: Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'tools',
      title: 'Tools',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tool' }] }],
    },
    { name: 'description', title: 'Short Description', type: 'text' },
    { name: 'shortTagline', title: 'App Short Tagline', type: 'string' },
    { name: 'playStoreUrl', title: 'Play Store URL', type: 'url' },
    { name: 'appStoreUrl', title: 'App Store URL', type: 'url' },
    { name: 'appIcon', title: 'App Icon', type: 'image', options: { hotspot: false } },
    { name: 'apkFile', title: 'APK File', type: 'file', options: { accept: '.apk' } },
    {
      name: 'screenshots',
      title: 'App Screenshots',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: false } }],
    },
    { name: 'longDescription', title: 'Long Description', type: 'blockContent' },
  ],
};
