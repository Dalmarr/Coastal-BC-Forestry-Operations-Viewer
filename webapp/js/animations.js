import { animate } from "https://cdn.jsdelivr.net/npm/motion@13.4.0/+esm";


const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

//Animate selected planning unit details
export function revealPlanningUnit() {

    if (reducedMotion.matches) 
        return;

    const element = document.querySelector("#unitDetails .unit-summary");

    if (!element) 
        return;

    animate(element, {
        opacity: [0, 1],
        transform: ["translateY(6px)", "translateY(0px)"]
        },
        {
            duration: 0.22,
            ease: "easeOut"});
}


//Animate displayed field observation
export function revealObservation() {

    if (reducedMotion.matches) return;

    const element = document.querySelector("#observationResults .observation-card");

    if (!element) return;

    animate(element,
        {opacity: [0, 1],
            transform: ["translateY(4px)", "translateY(0px)"]
        },
        {
            duration: 0.18,
            ease: "easeOut"});
}


//Provide subtle feedback when a filter changes
export function acknowledgeFilter(control) {

    if (reducedMotion.matches || !control) 
        return;

    animate(control, {opacity: [0.72, 1]}, {duration: 0.16, ease: "easeOut"});
}