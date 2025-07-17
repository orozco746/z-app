import React from 'react';
import { View } from 'react-native';
import Svg, { Line, Rect, Polyline } from 'react-native-svg';

type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
};

type Props = {
  data: Candle[];
  width?: number;
  height?: number;
};

const calculateMA = (data: Candle[], period: number): number[] => {
  return data.map((_, i) => {
    if (i < period - 1) return NaN;
    const slice = data.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, c) => sum + c.close, 0) / period;
    return avg;
  });
};

const calculateRSI = (data: Candle[], period = 14): number[] => {
  let gains = 0;
  let losses = 0;
  const rsi: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (i <= period) {
      if (diff >= 0) gains += diff;
      else losses -= diff;
      rsi.push(NaN);
    } else {
      const avgGain = gains / period;
      const avgLoss = losses / period;
      const rs = avgGain / (avgLoss || 1);
      rsi.push(100 - 100 / (1 + rs));

      const newDiff = diff;
      gains = (gains * (period - 1) + (newDiff > 0 ? newDiff : 0)) / period;
      losses = (losses * (period - 1) + (newDiff < 0 ? -newDiff : 0)) / period;
    }
  }

  return [NaN, ...rsi];
};

export default function CandlestickChart({ data, width = 340, height = 250 }: Props) {
  const chartHeight = height * 0.75;
  const rsiHeight = height * 0.25;

  const maxPrice = Math.max(...data.map(c => c.high));
  const minPrice = Math.min(...data.map(c => c.low));
  const candleWidth = width / data.length;

  const scaleY = (price: number) =>
    chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;

  const ma20 = calculateMA(data, 3); // usa 3 para ver algo con pocos datos
  const ma50 = calculateMA(data, 5); // usa 5 para ver algo con pocos datos
  const rsi = calculateRSI(data, 3);

  return (
    <View>
      <Svg width={width} height={height}>
        {/* Velas */}
        {data.map((c, i) => {
          const x = i * candleWidth + candleWidth / 4;
          const yHigh = scaleY(c.high);
          const yLow = scaleY(c.low);
          const yOpen = scaleY(c.open);
          const yClose = scaleY(c.close);
          const color = c.close > c.open ? 'green' : 'red';

          return (
            <React.Fragment key={i}>
              <Line x1={x + candleWidth / 4} y1={yHigh} x2={x + candleWidth / 4} y2={yLow} stroke={color} strokeWidth={2} />
              <Rect
                x={x}
                y={Math.min(yOpen, yClose)}
                width={candleWidth / 2}
                height={Math.abs(yOpen - yClose)}
                fill={color}
              />
            </React.Fragment>
          );
        })}

        {/* MA20 */}
        <Polyline
          points={ma20
            .map((y, i) => (isNaN(y) ? '' : `${i * candleWidth + candleWidth / 2},${scaleY(y)}`))
            .filter(p => p !== '')
            .join(' ')}
          fill="none"
          stroke="blue"
          strokeWidth={2}
        />

        {/* MA50 */}
        <Polyline
          points={ma50
            .map((y, i) => (isNaN(y) ? '' : `${i * candleWidth + candleWidth / 2},${scaleY(y)}`))
            .filter(p => p !== '')
            .join(' ')}
          fill="none"
          stroke="orange"
          strokeWidth={2}
        />

        {/* RSI */}
        {rsi.map((r, i) => {
          if (isNaN(r)) return null;
          const x = i * candleWidth + candleWidth / 2;
          const y = chartHeight + ((100 - r) / 100) * rsiHeight;
          return (
            <React.Fragment key={`rsi-${i}`}>
              {i > 0 && !isNaN(rsi[i - 1]) && (
                <Line
                  x1={(i - 1) * candleWidth + candleWidth / 2}
                  y1={chartHeight + ((100 - rsi[i - 1]) / 100) * rsiHeight}
                  x2={x}
                  y2={y}
                  stroke="purple"
                  strokeWidth={1.5}
                />
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
