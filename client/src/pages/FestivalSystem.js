import React, { useState, useEffect } from "react";
import { Row, Col, Card, message, Tabs, Button } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import FestivalForm from "../components/FestivalForm";
import EventForm from "../components/EventForm";
import FestivalList from "../components/FestivalList";
import EventList from "../components/EventList";
import UpdateFestivalForm from "../components/UpdateFestivalForm";
import { axiosInstance } from "../helpers/axiosInstance";

const { TabPane } = Tabs;

function FestivalSystem() {
  const [festivals, setFestivals] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all festivals
  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/festivals");
      if (response.data.success) {
        setFestivals(response.data.data);
      }
    } catch (error) {
      message.error("Failed to fetch festivals");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events");
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      message.error("Failed to fetch events");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFestivals();
    fetchEvents();
  }, []);

  const handleFestivalCreated = (newFestival) => {
    setFestivals([newFestival, ...festivals]);
    message.success("Festival created successfully!");
  };

  const handleEventCreated = (newEvent) => {
    setEvents([newEvent, ...events]);
    fetchFestivals(); // Refresh to update event counts
    message.success("Event created successfully!");
  };

  const handleFestivalUpdated = (updatedFestival) => {
    setFestivals(
      festivals.map((f) =>
        f.FestivalID === updatedFestival.FestivalID ? updatedFestival : f
      )
    );
    message.success("Festival updated successfully!");
  };

  const handleFestivalDeleted = (festivalId) => {
    setFestivals(festivals.filter((f) => f.FestivalID !== festivalId));
    setEvents(events.filter((e) => e.ID_Festivalit !== festivalId));
    message.success("Festival deleted successfully!");
  };

  const handleEventDeleted = (eventId) => {
    setEvents(events.filter((e) => e.EventID !== eventId));
    fetchFestivals(); // Refresh to update event counts
    message.success("Event deleted successfully!");
  };

  return (
    <div className="p-5">
      {/* Navigation Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Festival Management System
        </h1>
        <Link to="/">
          <Button type="primary" icon={<HomeOutlined />}>
            Back to Home
          </Button>
        </Link>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="System Overview" size="small">
            <p className="text-gray-600 mb-4">
              Manage festivals and their events. Create festivals, add events,
              update information, and delete as needed.
            </p>

            <Tabs defaultActiveKey="1" type="card">
              {/* Tab 1: Add Festival */}
              <TabPane tab="Add Festival" key="1">
                <Card title="Create New Festival" size="small">
                  <FestivalForm
                    onFestivalCreated={handleFestivalCreated}
                    onRefresh={fetchFestivals}
                  />
                </Card>
                <Card title="All Festivals" size="small" className="mt-4">
                  <FestivalList
                    festivals={festivals}
                    loading={loading}
                    onRefresh={fetchFestivals}
                    onFestivalDeleted={handleFestivalDeleted}
                    showEvents={false}
                  />
                </Card>
              </TabPane>

              {/* Tab 2: Add Event */}
              <TabPane tab="Add Event" key="2">
                <Card title="Create New Event" size="small">
                  <EventForm
                    festivals={festivals}
                    onEventCreated={handleEventCreated}
                    onRefresh={fetchEvents}
                  />
                </Card>
              </TabPane>

              {/* Tab 3: Display Festivals */}
              <TabPane tab="Festivals" key="3">
                <Card title="All Festivals" size="small">
                  <p className="text-gray-600 mb-4">
                    View all festivals. Click on a festival row to expand and
                    see its events.
                  </p>
                  <FestivalList
                    festivals={festivals}
                    loading={loading}
                    onRefresh={fetchFestivals}
                    onFestivalDeleted={handleFestivalDeleted}
                    showEvents={true}
                  />
                </Card>
              </TabPane>

              {/* Tab 4: Display Events */}
              <TabPane tab="Events" key="4">
                <Card title="All Events" size="small">
                  <p className="text-gray-600 mb-4">
                    View all events with their associated festivals. Delete
                    events as needed.
                  </p>
                  <EventList
                    events={events}
                    festivals={festivals}
                    loading={loading}
                    onRefresh={fetchEvents}
                    onEventDeleted={handleEventDeleted}
                  />
                </Card>
              </TabPane>

              {/* Tab 5: Update Festival */}
              <TabPane tab="Update Festival" key="5">
                <Card title="Update Festival Information" size="small">
                  <UpdateFestivalForm
                    festivals={festivals}
                    onFestivalUpdated={handleFestivalUpdated}
                    onRefresh={fetchFestivals}
                  />
                </Card>
              </TabPane>

              {/* Tab 6: Delete Festival */}
              <TabPane tab="Delete Festival" key="6">
                <Card title="Delete Festival" size="small">
                  <p className="text-gray-600 mb-4">
                    Delete festivals from the list below. This will also delete
                    all associated events.
                  </p>
                  <FestivalList
                    festivals={festivals}
                    loading={loading}
                    onRefresh={fetchFestivals}
                    onFestivalDeleted={handleFestivalDeleted}
                    showEvents={false}
                    showDeleteOnly={true}
                  />
                </Card>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default FestivalSystem;
