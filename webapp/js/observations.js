//Reference to the field observation layer
let observationsLayer;


//Store returned observations and track the current record
let observations = [];
let currentObservation = 0;


//Set up the observation navigation buttons
export function setupObservations(layer) {

    observationsLayer = layer;


    //Show the previous observation
    document.querySelector("#previousObservation").onclick = () => {

        if (currentObservation > 0) {
            currentObservation--;
            showObservation();
        }
    };


    //Show the next observation
    document.querySelector("#nextObservation").onclick = () => {

        if (currentObservation < observations.length - 1) {
            currentObservation++;
            showObservation();
        }
    };
}


//Query observations related to a selected planning unit
export async function showRelatedObservations(unitId) {

    const results = document.querySelector("#observationResults");

    const navigation = document.querySelector("#observationNavigation");


    //Show a temporary loading message
    results.innerHTML = "<p>Loading observations...</p>";
    navigation.hidden = true;


    //Query observations using the selected planning unit ID
    const query = observationsLayer.createQuery();

    query.where = `Related_Unit = '${unitId}'`;

    query.outFields = [
        "Obs_ID",
        "Obs_Type",
        "Severity",
        "Status",
        "Crew",
        "Notes"
    ];

    query.returnGeometry = false;


    //Run the query and store the returned records
    const response = await observationsLayer.queryFeatures(query);

    observations = response.features;
    currentObservation = 0;


    //Handle planning units with no related observations
    if (observations.length === 0) {
        results.innerHTML = "<p>No field observations for this planning unit.</p>";
        return;
    }


    //Show the observation navigation and first record
    navigation.hidden = false;

    showObservation();
}


//Display the current observation
function showObservation() {
    const observation = observations[currentObservation];
    const a = observations[currentObservation].attributes;


    //Build the observation card
    document.querySelector("#observationResults").innerHTML = `
         <article class="observation-card">

        <div class="observation-header">
            <div>
                <span class="observation-eyebrow">Field observation</span>
                <h3 class="observation-id">${a.Obs_ID ?? "Observation"}</h3>
            </div>

            <div class="observation-badges">
                <span
                    class="observation-badge observation-severity"
                    data-severity="${a.Severity}">
                    ${a.Severity ?? "Unknown"}
                </span>

                <span
                    class="observation-badge observation-status"
                    data-status="${a.Status}">
                    ${a.Status ?? "Unknown"}
                </span>
            </div>
        </div>

        <div class="observation-type">
            ${a.Obs_Type ?? "Unspecified observation"}
        </div>

        <dl class="observation-metadata">

            <div>
                <dt>Crew</dt>
                <dd>${a.Crew ?? "—"}</dd>
            </div>

            <div>
                <dt>Source</dt>
                <dd>${a.Notes ?? "—"}</dd>
            </div>

        </dl>

    </article>
`;
    revealObservation();
    
    //Update the observation number
    document.querySelector("#observationCounter").textContent = `${currentObservation + 1} of ${observations.length}`;


    //Disable navigation buttons at the beginning and end
    document.querySelector("#previousObservation").disabled = currentObservation === 0;

    document.querySelector("#nextObservation").disabled = currentObservation === observations.length - 1;
}