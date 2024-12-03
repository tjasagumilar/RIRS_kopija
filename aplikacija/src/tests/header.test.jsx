import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';

describe('Header Component', () => {
  it('should call onNavigate with "mojaEvidenca"', () => {
    const mockNavigate = jest.fn();
    render(<Header onNavigate={mockNavigate} />);
    fireEvent.click(screen.getByText('Moja evidenca'));
    expect(mockNavigate).toHaveBeenCalledWith('mojaEvidenca');
  });

  it('should call onNavigate with "vnesiUre"', () => {
    const mockNavigate = jest.fn();
    render(<Header onNavigate={mockNavigate} />);
    fireEvent.click(screen.getByText('Vnesi ure'));
    expect(mockNavigate).toHaveBeenCalledWith('vnesiUre');
  });


  it('should call onNavigate with "pregled"', () => {
    const mockNavigate = jest.fn();
    render(<Header onNavigate={mockNavigate} />);
    fireEvent.click(screen.getByText('Pregled'));
    expect(mockNavigate).toHaveBeenCalledWith('pregled');
  });
});