//Set up the planning unit and field observation filters
export function setupFilters(planningLayer, observationsLayer) {

    //Planning unit filter controls
    const unitStatus = document.querySelector("#unitStatus");
    const unitPriority = document.querySelector("#unitPriority");
    const unitActivity = document.querySelector("#unitActivity");


    //Field observation filter controls
    const obsSeverity = document.querySelector("#obsSeverity");
    const obsStatus = document.querySelector("#obsStatus");


    //Clear filters button
    const clearButton = document.querySelector("#clearFilters");


    //Apply selected planning unit filters
    function filterPlanningUnits() {

        const filters = [];

        if (unitStatus.value) {
            filters.push(`Status = '${unitStatus.value}'`);
        }

        if (unitPriority.value) {
            filters.push(`Priority = '${unitPriority.value}'`);
        }

        if (unitActivity.value) {
            filters.push(`Activity = '${unitActivity.value}'`);
        }

        planningLayer.definitionExpression =
            filters.length ? filters.join(" AND ") : null;
    }


    //Apply selected field observation filters
    function filterObservations() {

        const filters = [];

        if (obsSeverity.value) {
            filters.push(`Severity = '${obsSeverity.value}'`);
        }

        if (obsStatus.value) {
            filters.push(`Status = '${obsStatus.value}'`);
        }

        observationsLayer.definitionExpression =
            filters.length ? filters.join(" AND ") : null;
    }


    //Run planning unit filters when a dropdown changes
    unitStatus.addEventListener(
        "calciteSelectChange",
        filterPlanningUnits
    );

    unitPriority.addEventListener(
        "calciteSelectChange",
        filterPlanningUnits
    );

    unitActivity.addEventListener(
        "calciteSelectChange",
        filterPlanningUnits
    );


    //Run field observation filters when a dropdown changes
    obsSeverity.addEventListener(
        "calciteSelectChange",
        filterObservations
    );

    obsStatus.addEventListener(
        "calciteSelectChange",
        filterObservations
    );


    //Reset all filter controls and layer expressions
    clearButton.addEventListener("click", () => {

        unitStatus.value = "";
        unitPriority.value = "";
        unitActivity.value = "";

        obsSeverity.value = "";
        obsStatus.value = "";

        planningLayer.definitionExpression = null;
        observationsLayer.definitionExpression = null;
    });
}