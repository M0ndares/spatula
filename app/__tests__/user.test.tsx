import { registerUser } from '../actions/userDb';
import { createClient } from '../db/server';
import { db } from '../db';

jest.mock('../db/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('../db', () => ({
  db: {
    insert: jest.fn(),
  },
}));

describe('registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('must insert an user to the database', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({
      data: { user: { id: 'user-id-123' } },
      error: null,
    });

    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        signUp: mockSignUp,
      },
    });

    const mockValues = jest.fn().mockResolvedValue(true);
    (db.insert as jest.Mock).mockReturnValue({
      values: mockValues,
    });

    const result = await registerUser('test@example.com', 'password123', 'SpatulaUser');

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(mockValues).toHaveBeenCalledWith({
      id: 'user-id-123',
      name: 'SpatulaUser',
      isActive: false,
      category: 'Spatula master',
      });

    expect(result).toEqual({ success: true, error: null });
  });

  test('must return an error', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({
      data: { user: null },
      error: { message: 'This email has already been used.' },
    });

    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        signUp: mockSignUp,
      },
    });

    const result = await registerUser('test@example.com', 'password123', 'SpatulaUser');

    expect(db.insert).not.toHaveBeenCalled();

    expect(result).toEqual({
      success: false,
      error: 'This email has already been used.',
    });
  });
});