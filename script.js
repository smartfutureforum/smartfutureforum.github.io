"use strict";

// ========================================
// أدوات مساعدة
// ========================================

const $ = selector => document.querySelector(selector);

function escapeHTML(value) {
    const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(value ?? "").replace(
        /[&<>"']/g,
        character => characters[character]
    );
}

// ========================================
// المظهر: يبدأ بالغامق
// ========================================

function setTheme(isLight) {
    document.documentElement.dataset.theme =
        isLight ? "light" : "dark";

    $("#theme").innerHTML = isLight
        ? '<span aria-hidden="true">☾</span><small>غامق</small>'
        : '<span aria-hidden="true">☀</span><small>فاتح</small>';

    $("#theme").setAttribute(
        "aria-label",
        isLight ? "تفعيل المظهر الغامق" : "تفعيل المظهر الفاتح"
    );

    const brand = $("#brand");

    if (brand) {
        brand.src = isLight
            ? "assets/brand-light.webp"
            : "assets/brand-dark.webp";
    }

    const themeMeta = $('meta[name="theme-color"]');

    if (themeMeta) {
        themeMeta.content = isLight ? "#f7f9f8" : "#071b2b";
    }
}

setTheme(false);

$("#theme").addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme !== "light");
});

// ========================================
// قائمة الجوال
// ========================================

const menuButton = $("#menu");
const navigation = $("#nav");

function closeMenu() {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(open));
});

navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("click", event => {
    if (!event.target.closest("header")) {
        closeMenu();
    }
});

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        navigation.classList.contains("open")
    ) {
        closeMenu();
        menuButton.focus();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMenu();
    }
});

// ========================================
// روابط التسجيل
// ========================================

const registrationLinks = [
    "https://iauvle.zoom.us/webinar/register/WN_Wm8r4du2Tn2Ajn834tCSsQ",
    "https://iauvle.zoom.us/webinar/register/WN_eTQMoZzaQ0KSOpAv502BTg",
    "https://iauvle.zoom.us/webinar/register/WN_3mxcq5dAQpOuMR7ty5e42Q"
];

// ========================================
// البرنامج الزمني
// ========================================

const days = [
    {
        name: "الأحد",
        date: "١",
        title: "ورش العلوم المالية",
        location: "عن بُعد عبر Zoom",

        rows: [
            ["7:00–7:20 PM", "التأمين وإدارة المخاطر"],
            ["7:20–7:40 PM", "التكنولوجيا المالية FinTech"],
            ["7:40–8:00 PM", "بروتوكول التعامل في سوق العمل"],
            ["8:00–8:30 PM", "فقرة الاستفسارات والختام"]
        ],

        link: registrationLinks[0]
    },

    {
        name: "الاثنين",
        date: "٢",
        title: "ورش العلوم الإدارية",
        location: "عن بُعد عبر Zoom",

        rows: [
            ["7:00–7:20 PM", "الموارد البشرية"],
            ["7:20–7:40 PM", "سلاسل الإمداد"],
            ["7:40–8:00 PM", "التسويق الرقمي"],
            ["8:00–8:30 PM", "فقرة الاستفسارات والختام"]
        ],

        link: registrationLinks[1]
    },

    {
        name: "الثلاثاء",
        date: "٣",
        title: "معرض التدريب",

        location:
            "مبنى العمادات المساندة بالحرم الجامعي بالراكة · مبنى D3",

        rows: [
            [
                "9:00 AM–1:00 PM",
                "معرض التدريب — جهات من القطاع الحكومي والخاص"
            ]
        ]
    },

    {
        name: "الأربعاء",
        date: "٤",
        title: "ورش علوم الحاسب",
        location: "عن بُعد عبر Zoom",

        rows: [
            ["7:00–7:20 PM", "أمن الشبكات"],
            ["7:20–7:40 PM", "قواعد البيانات"],
            ["7:40–8:00 PM", "البرمجة"],
            ["8:00–8:30 PM", "فقرة الاستفسارات والختام"]
        ],

        link: registrationLinks[2]
    },

    {
        name: "الخميس",
        date: "٥",
        title: "الحفل الختامي",
        location: "مسرح الكلية التطبيقية بالدمام",

        rows: [
            ["9:00–9:15 AM", "الافتتاحية"],

            [
                "9:15–9:30 AM",
                "عرض مرئي عن أهم إنجازات وحدة التدريب التعاوني ودراسات سوق العمل"
            ],

            ["9:30–10:00 AM", "تجربة خريجي الكلية في التدريب"],
            ["10:00–11:00 AM", "جلسة حوارية"],
            ["11:00–11:15 AM", "كلمة سعادة العميدة"],
            ["11:15–11:55 AM", "تكريم المشاركين والمنظمين"],

            [
                "12:00–1:00 PM",
                "لقاء مباشر وحيوي بين أرباب العمل والطلبة"
            ]
        ]
    }
];

$(".day-tabs").innerHTML = days.map((day, index) => `
    <button
        id="day-${index}"
        type="button"
        role="tab"
        aria-controls="agenda"
        aria-selected="${index === 0}"
        tabindex="${index === 0 ? 0 : -1}"
        data-day="${index}">

        ${escapeHTML(day.name)}
        <br>
        <b>${escapeHTML(day.date)} نوفمبر</b>
    </button>
`).join("");

function showAgenda(index) {
    const day = days[index];

    document.querySelectorAll("[data-day]").forEach((button, i) => {
        const selected = index === i;

        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
    });

    $("#agenda").setAttribute("aria-labelledby", `day-${index}`);

    $("#agenda").innerHTML = `
        <div class="agenda">
            <h3>${escapeHTML(day.title)}</h3>

            <p class="muted">
                ${escapeHTML(day.location)}
            </p>

            ${day.rows.map(([time, title]) => `
                <div class="agenda-row">
                    <time>${escapeHTML(time)}</time>
                    <span>${escapeHTML(title)}</span>
                </div>
            `).join("")}

            ${day.link ? `
                <a
                    class="button"
                    href="${escapeHTML(day.link)}"
                    target="_blank"
                    rel="noopener">

                    التسجيل في ورش اليوم ↗
                </a>
            ` : ""}
        </div>
    `;
}

document.querySelectorAll("[data-day]").forEach((button, index) => {
    button.addEventListener("click", () => {
        showAgenda(index);
    });

    button.addEventListener("keydown", event => {
        let next = index;

        switch (event.key) {
            case "ArrowLeft":
                next = (index + 1) % days.length;
                break;

            case "ArrowRight":
                next = (index - 1 + days.length) % days.length;
                break;

            case "Home":
                next = 0;
                break;

            case "End":
                next = days.length - 1;
                break;

            default:
                return;
        }

        event.preventDefault();

        showAgenda(next);
        $(`#day-${next}`).focus();
    });
});

$("#agenda").tabIndex = 0;

showAgenda(0);

// ========================================
// صور المتحدثين والصورة الافتراضية
// ========================================

const defaultSpeakerImage = "assets/default-speaker.png";

document.addEventListener("error", event => {
    const image = event.target;

    if (!(image instanceof HTMLImageElement)) return;

    if (!image.classList.contains("speaker-portrait")) return;

    if (image.dataset.fallbackApplied) return;

    image.dataset.fallbackApplied = "true";

    image.classList.add("is-placeholder");
    image.alt = "صورة رمزية افتراضية";
    image.src = defaultSpeakerImage;
}, true);

function renderPerson(person) {
    const hasPortrait = Boolean(
        person.image && person.image.trim()
    );

    const image = hasPortrait
        ? person.image
        : defaultSpeakerImage;

    const description = hasPortrait
        ? person.name
        : "صورة رمزية افتراضية";

    return `
        <div class="person">
            <img
                class="speaker-portrait${hasPortrait ? "" : " is-placeholder"}"
                src="${escapeHTML(image)}"
                alt="${escapeHTML(description)}"
                loading="lazy"
                width="96"
                height="112">

            <div>
                <h4>${escapeHTML(person.name)}</h4>
                <small>${escapeHTML(person.role)}</small>
            </div>
        </div>
    `;
}

// ========================================
// المسارات والورش
// ========================================

const tracks = [
    {
        id: "financial",
        title: "العلوم المالية",
        dayIndex: 0,
        start: 0,
        link: registrationLinks[0],
        qr: "assets/qr-1.png"
    },

    {
        id: "administrative",
        title: "العلوم الإدارية",
        dayIndex: 1,
        start: 3,
        link: registrationLinks[1],
        qr: "assets/qr-2.png"
    },

    {
        id: "computer",
        title: "علوم الحاسب",
        dayIndex: 3,
        start: 6,
        link: registrationLinks[2],
        qr: "assets/qr-4.png"
    }
];

const workshopTimes = [
    "٧:٠٠–٧:٢٠ مساءً",
    "٧:٢٠–٧:٤٠ مساءً",
    "٧:٤٠–٨:٠٠ مساءً"
];

$("#tracks").innerHTML = tracks.map(track => {
    const day = days[track.dayIndex];

    const workshops = DATA.workshops.slice(
        track.start,
        track.start + 3
    );

    return `
        <div class="track" id="${track.id}">
            <div class="track-head">
                <div>
                    <div class="eyebrow">
                        ${escapeHTML(day.name)}
                        ${escapeHTML(day.date)} نوفمبر ٢٠٢٦
                    </div>

                    <h3>${escapeHTML(track.title)}</h3>
                </div>

                <a
                    class="button"
                    href="${escapeHTML(track.link)}"
                    target="_blank"
                    rel="noopener">

                    التسجيل في المسار ↗
                </a>
            </div>

            <div class="grid">
                ${workshops.map((person, index) => `
                    <article class="card">
                        ${renderPerson(person)}

                        <span class="slot">
                            ${workshopTimes[index]}
                        </span>

                        <h3>${escapeHTML(person.title)}</h3>

                        <details>
                            <summary>محاور الورشة</summary>
                            <p>${escapeHTML(person.axes)}</p>
                        </details>

                        <details>
                            <summary>عن مقدم الورشة</summary>
                            <p>${escapeHTML(person.bio)}</p>
                        </details>
                    </article>
                `).join("")}
            </div>

            <div class="registration">
                <img
                    class="qr"
                    src="${escapeHTML(track.qr)}"
                    alt="باركود التسجيل في ${escapeHTML(track.title)}"
                    loading="lazy"
                    width="90"
                    height="90">

                <p>
                    امسح الباركود للتسجيل
                    <br>
                    أو استخدم زر التسجيل في المسار.
                </p>
            </div>
        </div>
    `;
}).join("");

// ========================================
// البحث في الورش
// ========================================

function normalizeSearch(value) {
    return String(value)
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[\u064B-\u065F\u0670]/g, "")
        .replace(/[أإآ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/\s+/g, " ")
        .trim();
}

const workshopCards = [
    ...document.querySelectorAll("#tracks .card")
];

workshopCards.forEach(card => {
    card.dataset.search = normalizeSearch(card.textContent);
});

function searchWorkshops() {
    const query = normalizeSearch(
        $("#workshop-search").value
    );

    let count = 0;

    workshopCards.forEach(card => {
        card.hidden = !card.dataset.search.includes(query);

        if (!card.hidden) {
            count++;
        }
    });

    document.querySelectorAll("#tracks .track").forEach(track => {
        const hasVisibleCards = [
            ...track.querySelectorAll(".card")
        ].some(card => !card.hidden);

        track.hidden = !hasVisibleCards;
    });

    $("#workshop-results").textContent = count
        ? `عدد الورش المعروضة: ${count.toLocaleString("ar-SA")}`
        : "لا توجد نتائج مطابقة. جرّب اسمًا آخر أو امسح البحث.";
}

$("#workshop-search").addEventListener(
    "input",
    searchWorkshops
);

searchWorkshops();

// ========================================
// المشاركون في الجلسة الحوارية
// ========================================

$("#panelists").innerHTML = DATA.panel.map(person => `
    <article class="card">
        ${renderPerson(person)}

        <details>
            <summary>نبذة عن المشارك</summary>
            <p>${escapeHTML(person.bio)}</p>
        </details>
    </article>
`).join("");

// ========================================
// الجهات المشاركة
// ========================================

$("#organizations").innerHTML = DATA.organizations.map(org => `
    <article class="org">
        ${org.image ? `
            <img
                src="${escapeHTML(org.image)}"
                alt="شعار ${escapeHTML(org.name)}"
                loading="lazy">
        ` : ""}

        <h3>${escapeHTML(org.name)}</h3>

        ${org.bio && org.bio !== "—" ? `
            <details>
                <summary>عن الجهة</summary>
                <p>${escapeHTML(org.bio)}</p>
            </details>
        ` : ""}
    </article>
`).join("");

// ========================================
// تمييز القسم الحالي في شريط التنقل
// ========================================

const navigationLinks = [
    ...document.querySelectorAll("#nav a")
];

const sectionTargets = [
    { element: $(".hero"), href: "#main" },
    { element: $("#program"), href: "#program" },
    { element: $("#workshops"), href: "#workshops" },
    { element: $("#panel"), href: "#panel" },
    { element: $("#partners"), href: "#partners" },
    { element: $("#contact"), href: "#contact" }
].filter(target => target.element);

let navigationFramePending = false;

function updateActiveNavigation() {
    const marker = $("header").offsetHeight + 50;

    let activeHref = "#main";
    let nearestTop = -Infinity;

    sectionTargets.forEach(target => {
        const top = target.element.getBoundingClientRect().top;

        if (top <= marker && top > nearestTop) {
            nearestTop = top;
            activeHref = target.href;
        }
    });

    navigationLinks.forEach(link => {
        const active =
            link.getAttribute("href") === activeHref;

        link.classList.toggle("active", active);

        if (active) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    navigationFramePending = false;
}

window.addEventListener("scroll", () => {
    if (navigationFramePending) return;

    navigationFramePending = true;

    requestAnimationFrame(updateActiveNavigation);
}, { passive: true });

window.addEventListener("resize", updateActiveNavigation);

updateActiveNavigation();

// ========================================
// نافذة عرض الإعلانات
// ========================================

const announcementDialog = document.createElement("dialog");

announcementDialog.className = "announcement-dialog";

announcementDialog.setAttribute(
    "aria-labelledby",
    "announcement-title"
);

announcementDialog.innerHTML = `
    <div class="announcement-toolbar">
        <h2
            class="announcement-title"
            id="announcement-title">

            إعلانات الملتقى
        </h2>

        <div class="announcement-controls">
            <button
                type="button"
                data-action="zoom-out"
                aria-label="تصغير الإعلان">

                −
            </button>

            <button
                type="button"
                data-action="reset"
                aria-label="عرض الإعلان كاملًا">

                احتواء
            </button>

            <button
                type="button"
                data-action="zoom-in"
                aria-label="تكبير الإعلان">

                +
            </button>

            <a data-action="download" download>
                تحميل ↓
            </a>

            <button
                type="button"
                data-action="close"
                aria-label="إغلاق الإعلان"
                autofocus>

                ✕
            </button>
        </div>
    </div>

    <div class="announcement-stage">
        <img
            class="announcement-image"
            alt=""
            hidden>
    </div>

    <p
        class="announcement-status"
        role="status"
        aria-live="polite">
    </p>
`;

document.body.append(announcementDialog);

const announcementImage =
    announcementDialog.querySelector(".announcement-image");

const announcementStage =
    announcementDialog.querySelector(".announcement-stage");

const announcementStatus =
    announcementDialog.querySelector(".announcement-status");

const zoomInButton =
    announcementDialog.querySelector(
        '[data-action="zoom-in"]'
    );

const zoomOutButton =
    announcementDialog.querySelector(
        '[data-action="zoom-out"]'
    );

const resetZoomButton =
    announcementDialog.querySelector(
        '[data-action="reset"]'
    );

const downloadAnnouncementLink =
    announcementDialog.querySelector(
        '[data-action="download"]'
    );

const closeAnnouncementButton =
    announcementDialog.querySelector(
        '[data-action="close"]'
    );

let announcementZoom = 100;
let announcementBaseWidth = 0;
let announcementOpener = null;
let previousBodyOverflow = "";
let announcementLoadToken = 0;

function stageSize() {
    const style = getComputedStyle(announcementStage);

    return {
        width: Math.max(
            1,
            announcementStage.clientWidth -
            parseFloat(style.paddingLeft) -
            parseFloat(style.paddingRight)
        ),

        height: Math.max(
            1,
            announcementStage.clientHeight -
            parseFloat(style.paddingTop) -
            parseFloat(style.paddingBottom)
        )
    };
}

function updateAnnouncementZoom(value) {
    announcementZoom = Math.max(
        100,
        Math.min(300, value)
    );

    if (announcementBaseWidth) {
        announcementImage.style.width =
            `${announcementBaseWidth * announcementZoom / 100}px`;

        announcementImage.style.height = "auto";
        announcementImage.style.maxWidth = "none";
    }

    resetZoomButton.textContent =
        announcementZoom === 100
            ? "احتواء"
            : `${announcementZoom}%`;

    zoomOutButton.disabled = announcementZoom === 100;
    zoomInButton.disabled = announcementZoom === 300;
}

function fitAnnouncement() {
    if (
        !announcementDialog.open ||
        !announcementImage.naturalWidth
    ) {
        return;
    }

    const size = stageSize();

    const scale = Math.min(
        size.width / announcementImage.naturalWidth,
        size.height / announcementImage.naturalHeight,
        1
    );

    announcementBaseWidth =
        announcementImage.naturalWidth * scale;

    updateAnnouncementZoom(100);

    announcementStage.scrollTop = 0;
    announcementStage.scrollLeft = 0;
}

function openAnnouncement(link) {
    if (
        typeof announcementDialog.showModal !== "function"
    ) {
        return false;
    }

    const title = link.closest("#program")
        ? "البرنامج الزمني للملتقى"
        : link.textContent.replace(/[↗←]/g, "").trim();

    announcementOpener = link;
    announcementImage.hidden = true;
    announcementBaseWidth = 0;

    announcementDialog.querySelector(
        "#announcement-title"
    ).textContent = title;

    announcementImage.alt = title;

    announcementStatus.textContent =
        "جارٍ تحميل الإعلان…";

    downloadAnnouncementLink.href = link.href;

    downloadAnnouncementLink.download =
        new URL(link.href).pathname.split("/").pop();

    updateAnnouncementZoom(100);

    if (!announcementDialog.open) {
        previousBodyOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        announcementDialog.showModal();
    }

    const token = ++announcementLoadToken;
    const loader = new Image();

    loader.onload = () => {
        if (
            token !== announcementLoadToken ||
            !announcementDialog.open
        ) {
            return;
        }

        announcementImage.onload = () => {
            if (
                token !== announcementLoadToken ||
                !announcementDialog.open
            ) {
                return;
            }

            announcementImage.hidden = false;

            fitAnnouncement();

            announcementStatus.textContent =
                "الإعلان معروض كاملًا · استخدم + لتكبير التفاصيل · Esc للإغلاق";
        };

        announcementImage.src = loader.src;
    };

    loader.onerror = () => {
        if (
            token !== announcementLoadToken ||
            !announcementDialog.open
        ) {
            return;
        }

        announcementStatus.textContent =
            "تعذّر تحميل الإعلان. تأكد من وجود الصورة داخل مجلد assets.";
    };

    loader.src = link.href;

    return true;
}

document.querySelectorAll(
    ".downloads a[href], #program .section-head a[href]"
).forEach(link => {
    link.setAttribute("aria-haspopup", "dialog");

    link.addEventListener("click", event => {
        if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        if (openAnnouncement(link)) {
            event.preventDefault();
        }
    });
});

zoomInButton.addEventListener("click", () => {
    updateAnnouncementZoom(announcementZoom + 25);
});

zoomOutButton.addEventListener("click", () => {
    updateAnnouncementZoom(announcementZoom - 25);
});

resetZoomButton.addEventListener(
    "click",
    fitAnnouncement
);

closeAnnouncementButton.addEventListener("click", () => {
    announcementDialog.close();
});

announcementDialog.addEventListener("click", event => {
    if (event.target !== announcementDialog) {
        return;
    }

    const bounds =
        announcementDialog.getBoundingClientRect();

    const clickedOutside =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;

    if (clickedOutside) {
        announcementDialog.close();
    }
});

announcementDialog.addEventListener("close", () => {
    announcementLoadToken++;

    document.body.style.overflow =
        previousBodyOverflow;

    announcementOpener?.focus();
});

window.addEventListener("resize", () => {
    if (
        announcementDialog.open &&
        !announcementImage.hidden
    ) {
        fitAnnouncement();
    }
});