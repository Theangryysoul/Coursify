import { api } from "./axios";

export const getCurrentUser = async () => {
  const { data } = await api.get("/users/me");
  return data.data;
};

export const updateProfile = async (
  payload: {
    name: string;
    bio?: string;
  }
) => {
  const { data } = await api.patch(
    "/users/profile",
    payload
  );

  return data.data;
};

export const uploadAvatar = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("image", file);

  const { data } = await api.patch(
    "/users/avatar",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return data.data;
};

export const deleteAvatar = async () => {
  const { data } = await api.delete(
    "/users/avatar"
  );

  return data.data;
};