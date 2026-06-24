const announcementsContainer =
    document.getElementById("announcements");

const circularsContainer =
    document.getElementById("circulars");

const eventsContainer =
    document.getElementById("events");

const leftLinksContainer =
    document.querySelector("#leftLinks .links-container");

const rightLinksContainer =
    document.querySelector("#rightLinks .links-container");

const searchInput =
    document.getElementById("searchInput");

let portalData = {};

async function loadPortalData() {

    try {

        const response =
            await fetch(`${API_URL}?action=getAll`);

        const data =
            await response.json();

        portalData = data;

        renderAll();

    } catch (error) {

        console.error(error);

        announcementsContainer.innerHTML =
            "<p>Unable to load data.</p>";
    }
}

function renderAll() {

    renderLinks(
        portalData.leftLinks || [],
        leftLinksContainer
    );

    renderLinks(
        portalData.rightLinks || [],
        rightLinksContainer
    );

    renderCards(
        portalData.announcements || [],
        announcementsContainer,
        "announcement"
    );

    renderCards(
        portalData.circulars || [],
        circularsContainer,
        "circular"
    );

    renderCards(
        portalData.events || [],
        eventsContainer,
        "event"
    );
}

function renderLinks(data, container) {
    if(!container) return;
    container.innerHTML = "";

    data.forEach(link => {

        const a =
            document.createElement("a");

        a.href = link.URL || "#";

        a.target = "_blank";

        a.innerHTML = `
            ${
                link.Image
                ? `<img src="${link.Image}" width="24">`
                : ""
            }
            ${link.Name}
        `;

        container.appendChild(a);
    });
}
function renderCards(data, container, type) {
    if(!container) return;
    const search =
    searchInput
        ? searchInput.value.toLowerCase()
        : "";

    const filtered =
        data.filter(item => {

            const title =
                (item.Title || "")
                .toLowerCase();

            const content =
                (item.Content || "")
                .toLowerCase();

            return (
                title.includes(search) ||
                content.includes(search)
            );

        });

    container.innerHTML = "";

    filtered.forEach(item => {

        const card =
            document.createElement("div");

        card.className =
            "portal-card";

        let dateText = "";

        if(type === "event"){

            dateText =
                item.EventDate || "";

        }else{

            dateText =
                item.Date || "";
        }

        card.innerHTML = `

            ${
                item.Image
                ? `<img src="${item.Image}" alt="${item.Title || ''}">`
                : ""
            }

            <div class="portal-card-content">

                <h3>${item.Title || ""}</h3>

                <p>${item.Content || ""}</p>

                <div class="meta">

                    ${
                        item.Writer
                        ? `By ${item.Writer}<br>`
                        : ""
                    }

                    ${dateText}

                </div>

                <div class="action-buttons">

                    ${
                        item.PDF
                        ? `
                        <a href="${item.PDF}" target="_blank">
                            Open SPDF Link
                        </a>
                        `
                        : ""
                    }

                    ${
                        item.Link
                        ? `
                        <a href="${item.Link}" target="_blank">
                            Open Link
                        </a>
                        `
                        : ""
                    }

                </div>

            </div>
        `;

        container.appendChild(card);

    });

}
if(searchInput){

    searchInput.addEventListener(
        "input",
        renderAll
    );

}

loadPortalData();

setInterval(
    loadPortalData,
    AUTO_REFRESH_INTERVAL
);
const menuBtn =
document.getElementById("menuBtn");

const leftSidebar =
document.getElementById("leftLinks");

if(menuBtn){

    menuBtn.addEventListener("click",()=>{

        leftSidebar.classList.toggle("active");

    });

}
