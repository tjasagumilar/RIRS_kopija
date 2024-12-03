import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeeEntryForm from '../components/EmployeeEntryForm';
import axios from 'axios';

jest.mock('axios');

describe('EmployeeEntryForm Component', () => {
  const mockEmployees = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
  ];
  it('should render the form correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: mockEmployees });
    render(<EmployeeEntryForm />);
    expect(screen.getByLabelText(/izberite zaposlenega/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/število opravljenih ur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/datum/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/opis/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pošlji/i })).toBeInTheDocument();
  });

});


