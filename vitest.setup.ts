// Setup file for Vitest
// Used to mock Prisma or global variables during Node.js environment tests.

import { vi } from 'vitest'

// Mock Prisma Client to prevent actual database connections during unit tests
vi.mock('@/lib/prisma', () => {
  return {
    prisma: {
      transaction: {
        count: vi.fn(),
        findMany: vi.fn(),
      },
      user: {
        findUnique: vi.fn(),
        update: vi.fn(),
      }
    }
  }
})
