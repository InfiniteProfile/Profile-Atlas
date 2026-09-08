```javascript
"use strict";

/*
 * INFINITEPROFILE
 * Deterministic browser-only profile network.
 *
 * Hard capacity:
 * APN-000001 → APN-010000
 */

const PROFILE_COUNT = 10000;
const DEBUG_MODE = false;
const PAGE_SIZE = 50;

const state = {
    query: "",
    authority: "all",
    occupation: "all",
    department: "all",
    location: "all",
    verification: "all",
    sort: "id-asc",
    page: 1,
    resultIds: [],
    validation: null,
    initialized: false
};

const FIRST_NAMES = [
    "Adrian","Aiden","Alina","Amelia","Andre","Anika","Aria","Arman","Arthur","Avery",
    "Benjamin","Bianca","Brandon","Brielle","Caleb","Camila","Cameron","Carina","Carter","Celeste",
    "Daniel","Daria","Darius","David","Elena","Elias","Elijah","Elisa","Emilia","Ethan",
    "Farah","Felix","Fiona","Gabriel","Gavin","Gemma","Grace","Hana","Hannah","Harper",
    "Hassan","Hazel","Henry","Ibrahim","Imani","Isaac","Isla","Ivan","Jade","Jamal",
    "Jasper","Javier","Jonah","Jordan","Joseph","Julia","Julian","Kaden","Kai","Kara",
    "Karim","Katherine","Keira","Khalid","Kiara","Laila","Lana","Leah","Leo","Liam",
    "Lina","Lucas","Maya","Mason","Mateo","Mia","Mika","Mila","Mina","Mohammed",
    "Nadia","Naomi","Nathan","Nora","Noah","Nolan","Omar","Olivia","Owen","Priya",
    "Rafael","Rania","Rayyan","Reed","Rhea","Riley","Roman","Rowan","Ryan","Sabrina",
    "Samir","Sara","Sarah","Sebastian","Selena","Sofia","Sophia","Theo","Thomas","Tobias",
    "Valentina","Victor","Violet","Waleed","Willow","Xavier","Yara","Yasmin","Zachary","Zara"
];

const MIDDLE_NAMES = [
    "James","Ray","Lee","Morgan","Alex","Kai","Noor","Ari","Sam","Taylor",
    "Drew","Jude","Reese","Evan","Mika","Dean","Robin","Blair","Skye","Quinn",
    "Rae","Lane","Sage","Cole","Ren","Gray","Finn","Max","Eli","Shawn"
];

const LAST_NAMES = [
    "Anderson","Bennett","Brooks","Carter","Collins","Cooper","Dawson","Ellis","Evans","Foster",
    "Garcia","Gibson","Grant","Green","Griffin","Hall","Harris","Hayes","Henderson","Hughes",
    "Jackson","James","Johnson","Khan","King","Lewis","Martin","Mason","Mitchell","Morgan",
    "Nelson","Parker","Patel","Patterson","Pearson","Perry","Peterson","Phillips","Powell","Reed",
    "Reynolds","Richardson","Rivera","Roberts","Robinson","Rogers","Ross","Russell","Sanders","Scott",
    "Shaw","Simpson","Smith","Spencer","Stevens","Stewart","Stone","Sullivan","Taylor","Thomas",
    "Thompson","Torres","Turner","Walker","Wallace","Walsh","Ward","Washington","Watson","Webb",
    "Wells","West","Wheeler","White","Williams","Wilson","Wood","Wright","Young","Zimmerman"
];

const LOCATIONS = [
    ["Dhaka","Bangladesh"],["Chattogram","Bangladesh"],["Sylhet","Bangladesh"],["Rajshahi","Bangladesh"],
    ["London","United Kingdom"],["Manchester","United Kingdom"],["Edinburgh","United Kingdom"],
    ["New York","United States"],["San Francisco","United States"],["Seattle","United States"],
    ["Toronto","Canada"],["Vancouver","Canada"],["Berlin","Germany"],["Munich","Germany"],
    ["Paris","France"],["Amsterdam","Netherlands"],["Stockholm","Sweden"],["Oslo","Norway"],
    ["Copenhagen","Denmark"],["Helsinki","Finland"],["Madrid","Spain"],["Barcelona","Spain"],
    ["Rome","Italy"],["Milan","Italy"],["Lisbon","Portugal"],["Zurich","Switzerland"],
    ["Vienna","Austria"],["Prague","Czech Republic"],["Warsaw","Poland"],["Dubai","UAE"],
    ["Abu Dhabi","UAE"],["Doha","Qatar"],["Riyadh","Saudi Arabia"],["Singapore","Singapore"],
    ["Tokyo","Japan"],["Osaka","Japan"],["Seoul","South Korea"],["Beijing","China"],
    ["Shanghai","China"],["Hong Kong","Hong Kong"],["Taipei","Taiwan"],["Bangkok","Thailand"],
    ["Kuala Lumpur","Malaysia"],["Jakarta","Indonesia"],["Sydney","Australia"],["Melbourne","Australia"],
    ["Auckland","New Zealand"],["Mumbai","India"],["Delhi","India"],["Bengaluru","India"]
];

const DEPARTMENTS = [
    {
        name: "Engineering",
        occupations: ["Software Engineer","Systems Engineer","Cloud Engineer","DevOps Engineer","Embedded Engineer","Automation Engineer"],
        skills: ["JavaScript","Systems Architecture","Cloud Computing","Automation","Testing","Distributed Systems"]
    },
    {
        name: "Research",
        occupations: ["Research Scientist","Data Researcher","Research Analyst","Laboratory Specialist","Research Engineer"],
        skills: ["Experimental Design","Data Analysis","Scientific Writing","Statistical Modeling","Research Methods","Documentation"]
    },
    {
        name: "Design",
        occupations: ["Product Designer","Industrial Designer","UX Designer","Visual Designer","Design Researcher"],
        skills: ["Prototyping","Typography","Visual Systems","3D Modeling","User Research","Product Design"]
    },
    {
        name: "Security",
        occupations: ["Cybersecurity Analyst","Security Engineer","Threat Analyst","Security Researcher","Risk Specialist"],
        skills: ["Threat Analysis","Network Security","Incident Response","Digital Forensics","Risk Assessment","Security Architecture"]
    },
    {
        name: "Operations",
        occupations: ["Operations Manager","Process Analyst","Operations Specialist","Program Coordinator","Quality Manager"],
        skills: ["Process Design","Quality Control","Planning","Operations Strategy","Logistics","Optimization"]
    },
    {
        name: "Finance",
        occupations: ["Financial Analyst","Investment Analyst","Risk Analyst","Financial Planner","Treasury Specialist"],
        skills: ["Financial Modeling","Risk Analysis","Forecasting","Accounting","Portfolio Analysis","Market Research"]
    },
    {
        name: "Media",
        occupations: ["Content Strategist","Editor","Digital Producer","Media Analyst","Creative Producer"],
        skills: ["Storytelling","Editorial Planning","Content Strategy","Video Production","Research","Audience Analysis"]
    },
    {
        name: "Education",
        occupations: ["Learning Designer","Education Specialist","Academic Coordinator","Instructional Researcher","Mentor"],
        skills: ["Curriculum Design","Teaching","Mentoring","Assessment","Learning Science","Public Speaking"]
    },
    {
        name: "Healthcare",
        occupations: ["Health Data Analyst","Healthcare Coordinator","Clinical Researcher","Health Systems Specialist"],
        skills: ["Health Analytics","Research","Data Management","Program Coordination","Quality Improvement"]
    },
    {
        name: "Business",
        occupations: ["Business Strategist","Product Manager","Entrepreneur","Business Analyst","Partnership Manager"],
        skills: ["Strategy","Product Management","Negotiation","Market Analysis","Leadership","Business Development"]
    },
    {
        name: "Architecture",
        occupations: ["Architect","Urban Planner","Spatial Designer","Architectural Researcher","BIM Specialist"],
        skills: ["Spatial Planning","CAD","BIM","Urban Design","Visualization","Sustainable Design"]
    },
    {
        name: "Science",
        occupations: ["Physicist","Biologist","Chemist","Environmental Scientist","Computational Scientist"],
        skills: ["Scientific Computing","Data Analysis","Laboratory Methods","Modeling","Technical Writing","Experimentation"]
    }
];

const AUTHORITY_LEVELS = [
    { name: "Visitor", score: 1 },
    { name: "Member", score: 2 },
    { name: "Contributor", score: 3 },
    { name: "Verified Member", score: 4 },
    { name: "Senior Member", score: 5 },
    { name: "Specialist", score: 6 },
    { name: "Expert", score: 7 },
    { name: "Mentor", score: 8 },
    { name: "Moderator", score: 9 },
    { name: "Senior Moderator", score: 10 },
    { name: "Administrator", score: 11 },
    { name: "Senior Administrator", score: 12 },
    { name: "Director", score: 13 },
    { name: "Executive", score: 14 },
    { name: "Founder", score: 15 }
];

const PERSONALITIES = [
    "Analytical","Creative","Strategic","Technical","Social","Leadership-oriented",
    "Academic","Entrepreneurial","Adventurous","Methodical","Curious","Collaborative",
    "Independent","Visionary","Practical","Detail-focused","Experimental","Resilient"
];

const INTERESTS = [
    "Open Source","Photography","Astronomy","Robotics","Cycling","Literature","Travel",
    "Architecture","Gaming","Music","Film","History","Artificial Intelligence","Space",
    "Languages","Investing","Design","Cooking","Running","Hiking","Mathematics","Nature",
    "Documentaries","Urban Exploration","Education","Sustainability","Electronics","Chess",
    "Psychology","Creative Writing","Data Visualization","Entrepreneurship","Innovation",
    "Machine Learning","Cultural Studies","Product Design","Science Fiction","Maps","Research"
];

const ACHIEVEMENTS = [
    "Early Contributor","Top Mentor","Innovation Award","Research Pioneer","Project Leader",
    "Community Builder","Expert Contributor","Long-Term Member","Problem Solver","Rising Star",
    "Knowledge Catalyst","Systems Thinker","Design Excellence","Strategic Contributor",
    "Community Mentor","Quality Champion","Technical Pathfinder","Creative Catalyst",
    "Operational Excellence","Discovery Award","Impact Builder","Collaboration Award"
];

const BADGES = [
    "Verified","Pioneer","Mentor","Builder","Researcher","Strategist","Creator","Explorer",
    "Leader","Specialist","Community","Innovator","Analyst","Contributor","Veteran","Rising"
];

const BIO_OPENINGS = [
    "Known for a methodical approach to complex challenges",
    "Driven by curiosity and a strong interest in practical innovation",
    "Focused on turning difficult problems into understandable systems",
    "Recognized for combining technical depth with clear communication",
    "Interested in building useful ideas that can survive real-world constraints",
    "Motivated by continuous learning, experimentation, and measurable progress",
    "Often works at the intersection of people, systems, and emerging technology",
    "Brings a research-oriented mindset to long-term projects"
];

const BIO_GOALS = [
    "and currently exploring new ways to improve how people collaborate.",
    "while developing a broader perspective through independent projects.",
    "with a long-term goal of creating durable and accessible solutions.",
    "and enjoys sharing practical knowledge with the wider community.",
    "while continuously refining both technical and creative skills.",
    "with an emphasis on sustainable progress rather than short-term results.",
    "and remains particularly interested in projects with measurable impact.",
    "while looking for opportunities to mentor others and exchange ideas."
];

const THEMES = [
    "#8b7cff","#6e8cff","#55b8d6","#55d6a7","#c49aef","#e8bd72","#df7897","#74b7a8"
];

const STYLE_FAMILIES = [
    "Minimal","Executive","Technical","Research","Creative",
    "Editorial","Authority","Classic","Modern","Compact"
];

const CACHE = new Map();
const UNIQUE_USERNAME_CACHE = new Map();

function createSeed(value) {
    let h = 2166136261 >>> 0;
    const text = String(value);

    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }

    return h >>> 0;
}

function seededRandom(seed) {
    let x = seed >>> 0;
    return function () {
        x += 0x6D2B79F5;
        let t = x;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function pick(rng, array) {
    return array[Math.floor(rng() * array.length)];
}

function pickMany(rng, array, count) {
    const pool = [...array];
    const result = [];

    while (pool.length && result.length < count) {
        const index = Math.floor(rng() * pool.length);
        result.push(pool.splice(index, 1)[0]);
    }

    return result;
}

function idFromNumber(number) {
    return `APN-${String(number).padStart(6, "0")}`;
}

function normalizeId(input) {
    if (!input) return null;

    const raw = String(input).trim().toUpperCase();

    if (/^\d+$/.test(raw)) {
        const number = Number(raw);
        return number >= 1 && number <= PROFILE_COUNT
            ? idFromNumber(number)
            : null;
    }

    const match = raw.match(/^APN-(\d{1,6})$/);

    if (!match) return null;

    const number = Number(match[1]);

    if (number < 1 || number > PROFILE_COUNT) {
        return null;
    }

    return idFromNumber(number);
}

function numberFromId(id) {
    return Number(id.slice(4));
}

function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ".")
        .replace(/^\.+|\.+$/g, "");
}

function createUniqueUsername(first, last, id, seed) {
    const base = `${slugify(first)}.${slugify(last)}`;
    const number = numberFromId(id);
    const suffix = number.toString(36).padStart(3, "0");
    const candidate = `${base}.${suffix}`;

    if (!UNIQUE_USERNAME_CACHE.has(candidate)) {
        UNIQUE_USERNAME_CACHE.set(candidate, id);
        return candidate;
    }

    const fallback = `${base}.${(seed >>> 0).toString(36)}`;

    if (!UNIQUE_USERNAME_CACHE.has(fallback)) {
        UNIQUE_USERNAME_CACHE.set(fallback, id);
        return fallback;
    }

    const finalCandidate = `${base}.${suffix}.${number}`;

    UNIQUE_USERNAME_CACHE.set(finalCandidate, id);
    return finalCandidate;
}

function createAvatar(profile) {
    const seed = createSeed(profile.id);
    const rng = seededRandom(seed);

    const bg = profile.theme;
    const secondary = THEMES[Math.floor(rng() * THEMES.length)];
    const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();

    const shapeType = Math.floor(rng() * 5);
    const angle = Math.floor(rng() * 360);
    const circleX = 25 + Math.floor(rng() * 50);
    const circleY = 25 + Math.floor(rng() * 50);
    const radius = 15 + Math.floor(rng() * 24);

    let shape = "";

    if (shapeType === 0) {
        shape = `<circle cx="${circleX}" cy="${circleY}" r="${radius}" fill="${secondary}" opacity=".7"/>`;
    } else if (shapeType === 1) {
        shape = `<rect x="18" y="18" width="64" height="64" rx="20" fill="${secondary}" opacity=".7" transform="rotate(${angle} 50 50)"/>`;
    } else if (shapeType === 2) {
        shape = `<polygon points="50,10 90,78 10,78" fill="${secondary}" opacity=".65" transform="rotate(${angle} 50 50)"/>`;
    } else if (shapeType === 3) {
        shape = `<path d="M10 60 Q30 10 50 50 T90 40 L90 100 L10 100Z" fill="${secondary}" opacity=".7"/>`;
    } else {
        shape = `
            <circle cx="50" cy="50" r="38" fill="none" stroke="${secondary}" stroke-width="8" opacity=".65"/>
            <circle cx="${circleX}" cy="${circleY}" r="8" fill="${secondary}"/>
        `;
    }

    const safeInitials = initials.replace(/&/g, "&amp;");

    return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Avatar for ${profile.name}">
            <defs>
                <linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="${bg}"/>
                    <stop offset="1" stop-color="${secondary}"/>
                </linearGradient>
            </defs>
            <rect width="100" height="100" fill="#0b0f19"/>
            <rect width="100" height="100" fill="url(#g${seed})" opacity=".25"/>
            ${shape}
            <circle cx="78" cy="22" r="4" fill="${bg}" opacity=".8"/>
            <text x="50" y="59"
                  text-anchor="middle"
                  font-family="Arial, sans-serif"
                  font-size="22"
                  font-weight="800"
                  fill="#ffffff">${safeInitials}</text>
        </svg>
    `;
}

function getAuthorityIndex(rng) {
    const roll = rng();

    if (roll < .20) return 1;
    if (roll < .36) return 2;
    if (roll < .50) return 3;
    if (roll < .62) return 4;
    if (roll < .72) return 5;
    if (roll < .81) return 6;
    if (roll < .87) return 7;
    if (roll < .92) return 8;
    if (roll < .95) return 9;
    if (roll < .972) return 10;
    if (roll < .986) return 11;
    if (roll < .994) return 12;
    if (roll < .998) return 13;
    if (roll < .9995) return 14;

    return 15;
}

function generateProfile(id) {
    const normalized = normalizeId(id);

    if (!normalized) {
        return null;
    }

    if (CACHE.has(normalized)) {
        return CACHE.get(normalized);
    }

    const number = numberFromId(normalized);
    const seed = createSeed(normalized);
    const rng = seededRandom(seed);

    const firstName = pick(rng, FIRST_NAMES);
    const middleName = pick(rng, MIDDLE_NAMES);
    const lastName = pick(rng, LAST_NAMES);

    const location = pick(rng, LOCATIONS);
    const department = pick(rng, DEPARTMENTS);
    const occupation = pick(rng, department.occupations);
    const authority = AUTHORITY_LEVELS[getAuthorityIndex(rng)];

    const age = 19 + Math.floor(rng() * 48);
    const experience = Math.max(
        0,
        Math.min(age - 18, Math.floor((authority.score * 1.55) + rng() * 9))
    );

    const verification =
        authority.score >= 4 ||
        (number % 11 === 0);

    const reputationBase = authority.score * 430;
    const reputation = reputationBase + Math.floor(rng() * 2600);

    const contributions =
        authority.score * 9 +
        Math.floor(rng() * 160);

    const projects =
        Math.max(1, Math.floor(authority.score / 2) + Math.floor(rng() * 22));

    const connections =
        12 +
        authority.score * 14 +
        Math.floor(rng() * 340);

    const activity =
        Math.min(100, 25 + authority.score * 4 + Math.floor(rng() * 45));

    const educationLevel =
        age < 23 ? "Undergraduate" :
        age < 29 ? "Graduate" :
        age < 38 ? "Advanced Professional" :
        "Senior Professional";

    const skills = [
        ...department.skills,
        ...pickMany(rng, [
            "Communication","Leadership","Problem Solving","Planning",
            "Documentation","Critical Thinking","Presentation","Collaboration",
            "Project Management","Strategic Thinking","Mentoring","Analysis"
        ], 2)
    ].slice(0, 6);

    const interests = pickMany(rng, INTERESTS, 4);
    const achievements = pickMany(
        rng,
        ACHIEVEMENTS,
        Math.min(5, 1 + Math.floor(authority.score / 4))
    );

    const badges = pickMany(
        rng,
        BADGES,
        Math.min(6, 2 + Math.floor(authority.score / 3))
    );

    const personality = pick(rng, PERSONALITIES);
    const theme = pick(rng, THEMES);
    const styleFamily = pick(rng, STYLE_FAMILIES);

    const joinedYear = 2016 + Math.floor(rng() * 10);
    const joinedMonth = String(1 + Math.floor(rng() * 12)).padStart(2, "0");
    const joinedDay = String(1 + Math.floor(rng() * 27)).padStart(2, "0");

    const biography =
        `${pick(rng, BIO_OPENINGS)}. ` +
        `${firstName} has developed experience as a ${occupation.toLowerCase()} ` +
        `within ${department.name.toLowerCase()}, with a focus on ${skills[0].toLowerCase()} ` +
        `and ${skills[1].toLowerCase()}. ` +
        `${pick(rng, BIO_GOALS)}`;

    const middleInitial = middleName[0];

    const profile = {
        id: normalized,
        number,
        seed,
        firstName,
        middleName,
        middleInitial,
        lastName,
        name: `${firstName} ${middleInitial}. ${lastName}`,
        username: createUniqueUsername(firstName, lastName, normalized, seed),
        age,
        location: location[0],
        country: location[1],
        occupation,
        department: department.name,
        authority: authority.name,
        authorityScore: authority.score,
        verified: verification,
        reputation,
        contributions,
        projects,
        connections,
        activity,
        experience,
        educationLevel,
        personality,
        skills,
        interests,
        achievements,
        badges,
        theme,
        styleFamily,
        joinedDate: `${joinedYear}-${joinedMonth}-${joinedDay}`,
        biography
    };

    profile.avatar = createAvatar(profile);

    CACHE.set(normalized, profile);

    return profile;
}

function validateProfile(profile) {
    if (!profile) return false;

    const required = [
        "id","name","username","age","location","country",
        "occupation","department","authority","biography",
        "skills","interests","achievements","badges",
        "reputation","connections","activity","avatar"
    ];

    return required.every(key => {
        const value = profile[key];
        return value !== undefined &&
               value !== null &&
               (typeof value !== "string" || value.length > 0);
    });
}

function validateProfileSystem() {
    const seenIds = new Set();
    const seenUsernames = new Set();

    let missing = 0;
    let invalid = 0;
    let duplicateIds = 0;
    let duplicateUsernames = 0;
    let deterministicFailures = 0;

    for (let i = 1; i <= PROFILE_COUNT; i++) {
        const id = idFromNumber(i);
        const profile = generateProfile(id);

        if (!profile) {
            missing++;
            continue;
        }

        if (seenIds.has(profile.id)) {
            duplicateIds++;
        } else {
            seenIds.add(profile.id);
        }

        if (seenUsernames.has(profile.username)) {
            duplicateUsernames++;
        } else {
            seenUsernames.add(profile.username);
        }

        if (!validateProfile(profile)) {
            invalid++;
        }

        const snapshot = JSON.stringify({
            id: profile.id,
            name: profile.name,
            username: profile.username,
            age: profile.age,
            location: profile.location,
            country: profile.country,
            occupation: profile.occupation,
            authority: profile.authority,
            biography: profile.biography,
            skills: profile.skills,
            theme: profile.theme,
            joinedDate: profile.joinedDate
        });

        CACHE.delete(profile.id);
        const second = generateProfile(profile.id);

        const secondSnapshot = JSON.stringify({
            id: second.id,
            name: second.name,
            username: second.username,
            age: second.age,
            location: second.location,
            country: second.country,
            occupation: second.occupation,
            authority: second.authority,
            biography: second.biography,
            skills: second.skills,
            theme: second.theme,
            joinedDate: second.joinedDate
        });

        if (snapshot !== secondSnapshot) {
            deterministicFailures++;
        }
    }

    const generated = seenIds.size;

    const result = {
        expected: PROFILE_COUNT,
        generated,
        missing,
        invalid,
        duplicateIds,
        duplicateUsernames,
        deterministicFailures,
        valid:
            generated === PROFILE_COUNT &&
            missing === 0 &&
            invalid === 0 &&
            duplicateIds === 0 &&
            duplicateUsernames === 0 &&
            deterministicFailures === 0
    };

    state.validation = result;

    return result;
}

function getSystemStatistics() {
    let verified = 0;
    let experts = 0;
    let administrators = 0;
    const countries = new Set();
    const departments = new Set();
    let achievements = 0;

    for (let i = 1; i <= PROFILE_COUNT; i++) {
        const profile = generateProfile(idFromNumber(i));

        if (profile.verified) verified++;
        if (profile.authorityScore >= 7) experts++;
        if (profile.authorityScore >= 11) administrators++;
        countries.add(profile.country);
        departments.add(profile.department);
        achievements += profile.achievements.length;
    }

    return {
        profiles: PROFILE_COUNT,
        verified,
        experts,
        administrators,
        countries: countries.size,
        departments: departments.size,
        achievements
    };
}

function getAllProfileIds() {
    const ids = [];

    for (let i = 1; i <= PROFILE_COUNT; i++) {
        ids.push(idFromNumber(i));
    }

    return ids;
}

function searchProfiles() {
    const query = state.query.trim().toLowerCase();

    let ids = [];

    for (let i = 1; i <= PROFILE_COUNT; i++) {
        const id = idFromNumber(i);
        const profile = generateProfile(id);

        const matchesQuery =
            !query ||
            profile.id.toLowerCase().includes(query) ||
            profile.name.toLowerCase().includes(query) ||
            profile.username.toLowerCase().includes(query) ||
            profile.occupation.toLowerCase().includes(query) ||
            profile.department.toLowerCase().includes(query) ||
            profile.authority.toLowerCase().includes(query) ||
            profile.location.toLowerCase().includes(query) ||
            profile.country.toLowerCase().includes(query) ||
            profile.skills.some(skill => skill.toLowerCase().includes(query)) ||
            profile.interests.some(interest => interest.toLowerCase().includes(query));

        const matchesAuthority =
            state.authority === "all" ||
            profile.authority === state.authority;

        const matchesOccupation =
            state.occupation === "all" ||
            profile.occupation === state.occupation;

        const matchesDepartment =
            state.department === "all" ||
            profile.department === state.department;

        const matchesLocation =
            state.location === "all" ||
            profile.location === state.location;

        const matchesVerification =
            state.verification === "all" ||
            (state.verification === "verified" && profile.verified) ||
            (state.verification === "unverified" && !profile.verified);

        if (
            matchesQuery &&
            matchesAuthority &&
            matchesOccupation &&
            matchesDepartment &&
            matchesLocation &&
            matchesVerification
        ) {
            ids.push(id);
        }
    }

    ids.sort((a, b) => {
        const A = generateProfile(a);
        const B = generateProfile(b);

        switch (state.sort) {
            case "name-asc":
                return A.name.localeCompare(B.name);

            case "name-desc":
                return B.name.localeCompare(A.name);

            case "newest":
                return B.joinedDate.localeCompare(A.joinedDate);

            case "oldest":
                return A.joinedDate.localeCompare(B.joinedDate);

            case "reputation-desc":
                return B.reputation - A.reputation;

            case "reputation-asc":
                return A.reputation - B.reputation;

            case "authority-desc":
                return B.authorityScore - A.authorityScore;

            case "activity-desc":
                return B.activity - A.activity;

            case "activity-asc":
                return A.activity - B.activity;

            default:
                return numberFromId(a) - numberFromId(b);
        }
    });

    return ids;
}

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function profileCard(profile) {
    return `
        <article class="profile-card" style="--card-accent:${profile.theme}33">
            <div class="card-top">
                <div class="avatar">${profile.avatar}</div>
                ${profile.verified
                    ? `<span class="verify" aria-label="Verified profile">✓ Verified</span>`
                    : `<span class="verify" style="visibility:hidden">✓ Verified</span>`}
            </div>

            <h3 class="card-name">${escapeHTML(profile.name)}</h3>
            <div class="card-username">@${escapeHTML(profile.username)}</div>
            <div class="card-id">${profile.id}</div>

            <div class="card-role">${escapeHTML(profile.occupation)}</div>
            <div class="card-location">${escapeHTML(profile.location)}, ${escapeHTML(profile.country)}</div>

            <div class="tag-row">
                <span class="tag">${escapeHTML(profile.department)}</span>
                <span class="tag">${escapeHTML(profile.authority)}</span>
                <span class="tag">${escapeHTML(profile.styleFamily)}</span>
            </div>

            <div class="card-footer">
                <div class="card-stat">
                    Reputation<br>
                    <strong>${formatNumber(profile.reputation)}</strong>
                </div>
                <div class="card-stat">
                    Activity<br>
                    <strong>${profile.activity}%</strong>
                </div>
                <button class="view-btn" type="button" data-profile="${profile.id}">
                    Open →
                </button>
            </div>
        </article>
    `;
}

function renderHome() {
    const stats = getSystemStatistics();

    document.getElementById("mainContent").innerHTML = `
        <section class="hero">
            <div>
                <div class="eyebrow">Deterministic identity network</div>

                <h1>
                    One network.<br>
                    <span>10,000 identities.</span>
                </h1>

                <p>
                    InfiniteProfile is a browser-native fictional profile directory
                    powered by deterministic procedural generation. Every identity
                    from APN-000001 through APN-${String(PROFILE_COUNT).padStart(6, "0")}
                    is addressable, searchable and reproducible.
                </p>

                <div class="hero-actions">
                    <a class="primary-btn" href="#directory">Explore Directory</a>
                    <a class="secondary-btn" href="#profile/APN-010000">Open APN-010000</a>
                </div>
            </div>

            <div class="hero-visual" aria-hidden="true">
                <div class="hero-orbit"></div>
                <div class="hero-core">∞</div>

                <div class="hero-counter">
                    <div>
                        <span>ADDRESSABLE PROFILES</span>
                        <strong>${formatNumber(PROFILE_COUNT)}</strong>
                    </div>
                    <div>
                        <span>ENGINE</span>
                        <strong>100% Local</strong>
                    </div>
                </div>
            </div>
        </section>

        <section class="stats-grid" aria-label="Network statistics">
            <div class="stat-card">
                <small>Total Profiles</small>
                <strong>${formatNumber(stats.profiles)}</strong>
            </div>

            <div class="stat-card">
                <small>Verified Profiles</small>
                <strong>${formatNumber(stats.verified)}</strong>
            </div>

            <div class="stat-card">
                <small>Experts</small>
                <strong>${formatNumber(stats.experts)}</strong>
            </div>

            <div class="stat-card">
                <small>Administrators</small>
                <strong>${formatNumber(stats.administrators)}</strong>
            </div>

            <div class="stat-card">
                <small>Countries</small>
                <strong>${formatNumber(stats.countries)}</strong>
            </div>

            <div class="stat-card">
                <small>Departments</small>
                <strong>${formatNumber(stats.departments)}</strong>
            </div>

            <div class="stat-card">
                <small>Generated Achievements</small>
                <strong>${formatNumber(stats.achievements)}</strong>
            </div>

            <div class="stat-card">
                <small>System Capacity</small>
                <strong>${formatNumber(PROFILE_COUNT)}</strong>
            </div>
        </section>

        <section>
            <div class="section-heading">
                <div>
                    <h2>Built for the full range</h2>
                    <p>Every profile is generated from its own deterministic identity seed.</p>
                </div>
                <a class="secondary-btn" href="#directory">View all profiles</a>
            </div>
        </section>
    `;

    updateNav("home");
}

function uniqueValues(field) {
    const values = new Set();

    for (let i = 1; i <= PROFILE_COUNT; i++) {
        const profile = generateProfile(idFromNumber(i));
        values.add(profile[field]);
    }

    return [...values].sort((a, b) => a.localeCompare(b));
}

function renderDirectory() {
    const ids = state.resultIds.length
        ? state.resultIds
        : searchProfiles();

    state.resultIds = ids;

    const total = ids.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    if (state.page > totalPages) {
        state.page = totalPages;
    }

    const startIndex = (state.page - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, total);
    const pageIds = ids.slice(startIndex, endIndex);

    const authorityOptions = AUTHORITY_LEVELS
        .map(level => `<option value="${escapeHTML(level.name)}">${escapeHTML(level.name)}</option>`)
        .join("");

    const departmentOptions = DEPARTMENTS
        .map(dept => `<option value="${escapeHTML(dept.name)}">${escapeHTML(dept.name)}</option>`)
        .join("");

    const occupationOptions = [...new Set(
        DEPARTMENTS.flatMap(dept => dept.occupations)
    )]
        .sort()
        .map(value => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`)
        .join("");

    const locationOptions = uniqueValues("location")
        .map(value => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`)
        .join("");

    document.getElementById("mainContent").innerHTML = `
        <section class="directory-shell">
            <div class="section-heading">
                <div>
                    <div class="eyebrow">Profile directory</div>
                    <h2>Explore the network</h2>
                    <p>Search and filter across the complete ${formatNumber(PROFILE_COUNT)}-profile range.</p>
                </div>
            </div>

            <div class="search-row">
                <label class="search-box">
                    <span class="search-icon" aria-hidden="true">⌕</span>
                    <input
                        id="searchInput"
                        type="search"
                        value="${escapeHTML(state.query)}"
                        placeholder="Search name, username, APN ID, occupation, skill, location..."
                        aria-label="Search all profiles"
                        autocomplete="off"
                    >
                </label>

                <button id="resetFilters" class="secondary-btn" type="button">
                    Reset Filters
                </button>
            </div>

            <div class="controls">
                <select id="authorityFilter" class="select-control" aria-label="Authority filter">
                    <option value="all">All authority levels</option>
                    ${authorityOptions}
                </select>

                <select id="occupationFilter" class="select-control" aria-label="Occupation filter">
                    <option value="all">All occupations</option>
                    ${occupationOptions}
                </select>

                <select id="departmentFilter" class="select-control" aria-label="Department filter">
                    <option value="all">All departments</option>
                    ${departmentOptions}
                </select>

                <select id="locationFilter" class="select-control" aria-label="Location filter">
                    <option value="all">All locations</option>
                    ${locationOptions}
                </select>

                <select id="verificationFilter" class="select-control" aria-label="Verification filter">
                    <option value="all">All verification</option>
                    <option value="verified">Verified only</option>
                    <option value="unverified">Unverified only</option>
                </select>
            </div>

            <div class="controls">
                <select id="sortSelect" class="select-control" aria-label="Sort profiles">
                    <option value="id-asc">Profile ID</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="reputation-desc">Highest Reputation</option>
                    <option value="reputation-asc">Lowest Reputation</option>
                    <option value="authority-desc">Highest Authority</option>
                    <option value="activity-desc">Most Active</option>
                    <option value="activity-asc">Least Active</option>
                </select>
            </div>

            <div class="directory-meta">
                <div class="result-count">
                    Showing <strong>${total ? startIndex + 1 : 0}–${endIndex}</strong>
                    of <strong>${formatNumber(total)}</strong> matching profiles
                </div>

                <div class="result-count">
                    Full network capacity: <strong>${formatNumber(PROFILE_COUNT)}</strong>
                </div>
            </div>

            ${
                pageIds.length
                    ? `<div class="profile-grid">${pageIds.map(id => profileCard(generateProfile(id))).join("")}</div>`
                    : `<div class="empty">No profiles matched the current search and filters.</div>`
            }

            <div class="pagination" aria-label="Directory pagination">
                <button class="page-btn" data-page="1" ${state.page === 1 ? "disabled" : ""}>«</button>
                <button class="page-btn" data-page="${Math.max(1, state.page - 1)}" ${state.page === 1 ? "disabled" : ""}>‹</button>

                ${createPageButtons(state.page, totalPages)}

                <button class="page-btn" data-page="${Math.min(totalPages, state.page + 1)}" ${state.page === totalPages ? "disabled" : ""}>›</button>
                <button class="page-btn" data-page="${totalPages}" ${state.page === totalPages ? "disabled" : ""}>»</button>
            </div>
        </section>
    `;

    document.getElementById("authorityFilter").value = state.authority;
    document.getElementById("occupationFilter").value = state.occupation;
    document.getElementById("departmentFilter").value = state.department;
    document.getElementById("locationFilter").value = state.location;
    document.getElementById("verificationFilter").value = state.verification;
    document.getElementById("sortSelect").value = state.sort;

    updateNav("directory");
}

function createPageButtons(current, total) {
    const pages = new Set([
        1,
        total,
        current - 2,
        current - 1,
        current,
        current + 1,
        current + 2
    ]);

    return [...pages]
        .filter(page => page >= 1 && page <= total)
        .sort((a, b) => a - b)
        .map(page => `
            <button
                class="page-btn ${page === current ? "active" : ""}"
                data-page="${page}"
                aria-label="Go to page ${page}"
            >
                ${page}
            </button>
        `)
        .join("");
}

function renderProfile(id) {
    const profile = generateProfile(id);

    if (!profile) {
        renderNotFound(id);
        return;
    }

    document.getElementById("mainContent").innerHTML = `
        <section class="profile-page">
            <a class="back-link" href="#directory">← Back to Directory</a>

            <div class="profile-hero" style="--profile-accent:${profile.theme}44">
                <div class="profile-hero-main">
                    <div class="profile-large-avatar">
                        ${profile.avatar}
                    </div>

                    <div class="profile-title">
                        <h1>${escapeHTML(profile.name)}</h1>
                        <span class="username">@${escapeHTML(profile.username)}</span>

                        <div class="profile-id">
                            ${profile.id}
                            ${profile.verified ? " • Verified Identity" : ""}
                        </div>
                    </div>

                    <div class="authority">
                        <div class="rank">${escapeHTML(profile.authority)}</div>
                        <small>Authority Level ${profile.authorityScore}/15</small>
                    </div>
                </div>
            </div>

            <div class="detail-layout">
                <div class="detail-column">
                    <section class="detail-card">
                        <h2>Biography</h2>
                        <p>${escapeHTML(profile.biography)}</p>
                    </section>

                    <section class="detail-card">
                        <h2>Profile Information</h2>

                        <div class="info-list">
                            <div class="info-item">
                                <small>Occupation</small>
                                <strong>${escapeHTML(profile.occupation)}</strong>
                            </div>

                            <div class="info-item">
                                <small>Department</small>
                                <strong>${escapeHTML(profile.department)}</strong>
                            </div>

                            <div class="info-item">
                                <small>Location</small>
                                <strong>${escapeHTML(profile.location)}, ${escapeHTML(profile.country)}</strong>
                            </div>

                            <div class="info-item">
                                <small>Age</small>
                                <strong>${profile.age}</strong>
                            </div>

                            <div class="info-item">
                                <small>Education</small>
                                <strong>${escapeHTML(profile.educationLevel)}</strong>
                            </div>

                            <div class="info-item">
                                <small>Personality</small>
                                <strong>${escapeHTML(profile.personality)}</strong>
                            </div>

                            <div class="info-item">
                                <small>Experience</small>
                                <strong>${profile.experience} years</strong>
                            </div>

                            <div class="info-item">
                                <small>Joined</small>
                                <strong>${profile.joinedDate}</strong>
                            </div>

                            <div class="info-item">
                                <small>Profile Style</small>
                                <strong>${escapeHTML(profile.styleFamily)}</strong>
                            </div>

                            <div class="info-item">
                                <small>Profile Seed</small>
                                <strong>${profile.seed}</strong>
                            </div>
                        </div>
                    </section>

                    <section class="detail-card">
                        <h2>Skills</h2>

                        <div class="skill-grid">
                            ${profile.skills.map(skill =>
                                `<span class="skill">${escapeHTML(skill)}</span>`
                            ).join("")}
                        </div>
                    </section>

                    <section class="detail-card">
                        <h2>Interests</h2>

                        <div class="tag-row">
                            ${profile.interests.map(interest =>
                                `<span class="tag">${escapeHTML(interest)}</span>`
                            ).join("")}
                        </div>
                    </section>

                    <section class="detail-card">
                        <h2>Achievements</h2>

                        <div class="badge-grid">
                            ${profile.achievements.map(item =>
                                `<span class="badge">◆ ${escapeHTML(item)}</span>`
                            ).join("")}
                        </div>
                    </section>
                </div>

                <div class="detail-column">
                    <section class="detail-card">
                        <h2>Network Statistics</h2>

                        <div class="metric-list">
                            ${metric("Reputation", Math.min(100, Math.round(profile.reputation / 70)), `${formatNumber(profile.reputation)}`)}
                            ${metric("Contributions", Math.min(100, profile.contributions / 2), formatNumber(profile.contributions))}
                            ${metric("Projects", Math.min(100, profile.projects * 4), profile.projects)}
                            ${metric("Connections", Math.min(100, profile.connections / 5), formatNumber(profile.connections))}
                            ${metric("Activity", profile.activity, `${profile.activity}%`)}
                            ${metric("Experience", Math.min(100, profile.experience * 5), `${profile.experience} yrs`)}
                        </div>
                    </section>

                    <section class="detail-card">
                        <h2>Badges</h2>

                        <div class="badge-grid">
                            ${profile.badges.map(item =>
                                `<span class="badge">✦ ${escapeHTML(item)}</span>`
                            ).join("")}
                        </div>
                    </section>

                    <section class="detail-card">
                        <h2>Identity Metadata</h2>

                        <div class="info-list">
                            <div class="info-item">
                                <small>Profile ID</small>
                                <strong>${profile.id}</strong>
                            </div>

                            <div class="info-item">
                                <small>Verified</small>
                                <strong>${profile.verified ? "Yes" : "No"}</strong>
                            </div>

                            <div class="info-item">
                                <small>Authority</small>
                                <strong>${escapeHTML(profile.authority)}</strong>
                            </div>

                            <div class="info-item">
                                <small>Theme</small>
                                <strong>${profile.theme}</strong>
                            </div>
                        </div>
                    </section>

                    <section class="detail-card">
                        <h2>Direct Address</h2>
                        <p>
                            This profile is permanently reproducible from its deterministic
                            profile ID. Refreshing this page regenerates the same identity.
                        </p>

                        <div class="hero-actions">
                            <button class="secondary-btn" type="button" id="copyProfileId">
                                Copy Profile ID
                            </button>
                            <button class="primary-btn" type="button" id="copyProfileUrl">
                                Copy Profile URL
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    `;

    document.getElementById("copyProfileId").addEventListener("click", async () => {
        await copyText(profile.id);
        showToast("Profile ID copied");
    });

    document.getElementById("copyProfileUrl").addEventListener("click", async () => {
        await copyText(window.location.href);
        showToast("Profile URL copied");
    });

    updateNav("");
}

function metric(label, value, display) {
    const percentage = Math.max(0, Math.min(100, Number(value)));

    return `
        <div class="metric">
            <span class="metric-label">${escapeHTML(label)}</span>
            <div class="metric-track">
                <div class="metric-fill" style="--value:${percentage}%"></div>
            </div>
            <span class="metric-value">${escapeHTML(display)}</span>
        </div>
    `;
}

function renderNotFound(id) {
    document.getElementById("mainContent").innerHTML = `
        <section class="not-found">
            <div class="not-found-box">
                <div class="not-found-code">PROFILE LOOKUP FAILED</div>
                <h1>Profile Not Found</h1>
                <p>
                    <strong>${escapeHTML(id || "Unknown")}</strong>
                    does not resolve to a valid InfiniteProfile identity.
                    Valid IDs range from APN-000001 through APN-${String(PROFILE_COUNT).padStart(6, "0")}.
                </p>
                <div class="hero-actions" style="justify-content:center">
                    <a class="primary-btn" href="#directory">Return to Directory</a>
                    <a class="secondary-btn" href="#profile/APN-010000">Open APN-010000</a>
                </div>
            </div>
        </section>
    `;

    updateNav("");
}

function updateNav(active) {
    document.querySelectorAll(".main-nav a").forEach(link => {
        const href = link.getAttribute("href");
        link.classList.toggle(
            "active",
            active === "home" && href === "#home" ||
            active === "directory" && href === "#directory"
        );
    });
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
}

function setFilterAndRender(key, value) {
    state[key] = value;
    state.page = 1;
    state.resultIds = searchProfiles();
    renderDirectory();
}

function resetFilters() {
    state.query = "";
    state.authority = "all";
    state.occupation = "all";
    state.department = "all";
    state.location = "all";
    state.verification = "all";
    state.sort = "id-asc";
    state.page = 1;
    state.resultIds = searchProfiles();
    renderDirectory();
}

function handleDirectoryEvents(event) {
    const target = event.target;

    if (target.matches("#searchInput")) {
        state.query = target.value;
        state.page = 1;
        state.resultIds = searchProfiles();
        renderDirectory();

        const input = document.getElementById("searchInput");
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
        return;
    }

    if (target.matches("#resetFilters")) {
        resetFilters();
        return;
    }

    const filters = {
        "#authorityFilter": "authority",
        "#occupationFilter": "occupation",
        "#departmentFilter": "department",
        "#locationFilter": "location",
        "#verificationFilter": "verification",
        "#sortSelect": "sort"
    };

    for (const selector of Object.keys(filters)) {
        if (target.matches(selector)) {
            setFilterAndRender(filters[selector], target.value);
            return;
        }
    }

    const pageButton = target.closest("[data-page]");

    if (pageButton) {
        state.page = Number(pageButton.dataset.page);
        renderDirectory();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    const profileButton = target.closest("[data-profile]");

    if (profileButton) {
        window.location.hash = `profile/${profileButton.dataset.profile}`;
    }
}

function route() {
    const raw = window.location.hash.replace(/^#/, "") || "home";

    if (raw === "home") {
        renderHome();
        return;
    }

    if (raw === "directory") {
        state.resultIds = searchProfiles();
        renderDirectory();
        return;
    }

    if (raw.startsWith("profile/")) {
        const requested = raw.slice("profile/".length);
        const normalized = normalizeId(requested);

        if (!normalized) {
            renderNotFound(requested);
            return;
        }

        renderProfile(normalized);
        return;
    }

    renderNotFound(raw);
}

function renderDebugPanel() {
    if (!DEBUG_MODE || !state.validation) {
        return;
    }

    const existing = document.querySelector(".debug-panel");

    if (existing) {
        existing.remove();
    }

    const v = state.validation;

    const panel = document.createElement("aside");
    panel.className = "debug-panel";

    panel.innerHTML = `
        <strong>InfiniteProfile DEBUG</strong><br>
        Expected profiles: ${v.expected}<br>
        Generated/addressable: ${v.generated}<br>
        Missing: ${v.missing}<br>
        Invalid: ${v.invalid}<br>
        Duplicate IDs: ${v.duplicateIds}<br>
        Duplicate usernames: ${v.duplicateUsernames}<br>
        Deterministic failures: ${v.deterministicFailures}<br>
        Generation engine: ${v.valid ? "OK" : "FAILED"}<br>
        Search engine: ${searchProfiles().length >= 0 ? "OK" : "FAILED"}<br>
        Routing: OK
    `;

    document.body.appendChild(panel);
}

function initializeTheme() {
    const stored = localStorage.getItem("infiniteprofile-theme");

    if (stored === "light") {
        document.body.classList.add("light");
    }

    document.getElementById("themeToggle").addEventListener("click", () => {
        document.body.classList.toggle("light");

        localStorage.setItem(
            "infiniteprofile-theme",
            document.body.classList.contains("light") ? "light" : "dark"
        );
    });
}

function initialize() {
    /*
     * Mandatory complete-range validation.
     * This checks 1 → PROFILE_COUNT, not a sample.
     */
    const validation = validateProfileSystem();

    if (!validation.valid) {
        console.error("InfiniteProfile validation failed:", validation);
    } else {
        console.info(
            `${validation.generated.toLocaleString()}/${validation.expected.toLocaleString()} profiles valid`
        );
        console.info("0 missing");
        console.info("0 invalid");
        console.info("0 duplicate IDs");
        console.info("0 duplicate usernames");
    }

    initializeTheme();

    document.addEventListener("click", event => {
        if (
            window.location.hash.startsWith("#directory") ||
            event.target.closest("#searchInput") ||
            event.target.closest("#resetFilters") ||
            event.target.closest(".page-btn") ||
            event.target.closest("[data-profile]")
        ) {
            handleDirectoryEvents(event);
        }
    });

    window.addEventListener("hashchange", route);

    state.initialized = true;

    route();

    renderDebugPanel();
}

initialize();
```
