import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Projects() {
  const navigate = useNavigate();

  const images = [
    "/images/sustainability.jpg",
    "/images/artificial.jpg",
    "/images/intelligence.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Crossfade carousel for background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // List of projects
  const projects = [
    { name: "AI Data Extraction", description: "Extracting meaningful insights from complex datasets." },
    { name: "Machine Learning Enablement", description: "Helping businesses adopt ML solutions efficiently." },
    { name: "Genealogy", description: "Tracing ancestry using AI-powered tools." },
    { name: "Natural Language Processing", description: "Understanding and processing human language." },
    { name: "AI-Enabled Customer Service", description: "Automating customer support with AI chatbots." },
    { name: "Computer Vision", description: "Analyzing images and videos with deep learning." },
    { name: "Autonomous Driving Technology", description: "Developing AI systems for self-driving vehicles." },
  ];

  // Handle card click
  const handleProjectClick = (projectName) => {
    navigate("/apply", { state: { project: projectName } });
  };

  return (
    <div className="relative min-h-screen bg-[#f4cc8f] text-lifewood-green font-sans flex flex-col justify-center overflow-hidden">
      {/* Background carousel */}
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

      {/* Hero / Intro */}
      <div className="relative z-10 py-20 px-6 text-center">
        <div className="container mx-auto max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 md:p-12 border border-gray-200">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#3b7a57]">
            Our <span className="text-[#ff914d]">Projects</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-gray-700">
            Explore our projects below. Click on a project to start your
            application — once selected, your choice will be locked in the
            application form.
          </p>
        </div>
      </div>

      {/* Project Cards */}
      <section className="relative z-10 py-12 px-6">
        <div className="container mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl">
          {projects.map((project) => (
            <div
              key={project.name}
              className="bg-white rounded-2xl shadow-lg p-6 text-center cursor-pointer 
              hover:shadow-2xl hover:-translate-y-2 transform transition duration-300"
              onClick={() => handleProjectClick(project.name)}
            >
              <h3 className="font-bold text-xl mb-2 text-[#3b7a57]">
                {project.name}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[#3b7a57] text-white relative z-10 py-4 text-center text-xs md:text-sm shadow-inner">
        <p>&copy; {new Date().getFullYear()} Lifewood. All rights reserved.</p>
      </footer>
    </div>
    
  );
}

export default Projects;
