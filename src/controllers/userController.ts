import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: req.body,
  });

  ApiResponse.created(res, user, 'User created successfully');
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  ApiResponse.success(res, users, 'Users fetched successfully');
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return new AppError(`Invalid userId param type! Expected UUID but got ${typeof id}`, 400);
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    ApiResponse.notFound(res, 'User not found');
    return;
  }
  ApiResponse.success(res, user, 'User fetched successfully');
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== 'string') {
    return new AppError(`Invalid userId param type! Expected UUID but got ${typeof id}`, 400);
  }
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: req.body,
  });
  if (!user) {
    ApiResponse.notFound(res);
    return;
  }
  ApiResponse.success(res, user, 'User updated successfully');
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== 'string') {
    return new AppError(`Invalid userId param type! Expected UUID but got ${typeof id}`, 400);
  }
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  if (!user) {
    ApiResponse.notFound(res, 'User not found');
    return;
  }
  ApiResponse.success(res, user, 'User deleted successfully');
});
