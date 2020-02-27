document.addEventListener('DOMContentLoaded', () => update(document.getElementById('selectTrendDate').value));

var cardTemplate;
const VIDEO_URL = 'https://www.youtube.com/watch?v={videoId}';
const CHANNEL_URL = 'https://www.youtube.com/channel/{channelId}';
const IMG_URL = 'https://i.ytimg.com/vi/{videoId}/mqdefault.jpg';

function update(value) {
    if (!value) return;
    if (!cardTemplate) {
        cardTemplate = document.getElementById('cardTemplate');
        cardTemplate.parentElement.removeChild(cardTemplate);
    }

    const trends = document.getElementById('trends');

    fetch('/api/' + value)
        .then(res => res.json())
        .then(res => {
            while (trends.firstChild) trends.removeChild(trends.firstChild);

            res.forEach(item => {
                const card = cardTemplate.cloneNode(true);
                card.removeAttribute('id');

                card.querySelector('.thumbnail').src = convert(IMG_URL, item);
                card.querySelector('.channelTitle').textContent = item.channelTitle;
                card.querySelector('.videoTitle').textContent = item.videoTitle;

                card.querySelectorAll('.videoLink').forEach(el => el.href = convert(VIDEO_URL, item));
                card.querySelector('.channelLink').href = convert(CHANNEL_URL, item);

                card.querySelector('.videoDate').textContent = moment(item.videoDate).format("DD/MM/YYYY");

                card.querySelector('.position').textContent = formatNumber(item.position);
                card.querySelector('.viewCount').textContent = ' ' + formatNumber(item.viewCount);
                card.querySelector('.likeCount').textContent = ' ' + formatNumber(item.likeCount);
                card.querySelector('.dislikeCount').textContent = ' ' + formatNumber(item.dislikeCount);

                card.style.display = "initial";
                trends.appendChild(card);
            });
        });
}

function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function convert(url, item) {
    return url.replace('{videoId}', item.videoId).replace('{channelId}', item.channelId)
}