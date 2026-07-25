import { render, screen } from '@testing-library/react';
import MenuSpatula from '../components/menuSpatula';

describe('<NA />', () => {
  it('muestra un mensaje amigable cuando la lista de marcadores está vacía', () => {

    render(<MenuSpatula onSelectRecipe={jest.fn().mockResolvedValue({ id: '1', name: 'Tacos al Pastor', ingredients: [], steps: [] })}/>);

    const emptyMessage = screen.getByText(/egg/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});