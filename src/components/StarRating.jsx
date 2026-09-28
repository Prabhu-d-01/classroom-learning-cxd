import { useState } from 'react';

export default function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className="star select-none"
          style={{
            color: star <= (hovered || value) ? '#f59e0b' : 'var(--border)',
            cursor: readonly ? 'default' : 'pointer',
            filter: star <= (hovered || value) ? 'drop-shadow(0 0 4px rgba(245,158,11,0.5))' : 'none',
          }}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
