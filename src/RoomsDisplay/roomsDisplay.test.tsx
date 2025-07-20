import { render, screen, act } from '@testing-library/react';
import RoomsDisplay from './RoomsDisplay';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { io as mockIo } from 'socket.io-client';

vi.mock('socket.io-client', () => {
  const mSocket = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    id: 'mock-socket-id',
  };
  return {
    io: () => mSocket,
  };
});

const mockSocket = mockIo() as unknown as {
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  emit: ReturnType<typeof vi.fn>;
  id: string;
};

describe('RoomsDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // it('App title displays properly.', () => {
  //   render(<RoomsDisplay />);
  // });

  it('Renders all elements properly', () => {
    render(<RoomsDisplay />);
    const button = screen.getByRole('button', { name: `Create User` });
    const input = screen.getByTestId('formInput-input');
    const inputPlaceHolder = screen.getByPlaceholderText('User Name');

    expect(button).toBeVisible();
    expect(input).toBeVisible();
    expect(inputPlaceHolder).toBeVisible();
  });

  it('Creates a user and advances to room creation prompt when input is valid', async () => {
    const user = userEvent.setup();
    render(<RoomsDisplay />);
    const input = screen.getByTestId('formInput-input');
    const button = screen.getByRole('button', { name: 'Create User' });
    
    await user.type(input, 'Ren');
    await user.click(button);

    const getRoomListHandlerCall = (mockSocket.on as ReturnType<typeof vi.fn>).mock.calls.find((call) => call[0] === 'getRoomList');

    if(getRoomListHandlerCall){
      const getRoomListHandler = getRoomListHandlerCall[1];
      act(() => {
        getRoomListHandler([]);
      });
    };

    expect(screen.getByPlaceholderText('Room Name')).toBeInTheDocument();
  });

  it('Does not create a user and advance when no name is entered.', async () => {
    const user = userEvent.setup();
    render(<RoomsDisplay />);
    const userInput = screen.getByTestId('formInput-input');
    const button = screen.getByRole('button', { name: 'Create User' });
    
    await user.clear(userInput)
    await user.click(button);
    
    const getRoomListHandlerCall = (mockSocket.on as ReturnType<typeof vi.fn>).mock.calls.find((call) => call[0] === 'getRoomList');
    
    if(getRoomListHandlerCall){
      const getRoomListHandler = getRoomListHandlerCall[1];
      act(() => {
        getRoomListHandler([]);
      });
    };

    const roomInput = screen.queryByPlaceholderText('Room Name');
    expect(roomInput).not.toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('Does not create a user and advance when entered name is too short.', async () => {
    const user = userEvent.setup();
    const getRoomListHandlerCall = (mockSocket.on as ReturnType<typeof vi.fn>).mock.calls.find((call) => call[0] === 'getRoomList');
    render(<RoomsDisplay />);
    const userInput = screen.getByTestId('formInput-input');
    const button = screen.getByRole('button', { name: 'Create User' });
    
    await user.type(userInput, 'Re');
    await user.click(button);
    
    if(getRoomListHandlerCall){
      const getRoomListHandler = getRoomListHandlerCall[1];
      act(() => {
        getRoomListHandler([]);
      });
    };

    let roomInput = screen.queryByPlaceholderText('Room Name');
    expect(roomInput).not.toBeInTheDocument();
    expect(button).toBeInTheDocument();

    await user.clear(userInput)
    await user.type(userInput, 'R');
    await user.click(button);
    
    roomInput = screen.queryByPlaceholderText('Room Name');
    expect(roomInput).not.toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
});