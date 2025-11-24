
const staffApiUrl = "https://www.erskine.edu/wp-json/wp/v2/pages?slug=faculty-staff-directory";
let professorData = [];

async function loadProfessors() {
  try {
    const response = await fetch(staffApiUrl);
    const data = await response.json();

    if (!data.length || !data[0].content) {
      console.error("Professor directory not found");
      return;
    }

    const htmlContent = data[0].content.rendered;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const staffEntries = doc.querySelectorAll(
      ".vcex-staff-grid-wrap .staff-entry, .vcex-staff-grid-wrap .vcex-staff-entry, .vcex-staff-grid-wrap div"
    );

    professorData = Array.from(staffEntries).map(entry => {
      const nameEl = entry.querySelector(".staff-entry-title, h3, h4, strong");
      const name = nameEl ? nameEl.textContent.trim() : "";
      return { name };
    }).filter(prof => prof.name.length > 0);

    renderProfessors(professorData);
  } catch (error) {
    console.error("Error loading professors:", error);
  }
}

function renderProfessors(list) {
  const professorList = document.getElementById("professorList");
  professorList.innerHTML = "";
  list.forEach(prof => {
    const card = document.createElement("div");
    card.className = "card prof-card";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${prof.name}</h5>
      </div>
    `;
    professorList.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", function(e) {
    const query = e.target.value.toLowerCase();
    const filtered = professorData.filter(prof =>
      prof.name.toLowerCase().includes(query)
    );
    renderProfessors(filtered);
  });

  searchInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = e.target.value.toLowerCase();
      const filtered = professorData.filter(prof =>
        prof.name.toLowerCase().includes(query)
      );
      renderProfessors(filtered);
    }
  });

  // Load professors after DOM is ready
  loadProfessors();
});