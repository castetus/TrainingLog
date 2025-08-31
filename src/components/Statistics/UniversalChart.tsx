import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';

export interface ChartDataPoint {
  date: string;
  count?: number;
  weight?: number;
  reps?: number;
  duration?: number;
  [key: string]: any;
}

interface UniversalChartProps {
  data: ChartDataPoint[];
  title: string;
  type?: 'bar' | 'line';
  dataKeys?: string[];
  colors?: string[];
}

export default function UniversalChart({
  data,
  title,
  type = 'bar',
  dataKeys,
  colors = ['#8884d8', '#82ca9d', '#ffc658'],
}: UniversalChartProps) {
  // Auto-detect data keys if not provided
  const detectedDataKeys = dataKeys || Object.keys(data[0] || {}).filter(key => key !== 'date');
  
  // Determine chart type based on data structure
  const chartType = type || (data[0]?.count !== undefined ? 'bar' : 'line');

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {detectedDataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
            />
          ))}
        </BarChart>
      );
    }

    return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {detectedDataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
      </LineChart>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </Box>
  );
}
