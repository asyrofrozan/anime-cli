const axios = require('axios');
const cheerio = require('cheerio');

const animeURL = 'https://example-anime-website.com'; // Ganti dengan website yang ingin diakses

async function fetchAnime() {
    try {
        const { data } = await axios.get(animeURL);
        const $ = cheerio.load(data);

        const animeList = [];
        $('.anime-title').each((i, elem) => {
            animeList.push($(elem).text());
        });

        console.log('List Anime:', animeList);
    } catch (error) {
        console.error('Error fetching anime:', error.message);
    }
}

fetchAnime();
