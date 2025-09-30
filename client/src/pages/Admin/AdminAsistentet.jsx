import React, { useEffect, useState, useCallback } from "react";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message } from "antd";
import { Helmet } from "react-helmet";

function AdminAsistentet() {
  const dispatch = useDispatch();
  const [asistentet, setAsistentet] = useState([]);
  const [departmentet, setDepartmentet] = useState([]);
  const [selectedAsistenti, setSelectedAsistenti] = useState(null);
  const [filterDepartmenti, setFilterDepartmenti] = useState("");
  const [formData, setFormData] = useState({
    emri: "",
    mbiemri: "",
    pozita: "",
    ID_Departmenti: "",
  });

  const getDepartmentet = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/departmentet/get-all-departmentet");
      if (response.data.success) {
        setDepartmentet(response.data.data);
      }
    } catch (error) {
      message.error(error.message);
    }
  }, []);

  const getAsistentet = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      let response;
      if (filterDepartmenti) {
        response = await axiosInstance.get(
          `/asistentet/by-departmenti/${filterDepartmenti}`
        );
      } else {
        response = await axiosInstance.get("/asistentet/get-all-asistentet");
      }
      dispatch(HideLoading());
      if (response.data.success) {
        setAsistentet(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, filterDepartmenti]);

  const deleteAsistenti = async (_id) => {
    if (!window.confirm("A jeni te sigurt?")) return;
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.delete(`/asistentet/${_id}`);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getAsistentet();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(ShowLoading());
      let response = null;
      if (selectedAsistenti) {
        response = await axiosInstance.put(
          `/asistentet/${selectedAsistenti._id}`,
          formData
        );
      } else {
        response = await axiosInstance.post("/asistentet/add-asistenti", formData);
      }
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getAsistentet();
        setSelectedAsistenti(null);
        setFormData({ emri: "", mbiemri: "", pozita: "", ID_Departmenti: "" });
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleEdit = (record) => {
    setSelectedAsistenti(record);
    setFormData({
      emri: record.emri,
      mbiemri: record.mbiemri,
      pozita: record.pozita,
      ID_Departmenti: record.ID_Departmenti?._id || "",
    });
  };

  const handleCancel = () => {
    setSelectedAsistenti(null);
    setFormData({ emri: "", mbiemri: "", pozita: "", ID_Departmenti: "" });
  };

  useEffect(() => {
    getDepartmentet();
  }, [getDepartmentet]);

  useEffect(() => {
    getAsistentet();
  }, [getAsistentet]);

  return (
    <>
      <Helmet>
        <title>Asistentet</title>
      </Helmet>
      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "20px" }}>Asistentet</h1>

        <div style={{ marginBottom: "20px", border: "1px solid black", padding: "15px" }}>
          <h3>{selectedAsistenti ? "Perditeso Asistentin" : "Shto Asistent"}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label>Emri:</label>
              <input
                type="text"
                value={formData.emri}
                onChange={(e) => setFormData({ ...formData, emri: e.target.value })}
                required
                style={{ width: "100%", padding: "5px", border: "1px solid gray" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Mbiemri:</label>
              <input
                type="text"
                value={formData.mbiemri}
                onChange={(e) => setFormData({ ...formData, mbiemri: e.target.value })}
                required
                style={{ width: "100%", padding: "5px", border: "1px solid gray" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Pozita:</label>
              <input
                type="text"
                value={formData.pozita}
                onChange={(e) => setFormData({ ...formData, pozita: e.target.value })}
                required
                style={{ width: "100%", padding: "5px", border: "1px solid gray" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Departmenti:</label>
              <select
                value={formData.ID_Departmenti}
                onChange={(e) => setFormData({ ...formData, ID_Departmenti: e.target.value })}
                required
                style={{ width: "100%", padding: "5px", border: "1px solid gray" }}
              >
                <option value="">Zgjedh departmentin</option>
                {departmentet.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.emriDepartmentit}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" style={{ padding: "5px 15px", marginRight: "10px" }}>
              {selectedAsistenti ? "Perditeso" : "Shto"}
            </button>
            {selectedAsistenti && (
              <button type="button" onClick={handleCancel} style={{ padding: "5px 15px" }}>
                Anulo
              </button>
            )}
          </form>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Filtro sipas Departmentit: </label>
          <select
            value={filterDepartmenti}
            onChange={(e) => setFilterDepartmenti(e.target.value)}
            style={{ padding: "5px", border: "1px solid gray" }}
          >
            <option value="">Te gjitha</option>
            {departmentet.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.emriDepartmentit}
              </option>
            ))}
          </select>
        </div>

        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#ddd" }}>
              <th>Emri</th>
              <th>Mbiemri</th>
              <th>Pozita</th>
              <th>Departmenti</th>
              <th>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {asistentet.map((asistenti) => (
              <tr key={asistenti._id}>
                <td>{asistenti.emri}</td>
                <td>{asistenti.mbiemri}</td>
                <td>{asistenti.pozita}</td>
                <td>{asistenti.ID_Departmenti?.emriDepartmentit || "N/A"}</td>
                <td>
                  <button onClick={() => handleEdit(asistenti)} style={{ marginRight: "5px" }}>
                    Edit
                  </button>
                  <button onClick={() => deleteAsistenti(asistenti._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminAsistentet;

