let audioPlayer = document.querySelector('.quranPlayer'),
    surahsContainer = document.querySelector('.surahs'),
    ayah = document.querySelector('.ayah'),
    next = document.querySelector('.next'),
    play = document.querySelector('.play'),
    prev = document.querySelector('.prev'),
    year = document.querySelector('#year');

    getSurahs();
function getSurahs(){
    fetch('https://quran-endpoint.vercel.app/quran')
    .then(response => response.json())
    .then(data =>{
        for (let surah in data.data) {
            // console.log(data.data[surah].asma.ar.long)
            // console.log(data.data[surah].asma.en.short)
            surahsContainer.innerHTML += `
            <div>
            <p>${data.data[surah].asma.ar.long}</p>
            <p>${data.data[surah].asma.en.short}</p>
            </div>
            `
            let allSurahs = document.querySelectorAll('.surahs div'),
            AyahsAudios,
            AyahsText;

            allSurahs.forEach((surah,index) => {
                surah.addEventListener("click",()=>{
                    fetch(`https://quran-endpoint.vercel.app/quran/${index+ 1}`)
                    .then(response => response.json())
                    .then(data => {
                        // console.log(data)
                        let verses = data.data.ayahs;
                        AyahsAudios =  [];
                        AyahsText = [];
                        // console.log(verses)
                        verses.forEach(verse =>{
                            AyahsAudios.push(verse.audio.url);
                            AyahsText.push(verse.text.ar);
                            // console.log(verse.text.ar)
                            // console.log(verse.text.audio)
                        })
                        // console.log(AyahsAudios)
                        // console.log(AyahsText)
                        let AyahIndex = 0;
                        changeAyah(AyahIndex);
                        audioPlayer.addEventListener('ended', () =>{
                            AyahIndex++;
                            if(AyahIndex < AyahsAudios.length){
                                changeAyah(AyahIndex);
                            }
                            else{
                                AyahIndex = 0;
                                changeAyah(AyahIndex);
                                audioPlayer.pause();

                                swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Surah Has Bees Ended!',
                                    showConfirmButton: false,
                                    timer: 1500
                                  })
                                  ayah.innerHTML ="أضغط على الصورة لإستماع إليها";
                                  isPlaying  = true;
                                  togalePlay();
                            }
                            
                            console.log(AyahIndex)
                        })
                        //next , play, prev
                        next.addEventListener('click', () =>{
                            AyahIndex < AyahsAudios.length -1 ? AyahIndex ++ : AyahIndex =0;
                            changeAyah(AyahIndex);

                        })

                        prev.addEventListener('click', () =>{
                            AyahIndex == 0 ?AyahIndex =AyahsAudios.length -1 : AyahIndex --;
                            changeAyah(AyahIndex);

                        })

                        //handle play or pause
                        let isPlaying = false;
                        togalePlay()
                        function togalePlay(){
                            if(isPlaying){
                                audioPlayer.pause();
                                play.innerHTML = `<i class="fas fa-play"></i>`;
                                isPlaying = false;
                            }else{
                                audioPlayer.play();
                                play.innerHTML = `<i class="fas fa-pause"></i>`;
                                isPlaying = true;
                            }
                        }

                        play.addEventListener('click', togalePlay)

                        function changeAyah(index) {
                            audioPlayer.src = AyahsAudios[index];
                            ayah.innerHTML = AyahsText[index];
                            // audioPlayer.play();
                        }


                    })
                   
                })
            })
        }
    })
}



year.innerHTML = new Date().getFullYear();