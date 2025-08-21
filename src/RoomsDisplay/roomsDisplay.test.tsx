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

  //   const title = screen.getByText('No Projects to display.')
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
  
  describe('Create User', ()=>{
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
      render(<RoomsDisplay />);
      const getRoomListHandlerCall = (mockSocket.on as ReturnType<typeof vi.fn>).mock.calls.find((call) => call[0] === 'getRoomList');
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
    
    it('Does not create a user and advance when entered name contains symbols or numbers.', async () => {
      const user = userEvent.setup();
      render(<RoomsDisplay />);
      const getRoomListHandlerCall = (mockSocket.on as ReturnType<typeof vi.fn>).mock.calls.find((call) => call[0] === 'getRoomList');
      const userInput = screen.getByTestId('formInput-input');
      const button = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(userInput, 'Ren!');
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
      await user.type(userInput, 'Ren1');
      await user.click(button);
      
      roomInput = screen.queryByPlaceholderText('Room Name');
      expect(roomInput).not.toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it('Does not create a user and advance when entered name contains more than one space.', async () => {
      const user = userEvent.setup();
      render(<RoomsDisplay />);
      const userInput = screen.getByTestId('formInput-input');
      const button = screen.getByRole('button', { name: 'Create User' });
  
      await user.type(userInput, 're r e');
      await user.click(button);
  
      const getRoomListHandlerCall = (mockSocket.on as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === 'getRoomList'
      );
  
      if (getRoomListHandlerCall) {
        const getRoomListHandler = getRoomListHandlerCall[1];
        act(() => {
          getRoomListHandler([]);
        });
      }
  
      const roomInput = screen.queryByPlaceholderText('Room Name');
      expect(roomInput).not.toBeInTheDocument();
      expect(button).toBeInTheDocument();
      expect(mockSocket.emit).not.toHaveBeenCalledWith('getRoomList');
    });
  });

  describe('Create Room', () => {
    it('Creates a room when input is valid', async () => {
      const user = userEvent.setup();
      render(<RoomsDisplay />);
      const userInput = screen.getByTestId('formInput-input');
      const createUserButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(userInput, 'Ren');
      await user.click(createUserButton);
  
      const getRoomListHandlerCall = (mockSocket.on as ReturnType<typeof vi.fn>).mock.calls.find((call) => call[0] === 'getRoomList');
  
      if(getRoomListHandlerCall){
        const getRoomListHandler = getRoomListHandlerCall[1];
        act(() => {
          getRoomListHandler([]);
        });
      };
  
      const roomInput = screen.getByPlaceholderText('Room Name');
      const createRoomButton = screen.getByRole('button', { name: 'Create Room' });
  
      await user.type(roomInput, 'Test Room');
      await user.click(createRoomButton);
  
      expect(mockSocket.emit).toHaveBeenCalledWith('createRoom', expect.objectContaining({
        name: 'Test Room',
        hostId: expect.any(String),
        users: expect.arrayContaining([expect.objectContaining({ name: 'Ren' })])
      }));
    });

    it('Does not create a room when no name is entered.', async () => {
      const user = userEvent.setup();
      render(<RoomsDisplay />);
      
      const userInput = screen.getByTestId('formInput-input');
      const createUserButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(userInput, 'Ren');
      await user.click(createUserButton);
  
      const getRoomListHandlerCall = (mockSocket.on as ReturnType<typeof vi.fn>).mock.calls.find((call) => call[0] === 'getRoomList');
  
      if(getRoomListHandlerCall){
        const getRoomListHandler = getRoomListHandlerCall[1];
        act(() => {
          getRoomListHandler([]);
        });
      };
  
      const roomInput = screen.getByPlaceholderText('Room Name');
      const createRoomButton = screen.getByRole('button', { name: 'Create Room' });
  
      await user.clear(roomInput);
      await user.click(createRoomButton);

      expect(mockSocket.emit).not.toHaveBeenCalledWith(
        'createRoom',
        expect.objectContaining({ name: '' })
      );
      expect(roomInput).toBeInTheDocument();  
    });

    it('Does not create a room when input is too short', async () => {
      const user = userEvent.setup();
      render(<RoomsDisplay />);
      const userInput = screen.getByTestId('formInput-input');
      const createUserButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(userInput, 'Ren');
      await user.click(createUserButton);
  
      const getRoomListHandlerCall = (mockSocket.on as ReturnType<typeof vi.fn>).mock.calls.find((call) => call[0] === 'getRoomList');
  
      if(getRoomListHandlerCall){
        const getRoomListHandler = getRoomListHandlerCall[1];
        act(() => {
          getRoomListHandler([]);
        });
      };
  
      const roomInput = screen.getByPlaceholderText('Room Name');
      const createRoomButton = screen.getByRole('button', { name: 'Create Room' });
  
      await user.type(roomInput, 'Te');
      await user.click(createRoomButton);
  
      expect(mockSocket.emit).not.toHaveBeenCalledWith('createRoom', expect.objectContaining({
        name: 'Te',
        hostId: expect.any(String),
        users: expect.arrayContaining([expect.objectContaining({ name: 'Ren' })])
      }));
      expect(roomInput).toBeInTheDocument();

      await user.clear(roomInput)
      await user.type(roomInput, 'T');
      await user.click(createRoomButton);
  
      expect(mockSocket.emit).not.toHaveBeenCalledWith('createRoom', expect.objectContaining({
        name: 'T',
        hostId: expect.any(String),
        users: expect.arrayContaining([expect.objectContaining({ name: 'Ren' })])
      }));
      expect(roomInput).toBeInTheDocument(); 
    });

    it('Does not create a room when entered name contains more than one space.', async () => {
      const user = userEvent.setup();
      render(<RoomsDisplay />);
      const userInput = screen.getByTestId('formInput-input');
      const createUserButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(userInput, 'Ren');
      await user.click(createUserButton);
  
      const getRoomListHandlerCall = (mockSocket.on as ReturnType<typeof vi.fn>).mock.calls.find((call) => call[0] === 'getRoomList');
  
      if(getRoomListHandlerCall){
        const getRoomListHandler = getRoomListHandlerCall[1];
        act(() => {
          getRoomListHandler([]);
        });
      };
  
      const roomInput = screen.getByPlaceholderText('Room Name');
      const createRoomButton = screen.getByRole('button', { name: 'Create Room' });
  
      await user.type(roomInput, 'Test This Room');
      await user.click(createRoomButton);
  
      expect(mockSocket.emit).not.toHaveBeenCalledWith('createRoom', expect.objectContaining({
        name: 'Test This Room',
        hostId: expect.any(String),
        users: expect.arrayContaining([expect.objectContaining({ name: 'Ren' })])
      }));
      expect(roomInput).toBeInTheDocument();
    });

    it('Does not create a room when entered name contains symbols or numbers.', async () => {
      const user = userEvent.setup();
      render(<RoomsDisplay />);
      const userInput = screen.getByTestId('formInput-input');
      const createUserButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(userInput, 'Ren');
      await user.click(createUserButton);
  
      const getRoomListHandlerCall = (mockSocket.on as ReturnType<typeof vi.fn>).mock.calls.find((call) => call[0] === 'getRoomList');
  
      if(getRoomListHandlerCall){
        const getRoomListHandler = getRoomListHandlerCall[1];
        act(() => {
          getRoomListHandler([]);
        });
      };
  
      const roomInput = screen.getByPlaceholderText('Room Name');
      const createRoomButton = screen.getByRole('button', { name: 'Create Room' });
  
      await user.type(roomInput, 'Test Room!');
      await user.click(createRoomButton);
  
      expect(mockSocket.emit).not.toHaveBeenCalledWith('createRoom', expect.objectContaining({
        name: 'Test Room!',
        hostId: expect.any(String),
        users: expect.arrayContaining([expect.objectContaining({ name: 'Ren' })])
      }));
      expect(roomInput).toBeInTheDocument();

      await user.clear(roomInput);
      await user.type(roomInput, 'Test Room1');
      await user.click(createRoomButton);

      expect(mockSocket.emit).not.toHaveBeenCalledWith('createRoom', expect.objectContaining({
        name: 'Test Room1',
        hostId: expect.any(String),
        users: expect.arrayContaining([expect.objectContaining({ name: 'Ren' })])
      }));
      expect(roomInput).toBeInTheDocument();
    });
  });
});