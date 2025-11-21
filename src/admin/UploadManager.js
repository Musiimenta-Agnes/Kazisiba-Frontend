
// import React, { useState } from "react";
// import "./Styles.css";

// const UploadManager = () => {
//   const [file, setFile] = useState(null);
//   const [video, setVideo] = useState(null);
//   const [title, setTitle] = useState("");
//   const [page, setPage] = useState("gallery");
//   // const [section, setSection] = useState("");

//   // Define sections for pages, but materials has no subsections
//   const sectionsByPage = {
//     gallery: [],
//     projects: [],
//     homepage: [],
//     materials: [], // <-- no subsections
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Only require section if page has subsections
//     if (!file || !title || (sectionsByPage[page].length > 0 && !section)) {
//       alert("Please fill all required fields and select a file/section if required.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", title);
//     formData.append("page", page);
//     if (section) formData.append("section", section);

//     try {
//       const res = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("File uploaded successfully!");
//         setFile(null);
//         setTitle("");
//         setPage("gallery");
//         setSection("");
//       } else {
//         alert(data.message || "Upload failed.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("An error occurred while uploading.");
//     }
//   };

//   return (
//     <div className="upload-page fade-in">
//       <h2 className="upload-title">Upload Media</h2>
//       <p className="upload-subtext">Upload images or videos to the website.</p>

//       <form className="upload-form slide-up" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Select File</label>
//           <input
//             type="file"
//             accept="image/*,video/*"
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//         </div>

//         <div className="form-group">
//           <label>Title</label>
//           <input
//             type="text"
//             placeholder="Enter title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label>Choose Page</label>
//           <select
//             value={page}
//             onChange={(e) => {
//               setPage(e.target.value);
//               setSection("");
//             }}
//           >
//             <option value="gallery">Gallery</option>
//             <option value="projects">Projects</option>
//             <option value="materials">Materials</option>
          
//           </select>
//         </div>

//         {/* Only show section selector if the page has sections */}
//         {sectionsByPage[page].length > 0 && (
//           <div className="form-group">
//             <label>Choose Section</label>
//             <select value={section} onChange={(e) => setSection(e.target.value)}>
//               <option value="">-- None --</option>
//               {sectionsByPage[page].map((sec) => (
//                 <option key={sec} value={sec}>
//                   {sec.charAt(0).toUpperCase() + sec.slice(1)}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         <button type="submit" className="btn-upload glow-button">
//           Upload
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UploadManager;

import React, { useState } from "react";
import "./Styles.css";

const UploadManager = () => {
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState("gallery");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Choose API based on page
  const getEndpoint = () => {
    if (page === "materials") return `${API_URL}/api/v1/materials/`;
    if (page === "gallery") return `${API_URL}/api/v1/gallery/`;
    if (page === "projects") return `${API_URL}/api/v1/projects/`;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("adminToken");
    if (!token) return alert("Not authenticated. Please log in again.");

    const endpoint = getEndpoint();
    if (!endpoint) return alert("Invalid page selected!");

    const formData = new FormData();

    // ====================================
    // 🔥 MATERIALS or GALLERY (image/video)
    // ====================================
    if (page === "materials" || page === "gallery") {
      if (!file) return alert("Please choose a file.");

      const ext = file.name.split(".").pop().toLowerCase();
      const media_type =
        ["mp4", "mov", "avi", "mkv"].includes(ext) ? "video" : "image";

      formData.append("file", file);
      formData.append("media_type", media_type);
    }

    // ====================================
    // 🔥 PROJECTS (title, image?, video?)
    // ====================================
    if (page === "projects") {
      if (!title) return alert("Project title is required");

      formData.append("title", title);
      if (file) formData.append("image", file); // image
      if (video) formData.append("video", video); // video
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Uploaded successfully!");
        setFile(null);
        setVideo(null);
        setTitle("");
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while uploading.");
    }
  };

  return (
    <div className="upload-page fade-in">
      <h2 className="upload-title">Upload Media</h2>
      <p className="upload-subtext">Upload images or videos to the website.</p>

      <form className="upload-form slide-up" onSubmit={handleSubmit}>
        
        {/* Title (Projects only) */}
        {page === "projects" && (
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Select Image</label>
          <input
            type="file"
            accept="image/*, video/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {page === "projects" && (
          <div className="form-group">
            <label>Select Video (Optional)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </div>
        )}

        <div className="form-group">
          <label>Choose Page</label>
          <select value={page} onChange={(e) => setPage(e.target.value)}>
            <option value="gallery">Gallery</option>
            <option value="projects">Projects</option>
            <option value="materials">Materials</option>
          </select>
        </div>

        <button type="submit" className="btn-upload glow-button">
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadManager;
