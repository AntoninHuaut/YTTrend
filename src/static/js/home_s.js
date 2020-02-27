document.addEventListener('DOMContentLoaded', () => update(document.getElementById('selectTrendDate').value));

var cardTemplate;
const VIDEO_URL = 'https://www.youtube.com/watch?v={videoId}';
const CHANNEL_URL = 'https://www.youtube.com/channel/{channelId}';
const IMG_URL = 'https://i.ytimg.com/vi/{videoId}/mqdefault.jpg';
const EMBED_URL = 'http://www.youtube.com/embed/{videoId}?autoplay=1&modestbranding=1&playsinline=1';

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
            if (!Array.isArray(res)) return;
            while (trends.firstChild) trends.removeChild(trends.firstChild);

            res.forEach(item => {
                const card = cardTemplate.cloneNode(true);
                card.removeAttribute('id');

                card.querySelector('.thumbnail').src = convert(IMG_URL, item);
                card.querySelector('.channelTitle').textContent = item.channelTitle;
                card.querySelector('.videoTitle').textContent = item.videoTitle;

                card.querySelector('.videoLink').href = convert(VIDEO_URL, item);
                card.querySelector('.channelLink').href = convert(CHANNEL_URL, item);

                card.querySelector('.videoPlayer').onclick = () => {
                    convertIMGToPlayer(card, item);
                    return false;
                };

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

function convertIMGToPlayer(card, item) {
    const videoPlayer = card.querySelector('.videoPlayer');
    videoPlayer.onclick = null;

    const iframe = document.createElement('iframe');
    iframe.src = convert(EMBED_URL, item);
    iframe.style.width = "320px";
    iframe.style.height = "180px";
    iframe.frameBorder = "0";
    iframe.allowFullscreen = "1";

    videoPlayer.removeChild(videoPlayer.querySelector('.thumbnail'));
    videoPlayer.appendChild(iframe);
}

function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function convert(url, item) {
    return url.replace('{videoId}', item.videoId).replace('{channelId}', item.channelId)
}