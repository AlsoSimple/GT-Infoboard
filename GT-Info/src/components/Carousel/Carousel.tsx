import { useEffect, useState } from 'react';
import styles from './Carousel.module.scss';

interface CarouselProps<T> {
  items: T[];
  interval?: number;
  renderItem: (item: T) => React.ReactNode;
}

export function Carousel<T>({ items, interval = 5000, renderItem }: CarouselProps<T>) {
  // Track which item is shown, default 0
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // If less than 1 item, return (no timer)
    if (items.length <= 1) return;

    // move to next item
    const timer = setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % items.length);
    }, interval);

    // Clear timer item or interval changes.
    return () => clearInterval(timer);
  }, [items.length, interval]);

  // If there are no items, return nothing
  if (items.length === 0) return null;

  return (
    <div className={styles.carousel}>

      {/* Show only the current item */}
      <div className={styles.item}>
        {renderItem(items[currentIndex])}
      </div>

      {/* if more than one item = show dots*/}
      {items.length > 1 && (
        <div className={styles.dots}>
          {items.map((_, i) => (
            // add "active" class to current dot
            <span
              key={i}
              className={`${styles.dot} ${i === currentIndex ? styles.active : ''}`}
            />
          ))}
        </div>
      )}

    </div>
  );
}
