import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/Gallery.css';

const API_URL = process.env.REACT_APP_URL;


function Gallery() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [dynamicMedia, setDynamicMedia] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/gallery/");
        if (!res.ok) throw new Error("Failed to fetch gallery media");

        const data = await res.json();

        const formatted = data.gallery.map(item => ({
          id: item.id,
          src: item.media_url, // already full URL from backend
          type: item.media_type
        }));

        setDynamicMedia(formatted);
      } catch (err) {
        console.error("Error fetching gallery media:", err);
      }
    };

    fetchGallery();
  }, []);

  const hardcodedMedia = [
    { id: 1, src: "/images/videoframe_4594.png", type: "image" },
    { id: 2, src: "/images/neon-robot-vacuum-cleaner (1).jpg", type: "image" },
    { id: 3, src: "/images/283d0c8ac5ed5f365c9c8d58d3a3518f.jpg", type: "image" },
    { id: 4, src: "/images/74d4ce458519225ba04a97f28c245eb8.jpg", type: "image" },
    { id: 5, src: "/images/futuristic-kitchen-interior-design.jpg", type: "image" },
    { id: 6, src: "/images/3d-rendering-classic-interior.jpg", type: "image" },
    { id: 7, src: "/images/3d-rendering-modern-dining-room-living-room-with-luxury-decor.jpg", type: "image" },
    { id: 8, src: "/images/3d-room-interior-with-classic-design-furniture.jpg", type: "image" },
    { id: 9, src: "/images/96e6e6af520f3436de260b40653f2b74.jpg", type: "image" },
    { id: 10, src: "/images/0c70f62259e753379958cb940e89e1e2.jpg", type: "image" }
    
  ];

  const mediaItems = [...dynamicMedia, ...hardcodedMedia];

  const openMedia = (item) => {
    setSelectedMedia(item.src);
    setIsVideo(item.type === "video");
  };

  const closeMedia = () => {
    setSelectedMedia(null);
    setIsVideo(false);
  };

  return (
    <div className="gallery-container">
      <h1 className="gallery-title">Our Gallery</h1>
      <p className="gallery-subtitle">
        Showcasing our latest designs and projects<br/>
        Choose your best design and let Kazisiba style it within the shortest period of time
      </p>

      <div className="gallery-grid">
        {mediaItems.map((item) => (
          <div key={item.id} className="gallery-item" onClick={() => openMedia(item)}>
            {item.type === "image" ? (
              <img src={item.src} alt="" className="gallery-img" />
            ) : (
              <video src={item.src} className="gallery-img" />
            )}
          </div>
        ))}
      </div>

      {selectedMedia && (
        <div className="lightbox" onClick={closeMedia}>
          <span className="close">&times;</span>
          {isVideo ? (
            <video src={selectedMedia} controls autoPlay className="lightbox-img" />
          ) : (
            <img src={selectedMedia} alt="Selected" className="lightbox-img" />
          )}
        </div>
      )}
    </div>
  );
}

export default Gallery;
