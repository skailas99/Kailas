import { useState } from "react";

const PlantDetail = ({
  plant,
  isBookmarked,
  onToggleBookmark,
  note,
  onSaveNote,
}) => {
  const [rotation, setRotation] = useState(25);
  const [zoom, setZoom] = useState(1);

  if (!plant) {
    return <p>Select a plant to see details.</p>;
  }

  const handleShare = async () => {
    const shareText = `${plant.common_name} (${plant.botanical_name}) — uses: ${
      plant.medicinal_uses?.join(", ") || "N/A"
    }`;

    if (navigator.share) {
      await navigator.share({
        title: `Virtual Herbal Garden: ${plant.common_name}`,
        text: shareText,
      });
      return;
    }

    await navigator.clipboard.writeText(shareText);
  };

  return (
    <div className="plant-detail">
      <div className="detail-header">
        <div>
          <h3>{plant.common_name}</h3>
          <p className="muted">{plant.botanical_name}</p>
          <p className="muted">Region: {plant.region}</p>
        </div>
        <div className="actions">
          <button type="button" onClick={() => onToggleBookmark(plant._id)}>
            {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
          </button>
          <button type="button" onClick={handleShare}>
            Share
          </button>
        </div>
      </div>

      <section>
        <h4>Interactive 3D view (simulated)</h4>
        <div className="model-stage">
          <div
            className="model-card"
            style={{ transform: `rotateY(${rotation}deg) scale(${zoom})` }}
          >
            <p className="emoji">{plant.model_emoji || "🌿"}</p>
            <p>{plant.common_name}</p>
          </div>
        </div>
        <div className="slider-row">
          <label>
            Rotate
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(event) => setRotation(Number(event.target.value))}
            />
          </label>
          <label>
            Zoom
            <input
              type="range"
              min="0.8"
              max="1.6"
              step="0.1"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
          </label>
        </div>
      </section>

      <div className="detail-grid">
        <div>
          <h4>Common names</h4>
          <ul>
            {plant.common_names?.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Uses</h4>
          <ul>
            {plant.medicinal_uses?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Habitat</h4>
          <p>{plant.habitat || "Not available"}</p>
          <h4>Cultivation</h4>
          <p>{plant.cultivation || "Not available"}</p>
        </div>
        <div>
          <h4>Parts used</h4>
          <ul>
            {plant.part_used?.map((part) => (
              <li key={part}>{part}</li>
            ))}
          </ul>
          <h4>Dosage forms</h4>
          <ul>
            {plant.dosage_form?.map((form) => (
              <li key={form}>{form}</li>
            ))}
          </ul>
        </div>
      </div>

      <section className="media-grid">
        <article>
          <h4>Image</h4>
          <img src={plant.image_url} alt={plant.common_name} loading="lazy" />
        </article>
        <article>
          <h4>Video</h4>
          <a href={plant.video_url} target="_blank" rel="noreferrer">
            Watch cultivation / usage video
          </a>
        </article>
        <article>
          <h4>Audio guide</h4>
          <audio controls src={plant.audio_url}>
            <track kind="captions" />
          </audio>
        </article>
      </section>

      <section>
        <h4>Personal notes</h4>
        <textarea
          value={note}
          placeholder="Write your observations, dosage reminders, or study notes..."
          onChange={(event) => onSaveNote(plant._id, event.target.value)}
        />
      </section>
    </div>
  );
};

export default PlantDetail;
