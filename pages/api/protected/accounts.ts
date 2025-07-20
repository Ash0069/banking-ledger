import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (req.method === 'POST') {
    const { accountType } = req.body;

    if (!accountType) {
      return res.status(400).json({ message: 'Account type is required' });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const account = await prisma.account.create({
        data: {
          id: uuidv4(),
          userId,
          accountType,
          balance: 0.00,
          status: 'Active',
        },
      });

      res.status(201).json({ message: 'Account created', account });
    } catch (error) {
      console.error('Account creation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
    try {
      const accounts = await prisma.account.findMany({
        where: { userId },
      });

      res.status(200).json({ accounts });
    } catch (error) {
      console.error('Account retrieval error:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}