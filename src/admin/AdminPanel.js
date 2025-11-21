import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

function UniversalAdminPanel() {
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newFile, setNewFile] = useState(null);
  const navigate = useNavigate();

  const API_BASES = [
    { name: "Projects", url: "http://localhost:5000/api/v1/projects/" },
    { name: "Gallery", url: "http://localhost:5000/api/v1/gallery/" },
    { name: "Materials", url: "http://localhost:5000/api/v1/materials/" }
  ];

  // Fetch all items
  const fetchAll = async () => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      navigate("/kazisiba-admin/login");
      return;
    }

    setLoading(true);
    setError(null);
    let combined = [];

    for (const api of API_BASES) {
      try {
        const res = await fetch(api.url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch ${api.name}: ${res.status}`);
        }

        const data = await res.json();
        let items = [];

        if (api.name === "Projects") {
          // Project backend returns array of projects
          items = data.map(p => ({
            id: p.id,
            title: p.title || `Project ${p.id}`,
            type: p.video_url ? "video" : "image",
            src: p.video_url || p.image_url,
            source: "Project",
            created_at: p.created_at || null
          }));
        } else if (api.name === "Gallery") {
          // Gallery backend returns { gallery: [...] }
          items = (data.gallery || []).map(g => ({
            id: g.id,
            title: `Media ${g.id}`,
            type: g.media_type,
            src: g.media_url,
            source: "Gallery",
            created_at: g.created_at || null
          }));
        } else if (api.name === "Materials") {
          // Materials backend returns { materials: [...] }
          items = (data.materials || []).map(m => ({
            id: m.id,
            title: `Material ${m.id}`,
            type: m.media_type,
            src: m.media_url,
            source: "Material",
            created_at: m.created_at || null
          }));
        }

        combined = combined.concat(items);
      } catch (err) {
        console.error(`Error fetching ${api.name}:`, err);
        setError(`Failed to load ${api.name}`);
      }
    }

    setAllFiles(combined);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Editing / Deleting
  const startEdit = (item) => {
    setEditingItem(item);
    setNewTitle(item.title);
    setNewFile(null);
  };
  const cancelEdit = () => {
    setEditingItem(null);
    setNewTitle("");
    setNewFile(null);
  };
  const saveEdit = async () => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) return navigate("/kazisiba-admin/login");

    let endpoint = "";
    if (editingItem.source === "Project") endpoint = `http://localhost:5000/api/v1/projects/${editingItem.id}`;
    if (editingItem.source === "Gallery") endpoint = `http://localhost:5000/api/v1/gallery/${editingItem.id}`;
    if (editingItem.source === "Material") endpoint = `http://localhost:5000/api/v1/materials/${editingItem.id}`;

     const formData = new FormData();
        formData.append("title", newTitle);

        if (editingItem.source === "Material" && newFile) {
            // Always send file as 'file' for Material
            formData.append("file", newFile);
            formData.append("media_type", editingItem.type); // tell backend whether image or video
        } else if (newFile) {
            // For Projects/Gallery you can keep your old logic if backend expects 'image'/'video'
            formData.append(editingItem.type === "video" ? "video" : "image", newFile);
        }

        try {
            const res = await fetch(endpoint, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
            });
            if (!res.ok) throw new Error("Update failed");
            cancelEdit();
            fetchAll();
        } catch (err) {
            console.error(err);
        }
        };
  const deleteFile = async (item) => {
    if (!window.confirm(`Delete this ${item.source}?`)) return;
    const token = sessionStorage.getItem("adminToken");
    if (!token) return navigate("/kazisiba-admin/login");

    let endpoint = "";
    if (item.source === "Project") endpoint = `http://localhost:5000/api/v1/projects/${item.id}`;
    if (item.source === "Gallery") endpoint = `http://localhost:5000/api/v1/gallery/${item.id}`;
    if (item.source === "Material") endpoint = `http://localhost:5000/api/v1/materials/${item.id}`;

    try {
      const res = await fetch(endpoint, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Delete failed");
      setAllFiles(allFiles.filter(f => !(f.id === item.id && f.source === item.source)));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Render ----------
  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;
  if (allFiles.length === 0) return <div className="container mt-4">No data found</div>;

  return (
    <div className="container mt-4">
      <h2>Universal Admin Panel</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Title / Name</th>
            <th>Type</th>
            <th>Source</th>
            <th>Preview</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allFiles.map(item => (
            <tr key={`${item.source}-${item.id}`}>
              <td>
                {editingItem?.id === item.id && editingItem.source === item.source ? (
                  <input className="form-control" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                ) : (
                  item.title
                )}
              </td>
              <td>{item.type}</td>
              <td>{item.source}</td>
              <td>
                {editingItem?.id === item.id && editingItem.source === item.source ? (
                  <input type="file" accept={item.type === "image" ? "image/*" : "video/*"} onChange={e => setNewFile(e.target.files[0])} />
                ) : item.type === "image" ? (
                  <img src={item.src} width="120" alt={item.title} />
                ) : (
                  <video src={item.src} width="120" controls />
                )}
              </td>
              <td>{item.created_at ? new Date(item.created_at).toLocaleString() : '-'}</td>
              <td>
                {editingItem?.id === item.id && editingItem.source === item.source ? (
                  <>
                    <button className="btn btn-sm btn-success me-2" onClick={saveEdit}><i className="bi bi-check-lg"></i> Save</button>
                    <button className="btn btn-sm btn-secondary" onClick={cancelEdit}><i className="bi bi-x-lg"></i> Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => startEdit(item)}><i className="bi bi-pencil"></i> Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteFile(item)}><i className="bi bi-trash"></i> Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UniversalAdminPanel;
