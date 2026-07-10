export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;

  avatar?: {
    url: string;
    publicId: string;
  };

  createdAt: string;
  updatedAt: string;
}