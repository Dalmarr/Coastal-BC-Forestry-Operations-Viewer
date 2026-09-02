# Data Sources

This project uses a combination of authoritative Government of British Columbia spatial data and synthetic operational datasets created for portfolio and application-development purposes.

The workflow follows a simplified enterprise GIS pattern:

**Source / Staging Data → Processed / Publishing Data → Web GIS Application**

Only application-relevant attributes are retained in the publishing layers to improve clarity, performance, and maintainability.

---

## Vegetation Resources Inventory

**Source:** Government of British Columbia  
**Dataset:** VRI 2025 – Forest Vegetation Composite Rank 1 Layer (R1)  
**Spatial Reference:** NAD83 / BC Environment Albers (EPSG:3005)  
**Purpose:** Provides forest inventory context for operational planning, including species composition, stand age, height, crown closure, productivity, and stand volume.

### Processing

- Downloaded VRI Rank 1 polygon data for the project area.
- Clipped the source data to `Study_Area`.
- Retained the full clipped dataset as:

  `VRI_StudyArea`

- Created a lightweight publishing layer:

  `VRI_StudyArea_Web`

- Reduced the original schema from approximately 192 fields to a curated set of application-relevant attributes.
- Applied user-friendly aliases for web map and application use.

### Key Published Attributes

- Polygon / feature identifiers
- Forest management land base indicator
- BEC zone, subzone, and variant
- Crown closure
- Leading tree species and species composition
- Projected stand age
- Projected stand height
- Site index
- Live stems per hectare
- Live stand volume
- Harvest date
- Free-to-grow indicator

---

## Forest Tenure Road Section Lines

**Source:** Government of British Columbia  
**Dataset:** Forest Tenure Road Section Lines  
**Spatial Reference:** NAD83 / BC Environment Albers (EPSG:3005)  
**Purpose:** Provides forestry road and access context for operational planning and spatial analysis.

### Processing

- Downloaded provincial Forest Tenure Road Section Lines.
- Clipped the source data to `Study_Area`.
- Retained the full clipped dataset as:

  `Forest_Roads_StudyArea`

- Created a lightweight publishing layer:

  `Forest_Roads_Web`

- Retained only attributes relevant to road identification, tenure, lifecycle status, location, and operational planning.
- Added a calculated road length field in kilometres for application use.

### Key Published Attributes

- Road Section ID
- Road Section Name
- Forest File ID
- Road Section Length
- Section Width
- File Status
- File Type
- Geographic District
- Award Date
- Expiry Date
- Retirement Date
- Lifecycle Status
- Location
- Map Label
- Calculated Length (km)

---

## Freshwater Atlas Stream Network

**Source:** Government of British Columbia  
**Dataset:** Freshwater Atlas – Stream Network  
**Spatial Reference:** NAD83 / BC Environment Albers (EPSG:3005)  
**Purpose:** Provides hydrographic context for operational planning, environmental review, and spatial proximity analysis.

### Watershed Selection

The Freshwater Atlas stream network is organized by watershed group. Watershed-group polygons intersecting the project `Study_Area` were identified first, and the corresponding stream-network feature classes were selected.

The study area intersects the following watershed groups:

- CAMB
- COMX
- TSIT
- SALM
- GOLD
- CLAY
- NIMP
- ALBN

The relevant stream-network feature classes were merged and clipped to the project study area.

### Processing

- Selected stream-network feature classes corresponding to watershed groups intersecting `Study_Area`.
- Merged the selected stream-network datasets.
- Clipped the merged network to `Study_Area`.
- Retained the full clipped dataset as:

  `Stream_Networks_StudyArea`

- Created a lightweight publishing layer:

  `Streams_Web`

- Reduced the source schema to attributes relevant to identification, hydrologic context, and web application use.
- Removed empty, redundant, legacy, and highly encoded attributes not required by the application.
- Removed unnecessary Z geometry from the publishing layer where practical.

### Key Published Attributes

- Linear Feature ID
- Blue Line Key
- Watershed Group
- Stream Name
- Feature Source
- Stream Order
- Stream Magnitude
- Segment Length (m)
- Feature Code
- Tributary Side

---

## Study Area

**Dataset:** `Study_Area`  
**Source:** User-created project boundary  
**Spatial Reference:** NAD83 / BC Environment Albers (EPSG:3005)  
**Purpose:** Defines the spatial extent used for data extraction, clipping, processing, and application development.

The study area is centred on the Campbell River region and extends into surrounding forested areas to provide a realistic operational forestry context.

---

## Synthetic Operational Data

The following datasets are synthetic and were created solely to demonstrate enterprise GIS application-development workflows.

### Planning Units

**Dataset:** `Planning_Units`  
**Geometry:** Polygon  
**Purpose:** Synthetic planning units were manually delineated using authoritative VRI, forest tenure road, and Freshwater Atlas stream data as spatial context. Their locations and attributes are fictional and were created solely to demonstrate GIS application-development and operational planning

Attributes include:

- Unit ID
- Unit Name
- Status
- Priority
- Activity Type
- Planned Start / End Dates
- Area
- Planner
- Last Review Date
- Notes

Coded-value domains are used to standardize status, priority, and activity fields.

### Field Observations

**Dataset:** `Field_Observations`  
**Geometry:** Point  
**Purpose:** Represents fictional field observations associated with operational planning and monitoring.

Attributes include:

- Observation ID
- Observation Type
- Severity
- Status
- Observation Date
- Crew
- Related Planning Unit
- Source
- Notes

Coded-value domains are used to standardize observation type, severity, and status fields.

Both operational datasets use:

- Global IDs
- Editor tracking
- Controlled attribute domains

These features support data governance, auditing, quality assurance, and future hosted feature service workflows.

---

## Data Architecture

The project geodatabase is organized into three functional categories:

### Source / Staging

- `VRI_StudyArea`
- `Forest_Roads_StudyArea`
- `Stream_Networks_StudyArea`
- `Study_Area`

### Publishing

- `VRI_StudyArea_Web`
- `Forest_Roads_Web`
- `Streams_Web`

### Operational

- `Planning_Units`
- `Field_Observations`

This structure preserves authoritative source data while maintaining lightweight, application-ready layers for web publishing and enterprise-style GIS workflows.