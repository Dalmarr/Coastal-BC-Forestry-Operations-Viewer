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


    //Stores the planning-unit relationship filter applied to observations
    let relatedUnitFilter = null;

    //Used to prevent an older async query from overwriting a newer filter state
    let planningFilterRequest = 0;


    //Escape apostrophes in SQL text values
    function escapeSqlValue(value) {
        return String(value).replace(/'/g, "''");
    }


    //Build and apply the field observation expression
    function filterObservations() {

        const filters = [];

        //Restrict observations to currently visible planning units
        if (relatedUnitFilter) {
            filters.push(relatedUnitFilter);
        }

        //Apply observation-specific filters
        if (obsSeverity.value) {
            filters.push(`Severity = '${escapeSqlValue(obsSeverity.value)}'`);
        }

        if (obsStatus.value) {
            filters.push(`Status = '${escapeSqlValue(obsStatus.value)}'`);
        }

        observationsLayer.definitionExpression = filters.length? filters.join(" AND ") : null;
    }


    //Apply planning unit filters and synchronize related observations
    async function filterPlanningUnits() {

        const filters = [];

        if (unitStatus.value) {
            filters.push(`Status = '${escapeSqlValue(unitStatus.value)}'`);
        }

        if (unitPriority.value) {
            filters.push(`Priority = '${escapeSqlValue(unitPriority.value)}'`);
        }

        if (unitActivity.value) {
            filters.push(`Activity = '${escapeSqlValue(unitActivity.value)}'`);
        }

        const planningExpression = filters.length? filters.join(" AND ") : null;


        //Apply filter to planning units
        planningLayer.definitionExpression = planningExpression;


        //Track this request in case the user changes filters quickly
        const requestId = ++planningFilterRequest;


        //If no planning filters are active, remove the relationship restriction
        if (!planningExpression) {
            relatedUnitFilter = null;
            filterObservations();
            return;
        }


        //Query Unit_ID values for planning units that remain visible
        const query = planningLayer.createQuery();

        query.where = planningExpression;
        query.outFields = ["Unit_ID"];
        query.returnGeometry = false;


        const response = await planningLayer.queryFeatures(query);

        //Ignore stale results from an older filter request
        if (requestId !== planningFilterRequest) {
            return;
        }


        const unitIds = [
            ...new Set(
                response.features.map(feature => feature.attributes.Unit_ID).filter(value => value != null)
            )
        ];


        //If no planning units match, hide all observations
        if (unitIds.length === 0) {
            relatedUnitFilter = "1 = 0";
        } else {

            const values = unitIds.map(id => `'${escapeSqlValue(id)}'`).join(", ");

            relatedUnitFilter = `Related_Unit IN (${values})`;
        }

        //Reapply observation filters using the visible planning units
        filterObservations();
    }

    //Run planning unit filters when a dropdown changes
    unitStatus.addEventListener("calciteSelectChange", filterPlanningUnits);
    unitPriority.addEventListener("calciteSelectChange", filterPlanningUnits);
    unitActivity.addEventListener("calciteSelectChange",filterPlanningUnits);


    //Run field observation filters when a dropdown changes
    obsSeverity.addEventListener("calciteSelectChange", filterObservations);
    obsStatus.addEventListener("calciteSelectChange", filterObservations);


    //Reset all filter controls and layer expressions
    clearButton.addEventListener("click", () => {

        unitStatus.value = "";
        unitPriority.value = "";
        unitActivity.value = "";
        obsSeverity.value = "";
        obsStatus.value = "";

        //Invalidate any planning query still running
        planningFilterRequest++;
        planningLayer.definitionExpression = null;
        relatedUnitFilter = null;
        filterObservations();
    });
}