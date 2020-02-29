document.addEventListener('DOMContentLoaded', () => {
    const dateStart = document.getElementById('dateStart');
    $("#dateStart").selectpicker('val', dateStart.children[dateStart.children.length - 1].value);
});

function updateStart(dateStartValue) {
    const momentDateStartValue = moment(new Date(dateStartValue));

    const dateEnd = document.getElementById('dateEnd');
    const dateEndJQ = $("#dateEnd");
    const dateEndValue = dateEnd.value;

    for (let child of dateEnd.children) {
        child.hidden = moment(new Date(child.value)).isBefore(momentDateStartValue);

        if (dateEndValue === child.value && child.hidden)
            dateEndJQ.selectpicker('val', dateEnd.children[0].value);
    }

    dateEndJQ.selectpicker('refresh');
    setTimeout(() => {
        dateEndJQ.selectpicker('toggle');
    }, 1);
}

function updateEnd() {

}