/**
 * Name: Portfolio Script
 * Date: 2025
 * 
 * This file handles the behavior of the portfolio website.
 * Main functionalities:
 * 1. Dynamically loading and displaying project data from JSON files.
 * 2. Separating featured projects from additional projects.
 * 3. Filtering additional projects by category using tabs.
 * 4. Modal functionality for additional project details.
 */
"use strict";

(function () {
  let allProjects = []; // To store all additional project data
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
    setupModal();
    loadFeaturedProjects();
    loadAdditionalProjects();
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
   * Sets up modal close functionality
   */
  function setupModal() {
    const modal = id("project-modal");
    const closeBtn = qs(".modal-close");
    
    // Close on button click
    closeBtn.addEventListener("click", closeModal);
    
    // Close on background click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });
  }

  /**
   * Opens modal with project details
   */
  function openModal(project) {
    const modal = id("project-modal");
    
    // Populate modal content
    id("modal-image").src = project.image;
    id("modal-image").alt = project.title;
    
    const modalCategory = id("modal-category");
    modalCategory.textContent = project.category;
    modalCategory.setAttribute("data-category", project.category);
    
    id("modal-title").textContent = project.title;
    
    // Role
    const modalBody = qs(".modal-body");
    let roleElement = modalBody.querySelector(".modal-role");
    if (project.role) {
      if (!roleElement) {
        roleElement = gen("p");
        roleElement.classList.add("modal-role");
        modalBody.insertBefore(roleElement, id("modal-description"));
      }
      roleElement.textContent = project.role;
    } else if (roleElement) {
      roleElement.remove();
    }
    
    id("modal-description").textContent = project.description;
    
    // Tags
    const tagsContainer = id("modal-tags");
    tagsContainer.innerHTML = "";
    if (project.tags) {
      project.tags.forEach(tagText => {
        const tag = gen("span");
        tag.classList.add("tag");
        tag.textContent = tagText;
        tagsContainer.appendChild(tag);
      });
    }
    
    // Links
    const linksContainer = id("modal-links");
    linksContainer.innerHTML = "";
    
    if (project.link) {
      const mainLink = gen("a");
      mainLink.href = project.link;
      mainLink.textContent = "View Project";
      mainLink.classList.add("btn-primary");
      mainLink.target = "_blank";
      linksContainer.appendChild(mainLink);
    }
    
    // More links from moreLinks object
    if (project.moreLinks) {
      Object.entries(project.moreLinks).forEach(([label, url]) => {
        const link = gen("a");
        link.href = url;
        link.textContent = label;
        link.classList.add("btn-secondary");
        link.target = "_blank";
        linksContainer.appendChild(link);
      });
    }
    
    // Show modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  /**
   * Closes the modal
   */
  function closeModal() {
    const modal = id("project-modal");
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
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
    if (category === "all") {
      renderProjects(allProjects, "project-cards");
    } else {
      const filtered = allProjects.filter(p => p.category === category);
      renderProjects(filtered, "project-cards");
    }
  }

  /**
   * Loads the featured project data from features.json
   */
  function loadFeaturedProjects() {
    fetch("featured.json")
      .then(statusCheck)
      .then(res => res.json())
      .then(projects => {
        renderProjects(projects, "featured-cards", true);
      })
      .catch(err => console.error("Error loading featured projects:", err));
  }

  /**
   * Loads the additional project data from projects.json
   */
  function loadAdditionalProjects() {
    fetch("projects.json")
      .then(statusCheck)
      .then(res => res.json())
      .then(projects => {
        allProjects = projects;
        renderProjects(projects, "project-cards");
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
      card.classList.add(isFeatured ? "featured-card" : "project-card");

      if (isFeatured) {
        // Featured card structure with full content
        card.setAttribute("data-category", project.category);
        
        const imageLink = gen("a");
        imageLink.href = "javascript:void(0)";
        imageLink.style.cursor = "pointer";
        
        const image = gen("img");
        image.src = project.image;
        image.alt = project.title;
        imageLink.appendChild(image);
        
        // Click image to open modal
        imageLink.addEventListener("click", (e) => {
          e.preventDefault();
          openModal(project);
        });

        const content = gen("div");
        content.classList.add("featured-card-content");

        const category = gen("span");
        category.classList.add("category-tag");
        category.setAttribute("data-category", project.category);
        category.textContent = project.category;

        const title = gen("h3");
        title.textContent = project.title;

        content.appendChild(category);
        content.appendChild(title);

        // Role display
        if (project.role) {
          const role = gen("p");
          role.classList.add("project-role");
          role.textContent = project.role;
          content.appendChild(role);
        }

        const description = gen("p");
        description.textContent = project.description;
        content.appendChild(description);

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
        content.appendChild(tagsContainer);

        // Links - these still work as direct links
        const links = gen("div");
        links.classList.add("card-links");

        if (project.link) {
          const mainLink = gen("a");
          mainLink.href = project.link;
          mainLink.textContent = "View Project";
          mainLink.classList.add("btn-primary");
          if (project.link.startsWith("http")) {
            mainLink.target = "_blank";
          }
          links.appendChild(mainLink);
        }

        // More links from moreLinks object
        if (project.moreLinks) {
          Object.entries(project.moreLinks).forEach(([label, url]) => {
            const link = gen("a");
            link.href = url;
            link.textContent = label;
            link.classList.add("btn-secondary");
            link.target = "_blank";
            links.appendChild(link);
          });
        }

        content.appendChild(links);
        card.append(imageLink, content);

      } else {
        // Gallery card - just image with title overlay on hover, opens modal on click
        card.setAttribute("data-category", project.category);
        
        const image = gen("img");
        image.src = project.image;
        image.alt = project.title;
        image.classList.add("project-card-image");

        const titleOverlay = gen("div");
        titleOverlay.classList.add("project-card-title-overlay");
        const titleText = gen("h4");
        titleText.textContent = project.title;
        titleOverlay.appendChild(titleText);

        card.append(image, titleOverlay);
        
        // Highlight corresponding tab on hover
        card.addEventListener("mouseenter", () => {
          const targetTab = qs(`#tabs button[data-category="${project.category}"]`);
          if (targetTab && !targetTab.classList.contains("active")) {
            targetTab.classList.add("highlight");
          }
        });
        
        card.addEventListener("mouseleave", () => {
          const targetTab = qs(`#tabs button[data-category="${project.category}"]`);
          if (targetTab) {
            targetTab.classList.remove("highlight");
          }
        });
        
        // Click opens modal
        card.addEventListener("click", () => {
          openModal(project);
        });
      }

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