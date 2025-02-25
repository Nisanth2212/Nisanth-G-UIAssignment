import React from 'react';
import { calculateRewardPoints } from '../logics/rewardPoints';

const TransactionCard = ({ date, amount }) => {
  const points = calculateRewardPoints(amount);

  return (
    <tr className="transaction-card">
      <td>{date}</td>
      <td>${amount}</td>
      <td>{points}</td>
    </tr>
  );
};

export default TransactionCard;
