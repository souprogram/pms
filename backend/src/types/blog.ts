export type Blog = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  category: string;
  author_id: string;
  author: string;
  created_at: string;
  updated_at: string | null;
  content: string;
  hashtags: string[];
};
