import React, { useState, useEffect } from 'react';
import iphone from '../images/iphone.png'
import axios from 'axios';

const PhoneSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-2 animate-pulse">
    <div className="bg-gray-300 h-32 w-full rounded-md"></div>
    <div className="space-y-2">
      <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
      {/* <div className="bg-gray-300 h-4 w-1/2 rounded"></div> */}
    </div>
  </div>
);
const PhoneGrid = ({ onPhoneSelect }) => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        setLoading(true);
        
        // Delay the API call by 4 seconds (4000 milliseconds)
        setTimeout(async () => {
          const response = await axios.get('http://localhost:3001/phones');
          setPhones(response.data);
          setLoading(false);
        }, 4000);  // 4-second delay
      } catch (err) {
        setError('Failed to fetch phones. Please try again later.');
        setLoading(false);
      }
    };

    fetchPhones();
  }, []);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading
        ? Array(8).fill().map((_, index) => <PhoneSkeleton key={index} />)
        : phones.map((phone) => (
            <div
              key={phone.id}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onPhoneSelect(phone)}
            >
              <img src={phone.image } alt={`${phone.brand} `} className="w-full h-32 object-contain mb-2" />
              {/* <h3 className="font-semibold">{phone.brand}</h3>
              <p>{phone.model}</p> */}
            </div>
          ))}
    </div>
  );
};

export default PhoneGrid;