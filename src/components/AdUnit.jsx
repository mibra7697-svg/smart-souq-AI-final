import React from 'react';
import { motion } from 'framer-motion';

const AdUnit = () => {
  const containerStyle = {
    width: '100%',
    maxWidth: '728px',
    margin: 'auto',
    zIndex: 99998,
    height: 'auto',
    minHeight: '90px', // Prevents layout shift
    padding: '0.5rem 0',
  };

  const iframeStyle = {
    border: 0,
    padding: 0,
    width: '100%',
    maxWidth: '728px',
    height: '90px',
    overflow: 'hidden',
    display: 'block',
    margin: 'auto',
  };

  // Responsive styles for mobile devices
  const responsiveStyle = `
    @media (max-width: 768px) {
      #frame {
        max-width: 100% !important;
        padding: 0.25rem 0 !important;
      }
      #frame iframe {
        max-width: 100% !important;
        height: 60px !important;
      }
    }
  `;

  return (
    <>
      <style>{responsiveStyle}</style>
      <motion.div
        id="frame"
        style={containerStyle}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [1, 0.95, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        <iframe
          data-aa="2423667"
          src="//ad.a-ads.com/2423667/?size=728x90"
          style={iframeStyle}
          title="Ad"
        ></iframe>
      </motion.div>
    </>
  );
};

export default AdUnit;
