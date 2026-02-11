// schemas/index.js
import webProject from './webProject';
import mobileProject from './mobileProject';
import designProject from './designProject';
import tool from './tool';
import blockContent from './blockContent';
import certificates from './certificates';
import images_bucket from './images_bucket';
import appContext from './appContext';
import category from './category';
import galleryimages from './gallaryimages';
import type { SchemaTypeDefinition } from 'sanity';

const schemaTypes: SchemaTypeDefinition[] = [
	webProject,
	mobileProject,
	designProject,
	tool,
	blockContent,
	certificates,
	images_bucket,
	appContext,
	category,
	galleryimages,
];

export default schemaTypes;
