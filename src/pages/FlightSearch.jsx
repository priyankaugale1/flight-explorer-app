import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "antd";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";
import "../styles/FlightSearch.css";

const timeSlots = ["morning", "afternoon", "evening", "night"];

const FlightSearch = () => {
  const [tripType, setTripType] = useState("oneway");
  const [segments, setSegments] = useState([{ from: "", to: "", date: "" }]);
  const [filters, setFilters] = useState({ price: 10000, airline: "", stops: "", time: "" });
  const [results, setResults] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [showingSearch, setShowingSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllFlights();
  }, []);

  const fetchAllFlights = async () => {
    const apiKey = "5101a535d07506c9e4c4e0324538014e";
    try {
      const res = await axios.get(`http://api.aviationstack.com/v1/flights`, {
        params: { access_key: apiKey },
      });
      const data = res.data.data || [];
      const validFlights = data.filter(f => f.flight && f.flight.iata && f.airline && f.departure && f.arrival);
      setAllFlights(validFlights);
      setResults(validFlights);
    } catch (error) {
      console.error("Error fetching all flights", error);
    }
  };

  const handleSegmentChange = (i, field, value) => {
    const updated = [...segments];
    updated[i][field] = value;
    setSegments(updated);
  };

  const searchFlights = () => {
    const fromCity = segments[0].from.toUpperCase();
    const toCity = segments[0].to.toUpperCase();
    const filtered = allFlights.filter(f =>
      f.departure.iata === fromCity &&
      f.arrival.iata === toCity &&
      (filters.airline ? f.airline.name.toLowerCase().includes(filters.airline.toLowerCase()) : true)
    );
    setResults(filtered);
    setShowingSearch(true);
  };

  const handleBook = (flight) => {
    localStorage.setItem("selectedFlight", JSON.stringify(flight));
    navigate("/booking");
  };

  const columns = [
    {
      title: "Airline",
      key: "airline",
      render: (record) => record.airline?.name || "-"
    },
    {
      title: "Flight",
      key: "flight",
      render: (record) => record.flight?.iata || record.flight?.number || "-"
    },
    {
      title: "From",
      key: "from",
      render: (record) => record.departure?.iata || "-"
    },
    {
      title: "To",
      key: "to",
      render: (record) => record.arrival?.iata || "-"
    },
    {
      title: "Scheduled Departure",
      key: "departureTime",
      render: (record) => record.departure?.scheduled ? new Date(record.departure.scheduled).toLocaleString() : "-"
    },
    {
  title: "Action",
  key: "action",
  render: (record) => (
    <Button
      style={{ backgroundColor: "#1f3b73", borderColor: "#1f3b73" }}
      type="primary"
      onClick={() => handleBook(record)}
    >
      Book
    </Button>
  )
}

  ];

  return (
    <div className="flight-search-container">
      <div className="flight-search-bar">
        <select value={tripType} onChange={e => setTripType(e.target.value)}>
          <option value="oneway">One Way</option>
          <option value="round">Round Trip</option>
          <option value="multi">Multi-City</option>
        </select>

        <input
          placeholder="From (IATA)"
          value={segments[0].from}
          onChange={e => handleSegmentChange(0, "from", e.target.value)}
        />
        <input
          placeholder="To (IATA)"
          value={segments[0].to}
          onChange={e => handleSegmentChange(0, "to", e.target.value)}
        />
        <input
          type="date"
          value={segments[0].date}
          onChange={e => handleSegmentChange(0, "date", e.target.value)}
        />

        <input
          type="range"
          min="1000"
          max="10000"
          value={filters.price}
          onChange={e => setFilters({ ...filters, price: e.target.value })}
          style={{ width: "100px" }}
        />
        <span>₹{filters.price}</span>

        <input
          placeholder="Airline"
          value={filters.airline}
          onChange={e => setFilters({ ...filters, airline: e.target.value })}
        />
        <select onChange={e => setFilters({ ...filters, stops: e.target.value })}>
          <option value="">Any Stops</option>
          <option value="0">Non-stop</option>
          <option value="1">1 Stop</option>
          <option value="2+">2+ Stops</option>
        </select>
        <select onChange={e => setFilters({ ...filters, time: e.target.value })}>
          <option value="">Any Time</option>
          {timeSlots.map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>

        <button onClick={searchFlights} className="search-btn">Search</button>
      </div>

      <div className="flight-search-results">
        <h3>Results:</h3>
        <Table
          dataSource={results}
          columns={columns}
          rowKey={(record, idx) => idx}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default FlightSearch;
