/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetCommentsByPost($postId: String!) {\n    getCommentsByPost(postId: $postId) {\n      id\n      postId\n      parentCommentId\n      content\n      voteCount\n      userVoteValue\n      createdAt\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n      }\n    }\n  }\n": typeof types.GetCommentsByPostDocument,
    "\n  query GetCommentsByUser($userId: String!) {\n    getCommentsByUser(userId: $userId) {\n      id\n      postId\n      parentCommentId\n      content\n      voteCount\n      userVoteValue\n      createdAt\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n      }\n    }\n  }\n": typeof types.GetCommentsByUserDocument,
    "\n  query GetPostById($id: String!) {\n    getPostById(id: $id) {\n      __typename\n      ... on Post {\n        id\n        title\n        excerpt\n        body\n        mediaUrl\n        createdAt\n        voteCount\n        userVoteValue\n        commentCount\n        soma {\n          name\n          slug\n        }\n        author {\n          displayName\n          username\n          avatarUrl\n          isVerified\n          bio\n          stats {\n            posts\n            comments\n          }\n          awards\n        }\n      }\n    }\n  }\n": typeof types.GetPostByIdDocument,
    "\n  query GetGlobalFeed {\n    getGlobalFeed {\n      id\n      title\n      excerpt\n      mediaUrl\n      createdAt\n      voteCount\n      userVoteValue\n      commentCount\n      soma {\n        name\n        slug\n      }\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n        stats {\n          posts\n          comments\n        }\n        awards\n      }\n    }\n  }\n": typeof types.GetGlobalFeedDocument,
    "\n  query GetPostsByUser($userId: String!) {\n    getPostsByUser(userId: $userId) {\n      id\n      title\n      excerpt\n      body\n      mediaUrl\n      createdAt\n      voteCount\n      userVoteValue\n      commentCount\n      soma {\n        name\n        slug\n      }\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n        bio\n        stats {\n          posts\n          comments\n        }\n        awards\n      }\n    }\n  }\n": typeof types.GetPostsByUserDocument,
    "\n  mutation UpsertVote($data: CreateVoteDto!) {\n    upsertVote(data: $data)\n  }\n": typeof types.UpsertVoteDocument,
    "\n  mutation RemoveVote($data: DeleteVoteDto!) {\n    removeVote(data: $data)\n  }\n": typeof types.RemoveVoteDocument,
    "\n  query GetSomaBySlug($slug: String!) {\n    getSomaBySlug(slug: $slug) {\n      __typename\n      ... on Soma {\n        id\n        name\n        slug\n        description\n        memberCount\n        weeklyVisitorCount\n        coverUrl\n      }\n    }\n  }\n": typeof types.GetSomaBySlugDocument,
    "\n  query GetAllSomas {\n    getAllSomas {\n      id\n      name\n      slug\n      description\n      memberCount\n      weeklyVisitorCount\n      coverUrl\n    }\n  }\n": typeof types.GetAllSomasDocument,
    "\n  query GetMe {\n    me {\n      __typename\n      ... on UserResponseDto {\n        id\n        displayName\n        username\n        avatarUrl\n        role\n        isVerified\n      }\n    }\n  }\n": typeof types.GetMeDocument,
    "\n  query GetUserByUsername($username: String!) {\n    userByUsername(username: $username) {\n      __typename\n      ... on UserResponseDto {\n        id\n        displayName\n        username\n        avatarUrl\n        coverUrl\n        bio\n        isVerified\n        createdAt\n        stats {\n          posts\n          comments\n          followers\n          following\n        }\n        awards\n      }\n    }\n  }\n": typeof types.GetUserByUsernameDocument,
};
const documents: Documents = {
    "\n  query GetCommentsByPost($postId: String!) {\n    getCommentsByPost(postId: $postId) {\n      id\n      postId\n      parentCommentId\n      content\n      voteCount\n      userVoteValue\n      createdAt\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n      }\n    }\n  }\n": types.GetCommentsByPostDocument,
    "\n  query GetCommentsByUser($userId: String!) {\n    getCommentsByUser(userId: $userId) {\n      id\n      postId\n      parentCommentId\n      content\n      voteCount\n      userVoteValue\n      createdAt\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n      }\n    }\n  }\n": types.GetCommentsByUserDocument,
    "\n  query GetPostById($id: String!) {\n    getPostById(id: $id) {\n      __typename\n      ... on Post {\n        id\n        title\n        excerpt\n        body\n        mediaUrl\n        createdAt\n        voteCount\n        userVoteValue\n        commentCount\n        soma {\n          name\n          slug\n        }\n        author {\n          displayName\n          username\n          avatarUrl\n          isVerified\n          bio\n          stats {\n            posts\n            comments\n          }\n          awards\n        }\n      }\n    }\n  }\n": types.GetPostByIdDocument,
    "\n  query GetGlobalFeed {\n    getGlobalFeed {\n      id\n      title\n      excerpt\n      mediaUrl\n      createdAt\n      voteCount\n      userVoteValue\n      commentCount\n      soma {\n        name\n        slug\n      }\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n        stats {\n          posts\n          comments\n        }\n        awards\n      }\n    }\n  }\n": types.GetGlobalFeedDocument,
    "\n  query GetPostsByUser($userId: String!) {\n    getPostsByUser(userId: $userId) {\n      id\n      title\n      excerpt\n      body\n      mediaUrl\n      createdAt\n      voteCount\n      userVoteValue\n      commentCount\n      soma {\n        name\n        slug\n      }\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n        bio\n        stats {\n          posts\n          comments\n        }\n        awards\n      }\n    }\n  }\n": types.GetPostsByUserDocument,
    "\n  mutation UpsertVote($data: CreateVoteDto!) {\n    upsertVote(data: $data)\n  }\n": types.UpsertVoteDocument,
    "\n  mutation RemoveVote($data: DeleteVoteDto!) {\n    removeVote(data: $data)\n  }\n": types.RemoveVoteDocument,
    "\n  query GetSomaBySlug($slug: String!) {\n    getSomaBySlug(slug: $slug) {\n      __typename\n      ... on Soma {\n        id\n        name\n        slug\n        description\n        memberCount\n        weeklyVisitorCount\n        coverUrl\n      }\n    }\n  }\n": types.GetSomaBySlugDocument,
    "\n  query GetAllSomas {\n    getAllSomas {\n      id\n      name\n      slug\n      description\n      memberCount\n      weeklyVisitorCount\n      coverUrl\n    }\n  }\n": types.GetAllSomasDocument,
    "\n  query GetMe {\n    me {\n      __typename\n      ... on UserResponseDto {\n        id\n        displayName\n        username\n        avatarUrl\n        role\n        isVerified\n      }\n    }\n  }\n": types.GetMeDocument,
    "\n  query GetUserByUsername($username: String!) {\n    userByUsername(username: $username) {\n      __typename\n      ... on UserResponseDto {\n        id\n        displayName\n        username\n        avatarUrl\n        coverUrl\n        bio\n        isVerified\n        createdAt\n        stats {\n          posts\n          comments\n          followers\n          following\n        }\n        awards\n      }\n    }\n  }\n": types.GetUserByUsernameDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCommentsByPost($postId: String!) {\n    getCommentsByPost(postId: $postId) {\n      id\n      postId\n      parentCommentId\n      content\n      voteCount\n      userVoteValue\n      createdAt\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCommentsByPost($postId: String!) {\n    getCommentsByPost(postId: $postId) {\n      id\n      postId\n      parentCommentId\n      content\n      voteCount\n      userVoteValue\n      createdAt\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCommentsByUser($userId: String!) {\n    getCommentsByUser(userId: $userId) {\n      id\n      postId\n      parentCommentId\n      content\n      voteCount\n      userVoteValue\n      createdAt\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCommentsByUser($userId: String!) {\n    getCommentsByUser(userId: $userId) {\n      id\n      postId\n      parentCommentId\n      content\n      voteCount\n      userVoteValue\n      createdAt\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPostById($id: String!) {\n    getPostById(id: $id) {\n      __typename\n      ... on Post {\n        id\n        title\n        excerpt\n        body\n        mediaUrl\n        createdAt\n        voteCount\n        userVoteValue\n        commentCount\n        soma {\n          name\n          slug\n        }\n        author {\n          displayName\n          username\n          avatarUrl\n          isVerified\n          bio\n          stats {\n            posts\n            comments\n          }\n          awards\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPostById($id: String!) {\n    getPostById(id: $id) {\n      __typename\n      ... on Post {\n        id\n        title\n        excerpt\n        body\n        mediaUrl\n        createdAt\n        voteCount\n        userVoteValue\n        commentCount\n        soma {\n          name\n          slug\n        }\n        author {\n          displayName\n          username\n          avatarUrl\n          isVerified\n          bio\n          stats {\n            posts\n            comments\n          }\n          awards\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGlobalFeed {\n    getGlobalFeed {\n      id\n      title\n      excerpt\n      mediaUrl\n      createdAt\n      voteCount\n      userVoteValue\n      commentCount\n      soma {\n        name\n        slug\n      }\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n        stats {\n          posts\n          comments\n        }\n        awards\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetGlobalFeed {\n    getGlobalFeed {\n      id\n      title\n      excerpt\n      mediaUrl\n      createdAt\n      voteCount\n      userVoteValue\n      commentCount\n      soma {\n        name\n        slug\n      }\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n        stats {\n          posts\n          comments\n        }\n        awards\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPostsByUser($userId: String!) {\n    getPostsByUser(userId: $userId) {\n      id\n      title\n      excerpt\n      body\n      mediaUrl\n      createdAt\n      voteCount\n      userVoteValue\n      commentCount\n      soma {\n        name\n        slug\n      }\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n        bio\n        stats {\n          posts\n          comments\n        }\n        awards\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPostsByUser($userId: String!) {\n    getPostsByUser(userId: $userId) {\n      id\n      title\n      excerpt\n      body\n      mediaUrl\n      createdAt\n      voteCount\n      userVoteValue\n      commentCount\n      soma {\n        name\n        slug\n      }\n      author {\n        displayName\n        username\n        avatarUrl\n        isVerified\n        bio\n        stats {\n          posts\n          comments\n        }\n        awards\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpsertVote($data: CreateVoteDto!) {\n    upsertVote(data: $data)\n  }\n"): (typeof documents)["\n  mutation UpsertVote($data: CreateVoteDto!) {\n    upsertVote(data: $data)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveVote($data: DeleteVoteDto!) {\n    removeVote(data: $data)\n  }\n"): (typeof documents)["\n  mutation RemoveVote($data: DeleteVoteDto!) {\n    removeVote(data: $data)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSomaBySlug($slug: String!) {\n    getSomaBySlug(slug: $slug) {\n      __typename\n      ... on Soma {\n        id\n        name\n        slug\n        description\n        memberCount\n        weeklyVisitorCount\n        coverUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSomaBySlug($slug: String!) {\n    getSomaBySlug(slug: $slug) {\n      __typename\n      ... on Soma {\n        id\n        name\n        slug\n        description\n        memberCount\n        weeklyVisitorCount\n        coverUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllSomas {\n    getAllSomas {\n      id\n      name\n      slug\n      description\n      memberCount\n      weeklyVisitorCount\n      coverUrl\n    }\n  }\n"): (typeof documents)["\n  query GetAllSomas {\n    getAllSomas {\n      id\n      name\n      slug\n      description\n      memberCount\n      weeklyVisitorCount\n      coverUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMe {\n    me {\n      __typename\n      ... on UserResponseDto {\n        id\n        displayName\n        username\n        avatarUrl\n        role\n        isVerified\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      __typename\n      ... on UserResponseDto {\n        id\n        displayName\n        username\n        avatarUrl\n        role\n        isVerified\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserByUsername($username: String!) {\n    userByUsername(username: $username) {\n      __typename\n      ... on UserResponseDto {\n        id\n        displayName\n        username\n        avatarUrl\n        coverUrl\n        bio\n        isVerified\n        createdAt\n        stats {\n          posts\n          comments\n          followers\n          following\n        }\n        awards\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserByUsername($username: String!) {\n    userByUsername(username: $username) {\n      __typename\n      ... on UserResponseDto {\n        id\n        displayName\n        username\n        avatarUrl\n        coverUrl\n        bio\n        isVerified\n        createdAt\n        stats {\n          posts\n          comments\n          followers\n          following\n        }\n        awards\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;