import { Types } from "mongoose";

import Folder from "../models/folder.model.js";
import UserCourse from "../models/userCourse.model.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";

/**
 * Folders for one account, each with the number of courses filed inside it.
 *
 * The counts are gathered in a single aggregation over the user's courses
 * rather than one query per folder, so the sidebar still costs two round trips
 * no matter how many folders exist.
 */
export const getFolders = async (userId: string) => {
  const folders = await Folder.find({
    owner: userId,
  })
    .sort({ name: 1 })
    .lean();

  const counts = await UserCourse.aggregate<{
    _id: unknown;
    count: number;
  }>([
    {
      $match: {
        owner: new Types.ObjectId(userId),
        folder: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$folder",
        count: { $sum: 1 },
      },
    },
  ]);

  const countByFolder = new Map(
    counts.map((entry) => [String(entry._id), entry.count])
  );

  return folders.map((folder) => ({
    ...folder,
    courseCount: countByFolder.get(String(folder._id)) ?? 0,
  }));
};

export const createFolder = async (
  userId: string,
  data: {
    name: string;
    color?: string;
  }
) => {
  const existing = await Folder.findOne({
    owner: userId,
    name: data.name,
  });

  if (existing) {
    throw new BadRequestError("A folder with that name already exists");
  }

  return Folder.create({
    owner: userId,
    name: data.name,
    color: data.color,
  });
};

const findOwnedFolder = async (
  userId: string,
  folderId: string
) => {
  const folder = await Folder.findOne({
    _id: folderId,
    owner: userId,
  });

  if (!folder) {
    throw new NotFoundError("Folder not found");
  }

  return folder;
};

export const updateFolder = async (
  userId: string,
  folderId: string,
  data: {
    name?: string;
    color?: string;
  }
) => {
  const folder = await findOwnedFolder(userId, folderId);

  if (data.name && data.name !== folder.name) {
    const clash = await Folder.findOne({
      owner: userId,
      name: data.name,
    });

    if (clash) {
      throw new BadRequestError("A folder with that name already exists");
    }
  }

  Object.assign(folder, data);

  await folder.save();

  return folder;
};

/**
 * Deletes a folder without deleting its contents.
 *
 * Deleting a folder is a filing decision, not a decision to lose courses, so
 * the courses inside are moved back to "Uncategorised" instead of being
 * removed alongside it.
 */
export const deleteFolder = async (
  userId: string,
  folderId: string
) => {
  const folder = await findOwnedFolder(userId, folderId);

  await UserCourse.updateMany(
    {
      owner: userId,
      folder: folder._id,
    },
    {
      $set: {
        folder: null,
      },
    }
  );

  await folder.deleteOne();

  return {
    folderId,
  };
};
