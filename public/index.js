/**
 * Name: Portfolio Script
 * Date: [Your Date]
 * Section: [Your Section]
 *
 * This file handles the behavior of the portfolio website.
 * Main functionalities:
 * 1. Dynamically loading and displaying project data from a JSON file.
 * 2. Implementing a tags-based filtering system for projects.
 * 3. Smoothly navigating to sections of the page.
 */
"use strict";

(function () {
  let allProjects = []; // To store all project data for filtering
  let activeTag = null; // To track the currently active tag for filtering

  window.addEventListener("load", init);

  /**
   * Initializes the website by setting up event listeners and loading the project data.
   */
  function init() {
    id("hero-button").addEventListener("click", scrollToProjects);
    loadProjects();
  }

  /**
   * Loads the project data from the JSON file and renders it dynamically on the page.
   */
  function loadProjects() {
    fetch("projects.json")
      .then(statusCheck)
      .then((res) => res.json())
      .then((projects) => {
        allProjects = projects;
        renderProjects(projects);
      })
      .catch(handleError);
  }

  /**
   * Dynamically renders project cards based on the provided projects array.
   * @param {Array} projects - An array of project objects to display.
   */
  function renderProjects(projects) {
    const projectCards = id("project-cards");
    projectCards.innerHTML = ""; // Clear existing cards

    projects.forEach((project) => {
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

      // Add project-specific details, including Live Link and Source Code if available
      if (project.details || project.liveLink || project.sourceCode) {
        const detailsList = gen("ul");
        detailsList.classList.add("details-list");

        // Render regular details
        if (project.details) {
          Object.entries(project.details).forEach(([key, value]) => {
            const detailItem = gen("li");
            detailItem.textContent = `${capitalize(key)}: ${value}`;
            detailsList.appendChild(detailItem);
          });
        }

        // Add Live Link to details if available
        if (project.liveLink) {
          const liveLinkItem = gen("li");
          const liveLink = gen("a");
          liveLink.href = project.liveLink;
          liveLink.textContent = "View Live";
          liveLink.target = "_blank";
          liveLinkItem.appendChild(liveLink);
          detailsList.appendChild(liveLinkItem);
        }

        // Add Source Code to details if available
        if (project.sourceCode) {
          const sourceCodeItem = gen("li");
          const sourceCode = gen("a");
          sourceCode.href = project.sourceCode;
          sourceCode.textContent = "Source Code";
          sourceCode.target = "_blank";
          sourceCodeItem.appendChild(sourceCode);
          detailsList.appendChild(sourceCodeItem);
        }

        card.appendChild(detailsList);
      }

      // Create tag buttons for the project
      const tagContainer = gen("div");
      tagContainer.classList.add("tag-container");
      project.tags.forEach((tag) => {
        const tagButton = gen("button");
        tagButton.textContent = tag;
        tagButton.classList.add("tag");
        tagButton.dataset.tag = tag;
        tagButton.addEventListener("click", () =>
          toggleTagFilter(tag, tagButton)
        );
        tagContainer.appendChild(tagButton);
      });

      card.appendChild(tagContainer);
      projectCards.appendChild(card);
    });
  }

  /**
   * Toggles the tag filter. If a tag is already active, it resets to show all projects.
   * @param {string} tag - The selected tag for filtering.
   * @param {HTMLElement} tagButton - The clicked tag button element.
   */
  function toggleTagFilter(tag, tagButton) {
    if (activeTag === tag) {
      activeTag = null;
      renderProjects(allProjects);
      resetTagStyles();
    } else {
      activeTag = tag;
      const filteredProjects = allProjects.filter((project) =>
        project.tags.includes(tag)
      );
      renderProjects(filteredProjects);
      resetTagStyles();
      tagButton.classList.add("active");
    }
  }

  /**
   * Resets the styles of all tag buttons to remove the active state.
   */
  function resetTagStyles() {
    qsa(".tag").forEach((button) => {
      button.classList.remove("active");
    });
  }

  /**
   * Smoothly scrolls to the projects section of the page.
   */
  function scrollToProjects() {
    id("projects").scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Capitalizes the first letter of a string.
   * @param {string} str - The string to capitalize.
   * @returns {string} The capitalized string.
   */
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Handles and displays errors when they occur.
   * @param {Error} err - The error object to handle.
   */
  function handleError(err) {
    console.error("Error occurred:", err);
    displayError("Unable to load projects. Please try again later.");
  }

  /**
   * Displays an error message in the main content area.
   * @param {string} message - The error message to display.
   */
  function displayError(message) {
    const errorContainer = id("error-container");
    errorContainer.textContent = message;
    errorContainer.classList.remove("hidden");
  }

  /**
   * Checks the response status and throws an error if it's not OK.
   * @param {Response} response - The response object to check.
   * @returns {Response} The valid response object.
   * @throws Will throw an error if the response is not OK.
   */
  function statusCheck(response) {
    if (!response.ok) {
      return response.text().then((errorText) => {
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
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
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
