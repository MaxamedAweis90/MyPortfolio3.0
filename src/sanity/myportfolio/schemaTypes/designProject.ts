import { orderRankField } from '@sanity/orderable-document-list';
import type { Rule } from 'sanity';

export default {
  name: 'designProject',
  title: 'Design Project',
  type: 'document',
  fields: [
    orderRankField({ type: 'designProject' }),
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
    { name: 'images', title: 'Gallery Images', type: 'array', of: [{ type: 'image', options: { hotspot: false } }] },
    { name: 'liveProjectUrl', title: 'Live Project URL', type: 'url' },
  ],
};
