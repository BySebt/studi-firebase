export function getButtonClass(color){
    return `align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-${color}-400 border border-transparent active:bg-${color}-400 hover:bg-${color}-500 focus:shadow-outline-${color}`
}

export function titleCase(str) {
    str = str.replace("_", " ");
    const splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] =
            splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
}

export function getTaskColor(taskStatus) {
    let color = "blue";

    switch (taskStatus) {
        case "FIRST_REVISION":
            color = "pink";
            break;
        case "SECOND_REVISION":
            color = "orange";
            break;
        case "THIRD_REVISION":
            color = "blue";
    }

    return `inline-flex px-2 text-xs font-medium leading-5 rounded-full text-${color}-700 bg-${color}-100 dark:text-white dark:bg-${color}-600`;
}