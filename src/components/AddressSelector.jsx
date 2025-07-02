import React, { useEffect, useState } from "react";
import axios from "axios";

const AddressSelector = ({ userId, onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    if (userId) {
      axios
        .get(`/api/addresses/${userId}`)
        .then((res) => {
          setAddresses(res.data);
          if (res.data.length > 0) {
            setSelectedAddressId(res.data[0].id);
            onSelect(res.data[0]); 
          }
        })
        .catch((err) => {
          console.error("Failed to fetch addresses", err);
        });
    }
  }, [userId, onSelect]);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    setSelectedAddressId(selectedId);
    const selected = addresses.find((addr) => addr.id === parseInt(selectedId));
    if (selected) onSelect(selected);
  };

  return (
    <div className="p-4 border rounded-md shadow-md max-w-md">
      <label className="block font-semibold mb-2">Select Address</label>
      <select
        value={selectedAddressId || ""}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      >
        {addresses.map((addr) => (
          <option key={addr.id} value={addr.id}>
            {`${addr.street}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.postalCode}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AddressSelector;
