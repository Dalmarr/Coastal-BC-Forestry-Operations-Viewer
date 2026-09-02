//Import filtering and observation functions
import { setupFilters } from "./filters.js";
import { setupObservations, showRelatedObservations } from "./observations.js";


//Get the ArcGIS map component and wait for it to load
const mapView = document.querySelector("#mapView");

await mapView.viewOnReady();

const map = mapView.map;
await map.loadAll();


//Find the two layers used by the custom application tools
const planningLayer = map.allLayers.find(
    layer => layer.title === "Planning_Units_web"
);

const observationsLayer = map.allLayers.find(
    layer => layer.title === "Field_Observations_public"
);


//Set up the filters and observation navigation
setupFilters(planningLayer, observationsLayer);
setupObservations(observationsLayer);


//Handle clicks on planning units
mapView.addEventListener("arcgisViewClick", async event => {

    //Check whether the user clicked a planning unit
    const response = await mapView.hitTest(event.detail, {
        include: [planningLayer]
    });

    const hit = response.results.find(
        result => result.type === "graphic"
    );

    if (!hit) return;


    //Get the Object ID of the clicked planning unit
    const objectId =
        hit.graphic.attributes[planningLayer.objectIdField];


    //Query the full planning unit record
    const query = planningLayer.createQuery();

    query.objectIds = [objectId];
    query.outFields = ["*"];
    query.returnGeometry = false;

    const result = await planningLayer.queryFeatures(query);

    if (result.features.length === 0) return;


    //Get the planning unit attributes
    const a = result.features[0].attributes;
    const unitId = a.Unit_ID;


    //Display selected planning unit information
    document.querySelector("#unitDetails").innerHTML = `
        <strong>${unitId}</strong>

        <p>
            <b>Status:</b> ${a.Status}<br>
            <b>Priority:</b> ${a.Priority}<br>
            <b>Activity:</b> ${a.Activity}<br>
            <b>Area:</b> ${Number(a.Area_ha).toFixed(1)} ha<br>
            <b>Leading Species:</b> ${a.Lead_Species ?? "No VRI data"}<br>
            <b>Average Stand Age:</b>
            ${a.Avg_Age_yr != null
            ? Number(a.Avg_Age_yr).toFixed(0) + " years"
            : "No VRI data"}<br>
            <b>Nearest Road:</b>
            ${Number(a.Nearest_Road_m).toFixed(0)} m<br>
            <b>Nearest Stream:</b>
            ${Number(a.Nearest_Stream_m).toFixed(0)} m
        </p>
    `;


    //Load field observations related to the selected planning unit
    await showRelatedObservations(unitId);
});