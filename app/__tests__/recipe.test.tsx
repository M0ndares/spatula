import { registerRecipe } from "../actions/recipesDb";
import { db } from '../db';

jest.mock('../db', () => ({
  db: {
    insert: jest.fn(),
  },
}));

describe('registerRecipe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('must insert a new recipe into the database', async () => {
    const expectedRecipe = [{
        id: '1234',
        name: 'Alfredo pasta', 
        ingredients: '200g pasta, 1 onion, 1 chicken breast, 1 head of broccoli, 300g cream',
        steps: '1. Boil the pasta until al dente \n 2. Chop the broccoli and let it boil until softened \n 3. Slice the chicken breasts and the onion in small pieces \n 4. Put some oil on a pan and cook the chicken and the onion until brownish \n 5. Add the cream and mix until liquid \n 6. Integrate the pasta and broccoli'
    }]

    const mockRaw = jest.fn().mockResolvedValue(expectedRecipe);

    const mockValues = jest.fn().mockReturnValue({
        returning: mockRaw,
    });

    (db.insert as jest.Mock).mockReturnValue({
      values: mockValues,
    });

    const result = await registerRecipe(
      '1. Boil the pasta until al dente \n 2. Chop the broccoli and let it boil until softened \n 3. Slice the chicken breasts and the onion in small pieces \n 4. Put some oil on a pan and cook the chicken and the onion until brownish \n 5. Add the cream and mix until liquid \n 6. Integrate the pasta and broccoli',
      'Alfredo pasta',
      '200g pasta, 1 onion, 1 chicken breast, 1 head of broccoli, 300g cream'
    );

    expect(mockValues).toHaveBeenCalledWith({
      name: 'Alfredo pasta',
      ingredients: '200g pasta, 1 onion, 1 chicken breast, 1 head of broccoli, 300g cream',
      steps: '1. Boil the pasta until al dente \n 2. Chop the broccoli and let it boil until softened \n 3. Slice the chicken breasts and the onion in small pieces \n 4. Put some oil on a pan and cook the chicken and the onion until brownish \n 5. Add the cream and mix until liquid \n 6. Integrate the pasta and broccoli'
    });

    expect(result).toEqual({ success: true, returnRecipe: expectedRecipe[0] });
  });
});