import React, { useEffect, useState, useCallback } from "react";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message } from "antd";
import { Helmet } from "react-helmet";

function AdminDepartmentet() {
  const dispatch = useDispatch();
  const [departmentet, setDepartmentet] = useState([]);
  const [selectedDepartmenti, setSelectedDepartmenti] = useState(null);
  const [formData, setFormData] = useState({
    emriDepartmentit: "",
    numriIZyrave: "",
  });

  const getDepartmentet = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get("/departmentet/get-all-departmentet");
      dispatch(HideLoading());
      if (response.data.success) {
        setDepartmentet(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const deleteDepartmenti = async (_id) => {
    if (!window.confirm("A jeni te sigurt?")) return;
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.delete(`/departmentet/${_id}`);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getDepartmentet();
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
      if (selectedDepartmenti) {
        response = await axiosInstance.put(
          `/departmentet/${selectedDepartmenti._id}`,
          formData
        );
      } else {
        response = await axiosInstance.post("/departmentet/add-departmenti", formData);
      }
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getDepartmentet();
        setSelectedDepartmenti(null);
        setFormData({ emriDepartmentit: "", numriIZyrave: "" });
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleEdit = (record) => {
    setSelectedDepartmenti(record);
    setFormData({
      emriDepartmentit: record.emriDepartmentit,
      numriIZyrave: record.numriIZyrave,
    });
  };

  const handleCancel = () => {
    setSelectedDepartmenti(null);
    setFormData({ emriDepartmentit: "", numriIZyrave: "" });
  };

  useEffect(() => {
    getDepartmentet();
  }, [getDepartmentet]);

  return (
    <>
      <Helmet>
        <title>Departmentet</title>
      </Helmet>
      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "20px" }}>Departmentet</h1>

        <div style={{ marginBottom: "20px", border: "1px solid black", padding: "15px" }}>
          <h3>{selectedDepartmenti ? "Perditeso Departmentin" : "Shto Departament"}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label>Emri i Departmentit:</label>
              <input
                type="text"
                value={formData.emriDepartmentit}
                onChange={(e) => setFormData({ ...formData, emriDepartmentit: e.target.value })}
                required
                style={{ width: "100%", padding: "5px", border: "1px solid gray" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Numri i Zyrave:</label>
              <input
                type="number"
                value={formData.numriIZyrave}
                onChange={(e) => setFormData({ ...formData, numriIZyrave: e.target.value })}
                required
                style={{ width: "100%", padding: "5px", border: "1px solid gray" }}
              />
            </div>
            <button type="submit" style={{ padding: "5px 15px", marginRight: "10px" }}>
              {selectedDepartmenti ? "Perditeso" : "Shto"}
            </button>
            {selectedDepartmenti && (
              <button type="button" onClick={handleCancel} style={{ padding: "5px 15px" }}>
                Anulo
              </button>
            )}
          </form>
        </div>

        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#ddd" }}>
              <th>Emri i Departmentit</th>
              <th>Numri i Zyrave</th>
              <th>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {departmentet.map((dept) => (
              <tr key={dept._id}>
                <td>{dept.emriDepartmentit}</td>
                <td>{dept.numriIZyrave}</td>
                <td>
                  <button onClick={() => handleEdit(dept)} style={{ marginRight: "5px" }}>
                    Edit
                  </button>
                  <button onClick={() => deleteDepartmenti(dept._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminDepartmentet;

