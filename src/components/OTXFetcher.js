import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
    LineChart, Line, PieChart, Pie, Cell
  } from 'recharts';
  
import 'react-datepicker/dist/react-datepicker.css';


const OTXFetcher = () => {
  const [data, setData] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [valueFilter, setValueFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [typeOptions, setTypeOptions] = useState([]);


  const filteredData = data.filter((entry) => {
    // Type filter
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.some((typeObj) => typeObj.value === entry.indicator_type);
  
    // Value filter
    const matchesValue =
      valueFilter.trim() === '' ||
      entry.indicator_value.toLowerCase().includes(valueFilter.trim().toLowerCase());
  
    // Date filter
    const matchesDate =
  !dateFilter ||
  format(new Date(entry.created_at), 'yyyy-MM-dd') === format(dateFilter, 'yyyy-MM-dd');
  
    return matchesType && matchesValue && matchesDate;
  });

  // Type distribution
const typeCountMap = {};
filteredData.forEach((entry) => {
  typeCountMap[entry.indicator_type] = (typeCountMap[entry.indicator_type] || 0) + 1;
});
const typeChartData = Object.entries(typeCountMap).map(([type, count]) => ({
  type,
  count,
}));

// Indicators per day (local date)
const dateMap = {};
filteredData.forEach((entry) => {
  const localDate = format(new Date(entry.created_at), 'yyyy-MM-dd');
  dateMap[localDate] = (dateMap[localDate] || 0) + 1;
});
const timeChartData = Object.entries(dateMap).map(([date, count]) => ({
  date,
  count,
}));
  

  useEffect(() => {
    const fetchData = async () => {
        try {
          const API_KEY = process.env.REACT_APP_OTX_API_KEY;
      
          const res = await axios.get('https://otx.alienvault.com/api/v1/pulses/subscribed', {
            headers: {
              'X-OTX-API-KEY': API_KEY,
            },
          });
      
          const normalized = [];
      
          res.data.results.forEach((pulse) => {
            const pulseId = pulse.id;
            const pulseName = pulse.name;
      
            pulse.indicators.forEach((indicator) => {
              normalized.push({
                pulse_id: pulseId,
                pulse_name: pulseName,
                indicator_type: indicator.type,
                indicator_value: indicator.indicator,
                indicator_description: indicator.description || "No description available",
                created_at: indicator.created,
              });
            });
          });
      
          setData(normalized);
          const typesSet = new Set();
normalized.forEach((entry) => typesSet.add(entry.indicator_type));
const dynamicTypeOptions = Array.from(typesSet).map((type) => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1),
}));
setTypeOptions(dynamicTypeOptions);

        } catch (err) {
          console.error('Error fetching OTX data:', err);
        }
      };
      

    fetchData();
  }, []);




  return (

    
    <div>
        <h2>Indicator Type Distribution</h2>
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={typeChartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="type" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="count" fill="#8884d8" />
  </BarChart>
</ResponsiveContainer>

<h2>Indicators Over Time</h2>
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={timeChartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="count" stroke="#82ca9d" />
  </LineChart>
</ResponsiveContainer>

      <h2>Normalized OTX Indicators</h2>
      <div style={{ marginBottom: '20px' }}>
  {/* Type Multi-select */}
  <label>
    Filter by Type:&nbsp;
    <Select
  isMulti
  options={typeOptions}
  value={selectedTypes}
  onChange={setSelectedTypes}
  placeholder="Select types..."
/>

  </label>
  <br /><br />

  {/* Value Text Filter */}
  <label>
    Filter by Value:&nbsp;
    <input
      type="text"
      value={valueFilter}
      onChange={(e) => setValueFilter(e.target.value)}
      placeholder="Enter value to search"
    />
  </label>
  <br /><br />

  {/* Date Picker */}
  <label>
    Filter by Date:&nbsp;
    <DatePicker
      selected={dateFilter}
      onChange={(date) => setDateFilter(date)}
      placeholderText="Select a date"
      dateFormat="yyyy-MM-dd"
    />
  </label>
</div>

      <table border="1" cellPadding="6">
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
  );
  
};

export default OTXFetcher;
