import { orderRankField } from '@sanity/orderable-document-list';
import type { Rule } from 'sanity';

export default {
  name: 'webProject',
  title: 'Web Project',
  type: 'document',
  fields: [
    orderRankField({ type: 'webProject' }),
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
    { name: 'longDescription', title: 'Long Description', type: 'blockContent' },
    { name: 'date', title: 'Date', type: 'date', options: { dateFormat: 'MMMM YYYY' } },
    { name: 'duration', title: 'Duration', type: 'string' },
    { name: 'team', title: 'Team Members', type: 'array', of: [{ type: 'string' }] },
    { name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: false } }] },
    { name: 'video', title: 'Video URL', type: 'url' },
    { name: 'liveProjectUrl', title: 'Live Project URL', type: 'url' },
  ],
};
