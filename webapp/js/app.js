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


    //Format selected planning unit values
    const area =
        a.Area_ha != null
            ? `${Number(a.Area_ha).toFixed(1)} ha`
            : "—";

    const averageAge =
        a.Avg_Age_yr != null
            ? `${Number(a.Avg_Age_yr).toFixed(0)} yr`
            : "No VRI data";

    const nearestRoad =
        a.Nearest_Road_m != null
            ? `${Number(a.Nearest_Road_m).toFixed(0)} m`
            : "—";

    const nearestStream =
        a.Nearest_Stream_m != null
            ? `${Number(a.Nearest_Stream_m).toFixed(0)} m`
            : "—";


    //Display selected planning unit information
    document.querySelector("#unitDetails").innerHTML = `
    <div class="unit-summary">

        <div class="unit-summary-header">
            <div>
                <span class="unit-eyebrow">Planning unit</span>
                <h3 class="unit-id">${unitId}</h3>
            </div>

            <div class="unit-badges">
                <span
                    class="unit-badge unit-status"
                    data-status="${a.Status}">
                    ${a.Status}
                </span>

                <span
                    class="unit-badge unit-priority"
                    data-priority="${a.Priority}">
                    ${a.Priority}
                </span>
            </div>
        </div>

        <div class="unit-activity">
            <span class="unit-activity-label">Activity</span>
            <span class="unit-activity-value">${a.Activity ?? "—"}</span>
        </div>

        <dl class="unit-metrics">

            <div class="unit-metric">
                <dt>Area</dt>
                <dd>${area}</dd>
            </div>

            <div class="unit-metric">
                <dt>Average stand age</dt>
                <dd>${averageAge}</dd>
            </div>

            <div class="unit-metric unit-metric-wide">
                <dt>Leading species</dt>
                <dd>${a.Lead_Species ?? "No VRI data"}</dd>
            </div>

            <div class="unit-metric">
                <dt>Nearest road</dt>
                <dd>${nearestRoad}</dd>
            </div>

            <div class="unit-metric">
                <dt>Nearest stream</dt>
                <dd>${nearestStream}</dd>
            </div>

        </dl>

    </div>
`;


    //Load field observations related to the selected planning unit
    await showRelatedObservations(unitId);
});