import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';
import { format } from 'date-fns';

const Dashboard = ({ filteredData }) => {
  // Prepare chart data
  const typeMap = {};
  const dateMap = {};

  filteredData.forEach((entry) => {
    typeMap[entry.indicator_type] = (typeMap[entry.indicator_type] || 0) + 1;

    const localDate = format(new Date(entry.created_at), 'yyyy-MM-dd');
    dateMap[localDate] = (dateMap[localDate] || 0) + 1;
  });

  const typeChartData = Object.entries(typeMap).map(([type, count]) => ({ type, count }));
  const timeChartData = Object.entries(dateMap).map(([date, count]) => ({ date, count }));

  return (
    <>
      <div className="section-card table-container">
        <h2>📋 Indicator Table</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Value</th>
                <th>Description</th>
                <th>Pulse</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.indicator_type}</td>
                  <td>{entry.indicator_value}</td>
                  <td>{entry.indicator_description}</td>
                  <td>{entry.pulse_name}</td>
                  <td>{format(new Date(entry.created_at), 'yyyy-MM-dd')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-card">
        <h2>📊 Indicator Type Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={typeChartData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#b9b5ff" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="url(#barGradient)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="section-card">
        <h2>📈 Indicators Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#ff6f61" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Dashboard;
