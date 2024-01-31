import React from 'react';

interface OrderBookToggleFeedButtonProps {
  onToggleFeed: () => void;
}

const OrderBookToggleFeedButton: React.FC<OrderBookToggleFeedButtonProps> = ({ onToggleFeed }) => {
  return (
    <button className="toggle-feed-button" onClick={onToggleFeed}>
      Toggle Feed
    </button>
  );
};

export default OrderBookToggleFeedButton;
