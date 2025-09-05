import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const images = [
    "/images/sustainability.jpg",
    "/images/artificial.jpg",
    "/images/intelligence.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative min-h-screen bg-[#f4cc8f] text-lifewood-green font-sans flex flex-col justify-center overflow-hidden">
      {/* Crossfade Background */}
      <div className="absolute inset-0 w-full h-full">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out`}
            style={{
              backgroundImage: `url(${img})`,
              opacity: index === currentIndex ? 0.25 : 0,
            }}
          ></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-14 px-4 text-center">
        <div className="container mx-auto max-w-3xl bg-gradient-to-r from-[#3b7a57] to-[#2f5d46] text-white rounded-2xl shadow-xl p-8 md:p-10 backdrop-blur-md border border-white/10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to <span className="text-[#ff914d]">Lifewood</span>
          </h1>
          <p className="max-w-xl mx-auto text-base md:text-lg mb-6 leading-relaxed text-white/90">
            Lifewood is a global leader in AI, machine learning, and
            data-driven innovation. Our mission is to shape the future with
            technology that empowers people worldwide.
          </p>

          <Link to="/apply">
            <button className="bg-white text-[#3b7a57] px-6 py-2.5 rounded-xl shadow-md hover:bg-[#ff914d] hover:text-white transition-all duration-300 text-base font-semibold transform hover:scale-105">
              Apply Now
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="services"
        className="grid md:grid-cols-3 gap-5 md:gap-6 px-4 md:px-10 py-10 relative z-10"
      >
        {[
          {
            title: "Sustainability",
            desc: "Building eco-friendly solutions for a better tomorrow.",
            video: "YOUR_SUSTAINABILITY_VIDEO_ID",
          },
          {
            title: "Innovation",
            desc: "Bringing fresh ideas with modern technology and design.",
            video: "YOUR_INNOVATION_VIDEO_ID",
          },
          {
            title: "Responsibility",
            desc: "Committed to ethical practices and community growth.",
            video: "YOUR_RESPONSIBILITY_VIDEO_ID",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-4 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition transform duration-300 border border-gray-100"
          >
            <div className="aspect-video mb-2.5 overflow-hidden rounded-lg shadow">
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${feature.video}`}
                title={`${feature.title} Video`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <h3 className="font-bold text-lg md:text-xl mb-1 text-[#3b7a57]">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm md:text-base">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-[#3b7a57] text-white relative z-10 py-4 text-center text-xs md:text-sm shadow-inner">
        <p>&copy; {new Date().getFullYear()} Lifewood. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
