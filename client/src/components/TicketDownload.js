import React, { useState, useEffect } from 'react';
import { Button, Card, message, Spin } from 'antd';
import { DownloadOutlined, QrcodeOutlined, PrinterOutlined } from '@ant-design/icons';
import { axiosInstance } from '../helpers/axiosInstance';
import QRCode from 'react-qr-code';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TicketDownload = ({ bookingId, onClose }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, [bookingId]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/tickets/get?bookingId=${bookingId}`);
      if (response.data.success) {
        setTicket(response.data.data);
      } else {
        message.error('Ticket not found');
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      message.error('Error loading ticket');
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = async () => {
    try {
      const ticketElement = document.getElementById('ticket-content');
      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`ticket-${ticket.ticketNumber}.pdf`);
      message.success('Ticket downloaded successfully!');
    } catch (error) {
      console.error('Error downloading ticket:', error);
      message.error('Error downloading ticket');
    }
  };

  const printTicket = () => {
    const ticketElement = document.getElementById('ticket-content');
    const printWindow = window.open('', '_blank');
    
    // Get the QR code element and convert it to base64
    const qrElement = ticketElement?.querySelector('svg');
    let qrCodeDataUrl = '';
    
    if (qrElement) {
      const svgData = new XMLSerializer().serializeToString(qrElement);
      qrCodeDataUrl = 'data:image/svg+xml;base64,' + btoa(svgData);
    } else {
      // Fallback: create a simple text-based QR placeholder
      qrCodeDataUrl = '';
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Bus Ticket - ${ticket.ticketNumber}</title>
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #f5f5f5;
            }
            .ticket-container {
              max-width: 800px;
              margin: 0 auto;
              background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.15);
              overflow: hidden;
              page-break-inside: avoid;
            }
            .ticket-header {
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              padding: 30px;
              text-align: center;
              color: white;
            }
            .ticket-header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 2px;
            }
            .ticket-number {
              background: rgba(255,255,255,0.2);
              padding: 8px 20px;
              border-radius: 25px;
              display: inline-block;
              margin-top: 15px;
              font-weight: 600;
            }
            .ticket-content {
              padding: 40px;
            }
            .qr-section {
              text-align: center;
              margin-bottom: 40px;
              background: linear-gradient(145deg, #dbeafe 0%, #bfdbfe 100%);
              padding: 30px;
              border-radius: 15px;
              border: 2px dashed #3b82f6;
              page-break-inside: avoid;
            }
            .qr-container {
              display: inline-block;
              padding: 20px;
              background: white;
              border-radius: 15px;
              box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            }
            .qr-container svg {
              display: block !important;
              width: 180px !important;
              height: 180px !important;
              max-width: 180px !important;
              max-height: 180px !important;
            }
            .qr-container canvas {
              display: block !important;
              width: 180px !important;
              height: 180px !important;
              max-width: 180px !important;
              max-height: 180px !important;
            }
            .details-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 30px;
              margin-bottom: 30px;
            }
            .detail-card {
              background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
              padding: 25px;
              border-radius: 15px;
              box-shadow: 0 8px 16px rgba(0,0,0,0.08);
              border: 1px solid #e9ecef;
            }
            .card-title {
              color: #2563eb;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 10px;
              margin-bottom: 20px;
              font-size: 18px;
              font-weight: 600;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #f1f3f4;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: 600;
              color: #495057;
            }
            .detail-value {
              color: #212529;
              font-weight: 500;
            }
            .badge {
              background: #3b82f6;
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 14px;
            }
            .badge-success {
              background: #28a745;
            }
            .payment-section {
              background: linear-gradient(145deg, #dbeafe 0%, #bfdbfe 100%);
              padding: 30px;
              border-radius: 15px;
              margin-bottom: 30px;
              border: 2px solid #3b82f6;
            }
            .payment-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 25px;
            }
            .payment-card {
              background: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            }
            .footer {
              text-align: center;
              padding: 25px;
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              border-radius: 15px;
              color: white;
              page-break-inside: avoid;
            }
            .footer-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              font-size: 14px;
              line-height: 1.6;
            }
            .action-buttons {
              display: none !important;
            }
            @media print {
              .action-buttons {
                display: none !important;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .ticket-container {
                box-shadow: none;
                border: 1px solid #ddd;
              }
            }
            }
            @media print {
              body { background: white; }
              .ticket-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="ticket-header">
              <h1>🚌 BUS TICKET</h1>
              <div class="ticket-number">#${ticket.ticketNumber}</div>
            </div>
            
            <div class="ticket-content">
              <div class="qr-section">
                ${qrCodeDataUrl ? `<img src="${qrCodeDataUrl}" alt="QR Code" style="width: 180px; height: 180px; display: block; margin: 0 auto;">` : `
                  <div style="width: 180px; height: 180px; background: #f8f9fa; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed #3b82f6; border-radius: 8px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">📱</div>
                    <div style="font-size: 12px; color: #3b82f6; text-align: center; font-weight: 500;">QR Code</div>
                    <div style="font-size: 10px; color: #666; text-align: center; margin-top: 4px;">${ticket.ticketNumber}</div>
                  </div>
                `}
                <p style="margin-top: 15px; color: #2563eb; font-weight: 500;">📱 Scan QR code for validation</p>
              </div>
              
              <div class="details-grid">
                <div class="detail-card">
                  <h3 class="card-title">👤 Passenger Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${ticket.passengerName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${ticket.passengerEmail}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Booking Date:</span>
                    <span class="detail-value">${new Date(ticket.bookingDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div class="detail-card">
                  <h3 class="card-title">🚌 Journey Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Route:</span>
                    <span class="detail-value">${ticket.busDetails.from} → ${ticket.busDetails.to}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Departure:</span>
                    <span class="detail-value">${ticket.busDetails.departureTime ? new Date(ticket.busDetails.departureTime).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Arrival:</span>
                    <span class="detail-value">${ticket.busDetails.arrivalTime ? new Date(ticket.busDetails.arrivalTime).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Bus:</span>
                    <span class="detail-value">${ticket.busDetails.busNumber} ${ticket.busDetails.busType ? `(${ticket.busDetails.busType})` : ''}</span>
                  </div>
                </div>
                
                <div class="detail-card">
                  <h3 class="card-title">🪑 Seat Information</h3>
                  <div class="detail-row">
                    <span class="detail-label">Seats:</span>
                    <span class="badge">${ticket.seatNumbers.join(', ')}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Total Seats:</span>
                    <span class="badge badge-success">${ticket.seatNumbers.length}</span>
                  </div>
                </div>
                
                <div class="detail-card">
                  <h3 class="card-title">💰 Payment Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value" style="color: #28a745; font-weight: bold; font-size: 18px;">${ticket.totalAmount} MAD</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="badge ${ticket.status === 'active' ? 'badge-success' : ''}">${ticket.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              ${ticket.paymentDetails ? `
                <div class="payment-section">
                  <h3 class="card-title">💳 Payment Information</h3>
                  <div class="payment-grid">
                    <div class="payment-card">
                      <h4>Cardholder Details</h4>
                      <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${ticket.paymentDetails.cardholderName}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${ticket.paymentDetails.email}</span>
                      </div>
                    </div>
                    <div class="payment-card">
                      <h4>Card Details</h4>
                      <div class="detail-row">
                        <span class="detail-label">Type:</span>
                        <span class="badge">${ticket.paymentDetails.cardDetails?.brand?.toUpperCase() || 'N/A'}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Number:</span>
                        <span class="detail-value">**** **** **** ${ticket.paymentDetails.cardDetails?.last4 || '****'}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Expires:</span>
                        <span class="detail-value">${ticket.paymentDetails.cardDetails?.exp_month || '**'}/${ticket.paymentDetails.cardDetails?.exp_year || '****'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ` : ''}
              
              <div class="footer">
                <h4 style="margin: 0 0 20px 0; font-size: 18px;">Important Instructions</h4>
                <div class="footer-grid">
                  <div>⏰ Arrive 15 minutes early</div>
                  <div>🎫 Present ticket when boarding</div>
                  <div>📱 Keep ticket safe</div>
                  <div>📞 Contact support if needed</div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Ticket not found</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-4xl mx-auto bg-gradient-to-br from-blue-500 to-blue-700 min-h-screen">
      <div 
        id="ticket-content" 
        className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-0 shadow-2xl overflow-hidden relative border border-blue-200"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-white/10 rounded-full"></div>
          
          <h1 className="text-white m-0 text-3xl font-bold drop-shadow-lg tracking-wider">
            🚌 BUS TICKET
          </h1>
          <div className="bg-white/20 px-5 py-2 rounded-full inline-block mt-4">
            <p className="text-base font-semibold m-0 text-white tracking-wide">
              #{ticket.ticketNumber}
            </p>
          </div>
        </div>

        <div className="p-10">
          <div className="text-center mb-10 bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-dashed border-blue-500">
            <div className="inline-block p-5 bg-white rounded-2xl shadow-lg">
              <div style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <QRCode 
                  value={`${ticket.ticketNumber}|${ticket.bookingId}|${ticket.passengerName}`}
                  size={180}
                  level="M"
                  includeMargin={false}
                  style={{ 
                    display: 'block',
                    width: '180px',
                    height: '180px'
                  }}
                />
              </div>
            </div>
            <p className="mt-4 text-sm text-blue-600 font-medium">
              📱 Scan QR code for validation
            </p>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Passenger Details Card */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-200">
              <h3 className="text-blue-600 border-b-4 border-blue-500 pb-3 mb-5 text-lg font-semibold flex items-center">
                👤 Passenger Details
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-600">Name:</span> 
                  <span className="text-gray-900 font-medium">{ticket.passengerName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-600">Email:</span> 
                  <span className="text-gray-900 font-medium">{ticket.passengerEmail}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-gray-600">Booking Date:</span> 
                  <span className="text-gray-900 font-medium">{new Date(ticket.bookingDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Journey Details Card */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-200">
              <h3 className="text-blue-600 border-b-4 border-blue-500 pb-3 mb-5 text-lg font-semibold flex items-center">
                🚌 Journey Details
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-600">Route:</span> 
                  <span className="text-gray-900 font-medium">
                    {ticket.busDetails.from} → {ticket.busDetails.to}
                  </span>
                </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-600">Departure:</span>
                      <span className="text-gray-900 font-medium">
                        {ticket.busDetails.departureTime ? 
                          new Date(ticket.busDetails.departureTime).toLocaleString() : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-600">Arrival:</span>
                      <span className="text-gray-900 font-medium">
                        {ticket.busDetails.arrivalTime ? 
                          new Date(ticket.busDetails.arrivalTime).toLocaleString() : 
                          'N/A'
                        }
                      </span>
                    </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-gray-600">Bus:</span> 
                  <span className="text-gray-900 font-medium">
                    {ticket.busDetails.busNumber} {ticket.busDetails.busType ? `(${ticket.busDetails.busType})` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Seat Information Card */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-200">
              <h3 className="text-blue-600 border-b-4 border-blue-500 pb-3 mb-5 text-lg font-semibold flex items-center">
                🪑 Seat Information
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-600">Seats:</span> 
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {ticket.seatNumbers.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-gray-600">Total Seats:</span> 
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {ticket.seatNumbers.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-200">
              <h3 className="text-blue-600 border-b-4 border-blue-500 pb-3 mb-5 text-lg font-semibold flex items-center">
                💰 Payment Details
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-600">Total Amount:</span> 
                  <span className="text-green-600 font-bold text-lg">
                    {ticket.totalAmount} MAD
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-gray-600">Status:</span> 
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    ticket.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {ticket.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Information Section */}
          {ticket.paymentDetails && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl mb-8 border-2 border-blue-500">
              <h3 className="text-blue-600 border-b-4 border-blue-500 pb-3 mb-6 text-xl font-semibold flex items-center">
                💳 Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-md">
                  <h4 className="text-gray-600 mb-4 text-base font-semibold">Cardholder Details</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Name:</span> 
                      <span className="text-gray-900">{ticket.paymentDetails.cardholderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Email:</span> 
                      <span className="text-gray-900">{ticket.paymentDetails.email}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-md">
                  <h4 className="text-gray-600 mb-4 text-base font-semibold">Card Details</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Type:</span> 
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs">
                        {ticket.paymentDetails.cardDetails?.brand?.toUpperCase() || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Number:</span> 
                      <span className="text-gray-900 font-mono">
                        **** **** **** {ticket.paymentDetails.cardDetails?.last4 || '****'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Expires:</span> 
                      <span className="text-gray-900">
                        {ticket.paymentDetails.cardDetails?.exp_month || '**'}/{ticket.paymentDetails.cardDetails?.exp_year || '****'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Professional Footer */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white">
            <div className="mb-4">
              <h4 className="m-0 text-lg font-semibold">Important Instructions</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm leading-relaxed">
              <div>⏰ Arrive 15 minutes early</div>
              <div>🎫 Present ticket when boarding</div>
              <div>📱 Keep ticket safe</div>
              <div>📞 Contact support if needed</div>
            </div>
          </div>
        </div>
      </div>

              {/* Enhanced Action Buttons */}
        <div className="action-buttons text-center mt-8 flex justify-center gap-4 flex-wrap">
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={downloadTicket}
            size="large"
            className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 rounded-full px-8 py-2 h-auto text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Download PDF
          </Button>
          <Button 
            icon={<PrinterOutlined />} 
            onClick={printTicket}
            size="large"
            className="rounded-full px-8 py-2 h-auto text-base font-semibold border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            Print Ticket
          </Button>
          <Button 
            onClick={onClose}
            size="large"
            className="rounded-full px-8 py-2 h-auto text-base font-semibold"
          >
            Close
          </Button>
        </div>
    </div>
  );
};

export default TicketDownload;
