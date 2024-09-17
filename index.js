const axios = require('axios');
const cheerio = require('cheerio');
const inquirer = require('inquirer');

const animeURL = 'https://kuronime.pro/';

async function fetchAnime() {
    try {
        // Mengirim request HTTP GET ke Kuronime
        const { data } = await axios.get(animeURL);

        // Load data HTML menggunakan cheerio
        const $ = cheerio.load(data);

        // Array untuk menampung anime
        const animeList = [];

        // Menemukan elemen yang berisi judul anime dan URL episode
        $('a[itemprop="url"]').each((i, elem) => {
            const title = $(elem).find('.bsuxtt').text().trim(); // Mengambil judul anime
            const url = $(elem).attr('href'); // Mengambil URL episode

            // Hanya tambahkan jika title ada
            if (title && url.includes('nonton-')) {
                animeList.push({ title, url });
            }
        });

        // Mengembalikan daftar anime
        return animeList;
    } catch (error) {
        console.error('Error fetching anime from Kuronime:', error.message);
        return [];
    }
}

async function main() {
    const animeList = await fetchAnime();

    if (animeList.length === 0) {
        console.log('Tidak ada anime yang ditemukan.');
        return;
    }

    // Menampilkan judul-judul anime yang ditemukan
    const choices = animeList.map(anime => anime.title);

    // Menggunakan inquirer untuk memilih anime
    inquirer.prompt({
        type: 'list',
        name: 'chosenAnime',
        message: 'Pilih anime yang ingin kamu tonton:',
        choices: choices,
    }).then(async ({ chosenAnime }) => {
        // Mencari URL dari anime yang dipilih
        const selectedAnime = animeList.find(anime => anime.title === chosenAnime);
        if (selectedAnime) {
            console.log(`Kamu memilih: ${selectedAnime.title}`);
            console.log(`URL: ${selectedAnime.url}`);

            // Menggunakan dynamic import untuk modul `open`
            const { default: open } = await import('open');
            await open(selectedAnime.url);
        }
    }).catch(error => {
        console.error('Error:', error.message);
    });
}

main();
