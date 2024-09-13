import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto"></div>
    <div className="grid grid-cols-2 gap-4">
      {Array(4).fill().map((_, index) => (
        <div key={index} className="h-12 bg-gray-300 rounded"></div>
      ))}
    </div>
  </div>
);

const PhoneSellingCarousel = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  
  const [phoneBrands, setPhoneBrands] = useState([]);
  const [phoneSeries, setPhoneSeries] = useState({});
  const [phoneVariants, setPhoneVariants] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [estimatedPrice, setEstimatedPrice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      resetSelections();
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [brandsResponse, variantsResponse, timeSlotsResponse] = await Promise.all([
        axios.get('https://reuz-i.onrender.com/phone-brands'),
        axios.get('https://reuz-i.onrender.com/phone-variants'),
        axios.get('https://reuz-i.onrender.com/time-slots'),
      ]);
      setPhoneBrands(brandsResponse.data);
      setPhoneVariants(variantsResponse.data);
      setTimeSlots(timeSlotsResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch initial data. Please try again later.');
      setLoading(false);
    }
  };

  const fetchPhoneSeries = async (brand) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://reuz-i.onrender.com/phone-series/${brand}`);
      setPhoneSeries(prevState => ({...prevState, [brand]: response.data}));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch phone series. Please try again later.');
      setLoading(false);
    }
  };

  const fetchEstimatedPrice = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://reuz-i.onrender.com/estimate-price', {
        brand: selectedBrand,
        series: selectedSeries,
        variant: selectedVariant,
      });
      setEstimatedPrice(response.data.price);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch estimated price. Please try again later.');
      setLoading(false);
    }
  };

  const resetSelections = () => {
    setCurrentSlide(0);
    setSelectedBrand(null);
    setSelectedSeries(null);
    setSelectedVariant(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setEstimatedPrice(null);
  };

  useEffect(() => {
    if (currentSlide === 3 && selectedDate && selectedTimeSlot) {
      setCurrentSlide(4);
      fetchEstimatedPrice();
    }
  }, [selectedDate, selectedTimeSlot, currentSlide]);

  const handleOptionClick = (option, setter) => {
    setter(option);
    if (setter === setSelectedBrand) {
      fetchPhoneSeries(option);
    }
    if (canProceed()) {
      handleNextSlide();
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < 4) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const canProceed = () => {
    switch (currentSlide) {
      case 0:
        return selectedBrand !== null;
      case 1:
        return selectedSeries !== null;
      case 2:
        return selectedVariant !== null;
      case 3:
        return selectedDate !== null && selectedTimeSlot !== null;
      default:
        return true;
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (canProceed() && currentSlide < 4) {
        handleNextSlide();
      }
    },
    onSwipedRight: () => {
      if (currentSlide > 0) {
        handlePrevSlide();
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const renderSlide = () => {
    if (loading) return <SkeletonLoader />;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    switch (currentSlide) {
      case 0:
        return (
          <div className="grid grid-cols-2 gap-4">
            {phoneBrands.map((brand) => (
              <button
                key={brand}
                className={`p-4 rounded-lg ${
                  selectedBrand === brand
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handleOptionClick(brand, setSelectedBrand)}
              >
                {brand}
              </button>
            ))}
          </div>
        );
      case 1:
        if (!selectedBrand || !phoneSeries[selectedBrand]) {
          return <SkeletonLoader />;
        }

        return (
          <div className="grid grid-cols-2 gap-4">
            {phoneSeries[selectedBrand].map((series) => (
              <button
                key={series}
                className={`p-4 rounded-lg ${
                  selectedSeries === series
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handleOptionClick(series, setSelectedSeries)}
              >
                {series}
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            {phoneVariants.map((variant) => (
              <button
                key={variant}
                className={`p-4 rounded-lg ${
                  selectedVariant === variant
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handleOptionClick(variant, setSelectedVariant)}
              >
                {variant}
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <input
              type="date"
              onChange={(e) => {
                setSelectedDate(e.target.value);
                if (selectedTimeSlot) {
                  handleNextSlide();
                }
              }}
              className="w-full p-2 border rounded-lg"
            />
            <select
              onChange={(e) => {
                setSelectedTimeSlot(e.target.value);
                if (selectedDate) {
                  handleNextSlide();
                }
              }}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        );
      case 4:
        return (
          <div className="text-center">
            <p className="text-3xl font-semibold">Rs.{estimatedPrice}</p>
            <p className="mt-4">
              Brand: {selectedBrand}
              <br />
              Series: {selectedSeries}
              <br />
              Variant: {selectedVariant}
              <br />
              Appointment: {selectedDate} at {selectedTimeSlot}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
      >
        <FaTimes size={24} />
      </button>

      <div className="bg-white rounded-lg p-6 w-full max-w-md" {...swipeHandlers}>
        <h2 className="text-xl font-bold mb-4 text-center">
          {currentSlide === 0 && 'Select brand of your phone'}
          {currentSlide === 1 && 'Select Series'}
          {currentSlide === 2 && 'Select Variant'}
          {currentSlide === 3 && 'Schedule Appointment'}
          {currentSlide === 4 && 'Estimated Price'}
        </h2>
        <div className="mt-4">{renderSlide()}</div>
      </div>
    </div>
  );
};
export default PhoneSellingCarousel;
