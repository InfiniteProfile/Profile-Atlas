# InfiniteProfile

**InfiniteProfile** is a static, production-oriented fictional identity directory that algorithmically generates **exactly 10,000 complete, deterministic profiles** without a backend, database, build step, API key, or runtime service.

Repository owner: [@mdimrankhanalpha](https://github.com/mdimrankhanalpha)

## Features

- Exactly 10,000 individually addressable IDs: `APN-000001` through `APN-010000`
- Deterministic seeded profile generation; the same ID always resolves to the same identity
- Unique usernames with built-in collision validation
- Coherent department → occupation → skill relationships
- Authority hierarchy with 15 meaningful levels
- Procedural SVG avatars with deterministic visual variation
- Multiple profile themes/layouts, deterministic accent systems, and generated activity histories
- Search across ID, name, username, occupation, department, authority, location, skills and interests
- Direct ID search, including `APN-010000`
- Multi-field filters and sorting
- Efficient 48-profile pagination; 10,000 large profile cards are never inserted into the DOM at once
- Full profile viewer with hash routing: `#profile/APN-000001`
- Dashboard metrics calculated from the generated 10,000-profile universe
- Featured, highest-reputation and rising profiles selected from real generated profiles
- Responsive mobile/tablet/desktop layouts
- Semantic HTML, focus states, keyboard navigation and reduced-motion support
- Static GitHub Pages compatible

## Architecture

`script.js` is intentionally split into focused modules:

- `DataSets` — compact vocabularies and domain relationships.
- `Utils` — hashing, seeded RNG, formatting and stable ID helpers.
- `ProfileGenerator` — deterministic complete-profile generation and memoized access.
- `ProfileEngine` — public dataset API.
- `SearchEngine` — full-universe search, filtering and sorting.
- `AvatarGenerator` — procedural SVG avatar generation.
- `StatisticsEngine` — calculated directory statistics.
- `Validator` — full 10,000-record ID/username/fingerprint validation.
- `Router` — hash-based profile navigation.
- `Renderer` / `UI` — directory cards, profile detail view, filters, pagination and interactions.

## Deterministic 10,000-profile system

The source of truth is:

```js
const PROFILE_COUNT = 10000;
```

Profile IDs are derived automatically from `1..PROFILE_COUNT`:

```text
APN-000001
...
APN-010000
```

The generator hashes the ID with a fixed project seed, then uses that hash to seed a local pseudo-random generator. It never uses unseeded `Math.random()` for identity fields. A profile is cached after first generation, but the cache is an optimization only—the identity can always be reconstructed from its ID.

The public API is available in the browser console:

```js
getProfile('APN-000001')
getProfile('APN-005000')
getProfile('APN-010000')
searchProfiles('APN-010000')
validateProfiles()
```

## Uniqueness and validation

`validateProfiles()` iterates through the full range from 1 to 10,000 and verifies:

- every requested ID exists;
- every generated ID is the expected ID;
- usernames are unique;
- composite identity fingerprints do not duplicate;
- required sample endpoints resolve.

The UI does not rely on the validator to fake success: all directory rendering, search, filters, pagination and detail routing resolve profiles through the same generator.

## Performance

The full profile universe is addressable, but the DOM only receives the current page (48 profiles by default). Search uses a compact prebuilt text index and profile objects are memoized on demand. This keeps page rendering small while retaining a 10,000-profile dataset.

For static hosting, this approach avoids shipping a 10,000-object hand-authored JSON file. The browser derives each identity algorithmically instead.

## Local setup

No install step is needed.

1. Download or clone the project.
2. Open `index.html` directly in a browser, or serve the directory with any static file server.
3. The directory should immediately show the generated profile network.

Core runtime files are only:

```text
index.html
style.css
script.js
```

The Google Fonts link is optional; if unavailable, the CSS system-font fallbacks keep the application functional.

## GitHub Pages deployment

1. Create or use a GitHub repository under `mdimrankhanalpha`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select the branch containing the project and the `/ (root)` folder.
6. Save.

Because profile routing uses a hash such as `#profile/APN-010000`, GitHub Pages does not need server-side rewrite rules.

## Configuration

Change the central count only if you intentionally want a different directory size:

```js
const PROFILE_COUNT = 10000;
```

The generator, search index, validation range, statistics, pagination and ID boundaries all consume this value.

For the requested production configuration, keep it at `10000`.

`PAGE_SIZE` controls the number of cards rendered per directory page:

```js
const PAGE_SIZE = 48;
```

## Future database integration

The current project is backend-free. A future API/database layer can preserve the same public interface (`getProfile`, `searchProfiles`, `filterProfiles`, `sortProfiles`) and swap deterministic generation for persistent records where required. The hash route can remain unchanged.

## License

Use, modify and deploy this project according to the license you add to your repository. No external API or database is required by the core application.
