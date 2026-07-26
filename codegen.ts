import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../server/src/schema.gql',
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
  },
};

export default config;
