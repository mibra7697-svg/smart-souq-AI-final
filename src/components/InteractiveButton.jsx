import React from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

const InteractiveButton = ({
  onClick,
  children,
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full py-3 px-4 rounded-xl font-semibold transition-all transform focus:outline-none focus:ring-2 focus:ring-offset-2';
  const enabledClasses = 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:-translate-y-0.5';
  const disabledClasses = 'bg-gray-300 text-gray-500 cursor-not-allowed';

  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseClasses} ${isLoading || disabled ? disabledClasses : enabledClasses} ${className}`}
      whileHover={{ scale: isLoading || disabled ? 1 : 1.03 }}
      whileTap={{ scale: isLoading || disabled ? 0.98 : 0.98 }}
      {...props}
    >
      {isLoading ? (
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
