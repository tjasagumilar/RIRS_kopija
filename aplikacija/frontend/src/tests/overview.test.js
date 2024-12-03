import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Overview from '../components/Overview'; // Adjust path as needed
import axios from 'axios';

jest.mock('axios');

const mockEmployeeHours = [
  { employee_id: '1', name: 'John Doe', total_hours: 160 },
  { employee_id: '2', name: 'Jane Smith', total_hours: 140 },
];

describe('Overview Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the Overview component correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: mockEmployeeHours });

    render(<Overview />);
    expect(screen.getByLabelText(/Mesec/i)).toBeInTheDocument();
    expect(screen.queryByText(/Pregled oddelanih ur/i)).toBeInTheDocument();
  });

});
