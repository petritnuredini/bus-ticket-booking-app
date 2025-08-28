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
    <div className="m-5 flex flex-col gap-6">
      {/* Seats grid */}
      <div className="w-[300px] border-2 text-xl font-bold border-blue-500 rounded p-[10px]">
        <Row gutter={[10, 10]}>
          {Array.from(Array(capacity).keys()).map((seat, key) => {
            let seatClass = `btn btn-circle btn-outline bg-white cursor-pointer hover:bg-blue-600`;

            if (selectedSeats.includes(seat + 1)) {
              seatClass = `btn btn-circle btn-outline bg-green-500 text-white cursor-pointer`;
            } else if (bus.seatsBooked.includes(seat + 1)) {
              seatClass = `btn btn-circle btn-outline bg-red-500 text-white pointer-events-none cursor-not-allowed`;
            }

            return (
              <Col key={key} span={6}>
                <div className="flex justify-center items-center">
                  <div
                    className={`border-[1px] text-black p-3 ${seatClass}`}
                    onClick={() => {
                      if (!bus.seatsBooked.includes(seat + 1)) {
                        selectOrUnselectSeat(seat + 1);
                      }
                    }}
                  >
                    {seat + 1}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white border rounded"></div>
          <span className="text-sm">Free</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 border rounded"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 border rounded"></div>
          <span className="text-sm">Booked</span>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;
