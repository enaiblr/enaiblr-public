"use client";

import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="animated-background">
      <style jsx>{`
        .animated-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1 ;
          background-color: white;
        }

        .line {
          position: absolute;
          background-color: #e6f3ff;
          transition: all 0.5s ease;
        }

        .line-1, .line-3, .line-5, .line-7 {
          width: 2px;
          height: 100%;
        }

        .line-2, .line-4, .line-6, .line-8 {
          width: 100%;
          height: 2px;
        }

        .line-1 {
          left: 15%;
          animation: moveVertical 20s infinite alternate;
        }

        .line-2 {
          top: 20%;
          animation: moveHorizontal 18s infinite alternate;
        }

        .line-3 {
          left: 40%;
          animation: moveVertical 22s infinite alternate-reverse;
        }

        .line-4 {
          top: 45%;
          animation: moveHorizontal 21s infinite alternate-reverse;
        }

        .line-5 {
          right: 35%;
          animation: moveVertical 24s infinite alternate;
        }

        .line-6 {
          bottom: 30%;
          animation: moveHorizontal 19s infinite alternate;
        }

        .line-7 {
          right: 10%;
          animation: moveVertical 23s infinite alternate-reverse;
        }

        .line-8 {
          bottom: 10%;
          animation: moveHorizontal 20s infinite alternate-reverse;
        }

        .dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #b3d9ff;
          transform: translate(-50%, -50%);
        }

        @keyframes moveVertical {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes moveHorizontal {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      <div className="line line-1"></div>
      <div className="line line-2"></div>
      <div className="line line-3"></div>
      <div className="line line-4"></div>
      <div className="line line-5"></div>
      <div className="line line-6"></div>
      <div className="line line-7"></div>
      <div className="line line-8"></div>
      {[15, 40, 65, 90].map((x) =>
        [20, 45, 70, 90].map((y) => (
          <div key={`${x}-${y}`} className="dot" style={{ left: `${x}%`, top: `${y}%` }}></div>
        ))
      )}
    </div>
  );
};

export default AnimatedBackground;

