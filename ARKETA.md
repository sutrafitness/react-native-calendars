# Arketa fork

Based on Wix react-native-calendars 1.1314.0, upstream commit
`87c28a88208ca7107d7daa2a4a930bd12822326d` (the npm package gitHead).

This branch carries Business App's former
`packages/business-app/patches/react-native-calendars+1.1314.0.patch`:

- Period marking bleed at week edges.
- AgendaList scroll guard when sections shrink during a pending timer.
- Studio-timezone now indicator, relative to the timeline start hour.
- 80-point hour rows, quarter-hour guides, and compact hour labels.
- Wider timeline content, background/foreground render slots, reactive theme styles,
  and theme-controlled content height.

Edit the TypeScript sources. Run `npm install --ignore-scripts --legacy-peer-deps`
and `npm run build:arketa`, then commit the generated JavaScript and declarations
alongside the source changes. They are checked in so Git/archive consumers install
without a compiler or development dependencies. The package keeps the upstream
name and version for existing peer dependencies; consumers pin an immutable commit.
Never run the inherited upstream `release` script for this fork.

Branded App stays on the npm release and its own patch. Its patch changes calendar
headers, day sizing, week rendering and InfiniteList behavior that are absent here.
Do not migrate it to this branch without porting and testing those changes.
