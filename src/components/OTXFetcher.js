import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Dashboard from './Dashboard';

const OTXFetcher = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [valueFilter, setValueFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(null);

  const fetchData = async () => {
    try {
      const API_KEY = process.env.REACT_APP_OTX_API_KEY;

      const res = await axios.get('https://otx.alienvault.com/api/v1/pulses/subscribed', {
        headers: { 'X-OTX-API-KEY': API_KEY },
      });

      const normalized = [];

      res.data.results.forEach((pulse) => {
        const { id: pulseId, name: pulseName, indicators } = pulse;
        indicators.forEach((indicator) => {
          normalized.push({
            pulse_id: pulseId,
            pulse_name: pulseName,
            indicator_type: indicator.type,
            indicator_value: indicator.indicator,
            indicator_description: indicator.description || 'No description',
            created_at: indicator.created,
            severity: 'N/A',
            source: 'OTX',
          });
        });
      });

      setData(normalized);

      const typesSet = new Set(normalized.map((item) => item.indicator_type));
      const options = Array.from(typesSet).map((type) => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      }));
      setTypeOptions(options);
    } catch (err) {
      console.error('Error fetching OTX data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((entry) => {
      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some((typeObj) => typeObj.value === entry.indicator_type);

      const matchesValue =
        valueFilter.trim() === '' ||
        entry.indicator_value.toLowerCase().includes(valueFilter.trim().toLowerCase());

      const matchesDate =
        !dateFilter ||
        format(new Date(entry.created_at), 'yyyy-MM-dd') === format(dateFilter, 'yyyy-MM-dd');

      return matchesType && matchesValue && matchesDate;
    });

    setFilteredData(filtered);
  }, [selectedTypes, valueFilter, dateFilter, data]);

  if (loading) {
    return <div className="loading">Loading CTI data...</div>;
  }

  return (
    <div>
      <div className="filter-panel">
        <h2 className="section-title">🎯 Filter Threat Indicators</h2>

        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: '2rem',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            overflowX: 'auto',
          }}
        >
          {/* Type Filter */}
          <div style={{ flex: '1' }}>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Filter by Type:
            </label>
            <Select
              isMulti
              options={typeOptions}
              value={selectedTypes}
              onChange={setSelectedTypes}
              placeholder="Select types..."
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (base) => ({
                  ...base,
                  borderRadius: '8px',
                  borderColor: '#ced4da',
                  minHeight: '38px',
                  fontSize: '0.95rem',
                }),
              }}
            />
          </div>

          {/* Value Filter */}
          <div style={{ flex: '1' }}>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Filter by Value:
            </label>
            <input
              type="text"
              value={valueFilter}
              onChange={(e) => setValueFilter(e.target.value)}
              placeholder="Search value"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #ced4da',
                fontSize: '0.95rem',
              }}
            />
          </div>

          {/* Date Filter */}
          <div style={{ flex: '1' }}>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Filter by Date:
            </label>
            <DatePicker
              selected={dateFilter}
              onChange={(date) => setDateFilter(date)}
              placeholderText="Select date"
              dateFormat="yyyy-MM-dd"
              className="custom-datepicker"
            />
          </div>
        </div>
      </div>

      <Dashboard filteredData={filteredData} />
    </div>
  );
};

export default OTXFetcher;
