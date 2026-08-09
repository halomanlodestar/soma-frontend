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
  metadata?: {
    width?: number | null;
    height?: number | null;
  } | null;
  createdAt: string;
};
