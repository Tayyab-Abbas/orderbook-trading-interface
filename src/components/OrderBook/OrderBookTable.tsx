import React from 'react';

interface OrderBookTableProps {
  sideData: {
    price: number;
    size: number;
    total: number;
  }[];
  isBuySide: boolean;
}

const OrderBookTable: React.FC<OrderBookTableProps> = ({ sideData, isBuySide }) => {
  return (
    <div className="side-container">
      <table className="table">
        <thead className="color-lightgray">
          <tr>
            {!isBuySide && <th>Price</th>}
            <th>Size</th>
            <th>Total</th>
            {isBuySide && <th>Price</th>}
          </tr>
        </thead>
        <tbody>
          {sideData.map((item) => (
            <tr key={item.price}>
              {!isBuySide && <td style={{ color: isBuySide ? 'green' : 'red' }}>{item.price}</td>}
              <td>{item.size}</td>
              <td>{item.total}</td>
              {isBuySide && <td style={{ color: isBuySide ? 'green' : 'red' }}>{item.price}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderBookTable;
