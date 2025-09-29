import React, { useState, useEffect } from "react";
import { Row, Col, Card, message, Tabs } from "antd";
import PlanetForm from "../components/PlanetForm";
import SatelliteForm from "../components/SatelliteForm";
import PlanetList from "../components/PlanetList";
import SatelliteList from "../components/SatelliteList";
import UpdatePlanetTypeForm from "../components/UpdatePlanetTypeForm";
import DeleteSatellitesForm from "../components/DeleteSatellitesForm";
import { axiosInstance } from "../helpers/axiosInstance";

const { TabPane } = Tabs;

function PlanetSatelliteSystem() {
  const [planets, setPlanets] = useState([]);
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  // Fetch planets from API
  const fetchPlanets = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/planets");
      if (response.data.success) {
        setPlanets(response.data.data);
      }
    } catch (error) {
      message.error("Error fetching planets: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch satellites from API
  const fetchSatellites = async (excludeId = null) => {
    try {
      setLoading(true);
      let url = "/satellites";
      if (excludeId) {
        url += `?ID-ne=${excludeId}`;
      }

      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setSatellites(response.data.data);
      }
    } catch (error) {
      message.error("Error fetching satellites: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPlanets();
    fetchSatellites();
  }, []);

  // Handle planet creation
  const handlePlanetCreated = (newPlanet) => {
    setPlanets([...planets, newPlanet]);
    message.success("Planet created successfully!");
  };

  // Handle satellite creation
  const handleSatelliteCreated = (newSatellite) => {
    setSatellites([...satellites, newSatellite]);
    message.success("Satellite created successfully!");
  };

  // Handle planet type update
  const handlePlanetTypeUpdated = (updatedPlanet) => {
    setPlanets(
      planets.map((planet) =>
        planet.Name === updatedPlanet.Name ? updatedPlanet : planet
      )
    );
    message.success("Planet type updated successfully!");
  };

  // Handle satellites deletion
  const handleSatellitesDeleted = (deletedCount, planetName) => {
    // Refresh satellites list to reflect deletions
    fetchSatellites();
    message.success(
      `${deletedCount} satellites deleted for planet "${planetName}"`
    );
  };

  // Handle individual satellite deletion
  const handleSatelliteDeleted = (satelliteId) => {
    setSatellites(satellites.filter((sat) => sat.SatelliteId !== satelliteId));
    message.success("Satellite deleted successfully!");
  };

  // Handle planet deletion
  const handlePlanetDeleted = (planetId, deletedSatellitesCount) => {
    setPlanets(planets.filter((planet) => planet.PlanetId !== planetId));
    // Also refresh satellites list to remove deleted satellites
    fetchSatellites();
    message.success(
      `Planet deleted successfully along with ${deletedSatellitesCount} satellites!`
    );
  };

  return (
    <div className="p-5">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Planet-Satellite Management System" className="w-full">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              {/* Tab 1: Insert Planet */}
              <TabPane tab="Insert Planet" key="1">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="Create New Planet" size="small">
                      <PlanetForm onPlanetCreated={handlePlanetCreated} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Planets List" size="small">
                      <PlanetList
                        planets={planets}
                        loading={loading}
                        onRefresh={fetchPlanets}
                        onPlanetDeleted={handlePlanetDeleted}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              {/* Tab 2: Insert Satellite */}
              <TabPane tab="Insert Satellite" key="2">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="Create New Satellite" size="small">
                      <SatelliteForm
                        planets={planets}
                        onSatelliteCreated={handleSatelliteCreated}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Satellites List" size="small">
                      <SatelliteList
                        satellites={satellites}
                        loading={loading}
                        onRefresh={fetchSatellites}
                        onSatelliteDeleted={handleSatelliteDeleted}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              {/* Tab 3: Update Planet Type */}
              <TabPane tab="Update Planet Type" key="3">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="Update Planet Type" size="small">
                      <UpdatePlanetTypeForm
                        planets={planets}
                        onPlanetTypeUpdated={handlePlanetTypeUpdated}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Current Planets" size="small">
                      <PlanetList
                        planets={planets}
                        loading={loading}
                        onRefresh={fetchPlanets}
                        onPlanetDeleted={handlePlanetDeleted}
                        showTypeOnly={true}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              {/* Tab 4: Delete Satellites */}
              <TabPane tab="Delete Satellites" key="4">
                <DeleteSatellitesForm
                  planets={planets}
                  onSatellitesDeleted={handleSatellitesDeleted}
                />
              </TabPane>

              {/* Tab 5: Satellites */}
              <TabPane tab="Satellites" key="5">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card title="Filter Satellites (Hide Deleted)" size="small">
                      <p className="mb-3">
                        This view automatically hides deleted satellites. Use
                        the ID-ne parameter to exclude specific satellites.
                      </p>
                      <SatelliteList
                        satellites={satellites}
                        loading={loading}
                        onRefresh={fetchSatellites}
                        onSatelliteDeleted={handleSatelliteDeleted}
                        showFilterOptions={true}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlanetSatelliteSystem;
