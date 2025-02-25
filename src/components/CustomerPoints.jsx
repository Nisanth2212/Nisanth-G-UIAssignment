import React, { useState, useEffect } from 'react';
import { calculateRewardPoints } from '../logics/rewardPoints';
const CustomerPoints = ({ customerId, transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = transactions.filter((transaction) =>
        transaction.date.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm, transactions]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const groupedTransactions = filteredTransactions.reduce((acc, trs) => {
    const date = new Date(trs.date);
    const monthYear = `${date.toLocaleString('default', {
      month: 'long',
    })} ${date.getFullYear()}`;

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(trs);
    return acc;
  }, {});

  return (
    <div className="customer-points">
      <input
        type="text"
        placeholder="Search by Year"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Month & Year</th>
            <th>Total Amount</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedTransactions).length === 0 ? (
            <tr>
              <td colSpan="3">No records found</td>
            </tr>
          ) : (
            Object.keys(groupedTransactions).map((monthYear, index) => {
              const totalPoints = groupedTransactions[monthYear].reduce(
                (acc, trs) => acc + calculateRewardPoints(trs.amount),
                0
              );
              const totalAmount = groupedTransactions[monthYear].reduce(
                (acc, trs) => acc + trs.amount,
                0
              );

              return (
                <tr key={index}>
                  <td>{monthYear}</td>
                  <td>${totalAmount}</td>
                  <td>{totalPoints}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <h4 className="total-points-earned">
        Total Points Earned:{' '}
        {filteredTransactions.reduce(
          (acc, trs) => acc + calculateRewardPoints(trs.amount),
          0
        )}
      </h4>
    </div>
  );
};

export default CustomerPoints;
