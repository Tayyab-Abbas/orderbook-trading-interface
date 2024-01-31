import React, { useEffect, useState } from 'react';
import WebSocketService from '../../services/WebSocketService';
import OrderBookGroupingSelect from './OrderBookGroupingSelect';
import OrderBookTable from './OrderBookTable';
import OrderBookToggleFeedButton from './OrderBookToggleFeedButton';
import OrderBookKillFeedButton from './OrderBookKillFeedButton';

interface OrderBookData {
  price: number;
  size: number;
  total: number;
}

const OrderBook: React.FC = () => {
  const [buySide, setBuySide] = useState<OrderBookData[]>([
    { price: 10000, size: 5, total: 0 },
    { price: 9500, size: 8, total: 0 },
    // Add more dummy data as needed
  ]);
  const [sellSide, setSellSide] = useState<OrderBookData[]>([
    { price: 10500, size: 3, total: 0 },
    { price: 11000, size: 7, total: 0 },
    // Add more dummy data as needed
  ]);
  const [grouping, setGrouping] = useState<number>(0.5);
  const [webSocketService] = useState(new WebSocketService());

  useEffect(() => {
    webSocketService.connect('wss://www.cryptofacilities.com/ws/v1');
    return () => webSocketService.disconnect();
  }, [webSocketService]);

  useEffect(() => {
    webSocketService.onMessage((data: {
      numLevels: number;
      feed: string;
      bids: [number, number][];
      asks: [number, number][];
      product_id: string;
    }) => {
      // Assuming data is already in the correct format
      const processedData = processOrderBookData(data, grouping);

      // Update the buy side by filtering out price levels with size 0
      const updatedBuySide = processedData.buySide.filter(item => item.size > 0);

      // Update the sell side by filtering out price levels with size 0
      const updatedSellSide = processedData.sellSide.filter(item => item.size > 0);

      setBuySide(updatedBuySide);
      setSellSide(updatedSellSide);
    });
  }, [grouping, webSocketService]);

  const processOrderBookData = (data: {
    numLevels: number;
    feed: string;
    bids: [number, number][];
    asks: [number, number][];
    product_id: string;
  }, grouping: number) => {
    // Check if data.bids and data.asks are defined and are arrays
    if (!Array.isArray(data.bids) || !Array.isArray(data.asks)) {
      console.error("Invalid data format. Expected arrays for bids and asks.");
      return {
        buySide: [],
        sellSide: [],
      };
    }

    // Group bids and asks based on the selected grouping
    const groupedBids = groupLevels(data.bids, grouping);
    const groupedAsks = groupLevels(data.asks, grouping);

    let buyTotalSum = 0;
    const buySide = groupedBids.map(([price, size]) => {
      buyTotalSum += size;
      return {
        price,
        size,
        total: buyTotalSum,
      };
    });

    let sellTotalSum = 0;
    const sellSide = groupedAsks.map(([price, size]) => {
      sellTotalSum += size;
      return {
        price,
        size,
        total: sellTotalSum,
      };
    });

    return {
      buySide,
      sellSide,
    };
  };

  // Function to group levels based on the selected grouping
  const groupLevels = (levels: [number, number][], grouping: number) => {
    return levels.reduce((grouped, level) => {
      const price = Math.floor(level[0] / grouping) * grouping;
      const existingLevel = grouped.find((group) => group[0] === price);

      if (existingLevel) {
        existingLevel[1] += level[1];
      } else {
        grouped.push([price, level[1]]);
      }

      return grouped;
    }, [] as [number, number][]);
  };

  const handleGroupingChange = (newGrouping: number) => {
    setGrouping(newGrouping);
    // Additional logic for handling grouping change
  };

  const handleToggleFeed = () => {
    // Toggle between PI_XBTUSD and PI_ETHUSD
    const newProductIds =
      webSocketService.getProductIds()[0] === 'PI_XBTUSD'
        ? ['PI_ETHUSD']
        : ['PI_XBTUSD'];

    // Unsubscribe from the current feed
    webSocketService.unsubscribe();

    // Subscribe to the new feed
    webSocketService.subscribe(newProductIds);
  };

  const handleKillFeed = () => {
    // Force WebSocket feed to throw an error
    webSocketService.forceError();
  };

  return (
    <div className="order-book-container">

      <div className="header-container background-darkgray color-white">
        <h2 className="heading">Order Book</h2>
        {/* Display Group Select */}
        <OrderBookGroupingSelect onChange={handleGroupingChange} />
      </div>

      <div className="body-container background-darkgray color-white">
        {/* Display Buy Side */}
        <OrderBookTable sideData={buySide} isBuySide={true} />
        {/* Display Sell Side */}
        <OrderBookTable sideData={sellSide} isBuySide={false} />
      </div>

      <div className="footer-container">
        {/* Toggle Feed Button */}
        <OrderBookToggleFeedButton onToggleFeed={handleToggleFeed} />
        {/* Kill Feed Button */}
        <OrderBookKillFeedButton onKillFeed={handleKillFeed} />
      </div>
      
    </div>
  );
};

export default OrderBook;
