import { type SchemaTypeDefinition } from "sanity";
import { author } from "@/sanity/schemaTypes/author";
import { project } from "@/sanity/schemaTypes/project";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, project],
};