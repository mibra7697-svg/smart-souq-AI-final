import React, { useContext } from 'react';
import { ThemeContext, fallbackTheme } from '@/contexts/ThemeContext';

const LogoSimple = ({ type = 'horizontal', size = 'normal', color = 'gradient' }) => {
  const context = useContext(ThemeContext);
  
  // Defensive context access with fallback
  const theme = context?.theme || fallbackTheme;
  
  // Defensive palette access
  const palette = theme?.palette || fallbackTheme.palette;

  // Default color scheme as fallback
  const defaultColors = { 
    primary: palette.primary?.main || fallbackTheme.palette.primary.main, 
    secondary: palette.secondary?.main || fallbackTheme.palette.secondary.main 
  };
  
  const colors = {
    gradient: { primary: '#3b82f6', secondary: '#8b5cf6' },
    blue: { primary: '#3b82f6', secondary: '#2563eb' },
    purple: { primary: '#8b5cf6', secondary: '#7c3aed' },
    teal: { primary: '#0d9488', secondary: '#14b8a6' },
    white: { primary: '#ffffff', secondary: '#f1f5f9' }, // Added white color scheme
    default: defaultColors
  };

  // Default size as fallback
  const defaultSizes = { icon: 24, text: '0.95rem', subtext: '0.7rem' };
  
  const sizes = {
    small: { icon: 18, text: '0.8rem', subtext: '0.65rem' },
    normal: { icon: 24, text: '0.95rem', subtext: '0.7rem' },
    large: { icon: 32, text: '1.1rem', subtext: '0.8rem' },
    xlarge: { icon: 40, text: '1.3rem', subtext: '0.9rem' }, // Added xlarge size
    default: defaultSizes
  };

  // Robust destructuring with fallback mechanism
  const selectedColors = colors[color] || colors['default'] || defaultColors;
  const selectedSizes = sizes[size] || sizes['default'] || defaultSizes;
  
  // Error boundary: Ensure we have valid color and size objects
  if (!selectedColors || !selectedSizes) {
    console.error(`LogoSimple: Critical error - colors or sizes configuration is missing.`);
    return null;
  }
  
  // Destructure with fallback values
  const { primary = defaultColors.primary, secondary = defaultColors.secondary } = selectedColors;
  const { icon = defaultSizes.icon, text = defaultSizes.text, subtext = defaultSizes.subtext } = selectedSizes;
  
  // Final safety check: If critical values are still missing, return null
  if (!primary || !secondary || !icon) {
    console.warn(`LogoSimple: Invalid configuration for color="${color}", size="${size}". Returning null to prevent crash.`);
    return null;
  }

  const Icon = () => (
    <div style={{
      width: `${icon}px`,
      height: `${icon}px`,
      background: `linear-gradient(135deg, ${primary}, ${secondary})`,
      borderRadius: '6px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 2px 8px ${primary}40`
    }}>
      {/* رمز موجات الذكاء الاصطناعي */}
      <div style={{
        position: 'relative',
        width: `${icon * 0.6}px`,
        height: `${icon * 0.4}px`,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            width: `${icon * 0.1}px`,
            height: `${(icon * 0.25) * (i/3)}px`,
            background: 'white',
            borderRadius: '1px',
            animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
          }}></div>
        ))}
      </div>
      
      {/* رمز AI صغير */}
      <div style={{
        position: 'absolute',
        bottom: '1px',
        right: '1px',
        color: 'white',
        fontSize: `${icon * 0.18}px`,
        fontWeight: 'bold',
        opacity: '0.9'
      }}>AI</div>
    </div>
  );

  const Text = () => (
    <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
      <div style={{
        fontSize: text,
        fontWeight: '800',
        background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        سمارت سوق
      </div>
      <div style={{
        fontSize: subtext,
        color: '#64748b',
        fontWeight: '500',
        letterSpacing: '0.3px'
      }}>
        Smart Souq AI
      </div>
    </div>
  );

  if (type === 'icon') return <Icon />;
  if (type === 'text') return <Text />;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: type === 'horizontal' ? '8px' : '4px',
      flexDirection: type === 'vertical' ? 'column' : 'row'
    }}>
      <Icon />
      <Text />
    </div>
  );
};

export default LogoSimple;