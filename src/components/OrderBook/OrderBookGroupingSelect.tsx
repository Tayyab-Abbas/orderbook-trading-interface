import React from 'react';

interface OrderBookGroupingSelectProps {
  onChange: (grouping: number) => void;
}

const OrderBookGroupingSelect: React.FC<OrderBookGroupingSelectProps> = ({ onChange }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const grouping = parseFloat(e.target.value);
    onChange(grouping);
  };

  return (
    <div className="grouping-button background-gray">
      <label htmlFor="groupingSelect" className="label">
        Group
      </label>
      <select id="groupingSelect" className="select" onChange={handleSelectChange}>
        <option value="0.5">0.5</option>
        <option value="1">1</option>
        <option value="2.5">2.5</option>
      </select>
    </div>
  );
};

export default OrderBookGroupingSelect;
