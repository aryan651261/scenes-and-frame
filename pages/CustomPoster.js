
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import htm from 'htm';
import { mockApi } from '../services/mockApi.js';
import { useApp } from '../App.js';

const html = htm.bind(React.createElement);

export default function CustomPoster() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to submit your custom poster.");
      navigate('/auth');
      return;
    }
    if (!file) {
      alert("Please upload an image.");
      return;
    }

    setSubmitting(true);
    // Simulation of upload. In a real environment, we'd send a FormData with the actual File.
    const posterData = {
      userId: user.id,
      userEmail: user.email,
      image: preview, // Storing base64 for simulation
      customText: text,
      fileName: file.name
    };

    await mockApi.submitCustomPoster(posterData);
    setSubmitting(false);
    alert("Your custom poster request has been submitted to our curators.");
    navigate('/dashboard');
  };

  return html`
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <span className="text-brand font-black text-[10px] uppercase tracking-[0.6em] mb-4 block">Bespoke Creation</span>
        <h1 className="font-serif text-6xl font-black italic tracking-tighter text-gray-900">Custom Poster</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-4">Upload your vision. We'll frame the reality.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="aspect-[3/4] rounded-[3rem] border-4 border-dashed border-gray-100 flex items-center justify-center overflow-hidden bg-gray-50 group hover:border-brand/30 transition-all cursor-pointer relative" onClick=${() => document.getElementById('poster-upload').click()}>
            ${preview ? html`
              <img src=${preview} className="w-full h-full object-cover" />
            ` : html`
              <div className="text-center space-y-4">
                <div className="text-5xl opacity-10 group-hover:scale-110 transition-transform">📷</div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Click to Upload Image</p>
              </div>
            `}
            <input id="poster-upload" type="file" accept="image/*" className="hidden" onChange=${handleFileChange} />
          </div>
          <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-widest leading-relaxed">Accepted formats: JPEG, PNG. Max size: 25MB.</p>
        </div>

        <form onSubmit=${handleSubmit} className="space-y-10 flex flex-col justify-center">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4">Overlay Text (Optional)</label>
            <input 
              value=${text} 
              onChange=${e => setText(e.target.value)} 
              placeholder="Ex. A New Hope" 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 text-sm font-bold outline-none focus:border-brand transition-all"
            />
            <p className="text-[9px] text-gray-300 mt-4 uppercase tracking-widest">Our designers will aesthetically place this text on your poster.</p>
          </div>

          <button 
            type="submit" 
            disabled=${submitting}
            className="w-full bg-brand text-white py-6 rounded-full font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            ${submitting ? 'Transmitting...' : 'Submit to Curators'}
          </button>

          <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">Process</h4>
            <ul className="space-y-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
              <li className="flex gap-4"><span>01.</span> <span>Upload high-res image.</span></li>
              <li className="flex gap-4"><span>02.</span> <span>Add custom typography.</span></li>
              <li className="flex gap-4"><span>03.</span> <span>Curators review and finalize design.</span></li>
              <li className="flex gap-4 text-brand"><span>04.</span> <span>Museum-grade printing & framing.</span></li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  `;
}
