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
