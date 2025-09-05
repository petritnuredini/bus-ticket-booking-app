import React from "react";
import { Row, Col } from "antd";

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
  const capacity = bus.capacity;

  const selectOrUnselectSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      if (selectedSeats.length >= 5) {
        alert("Mund të zgjedhësh maksimumi 5 ulëse.");
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <div>
      {/* Modern Blue Seats Grid */}
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '25px', 
        border: '2px solid #dbeafe',
        borderRadius: '12px',
        marginBottom: '25px'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          {Array.from(Array(capacity).keys()).map((seat, key) => {
            const seatNumber = seat + 1;
            let buttonStyle = {
              width: '65px',
              height: '65px',
              border: '2px solid #3b82f6',
              backgroundColor: 'white',
              color: '#1e40af',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            };

            if (selectedSeats.includes(seatNumber)) {
              buttonStyle = {
                ...buttonStyle,
                backgroundColor: '#3b82f6',
                color: 'white',
                border: '2px solid #1e40af',
                boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
              };
            } else if (bus.seatsBooked.includes(seatNumber)) {
              buttonStyle = {
                ...buttonStyle,
                backgroundColor: '#ef4444',
                color: 'white',
                border: '2px solid #dc2626',
                cursor: 'not-allowed',
                opacity: '0.6',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
              };
            }

            return (
              <button
                key={key}
                style={buttonStyle}
                onClick={() => {
                  if (!bus.seatsBooked.includes(seatNumber)) {
                    selectOrUnselectSeat(seatNumber);
                  }
                }}
                disabled={bus.seatsBooked.includes(seatNumber)}
                onMouseEnter={(e) => {
                  if (!bus.seatsBooked.includes(seatNumber) && !selectedSeats.includes(seatNumber)) {
                    e.target.style.backgroundColor = '#dbeafe';
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!bus.seatsBooked.includes(seatNumber) && !selectedSeats.includes(seatNumber)) {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                {seatNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modern Blue Legend */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        border: '2px solid #dbeafe',
        borderRadius: '12px',
        marginBottom: '25px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ 
              width: '45px', 
              height: '45px', 
              backgroundColor: 'white', 
              border: '2px solid #3b82f6',
              margin: '0 auto 8px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}></div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>Available</div>
          </div>
          <div>
            <div style={{ 
              width: '45px', 
              height: '45px', 
              backgroundColor: '#3b82f6', 
              border: '2px solid #1e40af',
              margin: '0 auto 8px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
            }}></div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>Selected</div>
          </div>
          <div>
            <div style={{ 
              width: '45px', 
              height: '45px', 
              backgroundColor: '#ef4444', 
              border: '2px solid #dc2626',
              margin: '0 auto 8px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
            }}></div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>Occupied</div>
          </div>
        </div>
      </div>

      {/* Modern Blue Selection Status */}
      <div style={{ 
        textAlign: 'center', 
        backgroundColor: '#dbeafe', 
        padding: '20px', 
        border: '2px solid #3b82f6',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p style={{ fontSize: '18px', color: '#1e40af', margin: '0', fontWeight: '500' }}>
          {selectedSeats.length > 0 ? (
            <>
              <strong style={{ color: '#1e40af', fontSize: '20px' }}>
                {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected
              </strong>
              {selectedSeats.length >= 5 && (
                <div style={{ color: '#ef4444', fontSize: '16px', marginTop: '8px', fontWeight: 'bold' }}>
                  Maximum 5 seats allowed
                </div>
              )}
            </>
          ) : (
            <span style={{ fontSize: '18px' }}>Click on seats to select them</span>
          )}
        </p>
      </div>
    </div>
  );
}

export default SeatSelection;
