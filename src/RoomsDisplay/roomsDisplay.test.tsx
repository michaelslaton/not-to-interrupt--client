import { render, screen } from "@testing-library/react";
import RoomsDisplay from "./RoomsDisplay";
import userEvent from "@testing-library/user-event";

describe('RoomsDisplay', () => {
  it('App title displays properly.', () => {
    render(<RoomsDisplay />);
  });

  it('Renders all elements properly', () => {
    render(<RoomsDisplay />);
    const button = screen.getByRole('button', { name: `Create User` });
    const input = screen.getByTestId('formInput-input');
    const inputPlaceHolder = screen.getByPlaceholderText('User Name');

    expect(button).toBeVisible();
    expect(input).toBeVisible();
    expect(inputPlaceHolder).toBeVisible();
  });

  it('Creates a user when input is entered properly', async () => {

    const user = userEvent.setup();
    render(<RoomsDisplay />);

    const button = screen.getByRole('button', { name: `Create User` });
    const input = screen.getByTestId('formInput-input');
    expect(button).toBeVisible();
    expect(input).toBeVisible();

    input.focus();
    await user.keyboard('Ren');
    await user.click(button);
  });
});
