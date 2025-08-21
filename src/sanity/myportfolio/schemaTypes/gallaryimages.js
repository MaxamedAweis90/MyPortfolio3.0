export default {
	name: 'galleryimages',
	title: 'Gallery Events',
	type: 'document',
	fields: [
	  {
		name: 'title',
		title: 'Event Title',
		type: 'string',
	  },
	  {
		name: 'description',
		title: 'Description',
		type: 'text',
	  },
	  {
		name: 'images',
		title: 'Images',
		type: 'array',
		of: [
		  {
			type: 'image',
			options: {
			  hotspot: true,
			},
		  },
		],
	  },
	  {
		name: 'createdAt',
		title: 'Created At',
		type: 'datetime',
		readOnly: true,
		initialValue: () => new Date().toISOString(),
	  },
	],
  };
  