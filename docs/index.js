/**
 * Name: Portfolio Script
 * Date: [Your Date]
 * Section: [Your Section]
 *
 * This file handles the behavior of the portfolio website.
 * Main functionalities:
 * 1. Dynamically loading and displaying project data from a JSON file.
 * 2. Filtering projects by category using tabs.
 * 3. Resetting to "All" projects when a tab is clicked again.
 */
"use strict";

(function () {
  let allProjects = []; // To store all project data
  let activeCategory = null; // Tracks the currently active category

  window.addEventListener("load", init);

  /**
   * Initializes the website by setting up event listeners and loading the project data.
   */
  function init() {
    id("hero-button").addEventListener("click", () => {
      id("projects").scrollIntoView({ behavior: "smooth" });
    }); // Smooth scrolling to projects section
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

        if (activeCategory === category) {
          // Reset to "All" if the same tab is clicked
          activeCategory = null;
          highlightTab(null); // Remove active highlight
          renderProjects(allProjects); // Show all projects
        } else {
          // Filter by category
          activeCategory = category;
          highlightTab(tab); // Highlight the clicked tab
          filterProjectsByCategory(category);
        }
      });
    });
  }

  /**
   * Highlights the currently selected tab and removes highlight from others.
   * @param {HTMLElement|null} selectedTab - The tab to highlight, or null to clear highlights.
   */
  function highlightTab(selectedTab) {
    qs("#tabs").querySelectorAll("button").forEach(tab => {
      tab.classList.remove("active");
    });
    if (selectedTab) {
      selectedTab.classList.add("active");
    }
  }

  /**
   * Filters projects based on the selected category.
   * @param {string} category - The selected category to filter by.
   */
  function filterProjectsByCategory(category) {
    const filteredProjects = allProjects.filter(project => project.category === category);
    renderProjects(filteredProjects);
  }

  /**
   * Loads the project data from the JSON file and renders all projects.
   */
  function loadProjects() {
    fetch("projects.json")
      .then(statusCheck)
      .then(res => res.json())
      .then(projects => {
        allProjects = projects;
        renderProjects(projects); // Show all projects by default
      })
      .catch(err => console.error("Error occurred:", err));
  }

  /**
   * Dynamically renders project cards based on the provided projects array.
   * @param {Array} projects - An array of project objects to display.
   */
  function renderProjects(projects) {
    const projectCards = id("project-cards");
    projectCards.innerHTML = ""; // Clear existing cards

    projects.forEach(project => {
      const card = gen("div");
      card.classList.add("project-card");

      const image = gen("img");
      image.src = project.image;
      image.alt = project.title;

      const title = gen("h3");
      title.textContent = project.title;

      const description = gen("p");
      description.textContent = project.description;

      card.append(image, title, description);

      // Add project-specific details
      if (project.details) {
        const detailsList = gen("ul");
        detailsList.classList.add("details-list");
        Object.entries(project.details).forEach(([key, value]) => {
          const detailItem = gen("li");
          detailItem.textContent = `${key}: ${value}`;
          detailsList.appendChild(detailItem);
        });

        card.appendChild(detailsList);
      }

      // Add Live Link if available
      if (project.liveLink) {
        const liveLink = gen("a");
        liveLink.href = project.liveLink;
        liveLink.textContent = "View Live";
        liveLink.target = "_blank";
        card.appendChild(liveLink);
      }

      // Add Source Code Link if available
      if (project.sourceCode) {
        const sourceCode = gen("a");
        sourceCode.href = project.sourceCode;
        sourceCode.textContent = "Source Code";
        sourceCode.target = "_blank";
        card.appendChild(sourceCode);
      }

      projectCards.appendChild(card);
    });
  }

  /**
   * Checks the response status and throws an error if it's not OK.
   * @param {Response} response - The response object to check.
   * @returns {Response} The valid response object.
   * @throws Will throw an error if the response is not OK.
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
   * Returns an array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object[]} Array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
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
