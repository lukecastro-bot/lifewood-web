import React, { useState, useEffect } from "react";

function About() {
  const images = [
    "/images/sustainability.jpg",
    "/images/artificial.jpg",
    "/images/intelligence.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative min-h-screen bg-[#f4cc8f] text-lifewood-green font-sans flex flex-col justify-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 w-full h-full">
        {images.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
            style={{
              backgroundImage: `url(${img})`,
              opacity: index === currentIndex ? 0.25 : 0,
            }}
          ></div>
        ))}
      </div>

      {/* About Section */}
      <section className="relative z-10 py-14 px-6">
        <div className="container mx-auto max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 text-center border border-gray-200">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#3b7a57] drop-shadow-sm">
            About <span className="text-[#ff914d]">Lifewood</span>
          </h1>
          <p className="text-base md:text-lg mb-4 leading-relaxed text-gray-700">
            Lifewood is dedicated to advancing artificial intelligence and
            empowering businesses globally. With operations across multiple
            continents, we specialize in AI data extraction, machine learning
            enablement, and natural language processing.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-gray-700">
            Our mission is to deliver innovative solutions responsibly and
            sustainably, making technology accessible and impactful for
            companies and communities worldwide.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 py-12 px-6">
        <div className="container mx-auto grid md:grid-cols-3 gap-6 max-w-6xl">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2 text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#3b7a57]">
              Diversity
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              We celebrate differences in belief, religion, philosophy and ways of life, 
              because they bring unique perspectives and ideas that encourage everyone to move forward.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2 text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#3b7a57]">
              Integrity
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              We are dedicated to act ethically and sustainably in everything we do. 
              More than just the bare minimum, it is the basis of our existence as a company.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-2 text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#3b7a57]">
              Innovation
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Innovation is at the heart of all we do, 
              enriching our lives and challenging us to continually improve ourselves and our service.

            </p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[#3b7a57] text-white relative z-10 py-4 text-center text-xs md:text-sm shadow-inner">
        <p>&copy; {new Date().getFullYear()} Lifewood. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default About;
