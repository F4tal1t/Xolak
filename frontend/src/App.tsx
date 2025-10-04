import React, { useState } from 'react';
import FaultyTerminal from './components/FaultyTerminal';
import RotatingText from './components/RotatingText'
import Chat from './chat';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'chat'>('home');

  const handleGetStarted = () => {
    setCurrentView('chat');
  };

  if (currentView === 'chat') {
    return <Chat />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      
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
      
      
      <header className="top-header">
        <div className="header-content" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          width: '1850px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}>
          <h1 className="logo">Xolak</h1>
          <nav className="nav">
            <a href="#" className="nav-link">Features</a>
            <a href="#" className="nav-link">Docs</a>
            <a href="#" className="nav-link">Contribute</a>
          </nav>
        </div>
      </header>

      
      <div className="center-content">
        <h1 className="main-title">Get your first
        <div className="rotating-text-container">
          <RotatingText
            texts={['contribution', 'pull request', 'merge', 'issue', 'commit']}
            mainClassName="rotating-text-main"
            staggerFrom="first"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="rotating-text-split"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={3000}
          />
        </div>
        </h1>
        <p className="main-subtitle">Discover open source projects perfect for Hacktoberfest 2025 and beyond</p>
        
        
        {/* <div className="input-box">
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
        </div> */}

        {/* Import Options */}
        {/* <div className="import-options">
          <span>or import from</span>
          <button className="import-btn">GitHub</button>
          <button className="import-btn">Stack Overflow</button>
          <button className="import-btn">Dev.to</button>
        </div> */}

        <div className='button' style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: '2rem',
          pointerEvents: 'auto'
        }}>
          <button className="plan-btn" 
          onClick={handleGetStarted}
          style={{
            fontSize: '18px', 
            padding: '16px 48px', 
            color: '#ffffff',
            background: ' #764ba2 ',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50px',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            cursor: 'pointer',
            fontWeight: '600',
            letterSpacing: '0.5px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            fontFamily: "'DepartureMono', 'Courier New', 'Monaco', 'Menlo', monospace"
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.transform = 'translateY(-2px)';
            target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.transform = 'translateY(0px)';
            target.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
          }}>
            Get Started
          </button>
        </div>


      </div>
    </div>
  );
}

export default App;