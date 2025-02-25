import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { fetchTransactions } from './api/api';

jest.mock('./api/api');

const mockData = [
  {
    customerId: '1',
    transactions: [
      { date: '2025-02-01', amount: 100 },
      { date: '2025-02-15', amount: 200 },
    ],
  },
  {
    customerId: '2',
    transactions: [
      { date: '2025-01-10', amount: 150 },
      { date: '2025-01-20', amount: 50 },
    ],
  },
];

describe('App Component', () => {
  beforeEach(() => {
    fetchTransactions.mockResolvedValue(mockData);
  });

  test('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('renders customers and their transactions after loading', async () => {
    render(<App />);
    await waitFor(() => expect(fetchTransactions).toHaveBeenCalled());
    expect(screen.getByText('Customer Reward Points')).toBeInTheDocument();
    expect(screen.getByText('Month & Year')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
  });

  test('handles error state when API call fails', async () => {
    fetchTransactions.mockRejectedValueOnce(new Error('Failed to load data'));

    render(<App />);
    await waitFor(() =>
      expect(
        screen.getByText(/Failed to load customers data/i)
      ).toBeInTheDocument()
    );
  });
});
