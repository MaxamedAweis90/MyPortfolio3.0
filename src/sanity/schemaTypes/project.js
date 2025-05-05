export default {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
      { name: 'title',       title: 'Title',           type: 'string', validation: Rule => Rule.required() },
      { name: 'slug',        title: 'Slug',            type: 'slug',   options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() },
      { name: 'category',    title: 'Category',        type: 'string', options: { list: ['Web','Mobile','Design'] }, validation: Rule => Rule.required() },
      { name: 'label',       title: 'Label',           type: 'string', options: { list: ['Latest','Hot 🔥'] } },
      { name: 'description', title: 'Short Description',type: 'text' },
      { name: 'longDescription', title: 'Long Description', type: 'blockContent' },
      { name: 'date',        title: 'Date',            type: 'date',   options: { dateFormat: 'MMMM YYYY' } },
      { name: 'duration',    title: 'Duration',        type: 'string' },
      { name: 'team',        title: 'Team Members',    type: 'array',  of: [{ type: 'string' }] },
      { name: 'images',      title: 'Images',          type: 'array',  of: [{ type: 'image', options: { hotspot: true } }] },
      { name: 'video',       title: 'Video URL',       type: 'url' }
    ]
  }