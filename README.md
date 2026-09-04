# Coastal BC Forestry Operations Viewer

An independent web GIS project demonstrating forestry-oriented spatial data
management, hosted GIS services, dashboard development, and custom application
development using the ArcGIS platform.

[Live Web Application](https://dalmarr.github.io/Coastal-BC-Forestry-Operations-Viewer/webapp/)
| [ArcGIS Dashboard](https://sqg.maps.arcgis.com/apps/dashboards/0630960a921a4c0a94dac14c3e672151#)
| [ArcGIS Online Web Map](https://sqg.maps.arcgis.com/apps/mapviewer/index.html?webmap=24aa3af7044247798c4ecf2d001fde60)

The project combines public Government of British Columbia forest inventory,
forest road, and hydrographic data with synthetic operational planning and
field-observation datasets for a study area centred on Campbell River,
Vancouver Island.

> **Portfolio disclaimer:** Planning units, field observations, operational
> statuses, schedules, personnel, and related business attributes are synthetic.
> This project is not affiliated with or representative of any real-world data 
> belonging to or produced any forestry company.

 ## Overview

The Coastal BC Forestry Operations Viewer is an independent web GIS project designed to demonstrate an end-to-end forestry-oriented GIS operational planning.
The project combines public Government of British Columbia forestry and environmental datasets with synthetic operational planning and field observation data for a study area focused on Campbell River, Vancouver Island.
The workflow begins with data preparation and spatial analysis in ArcGIS Pro, continues through hosted feature services and ArcGIS Online, and culminates in a custom web application built with the ArcGIS Maps SDK for JavaScript and Calcite Design System.
The project was developed to demonstrate practical skills in spatial data management, hosted GIS services, web mapping, dashboard development, JavaScript GIS application development, and operational GIS workflow design.

---

## Features

### Planning Unit Filtering

Users can filter planning units by:

- Status
- Priority
- Activity

Planning activities include:

- Harvest Planning
- Road Planning
- Field Assessment
- Environmental Review
- Silviculture

### Field Observation Filtering

Field observations can be filtered independently by:

- Severity
- Status

Observation types include:

- Road Condition
- Drainage
- Stream Crossing
- Vegetation
- Terrain
- Access
- Environmental Concern

### Planning Unit Detail View

Selecting a planning unit retrieves its full hosted feature record and displays key information, including:

- Unit ID
- Status
- Priority
- Activity
- Area
- Leading Species
- Average Stand Age
- Nearest Forest Road
- Nearest Stream

### Related Field Observations

After a planning unit is selected, the application queries the field-observation layer using the selected planning unit ID.
For example:

```sql
Related_Unit = 'PU-006'
```

Only observations associated with the selected planning unit are returned. If multiple observations are related to the unit, users can move through them using Previous and Next controls.

### Web Map Controls

The application also includes:

- Zoom controls
- Home control
- Layer List
- Legend
- Interactive pop-ups
- Hosted feature-layer filtering
- Related-record navigation

## Architecture

The project follows a simplified source-to-publishing GIS architecture.
```
Government of B.C. Source Data
            |
            v
ArcGIS Pro Staging / Processing
            |
            v
Operational and Publishing Layers
            |
            v
ArcGIS Online Hosted Feature Services
            |
        +---+---+
        |       |
        v       v
     Web Map  Dashboard
        |
        v
Custom JavaScript Application
```

The workflow separates source and processing data from web-oriented publishing layers. This allows the original spatial datasets to be preserved while smaller, curated schemas are exposed to the web application.


### Field Observation Publishing Pattern

The field-observation workflow uses a separate public view:
```
Field_Observations_web
Private / editable hosted feature layer
            |
            v
Field_Observations_public
Public / read-only hosted feature layer view
            |
            v
Web Map / Dashboard / JavaScript Application
```
This separates editing capability from public access to the portfolio application.


## Data

### Study Area
The study area is centred on Campbell River and surrounding forested areas of Vancouver Island. It is used as the spatial extent for clipping and organizing the supporting forestry and environmental datasets.

### Planning Units
Fourteen synthetic planning-unit polygons were created using the VRI, road, and stream datasets as spatial context. Planning units contain operational attributes such as:

- Unit ID
- Unit Name
- Status
- Priority
- Activity
- Planned Start
- Planned End
- Area
- Planner
- Last Review
- Notes

Possible statuses include:
- Proposed
- Under Review
- Approved
- Active
- Complete
- Deferred
  

### Derived Planning Attributes
Planning units were spatially analyzed against the reference datasets.
Derived attributes include:

- Leading Species
- Average Stand Age
- Average Stand Height
- Average Crown Closure
- Nearest Forest Road
- Nearest Stream
- Stream Intersection indicator

Leading species was assigned from the VRI polygon with the largest overlap with each planning unit.

Mean stand values were calculated from intersecting VRI polygons.

Nearest-road and nearest-stream values were calculated using proximity analysis.

A nearest-stream distance of 0m indicates that a mapped stream intersects or touches the planning unit.


### Field Observations
63 synthetic field-observation points were created within the planning units.

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

Controlled domains, Global IDs, editor tracking, and attachment capability were configured to support an enterprise-style operational data workflow.


## Web Application

The custom application is built with the ArcGIS Maps SDK for JavaScript and Calcite Design System. The application loads the existing ArcGIS Online Web Map rather than rebuilding each hosted layer individually. This allows map symbology, pop-ups, layer configuration, and other Web Map settings to be reused by the custom application.


### Application Structure
```
webapp/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── app.js
    ├── filters.js
    └── observations.js
```

```app.js```
- loads the ArcGIS Web Map
- finds the required hosted feature layers
- handles planning-unit map clicks
- queries complete planning-unit records
- displays selected unit information

```filters.js```
- manages planning-unit filters
- manages field-observation filters
- applies FeatureLayer definition expressions
- clears active filters

```observations.js```
- queries field observations related to selected planning units
- displays observation information
- manages Previous and Next navigation
  

### Dynamic Filtering
Filters are applied to hosted feature layers using ```definitionExpression```.

Example:
```
planningLayer.definitionExpression =
    "Status = 'Active'";
```
Multiple selected filters can be combined into a single SQL expression.

### Planning Unit Selection

When a user clicks the map, a hit test identifies whether a planning-unit feature was selected.

The selected feature's Object ID is then used to query the full hosted feature record:
```
query.objectIds = [objectId];
query.outFields = ["*"];
```
The resulting attributes are displayed in the Selected Planning Unit panel.


### Cross-Layer Query

The selected planning unit ID is then used to query the public field-observation layer.
```
query.where = `Related_Unit = '${unitId}'`;
```
This creates an interactive relationship between planning units and their associated field observations.

