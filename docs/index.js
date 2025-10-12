/**
 * Name: Portfolio Script
 * Date: 2025
 * 
 * This file handles the behavior of the portfolio website.
 * Main functionalities:
 * 1. Dynamically loading and displaying project data from a JSON file.
 * 2. Separating featured projects from additional projects.
 * 3. Filtering additional projects by category using tabs.
 */
"use strict";

(function () {
  let allProjects = []; // To store all project data
  let activeCategory = "all"; // Tracks the currently active category

  window.addEventListener("load", init);

  /**
   * Initializes the website by setting up event listeners and loading the project data.
   */
  function init() {
    id("hero-button").addEventListener("click", () => {
      id("featured").scrollIntoView({ behavior: "smooth" });
    });
    setupTabs();
    loadProjects();
  }

  /**
   * Sets up the tab buttons for filtering projects by category.
   */
  function setupTabs() {
    qs("#tabs").querySelectorAll("button").forEach(tab => {
      tab.addEventListener("click", () => {
        const category = tab.dataset.category;
        activeCategory = category;
        highlightTab(tab);
        filterProjectsByCategory(category);
      });
    });
  }

  /**
   * Highlights the currently selected tab and removes highlight from others.
   * @param {HTMLElement} selectedTab - The tab to highlight.
   */
  function highlightTab(selectedTab) {
    qs("#tabs").querySelectorAll("button").forEach(tab => {
      tab.classList.remove("active");
    });
    selectedTab.classList.add("active");
  }

  /**
   * Filters additional projects based on the selected category.
   * @param {string} category - The selected category to filter by.
   */
  function filterProjectsByCategory(category) {
    const additionalProjects = allProjects.filter(p => !p.featured);
    
    if (category === "all") {
      renderProjects(additionalProjects, "project-cards");
    } else {
      const filtered = additionalProjects.filter(p => p.category === category);
      renderProjects(filtered, "project-cards");
    }
  }

  /**
   * Loads the project data from the JSON file and renders projects.
   */
  function loadProjects() {
    fetch("projects.json")
      .then(statusCheck)
      .then(res => res.json())
      .then(projects => {
        allProjects = projects;
        
        // Render featured projects
        const featured = projects.filter(p => p.featured);
        renderProjects(featured, "featured-cards", true);
        
        // Render all additional projects by default
        const additional = projects.filter(p => !p.featured);
        renderProjects(additional, "project-cards");
      })
      .catch(err => console.error("Error loading projects:", err));
  }

  /**
   * Dynamically renders project cards based on the provided projects array.
   * @param {Array} projects - An array of project objects to display.
   * @param {string} containerId - The ID of the container to render projects in.
   * @param {boolean} isFeatured - Whether these are featured projects (larger cards).
   */
  function renderProjects(projects, containerId, isFeatured = false) {
    const container = id(containerId);
    container.innerHTML = "";

    if (projects.length === 0) {
      container.innerHTML = "<p class='no-projects'>No projects found in this category.</p>";
      return;
    }

    projects.forEach(project => {
      const card = gen("div");
      card.classList.add("project-card");
      if (isFeatured) card.classList.add("featured-card");

      // Image
      const image = gen("img");
      image.src = project.image;
      image.alt = project.title;

      // Content overlay
      const content = gen("div");
      content.classList.add("card-content");

      const title = gen("h3");
      title.textContent = project.title;

      const category = gen("span");
      category.classList.add("category-tag");
      category.textContent = project.category;

      const description = gen("p");
      description.textContent = project.description;

      // Tags
      const tagsContainer = gen("div");
      tagsContainer.classList.add("tags");
      if (project.tags) {
        project.tags.forEach(tagText => {
          const tag = gen("span");
          tag.classList.add("tag");
          tag.textContent = tagText;
          tagsContainer.appendChild(tag);
        });
      }

      // Links
      const links = gen("div");
      links.classList.add("card-links");

      if (project.link) {
        const detailsLink = gen("a");
        detailsLink.href = project.link;
        detailsLink.textContent = "View Project";
        detailsLink.classList.add("btn-primary");
        if (project.link.startsWith("http")) {
          detailsLink.target = "_blank";
        }
        links.appendChild(detailsLink);
      }

      if (project.liveLink) {
        const liveLink = gen("a");
        liveLink.href = project.liveLink;
        liveLink.textContent = "Live Demo";
        liveLink.classList.add("btn-secondary");
        liveLink.target = "_blank";
        links.appendChild(liveLink);
      }

      if (project.sourceCode) {
        const sourceLink = gen("a");
        sourceLink.href = project.sourceCode;
        sourceLink.innerHTML = '<i class="fab fa-github"></i> Code';
        sourceLink.classList.add("btn-secondary");
        sourceLink.target = "_blank";
        links.appendChild(sourceLink);
      }

      content.append(title, category, description, tagsContainer, links);
      card.append(image, content);
      container.appendChild(card);
    });
  }

  /**
   * Checks the response status and throws an error if it's not OK.
   * @param {Response} response - The response object to check.
   * @returns {Response} The valid response object.
   */
  function statusCheck(response) {
    if (!response.ok) {
      return response.text().then(errorText => {
        throw new Error(errorText);
      });
    }
    return response;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();