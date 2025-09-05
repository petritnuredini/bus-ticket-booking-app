import React, { useState } from 'react';
import { Button, Card, Input, message, Result, Descriptions, Tag } from 'antd';
import { QrcodeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { axiosInstance } from '../helpers/axiosInstance';

const TicketValidator = () => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateTicket = async () => {
    if (!qrCodeData.trim()) {
      message.error('Please enter QR code data');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/tickets/validate', {
        qrCodeData,
        validatedBy: 'Admin' // You can get this from user context
      });

      if (response.data.success) {
        setValidationResult({
          success: true,
          data: response.data.data
        });
        message.success('Ticket validated successfully!');
      } else {
        setValidationResult({
          success: false,
          message: response.data.message,
          data: response.data.data
        });
        message.warning(response.data.message);
      }
    } catch (error) {
      console.error('Error validating ticket:', error);
      setValidationResult({
        success: false,
        message: 'Error validating ticket'
      });
      message.error('Error validating ticket');
    } finally {
      setLoading(false);
    }
  };

  const resetValidation = () => {
    setValidationResult(null);
    setQrCodeData('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card title="🎫 Ticket Validator" style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Input.TextArea
            placeholder="Paste QR code data here or scan QR code..."
            value={qrCodeData}
            onChange={(e) => setQrCodeData(e.target.value)}
            rows={4}
            style={{ marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              type="primary"
              icon={<QrcodeOutlined />}
              onClick={validateTicket}
              loading={loading}
              disabled={!qrCodeData.trim()}
            >
              Validate Ticket
            </Button>
            <Button onClick={resetValidation}>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {validationResult && (
        <Card>
          {validationResult.success ? (
            <Result
              status="success"
              title="Ticket Validated Successfully!"
              icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              extra={
                <div>
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Ticket Number">
                      <Tag color="blue">{validationResult.data.ticketNumber}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Passenger Name">
                      {validationResult.data.passengerName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Route">
                      {validationResult.data.busDetails.from} → {validationResult.data.busDetails.to}
                    </Descriptions.Item>
                    <Descriptions.Item label="Departure Time">
                      {new Date(validationResult.data.busDetails.departureTime).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Seat Numbers">
                      {validationResult.data.seatNumbers.join(', ')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Validated At">
                      {new Date(validationResult.data.validatedAt).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Validated By">
                      {validationResult.data.validatedBy}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              }
            />
          ) : (
            <Result
              status="error"
              title="Ticket Validation Failed"
              icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              subTitle={validationResult.message}
              extra={
                validationResult.data && (
                  <div>
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label="Ticket Number">
                        <Tag color="red">{validationResult.data.ticketNumber}</Tag>
                      </Descriptions.Item>
                      {validationResult.data.usedAt && (
                        <Descriptions.Item label="Used At">
                          {new Date(validationResult.data.usedAt).toLocaleString()}
                        </Descriptions.Item>
                      )}
                      {validationResult.data.usedBy && (
                        <Descriptions.Item label="Used By">
                          {validationResult.data.usedBy}
                        </Descriptions.Item>
                      )}
                      {validationResult.data.departureTime && (
                        <Descriptions.Item label="Departure Time">
                          {new Date(validationResult.data.departureTime).toLocaleString()}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </div>
                )
              }
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default TicketValidator;
