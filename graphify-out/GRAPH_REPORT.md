# Graph Report - .  (2026-07-09)

## Corpus Check
- Large corpus: 43 files · ~646,682 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 117 nodes · 229 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.87)
- Token cost: 11,200 input · 3,400 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Database Schema and Core Concepts|Database Schema and Core Concepts]]
- [[_COMMUNITY_Authentication and UI Layout|Authentication and UI Layout]]
- [[_COMMUNITY_Routing and Elephant Directory|Routing and Elephant Directory]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Pooram Accessories and Calendars|Pooram Accessories and Calendars]]
- [[_COMMUNITY_Project Metadata and Scripts|Project Metadata and Scripts]]
- [[_COMMUNITY_Festival and Temple Views|Festival and Temple Views]]
- [[_COMMUNITY_User Dashboards|User Dashboards]]
- [[_COMMUNITY_Application Entry Point|Application Entry Point]]
- [[_COMMUNITY_ESLint Configuration|ESLint Configuration]]

## God Nodes (most connected - your core abstractions)
1. `renderLayout()` - 18 edges
2. `setupLayoutEvents()` - 17 edges
3. `getSession()` - 15 edges
4. `compilerOptions` - 12 edges
5. `renderDashboard()` - 10 edges
6. `dbService` - 9 edges
7. `navigate()` - 8 edges
8. `Kerala Pooram Management Portal` - 8 edges
9. `renderAccessoryDetail()` - 6 edges
10. `renderElephantDetail()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Kerala Pooram Management Portal` --implements--> `Festival`  [INFERRED]
  README.md → src/db.ts
- `Kerala Pooram Management Portal` --implements--> `Elephant`  [INFERRED]
  README.md → src/db.ts
- `Kerala Pooram Management Portal` --implements--> `Accessory`  [INFERRED]
  README.md → src/db.ts
- `Kerala Pooram Management Portal` --implements--> `User`  [INFERRED]
  README.md → src/db.ts
- `renderDashboard()` --calls--> `getSession()`  [EXTRACTED]
  src/views/dashboard.ts → src/auth.ts

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "Database Schema and Core Concepts"
Cohesion: 0.13
Nodes (14): Elephant & Accessory Booking Workflows, Kerala Cultural Design Theme, Kerala Pooram Management Portal, Pooram Portal User Roles, SessionPayload, Accessory, AccessoryBooking, DatabaseSchema (+6 more)

### Community 1 - "Authentication and UI Layout"
Cohesion: 0.30
Nodes (14): checkRole(), getSession(), logout(), setSession(), renderLayout(), setupLayoutEvents(), dbService, sha256() (+6 more)

### Community 2 - "Routing and Elephant Directory"
Cohesion: 0.21
Nodes (11): Photo profile of elephant Karnan used in elephants view, Photo profile of elephant Thechikkottukavu Ramachandran, Public photo profile of elephant Karnan, Public photo profile of elephant Thechikkottukavu Ramachandran, addRoute(), initRouter(), navigate(), Route (+3 more)

### Community 3 - "TypeScript Configuration"
Cohesion: 0.14
Nodes (13): compilerOptions, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noUnusedLocals, noUnusedParameters (+5 more)

### Community 4 - "Pooram Accessories and Calendars"
Cohesion: 0.18
Nodes (10): Chenda accessory photo used in accessories view, Muthukuda accessory photo used in accessories view, Nettipattam accessory photo used in accessories view, Public Chenda accessory photo used in accessories view, Public Muthukuda accessory photo used in accessories view, Public Nettipattam accessory photo used in accessories view, BookingInfo, renderCalendarWidget() (+2 more)

### Community 5 - "Project Metadata and Scripts"
Cohesion: 0.17
Nodes (11): devDependencies, typescript, vite, name, private, scripts, build, dev (+3 more)

### Community 6 - "Festival and Temple Views"
Cohesion: 0.18
Nodes (10): Photo profile of Nemmara festival used in festival views, Photo profile of Thrissur Pooram festival, Photo profile of Nemmara Temple, Photo profile of Vadakkunnathan Temple, Public photo profile of Nemmara festival, Public photo profile of Thrissur Pooram festival, Public photo profile of Nemmara Temple, Public photo profile of Vadakkunnathan Temple (+2 more)

### Community 7 - "User Dashboards"
Cohesion: 0.36
Nodes (8): CATEGORIES, DISTRICTS, renderAccessoryOwnerDashboard(), renderAdminDashboard(), renderCommitteeDashboard(), renderDashboard(), renderElephantOwnerDashboard(), setupDashboardEvents()

### Community 8 - "Application Entry Point"
Cohesion: 0.50
Nodes (3): Icon for the Kerala Pooram Management Portal, Vite Application Container, Public static Icon for the Portal

## Knowledge Gaps
- **59 isolated node(s):** `eslintConfig`, `name`, `version`, `private`, `type` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `renderLayout()` connect `Authentication and UI Layout` to `Routing and Elephant Directory`, `Pooram Accessories and Calendars`, `Festival and Temple Views`, `User Dashboards`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `setupLayoutEvents()` connect `Authentication and UI Layout` to `Routing and Elephant Directory`, `Pooram Accessories and Calendars`, `Festival and Temple Views`, `User Dashboards`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `name`, `version` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Database Schema and Core Concepts` be split into smaller, more focused modules?**
  _Cohesion score 0.1286549707602339 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._