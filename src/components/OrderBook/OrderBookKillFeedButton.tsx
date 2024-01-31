import React from 'react';

interface OrderBookKillFeedButtonProps {
  onKillFeed: () => void;
}

const OrderBookKillFeedButton: React.FC<OrderBookKillFeedButtonProps> = ({ onKillFeed }) => {
  return (
    <button className="kill-feed-button" onClick={onKillFeed}>
      Kill Feed
    </button>
  );
};

export default OrderBookKillFeedButton;
