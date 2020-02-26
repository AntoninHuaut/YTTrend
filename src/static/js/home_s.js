document.addEventListener('DOMContentLoaded', () => update(document.getElementById('selectTrendDate').value));

const VIDEO_URL = 'https://www.youtube.com/watch?v={videoId}';
const CHANNEL_URL = 'https://www.youtube.com/channel/{channelId}';
const IMG_URL = 'https://i.ytimg.com/vi/{videoId}/mqdefault.jpg';

function update(value) {
    if(!value) return;
    
    const cardTemplate = document.getElementById('cardTemplate');
    cardTemplate.removeAttribute('id');
    const trends = document.getElementById('trends');

    fetch('/api/' + value)
        .then(res => res.json())
        .then(res => {
            res.forEach(item => {
                const card = cardTemplate.cloneNode(true);
                console.log(card)
                card.querySelector('.thumbnail').src = convert(IMG_URL, item);
                card.querySelector('.videoTitle').textContent = item.videoTitle;
                card.querySelector('.channelTitle').textContent = item.channelTitle;
                card.querySelector('.videoLink').href = convert(VIDEO_URL, item);
                card.querySelector('.channelLink').href = convert(CHANNEL_URL, item);

                card.style.display = "initial";
                trends.appendChild(card);
            });
        });
}

function convert(url, item) {
    return url.replace('{videoId}', item.videoId).replace('{channelId}', item.channelId)
}