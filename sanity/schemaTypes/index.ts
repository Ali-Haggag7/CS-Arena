import { type SchemaTypeDefinition } from "sanity";
import { author } from "@/sanity/schemaTypes/author";
import { project } from "@/sanity/schemaTypes/project";
import { changelog } from "@/sanity/schemaTypes/changelog";


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, project, changelog],
};