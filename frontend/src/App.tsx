import React from 'react';
import FaultyTerminal from './components/FaultyTerminal';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Terminal Background - Fully Interactive */}
      <FaultyTerminal
        scale={1.5}
        gridMul={[3, 1]}
        digitSize={2.1}
        timeScale={0.4}
        pause={false}
        scanlineIntensity={0.7}
        glitchAmount={1}
        flickerAmount={0.2}
        noiseAmp={1.4}
        chromaticAberration={0}
        dither={false}
        curvature={0.05}
        tint="#4A1A99"
        mouseReact={true}
        mouseStrength={0.2}
        pageLoadAnimation={true}
        brightness={0.8}
      />
      
      {/* Minimal Header - No Background Blocking */}
      <header className="top-header">
        <div className="header-content">
          <h1 className="logo">Xolak</h1>
          <nav className="nav">
            <a href="#" className="nav-link">Features</a>
            <a href="#" className="nav-link">Docs</a>
            <a href="#" className="nav-link">Contribute</a>
          </nav>
        </div>
      </header>

      {/* Centered Content - Minimal Overlay */}
      <div className="center-content">
        <h1 className="main-title">Build your next project faster</h1>
        <p className="main-subtitle">Discover open source projects perfect for Hacktoberfest 2025 and beyond</p>
        
        {/* Main Input Box - Expanded Bolt.new Style */}
        <div className="input-box">
          <button className="add-btn">+</button>
          <textarea 
            placeholder="Describe the kind of project you want to work on..."
            className="main-input"
            rows={4}
          />
          <button className="plan-btn">
            <span>Get Projects</span>
            <svg className="arrow" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Import Options */}
        <div className="import-options">
          <span>or import from</span>
          <button className="import-btn">GitHub</button>
          <button className="import-btn">Stack Overflow</button>
          <button className="import-btn">Dev.to</button>
        </div>
      </div>
    </div>
  );
}

export default App;