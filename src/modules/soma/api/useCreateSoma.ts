/** @format */

"use client";

import { useMutation } from "@apollo/client/react";

import { graphql } from "@/gql";
import { getResultErrorMessage } from "@/lib/graphql-errors";

const CreateSomaDocument = graphql(`
  mutation CreateSoma($data: CreateSomaDto!) {
    createSoma(data: $data) {
      __typename
      ... on Soma {
        id
        slug
        name
      }
      ... on InvalidInputError {
        message
      }
    }
  }
`);

export function useCreateSoma() {
  const [createSoma] = useMutation(CreateSomaDocument);

  const submitSoma = async (data: {
    name: string;
    slug: string;
    description: string;
  }) => {
    const result = await createSoma({ variables: { data } });
    const soma = result.data?.createSoma;

    if (!soma || soma.__typename !== "Soma") {
      throw new Error(
        getResultErrorMessage(soma, "We could not create this Soma."),
      );
    }

    return soma;
  };

  return { submitSoma };
}
