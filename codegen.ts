import "dotenv/config";
import type { CodegenConfig } from '@graphql-codegen/cli';

const schemaUrl = process.env.CODEGEN_SCHEMA_URL?.replace(/\/$/, "");

// Codegen must not depend on GraphQL introspection being enabled on the runtime
// API. Use the committed contract by default; opt into an introspection-enabled
// endpoint only when intentionally refreshing that contract.
const schema = schemaUrl ? `${schemaUrl}/graphql` : './schema.graphql';

const config: CodegenConfig = {
  schema,
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true, // For better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
      config: {
        scalars: {
          DateTime: 'string',
        },
      },
    },
    ...(schemaUrl
      ? {
          './schema.graphql': {
            plugins: ['schema-ast'],
          },
        }
      : {}),
  },
};

export default config;
