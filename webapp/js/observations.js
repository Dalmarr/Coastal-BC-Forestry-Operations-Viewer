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

    const results =
        document.querySelector("#observationResults");

    const navigation =
        document.querySelector("#observationNavigation");


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
        "Source"
    ];

    query.returnGeometry = false;


    //Run the query and store the returned records
    const response =
        await observationsLayer.queryFeatures(query);

    observations = response.features;
    currentObservation = 0;


    //Handle planning units with no related observations
    if (observations.length === 0) {

        results.innerHTML =
            "<p>No field observations for this planning unit.</p>";

        return;
    }


    //Show the observation navigation and first record
    navigation.hidden = false;

    showObservation();
}


//Display the current observation
function showObservation() {

    const a =
        observations[currentObservation].attributes;


    //Build the observation card
    document.querySelector("#observationResults").innerHTML = `
        <calcite-card>

            <span slot="heading">${a.Obs_ID}</span>
            <span slot="description">${a.Obs_Type}</span>

            <p>
                <b>Severity:</b> ${a.Severity}<br>
                <b>Status:</b> ${a.Status}<br>
                <b>Crew:</b> ${a.Crew}<br>
                <b>Source:</b> ${a.Source}
            </p>

        </calcite-card>
    `;


    //Update the observation number
    document.querySelector("#observationCounter").textContent =
        `${currentObservation + 1} of ${observations.length}`;


    //Disable navigation buttons at the beginning and end
    document.querySelector("#previousObservation").disabled =
        currentObservation === 0;

    document.querySelector("#nextObservation").disabled =
        currentObservation === observations.length - 1;
}