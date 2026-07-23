/** @format */

export type Soma = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MediaItem = {
  id: string;
  type: string;
  originalUrl: string;
  createdAt: string;
};
