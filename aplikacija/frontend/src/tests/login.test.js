import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/LoginForm';
import axios from 'axios';

jest.mock('axios');

describe('LoginForm Component', () => {
  it('should submit the form and call onLogin on successful login', async () => {
    const mockUser = { id: 1, name: 'Bob' };
    const mockResponse = { data: { success: true, user: mockUser } };
    axios.post.mockResolvedValueOnce(mockResponse);
    const onLoginMock = jest.fn();
    render(<LoginForm onLogin={onLoginMock} />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'bob' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'geslo123' } });
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/login', {
        username: 'bob',
        password: 'geslo123',
      });
      expect(onLoginMock).toHaveBeenCalledWith(mockUser);
    });
  });
});