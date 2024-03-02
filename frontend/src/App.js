import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
  const BackendUrl = 'http://localhost:8081/api/customers';
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [searchTerm, sortBy, currentPage]); 
  const fetchData = async () => {
    try {
      const response = await axios.get(BackendUrl, {
        params: { search: searchTerm, sort: sortBy, page: currentPage },
      });
      const { customers, total } = response.data;
      setCustomers(customers);
      setTotalPages(Math.ceil(total / 20)); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='container'>
      <h1 className='des'>Customer Data</h1>
      <div>
        <input type="text" placeholder="Search by name or location" value={searchTerm} onChange={handleSearchChange} />
        <select value={sortBy} onChange={handleSortChange}>
          <option value="date">Sort by Date</option>
          <option value="time">Sort by Time</option>

        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer,index) => (
            <tr key={customer.sno}>
              <td>{index + 1}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
             <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='pagination'>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} onClick={() => handlePageChange(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
