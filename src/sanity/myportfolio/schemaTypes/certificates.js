export default {
  name: 'certificate',
  title: 'Certificate',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'issuer',
      title: 'Issuer',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'issuedDate',
      title: 'Issued Date',
      type: 'date',
      description: 'The date this certificate was issued',
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Web', value: 'Web' },
          { title: 'Mobile', value: 'Mobile' },
          { title: 'Design', value: 'Design' },
        ],
        layout: 'dropdown', // This will make it a dropdown
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'imageRef',
      title: 'Certificate Image',
      type: 'reference',
      to: [{ type: 'imageFile' }],
      description: 'Pick your certificate image from the bucket',
      validation: Rule => Rule.required(),
    },
    {
      name: 'link',
      title: 'Certificate Link',
      type: 'url',
      description: 'Public link to view the certificate',
    },
    {
      name: 'verificationUrl',
      title: 'Verification URL',
      type: 'url',
      description: 'Link to verify certificate authenticity',
    },
    {
      name: 'verificationCode',
      title: 'Verification Code',
      type: 'string',
      description: 'Enter the unique verification code for this certificate.',
      validation: Rule => Rule.optional(),
    },
    {
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      hidden: true,
      readOnly: true,
    },
  ],
  orderings: [
    {
      title: 'Order by Rank',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
};
