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
    printWindow.document.write(`
      <html>
        <head>
          <title>Bus Ticket - ${ticket.ticketNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .ticket { border: 2px solid #000; padding: 20px; max-width: 600px; }
            .header { text-align: center; margin-bottom: 20px; }
            .qr-code { text-align: center; margin: 20px 0; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .detail-item { margin: 5px 0; }
            .label { font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          ${ticketElement.innerHTML}
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div id="ticket-content" style={{ 
        border: '2px solid #1890ff', 
        borderRadius: '10px', 
        padding: '30px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1890ff', margin: 0 }}>🚌 BUS TICKET</h1>
          <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>
            Ticket #: {ticket.ticketNumber}
          </p>
        </div>

        {/* QR Code */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <QRCode 
            value={JSON.stringify({
              ticketNumber: ticket.ticketNumber,
              bookingId: ticket.bookingId,
              passengerName: ticket.passengerName
            })}
            size={150}
            style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#fff' }}
          />
          <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            Scan this QR code for validation
          </p>
        </div>

        {/* Ticket Details */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: '5px' }}>
              Passenger Details
            </h3>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Name:</span> {ticket.passengerName}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Email:</span> {ticket.passengerEmail}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Booking Date:</span> {new Date(ticket.bookingDate).toLocaleDateString()}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: '5px' }}>
              Journey Details
            </h3>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Route:</span> {ticket.busDetails.from} → {ticket.busDetails.to}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Departure:</span> {new Date(ticket.busDetails.departureTime).toLocaleString()}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Arrival:</span> {new Date(ticket.busDetails.arrivalTime).toLocaleString()}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Bus:</span> {ticket.busDetails.busNumber} ({ticket.busDetails.busType})
            </div>
          </div>
        </div>

        {/* Seat and Payment Details */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: '5px' }}>
              Seat Information
            </h3>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Seats:</span> {ticket.seatNumbers.join(', ')}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Total Seats:</span> {ticket.seatNumbers.length}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: '5px' }}>
              Payment Details
            </h3>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Total Amount:</span> {ticket.totalAmount} MAD
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Status:</span> 
              <span style={{ 
                color: ticket.status === 'active' ? '#52c41a' : '#ff4d4f',
                fontWeight: 'bold',
                marginLeft: '5px'
              }}>
                {ticket.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

       
        {ticket.paymentDetails && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ 
              color: '#1890ff', 
              borderBottom: '2px solid #1890ff', 
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              💳 Card Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>Cardholder Name:</span> {ticket.paymentDetails.cardholderName}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>Email:</span> {ticket.paymentDetails.email}
                </div>
              </div>
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>Card Type:</span> {ticket.paymentDetails.cardDetails?.brand?.toUpperCase() || 'N/A'}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>Card Number:</span> **** **** **** {ticket.paymentDetails.cardDetails?.last4 || '****'}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>Expires:</span> {ticket.paymentDetails.cardDetails?.exp_month || '**'}/{ticket.paymentDetails.cardDetails?.exp_year || '****'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px', 
          padding: '15px',
          backgroundColor: '#f0f8ff',
          borderRadius: '5px',
          border: '1px solid #1890ff'
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
            Please arrive at the bus station 15 minutes before departure time.
            <br />
            Keep this ticket safe and present it when boarding the bus.
            <br />
            For any queries, contact our customer support.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={downloadTicket}
          size="large"
          style={{ marginRight: '10px' }}
        >
          Download PDF
        </Button>
        <Button 
          icon={<PrinterOutlined />} 
          onClick={printTicket}
          size="large"
          style={{ marginRight: '10px' }}
        >
          Print Ticket
        </Button>
        <Button onClick={onClose} size="large">
          Close
        </Button>
      </div>
    </div>
  );
};

export default TicketDownload;
