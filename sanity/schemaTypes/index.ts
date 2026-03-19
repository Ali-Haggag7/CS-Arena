import { type SchemaTypeDefinition } from "sanity";
import { author } from "./author";
import { project } from "./project";
import { changelog } from "./changelog";
import { university } from './university'
import { domain } from './domain'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, project, changelog, university, domain],
};