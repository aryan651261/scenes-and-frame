
import React from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

export const Logo = ({ light = false }) => html`
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="relative w-12 h-12 flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg]">
      <svg viewBox="0 0 100 100" className=${`w-full h-full ${light ? 'text-white' : 'text-[#D30000]'} fill-current`}>
        <text x="10" y="75" style=${{ fontFamily: '"Playfair Display", serif', fontSize: '70px', fontStyle: 'italic', fontWeight: '900', letterSpacing: '-0.1em' }}>S</text>
        <text x="60" y="75" style=${{ fontFamily: '"Playfair Display", serif', fontSize: '70px', fontWeight: '900' }}>F</text>
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <span className=${`font-serif text-xl tracking-tighter font-black italic ${light ? 'text-white' : 'text-gray-900'}`}>SCENES</span>
      <span className=${`font-serif text-[10px] tracking-[0.4em] font-bold uppercase ${light ? 'text-gray-400' : 'text-[#D30000]'}`}>and Frame</span>
    </div>
  </div>
`;

export const CATEGORIES = [
  { name: 'Custom Poster', value: 'Custom', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&w=800&q=80', custom: true },
  { name: 'Superhero Collection', value: 'Superhero', img: 'https://images.unsplash.com/photo-1562907550-096d3bf9b25c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Car Collection', value: 'Car', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Movie Collection', value: 'Movie', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80' },
  { name: 'TV Series Collection', value: 'TVSeries', img: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=80' },
];

export const SIZES = ['8x10', '12x18', '24x36', 'Gallery Size'];
export const FRAME_TYPES = ['Classic Black', 'Natural Oak', 'Sleek White', 'Metallic Gold'];
