import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";

function AdminDashboardSummary() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) return navigate("/kazisiba-admin/login");

    try {
      const res = await fetch("http://localhost:5000/api/v1/admin/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
        });


      if (!res.ok) throw new Error("Failed to fetch dashboard data");

      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;
  if (!dashboardData) return null;

  const { totals, recent_items } = dashboardData;

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>

      {/* Totals */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Materials</h5>
              <p className="card-text display-6">{totals.materials}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Projects</h5>
              <p className="card-text display-6">{totals.projects}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Gallery Items</h5>
              <p className="card-text display-6">{totals.gallery_items}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="mt-5">
        <h4>Recent Materials</h4>
        <div className="d-flex flex-wrap gap-3 mt-2">
          {recent_items.materials.map((m) => (
            <div key={m.id} className="card p-2" style={{ width: "150px" }}>
              {m.media_type === "image" ? (
                <img src={m.media_url} alt={`Material ${m.id}`} className="img-fluid" />
              ) : (
                <video src={m.media_url} className="img-fluid" controls />
              )}
            </div>
          ))}
        </div>

        <h4 className="mt-4">Recent Projects</h4>
        <div className="d-flex flex-wrap gap-3 mt-2">
          {recent_items.projects.map((p) => (
            <div key={p.id} className="card p-2" style={{ width: "150px" }}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="img-fluid" />
              ) : p.video_url ? (
                <video src={p.video_url} className="img-fluid" controls />
              ) : (
                <div>No media</div>
              )}
              <div className="mt-1 text-center">{p.title}</div>
            </div>
          ))}
        </div>

        <h4 className="mt-4">Recent Gallery Items</h4>
        <div className="d-flex flex-wrap gap-3 mt-2">
          {recent_items.gallery.map((g) => (
            <div key={g.id} className="card p-2" style={{ width: "150px" }}>
              {g.media_type === "image" ? (
                <img src={g.image_url} alt={`Gallery ${g.id}`} className="img-fluid" />
              ) : (
                <video src={g.image_url} className="img-fluid" controls />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardSummary;
