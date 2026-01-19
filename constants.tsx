
import React from 'react';

export const COLORS = {
  brand: '#D30000', // Vibrant Red from the provided logo
  dark: '#0f0f0f',
  light: '#FAFAFA',
  accent: '#FF0000'
};

export const Logo = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="relative w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
      {/* 
        This SVG is designed to mimic the brushed, artistic 'S & F' logo provided.
        It uses a high-contrast red and a stylistic font-weight to capture the essence 
        of the hand-painted original.
      */}
      <svg viewBox="0 0 100 100" className="w-full h-full text-[#D30000] fill-current drop-shadow-sm">
        <text 
          x="10" 
          y="75" 
          style={{ 
            fontFamily: '"Playfair Display", serif', 
            fontSize: '70px', 
            fontStyle: 'italic', 
            fontWeight: '900',
            letterSpacing: '-0.1em'
          }}
        >
          S
        </text>
        <text 
          x="45" 
          y="55" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '25px', 
            fontWeight: '400'
          }}
        >
          &
        </text>
        <text 
          x="60" 
          y="75" 
          style={{ 
            fontFamily: '"Playfair Display", serif', 
            fontSize: '70px', 
            fontStyle: 'normal', 
            fontWeight: '900'
          }}
        >
          F
        </text>
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-serif text-2xl tracking-tighter text-gray-900 font-black italic">SCENES</span>
      <span className="font-serif text-sm tracking-[0.4em] text-[#D30000] font-bold -mt-1 uppercase">and Frame</span>
    </div>
  </div>
);

export const CATEGORIES = [
  { name: 'Movie Frames', value: 'Movie' as const, img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80' },
  { name: 'Nature Frames', value: 'Nature' as const, img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Anime Frames', value: 'Anime' as const, img: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=800&q=80' },
  { name: 'Abstract Frames', value: 'Abstract' as const, img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80' },
];

export const SIZES = ['8x10', '12x18', '24x36', 'Custom'];
export const FRAME_TYPES = ['Classic Black', 'Natural Oak', 'Sleek White', 'Metallic Gold'];
