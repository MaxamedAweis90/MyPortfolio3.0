// schemas/tool.js

export default {
	name: 'tool',
	title: 'Tool',
	type: 'document',
	fields: [
	  {
		name: 'title',
		title: 'Tool Name',
		type: 'string',
		validation: Rule => Rule.required()
	  },
	  {
		name: 'icon',
		title: 'React Icon Name (e.g., SiNextdotjs, FaGithub)',
		type: 'string',
		validation: Rule => Rule.required()
	  }
	],
	preview: {
	  select: {
		title: 'title',
		subtitle: 'icon'
	  }
	}
  }
  