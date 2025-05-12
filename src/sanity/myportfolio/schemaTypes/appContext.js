// schemas/appContext.js

export default {
  name: 'appContext',
  title: 'App Context / Site Settings',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Your Name or Brand Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'siteUrl',
      title: 'Website URL',
      type: 'url',
      validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] })
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string'
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string'
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url'
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'url'
        },
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url'
        }
      ]
    },
    {
      name: 'resume',
      title: 'Resume (CV) Link',
      type: 'url'
    }
  ]
}
