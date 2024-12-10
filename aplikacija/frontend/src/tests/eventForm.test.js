import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddEventForm from '../components/AddEventForm';

describe('AddEventForm component', () => {
  const mockOnEventAdded = jest.fn();

  it('should render all input fields and the submit button', () => {
    render(<AddEventForm employeeId="123" onEventAdded={mockOnEventAdded} />);

    // Preverjanje prikaza vseh polj
    expect(screen.getByLabelText(/Ime dogodka/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Datum/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Čas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lokacija/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Opis/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Načrtuj/i })).toBeInTheDocument();
  });

  it('should allow user to input data and call onEventAdded on form submission', async () => {
    render(<AddEventForm employeeId="123" onEventAdded={mockOnEventAdded} />);

    fireEvent.change(screen.getByLabelText(/Ime dogodka/i), { target: { value: 'Team Building' } });
    fireEvent.change(screen.getByLabelText(/Datum/i), { target: { value: '2024-12-15' } });
    fireEvent.change(screen.getByLabelText(/Čas/i), { target: { value: '15:00' } });
    fireEvent.change(screen.getByLabelText(/Lokacija/i), { target: { value: 'Hotel Plaza' } });
    fireEvent.change(screen.getByLabelText(/Opis/i), { target: { value: 'Opis dogodka' } });

    fireEvent.click(screen.getByRole('button', { name: /Načrtuj/i }));

    expect(mockOnEventAdded).not.toHaveBeenCalled(); 
  });

  it('should not submit the form if required fields are empty', () => {
    render(<AddEventForm employeeId="123" onEventAdded={mockOnEventAdded} />);

    fireEvent.click(screen.getByRole('button', { name: /Načrtuj/i }));

    expect(mockOnEventAdded).not.toHaveBeenCalled();

    const eventNameInput = screen.getByLabelText(/Ime dogodka/i);
    expect(eventNameInput).toBeInvalid();
  });
});
