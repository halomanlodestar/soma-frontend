import "dotenv/config";
import type { CodegenConfig } from '@graphql-codegen/cli';

const apiUrl = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000"
).replace(/\/$/, "");

const config: CodegenConfig = {
  schema: `${apiUrl}/graphql`,
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
    './schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
