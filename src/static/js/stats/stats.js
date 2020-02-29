toggle(0);

function toggle(value) {
    value = parseInt(value);
    const items = document.querySelectorAll('.toggleItem');

    items.forEach(item => {
        item.classList.remove('btn-primary');
        item.classList.add('btn-info');

        document.getElementById('toggle' + item.getAttributeNode('data-name').value).style.display = 'none';
    });

    const selectItem = items[value];
    selectItem.classList.remove('btn-info');
    selectItem.classList.add('btn-primary');
    document.getElementById('toggle' + selectItem.getAttributeNode('data-name').value).style.removeProperty('display');
}