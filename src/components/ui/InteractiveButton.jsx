import React from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

const InteractiveButton = ({
  onClick,
  children,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all transform focus:outline-none focus:ring-2 focus:ring-offset-2';
  const enabledClasses = 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5';
  const disabledClasses = 'bg-gray-300 text-gray-500 cursor-not-allowed';

  return (
    <motion.button
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseClasses} ${loading || disabled ? disabledClasses : enabledClasses} ${className}`}
      whileHover={{ scale: loading || disabled ? 1 : 1.02 }}
      whileTap={{ scale: loading || disabled ? 0.98 : 0.98 }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <FaSpinner className="animate-spin mr-2" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default InteractiveButton;