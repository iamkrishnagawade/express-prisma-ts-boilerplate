import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: req.body,
  });

  ApiResponse.created(res, user, "User created successfully");
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  ApiResponse.success(res, users, "Users fetched successfully");
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const userId = String(req.params.id);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    ApiResponse.notFound(res);
    return;
  }
  ApiResponse.success(res, user, "User fetched successfully");
});