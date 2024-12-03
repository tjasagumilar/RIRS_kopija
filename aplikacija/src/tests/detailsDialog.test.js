import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeDetailsDialog from '../components/EmployeeDetailsDialog';

jest.mock('@mui/x-charts/Gauge', () => ({
  Gauge: () => <div>Mocked Gauge</div>,
}));

describe('EmployeeDetailsDialog component', () => {
  const employee = {
    name: 'John Doe',
    id: '123',
    email: 'john.doe@example.com',
    total_hours: 120,
  };

  it('should not render the dialog when open is false', () => {
    render(<EmployeeDetailsDialog open={false} onClose={() => {}} employee={employee} />);
    const dialogTitle = screen.queryByText('Podrobnosti zaposlenega');
    expect(dialogTitle).toBeNull();
  });

  it('should render employee details when employee prop is provided', () => {
    render(<EmployeeDetailsDialog open={true} onClose={() => {}} employee={employee} />);
    expect(screen.getByText('Podrobnosti zaposlenega')).toBeInTheDocument();
    expect(screen.getByText(/Ime:/i)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/ID zaposlenega:/i)).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Št. oddelanih ur:/i)).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText(/\/ 160.00/i)).toBeInTheDocument();
    expect(screen.getByText('Mocked Gauge')).toBeInTheDocument();
  });

  it('should not render employee details when employee prop is null', () => {
    render(<EmployeeDetailsDialog open={true} onClose={() => {}} employee={null} />);
    expect(screen.queryByText('Ime:')).toBeNull();
    expect(screen.queryByText('ID zaposlenega:')).toBeNull();
    expect(screen.queryByText('Email:')).toBeNull();
    expect(screen.queryByText('Št. oddelanih ur:')).toBeNull();
  });

  it('should call onClose function when "Zapri" button is clicked', () => {
    const onCloseMock = jest.fn();
    render(<EmployeeDetailsDialog open={true} onClose={onCloseMock} employee={employee} />);
    fireEvent.click(screen.getByText('Zapri'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
