document.addEventListener("DOMContentLoaded", function () {
  const stories = [
    {
      id: 1,
      title: "The Secret of the Basilica Cistern",
      snippet:
        "Beneath the bustling streets of Sultanahmet lies an ancient wonder that few visitors fully appreciate...",
      image:
        "https://imgs.search.brave.com/hVvdnDh9rsKyXrzhGS2rF-43I0n5YRf9H9jw8R-mg5c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hLWZh/Yi1qb3VybmV5LmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/My8xMC9DaXN0ZXJu/YS1CYXNpbGljYS00/LTEwMjR4NzY4Lmpw/ZWc",
      category: "history",
      content: "Full story about the Basilica Cistern would go here...",
    },
    {
      id: 2,
      title: "The Whirling Dervishes of Galata",
      snippet:
        "In a quiet corner near Galata Tower, a centuries-old tradition continues to spin its magic...",
      image:
        "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "culture",
      content: "Full story about the Whirling Dervishes would go here...",
    },
    {
      id: 3,
      title: "The Cats of Cihangir",
      snippet:
        "Istanbul's feline residents have their own society, and nowhere is this more evident than in Cihangir...",
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "culture",
      content: "Full story about Istanbul's cats would go here...",
    },
    {
      id: 4,
      title: "The Hidden Passageways of Grand Bazaar",
      snippet:
        "Beyond the main thoroughfares of the world's oldest shopping mall lie secrets known only to locals...",
      image:
        "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "architecture",
      content: "Full story about Grand Bazaar's secrets would go here...",
    },
    {
      id: 5,
      title: "Sunset at Pierre Loti Hill",
      snippet:
        "The view from this quiet café has inspired poets and lovers for generations...",
      image:
        "https://images.unsplash.com/photo-1491557345352-5929e343eb89?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "personal",
      content: "Full story about Pierre Loti Hill would go here...",
    },
    {
      id: 6,
      title: "The Ghost Stations of the Metro",
      snippet:
        "Istanbul's metro system hides abandoned stations that tell stories of the city's rapid transformation...",
      image:
        "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "history",
      content: "Full story about the ghost metro stations would go here...",
    },
  ];

  const grid = document.querySelector(".grid");
  const form = document.getElementById("lore-form");
  const thankYouMessage = document.getElementById("thank-you");
  const submitAnotherBtn = document.getElementById("submit-another");
  const categorySelect = document.getElementById("category-select");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const submitBtn = form ? form.querySelector("button[type='submit']") : null;

  renderStories(stories);
  setupEventListeners();

  function renderStories(storiesToRender) {
    if (!grid) return;

    // Define the external URLs for each story ID
    const externalLinks = {
      1: "https://www.basilica-cistern.com/hidden-gems-of-basilica-cistern",
      2: "https://theistanbulinsider.com/where-to-see-the-whirling-dervishes-in-istanbul/",
      3: "https://johnhendersontravel.com/cats-of-istanbul/",
      4: "https://en.wikipedia.org/wiki/Grand_Bazaar,_Istanbul",
      5: "https://forevervacation.com/istanbul/pierre-loti-hill",
      6: "https://en.wikipedia.org/wiki/Istanbul_Metro",
    };

    grid.innerHTML = storiesToRender
      .map(
        (story) => `
        <article class="story-card fade-in" data-category="${story.category}">
          <img src="${story.image}" alt="${story.title}" class="card-image">
          <div class="card-content">
            <span class="category">${getCategoryName(story.category)}</span>
            <h3>${story.title}</h3>
            <p>${story.snippet}</p>
            <a href="${
              externalLinks[story.id]
            }" class="read-more" target="_blank" rel="noopener noreferrer">Read More</a>
          </div>
        </article>
      `
      )
      .join("");
  }

  function getCategoryName(category) {
    const categories = {
      history: "History",
      culture: "Culture",
      architecture: "Architecture",
      personal: "Personal",
    };
    return categories[category] || "Uncategorized";
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();

    if (!name || !email || !title || !body) {
      alert("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner">⏳</span> Submitting...';
    }

    try {
      const response = await fetch("/api/submit-lore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ name, email, title, body }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        showThankYouMessage();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting your story. Please try again.");

      const submissions = JSON.parse(
        localStorage.getItem("submissions") || "[]"
      );
      submissions.push({ name, email, title, body });
      localStorage.setItem("submissions", JSON.stringify(submissions));
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      }
    }
  }

  function showThankYouMessage() {
    if (form) form.classList.add("hidden");
    if (thankYouMessage) {
      thankYouMessage.classList.remove("hidden");
      thankYouMessage.classList.add("slide-up");
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function filterStories() {
    const selectedCategory = categorySelect.value;
    const searchTerm = searchInput.value.toLowerCase();

    let filteredStories = stories;

    if (selectedCategory !== "all") {
      filteredStories = filteredStories.filter(
        (story) => story.category === selectedCategory
      );
    }

    if (searchTerm) {
      filteredStories = filteredStories.filter(
        (story) =>
          story.title.toLowerCase().includes(searchTerm) ||
          story.snippet.toLowerCase().includes(searchTerm)
      );
    }

    renderStories(filteredStories);
  }

  function showStoryDetails(storyId) {
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;

    const modal = document.createElement("div");
    modal.className = "story-modal";
    modal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>${story.title}</h2>
          <span class="category">${getCategoryName(story.category)}</span>
          <img src="${story.image}" alt="${story.title}">
          <div class="story-body">${story.content}</div>
        </div>
      `;

    document.body.appendChild(modal);
    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.remove();
    });
  }

  function setupEventListeners() {
    if (form) {
      form.addEventListener("submit", handleFormSubmit);
    }

    if (submitAnotherBtn) {
      submitAnotherBtn.addEventListener("click", function () {
        form.reset();
        form.classList.remove("hidden");
        thankYouMessage.classList.add("hidden");
        thankYouMessage.classList.remove("slide-up");
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", filterStories);
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", filterStories);
    }
    if (searchInput) {
      searchInput.addEventListener("keyup", function (e) {
        if (e.key === "Enter") filterStories();
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 20,
            behavior: "smooth",
          });
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  function animateOnScroll() {
    const elements = document.querySelectorAll(
      ".story-card, .lore-form, .thank-you-message"
    );
    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      if (elementPosition < screenPosition) {
        element.classList.add("fade-in");
      }
    });
  }

  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll();
});
