import { useEffect, useState } from 'react';

const BackToTop = ({ 
  showAfter = 300, 
  children = '↑',
  className = '',
  ariaLabel = 'Back to top'
}) => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    setVisible(scrolled > showAfter);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
    return () => {
      window.removeEventListener('scroll', toggleVisible);
    };
  }, [showAfter]);

  return (
    <button 
      className={`back-to-top ${visible ? 'visible' : ''} ${className}`}
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      tabIndex={visible ? 0 : -1}
      style={{ display: visible ? 'flex' : 'none' }}
      role="button"
    >
      {children}
    </button>
  );
};

export default BackToTop;
