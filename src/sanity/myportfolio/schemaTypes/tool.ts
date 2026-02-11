// schemas/tool.js
import type { Rule } from 'sanity'

export default {
	name: 'tool',
	title: 'Tool',
	type: 'document',
	fields: [
	  {
		name: 'title',
		title: 'Tool Name',
		type: 'string',
		validation: (Rule: Rule) => Rule.required()
	  },
	  {
		name: 'icon',
		title: 'React Icon Name (e.g., SiNextdotjs)',
		type: 'string',
		validation: (Rule: Rule) => Rule.required()
	  },
	  {
		name: 'color',
		title: 'Tailwind or HEX Color (e.g., text-blue-500 or #1e90ff)',
		type: 'string',
		validation: (Rule: Rule) => Rule.required()
	  }
	],
	preview: {
	  select: {
		title: 'title',
		subtitle: 'icon'
	  }
	}
  };
  