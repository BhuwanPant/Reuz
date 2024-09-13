import React, { useState } from 'react';
import PhoneSellingCarousel from './components/PhoneSellingCarousel';
import PhoneGrid from './components/PhoneGrid';

function App() {
  const [selectedPhone, setSelectedPhone] = useState(null);

  const handlePhoneSelect = (phone) => {
    setSelectedPhone(phone);
  };

  const handleCloseCarousel = () => {
    setSelectedPhone(null);
  };

  return (
    <div className="App p-4">
      <header className="App-header">
        <h1 className="text-3xl font-bold mb-4">Sell Your Old Phone</h1>
      </header>
      <main>
        <PhoneGrid onPhoneSelect={handlePhoneSelect} />
        {selectedPhone && (
          <PhoneSellingCarousel
            isOpen={!!selectedPhone}
            onClose={handleCloseCarousel}
            selectedPhone={selectedPhone}
          />
        )}
      </main>
    </div>
  );
}

export default App;