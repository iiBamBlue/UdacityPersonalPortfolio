/** @format */

// main.js
// Handles About Me, Projects, and Form Validation for the portfolio

document.addEventListener("DOMContentLoaded", () => {
  // --- Inject Personal Name in Header ---
  const headerH1 = document.querySelector("header h1");
  if (headerH1) {
    headerH1.textContent = "Darien Johnas";
  }

  // --- Loading Elements (Only HTML addition allowed) ---
  function createLoadingElement(targetId, text = "Loading...") {
    const target = document.getElementById(targetId);
    if (!target) return null;

    const loader = document.createElement("div");
    loader.className = "loading-spinner";
    loader.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; padding: 2rem;">
        <div style="
          border: 3px solid #f3f3f3; 
          border-top: 3px solid #667eea; 
          border-radius: 50%; 
          width: 30px; 
          height: 30px; 
          animation: spin 1s linear infinite;
          margin-right: 1rem;
        "></div>
        <span style="color: #667eea; font-weight: 500;">${text}</span>
      </div>
    `;
    target.appendChild(loader);
    return loader;
  }

  // Add spinner animation CSS
  const spinnerCSS = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  const spinnerStyle = document.createElement("style");
  spinnerStyle.textContent = spinnerCSS;
  document.head.appendChild(spinnerStyle);

  // --- Hamburger Menu for Mobile Navigation ---
  function createHamburgerMenu() {
    const nav = document.querySelector("nav");
    const ul = document.querySelector("nav ul");
    if (!nav || !ul) return;

    // Create hamburger button
    const hamburger = document.createElement("button");
    hamburger.className = "hamburger-menu";
    hamburger.innerHTML = `
      <span style="display: block; width: 25px; height: 3px; background: #333; margin: 5px 0; transition: 0.3s;"></span>
      <span style="display: block; width: 25px; height: 3px; background: #333; margin: 5px 0; transition: 0.3s;"></span>
      <span style="display: block; width: 25px; height: 3px; background: #333; margin: 5px 0; transition: 0.3s;"></span>
    `;

    // Add hamburger menu CSS
    const hamburgerCSS = `
      .hamburger-menu {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 10px;
        z-index: 1000;
      }
      .hamburger-menu.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
      }
      .hamburger-menu.active span:nth-child(2) {
        opacity: 0;
      }
      .hamburger-menu.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
      }
      @media (max-width: 768px) {
        .hamburger-menu {
          display: block;
        }
        nav ul {
          position: fixed;
          top: 0;
          right: -100%;
          width: 250px;
          height: 100vh;
          background: white;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 60px;
          transition: right 0.3s ease;
          box-shadow: -2px 0 5px rgba(0,0,0,0.1);
        }
        nav ul.active {
          right: 0;
        }
        nav ul a {
          margin: 1rem 0;
          padding: 1rem 2rem;
          border-bottom: 1px solid #eee;
        }
      }
    `;
    const hamburgerStyle = document.createElement("style");
    hamburgerStyle.textContent = hamburgerCSS;
    document.head.appendChild(hamburgerStyle);

    // Add hamburger to nav
    nav.insertBefore(hamburger, ul);

    // Hamburger functionality
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      ul.classList.toggle("active");
    });

    // Close menu when clicking links
    ul.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        hamburger.classList.remove("active");
        ul.classList.remove("active");
      }
    });
  }

  createHamburgerMenu();
  // --- About Me Section with Loading ---
  const aboutLoader = createLoadingElement("aboutMe", "Loading About Me...");

  // Personal About Me Data (to override fetched data)
  const personalAboutMe = {
    aboutMe:
      "Passionate software developer with expertise in full-stack web development and modern JavaScript frameworks. I create innovative applications including weather-based clothing recommendations, responsive platforms, and robust backend APIs. Currently building my skills through TripleTen's Software Engineering program while developing real-world projects with React, Node.js, and MongoDB. I love problem-solving and building user-friendly applications that make a real impact.",
    headshot: "../images/headshot.webp",
  };

  fetch("./starter/data/aboutMeData.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      // Override fetched data with personal data
      const aboutData = { ...data, ...personalAboutMe };
      console.log("About Me data loaded:", aboutData);
      const aboutMeDiv = document.getElementById("aboutMe");
      if (!aboutMeDiv) return;

      // Remove loading element
      if (aboutLoader) aboutLoader.remove();

      // Paragraph
      const p = document.createElement("p");
      p.textContent = aboutData.aboutMe || aboutData.about_me || "";

      // Headshot
      const headshotContainer = document.createElement("div");
      headshotContainer.className = "headshotContainer";
      const img = document.createElement("img");
      // Handle relative paths from JSON
      let headshot = aboutData.headshot || "./starter/images/headshot.webp";
      if (headshot.startsWith("../")) {
        headshot = "./starter/" + headshot.substring(3);
      }
      img.src = headshot;
      img.alt = "Headshot";
      headshotContainer.appendChild(img);

      // Clear existing content and append new elements
      while (aboutMeDiv.firstChild) {
        aboutMeDiv.removeChild(aboutMeDiv.firstChild);
      }
      aboutMeDiv.appendChild(p);
      aboutMeDiv.appendChild(headshotContainer);
    })
    .catch((error) => {
      console.error("Error loading About Me data:", error);
      if (aboutLoader) aboutLoader.remove();
      const aboutMeDiv = document.getElementById("aboutMe");
      if (aboutMeDiv) {
        const errorMsg = document.createElement("p");
        errorMsg.textContent =
          "Unable to load About Me content. Please try again later.";
        errorMsg.style.color = "#ff6b6b";
        aboutMeDiv.appendChild(errorMsg);
      }
    });

  // --- Projects Section with Loading ---
  const projectsLoader = createLoadingElement(
    "projectList",
    "Loading Projects..."
  );

  // Personal Projects Data (to add to fetched data)
  const personalProjects = [
    {
      project_id: "project_darien_wtwr",
      project_name: "WTWR – What to Wear Right Now",
      short_description: "React app with weather-based outfit suggestions.",
      long_description:
        "React app with weather-based outfit suggestions, modals, and responsive toggles. Features real-time weather data integration, user authentication, and personalized clothing recommendations based on current weather conditions.",
      card_image: "../images/weather_app_card.webp",
      spotlight_image: "../images/weather_app_spotlight.webp",
      url: "https://github.com/iiBamBlue",
    },
    {
      project_id: "project_darien_spots",
      project_name: "Spots Platform",
      short_description: "Responsive platform with modern optimization.",
      long_description:
        "Responsive layout with Webpack optimization, hover effects, and form validation. Built with modern JavaScript and SCSS, featuring dynamic content loading and interactive user interfaces.",
      card_image: "../images/social_media_card.webp",
      spotlight_image: "../images/social_media_spotlight.webp",
      url: "https://github.com/iiBamBlue",
    },
    {
      project_id: "project_darien_coffee",
      project_name: "Craft and Brew",
      short_description: "Responsive coffee shop website with modern design.",
      long_description:
        "A responsive coffee shop website with modern design, interactive menu, and reservation system. Features smooth animations, mobile-first design, and optimized performance.",
      card_image: "../images/commerce_card.webp",
      spotlight_image: "../images/commerce_spotlight.webp",
      url: "https://iibamblue.github.io/se_project_coffeeshop/",
    },
    {
      project_id: "project_darien_todo",
      project_name: "ToDo App",
      short_description: "Simple and intuitive task management app.",
      long_description:
        "A simple and intuitive task management app built with React. Features include adding, editing, and deleting tasks, with local storage persistence and responsive design.",
      card_image: "../images/todo_card.webp",
      spotlight_image: "../images/todo_spotlight.webp",
      url: "https://github.com/iiBamBlue",
    },
  ];

  fetch("./starter/data/projectsData.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((projects) => {
      // Combine original projects with personal projects
      const allProjects = [...projects, ...personalProjects];
      console.log("Projects data loaded:", allProjects);
      const cardsContainer = document.getElementById("projectList");
      const spotlight = document.getElementById("projectSpotlight");
      if (!cardsContainer || !spotlight) {
        console.error("Project containers not found");
        return;
      }

      // Remove loading element
      if (projectsLoader) projectsLoader.remove();

      // Helper: fallback images
      const getCardImg = (img) => {
        if (!img) return "./starter/images/card_placeholder_bg.webp";
        if (img.startsWith("../")) return "./starter/" + img.substring(3);
        return img;
      };
      const getSpotlightImg = (img) => {
        if (!img) return "./starter/images/spotlight_placeholder_bg.webp";
        if (img.startsWith("../")) return "./starter/" + img.substring(3);
        return img;
      };

      // Create cards using document fragment for better performance
      const fragment = document.createDocumentFragment();

      allProjects.forEach((proj, idx) => {
        const card = document.createElement("div");
        card.className = "projectCard";
        card.id = proj.project_id || `project_${idx}`;
        card.style.backgroundImage = `url('${getCardImg(proj.card_image)}')`;
        const h4 = document.createElement("h4");
        h4.textContent = proj.project_name || "Untitled Project";
        const p = document.createElement("p");
        p.textContent = proj.short_description || "";
        card.appendChild(h4);
        card.appendChild(p);
        card.addEventListener("click", () => updateSpotlight(proj));
        fragment.appendChild(card);
      });

      // Append all cards at once
      cardsContainer.appendChild(fragment);

      // Spotlight update
      function updateSpotlight(proj) {
        // Clear existing content using DOM methods
        while (spotlight.firstChild) {
          spotlight.removeChild(spotlight.firstChild);
        }

        const h3 = document.createElement("h3");
        h3.id = "spotlightTitles";
        h3.textContent = proj.project_name || "Untitled Project";
        const p = document.createElement("p");
        p.textContent = proj.long_description || "";
        const a = document.createElement("a");
        a.href = proj.url || "#";
        a.textContent = "Click here to see more...";
        a.target = "_blank";

        // Spotlight image as background
        spotlight.style.backgroundImage = `url('${getSpotlightImg(
          proj.spotlight_image
        )}')`;
        spotlight.appendChild(h3);
        spotlight.appendChild(p);
        spotlight.appendChild(a);
      }

      // Set initial spotlight
      if (allProjects.length > 0) updateSpotlight(allProjects[0]);

      // --- Project Nav Arrows with Continuous Scrolling ---
      const leftBtn = document.querySelector(".arrow-left");
      const rightBtn = document.querySelector(".arrow-right");
      let scrollInterval;

      function scrollCards(dir) {
        const mq = window.matchMedia("(max-width: 768px)");
        if (mq.matches) {
          // Mobile: horizontal
          cardsContainer.scrollBy({ left: dir * 200, behavior: "smooth" });
        } else {
          // Desktop: vertical
          cardsContainer.scrollBy({ top: dir * 200, behavior: "smooth" });
        }
      }

      function startContinuousScroll(direction) {
        scrollCards(direction);
        scrollInterval = setInterval(() => scrollCards(direction), 150);
      }

      function stopContinuousScroll() {
        if (scrollInterval) {
          clearInterval(scrollInterval);
          scrollInterval = null;
        }
      }

      // Enhanced arrow button event listeners for continuous scrolling
      if (leftBtn) {
        leftBtn.addEventListener("mousedown", () => startContinuousScroll(-1));
        leftBtn.addEventListener("mouseup", stopContinuousScroll);
        leftBtn.addEventListener("mouseleave", stopContinuousScroll);
        leftBtn.addEventListener("click", (e) => e.preventDefault()); // Prevent default click
      }

      if (rightBtn) {
        rightBtn.addEventListener("mousedown", () => startContinuousScroll(1));
        rightBtn.addEventListener("mouseup", stopContinuousScroll);
        rightBtn.addEventListener("mouseleave", stopContinuousScroll);
        rightBtn.addEventListener("click", (e) => e.preventDefault()); // Prevent default click
      }
    })
    .catch((error) => {
      console.error("Error loading Projects data:", error);
      if (projectsLoader) projectsLoader.remove();
      const cardsContainer = document.getElementById("projectList");
      if (cardsContainer) {
        const errorMsg = document.createElement("div");
        errorMsg.innerHTML = `
          <p style="color: #ff6b6b; text-align: center; padding: 2rem;">
            Unable to load projects. Please try again later.
          </p>
        `;
        cardsContainer.appendChild(errorMsg);
      }
    });

  // --- Form Validation ---
  const form = document.querySelector("form");
  if (form) {
    const emailInput = form.querySelector('input[type="text"]');
    const messageInput = form.querySelector("textarea");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");
    const charCount = document.getElementById("charactersLeft");

    // Regex
    const illegalChars = /[^a-zA-Z0-9@._-]/;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Live char count
    if (messageInput && charCount) {
      messageInput.addEventListener("input", () => {
        const length = messageInput.value.length;
        charCount.textContent = `Characters: ${length}/300`;

        // Add error class if over 300 characters
        if (length > 300) {
          charCount.classList.add("error");
        } else {
          charCount.classList.remove("error");
        }
      });
    }
    form.addEventListener("submit", (e) => {
      let valid = true;

      // Reset errors
      if (emailError) emailError.textContent = "";
      if (messageError) messageError.textContent = "";

      // Email
      const email = emailInput ? emailInput.value.trim() : "";
      if (!email) {
        if (emailError) emailError.textContent = "Email is required.";
        valid = false;
      } else if (!validEmail.test(email)) {
        if (emailError) emailError.textContent = "Invalid email address.";
        valid = false;
      } else if (illegalChars.test(email)) {
        if (emailError)
          emailError.textContent = "Email contains illegal characters.";
        valid = false;
      }
      // Message
      const msg = messageInput ? messageInput.value : "";
      if (!msg) {
        if (messageError) messageError.textContent = "Message is required.";
        valid = false;
      } else if (illegalChars.test(msg)) {
        if (messageError)
          messageError.textContent = "Message contains illegal characters.";
        valid = false;
      } else if (msg.length > 300) {
        if (messageError)
          messageError.textContent = "Message must be 300 characters or less.";
        valid = false;
      }
      if (!valid) {
        e.preventDefault();
      } else {
        e.preventDefault();
        alert("Form validation passed!");
      }
    });
  }
});
