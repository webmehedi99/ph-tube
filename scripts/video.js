console.log('scripts file added');

function getTimeString(time) {
    //get Hour and rest seconds
    const hour = parseInt(time / 3600);
    let remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond / 60);
    remainingSecond = remainingSecond % 60;
    return `${hour} hour  ${minute} minute ${remainingSecond} second ago`;
}

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn");
    console.log(buttons);
    for(let btn of buttons){
        btn.classList.remove("active")
}
}
// fetch api, load categories on html

// create load categories

const loadCategories = () => {
    console.log('load categories connected');

    // fetch the data

    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
        .catch(error => console.log(error))


}

const loadVideos = (searchText = "" ) => {
    console.log('load categories connected');

    // fetch the data

    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => displayVideos(data.videos))
        .catch(error => console.log(error))


}

const loadCategoryVideos = (id) => {
    // alert(id)
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then(res => res.json())
        .then(data => {
            removeActiveClass();
            const activeBtn = document.getElementById(`btn-${id}`);
            activeBtn.classList.add("active")
            displayVideos(data.category);
        })
        .catch(error => console.log(error))
}

const loadDisplay = async (videoId) =>{
     console.log(videoId);
     const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
     const res = await fetch(uri) ;
     const data = await res.json() ;
     displayDetails(data.video)
}
const displayDetails = (video) =>{
    console.log(video);
    const detailContainer = document.getElementById('modal-content');
    detailContainer.innerHTML = `
     <img src="${video.thumbnail}"/>
     <p>${video.description}<p>
    `

    // way - 1

    // document.getElementById('showModalData').click();

    // way -2 
    document.getElementById('customModal').showModal();

}

// {
//     "category_id": "1001",
//     "video_id": "aaaa",
//     "thumbnail": "https://i.ibb.co/L1b6xSq/shape.jpg",
//     "title": "Shape of You",
//     "authors": [
//         {
//             "profile_picture": "https://i.ibb.co/D9wWRM6/olivia.jpg",
//             "profile_name": "Olivia Mitchell",
//             "verified": ""
//         }
//     ],
//     "others": {
//         "views": "100K",
//         "posted_date": "16278"
//     },
//     "description": "Dive into the rhythm of 'Shape of You,' a captivating track that blends pop sensibilities with vibrant beats. Created by Olivia Mitchell, this song has already gained 100K views since its release. With its infectious melody and heartfelt lyrics, 'Shape of You' is perfect for fans looking for an uplifting musical experience. Let the music take over as Olivia's vocal prowess and unique style create a memorable listening journey."
// }


//create dynamic videos section
const displayVideos = (videos) => {
    const videosContainer = document.getElementById('videos');
    videosContainer.innerHTML = "";

    if (videos.length == 0) {
        videosContainer.classList.remove("grid")
        videosContainer.innerHTML = `
        <div class="min-h-[300px] w-full flex flex-col gap-5 justify-center items-center">
           <img src="/assets/Icon.png" alt="">
           <h2 class="font-bold text-2xl text-center">Oops !! Sorry, There is No <br> Content Here</h2> 
        </div>


        `;
        return;
    } else {
        videosContainer.classList.add("grid")
    }


    videos.forEach(video => {
        // console.log(video);
        const card = document.createElement('div');
        card.classList = "card card-compact ";
        card.innerHTML = `
        <figure class="h-[200px] relative">
            <img
            src="${video.thumbnail}"
            class ="w-full h-full  object-cover"
            alt="Shoes" />
              ${video.others.posted_date?.length == 0
                ? ""
                : `<span class="absolute text-xs right-2 bottom-2 bg-black text-white rounded p-1">${getTimeString(
                    video.others.posted_date
                )}</span>`
            }
        </figure>
        
        <div class="px-0 py-2 flex gap-2">
            <div ">
            <img class="w-10 h-10 rounded-full object-cover" src="${video.authors[0].profile_picture}" alt=""> 
            </div>
            <div>
            <h2 class="font-bold">${video.title} </h2>
            <div class="flex items-center gap-2">
              <p class="text-gray-500">${video.authors[0].profile_name}</p>
              ${video.authors[0].verified === true ? `<img class="w-5 " src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" alt=""> ` : ""
            }
            </div>
            <p> <button onclick="loadDisplay('${video.video_id}')" class="btn btn-sm btn-error">Details</button> </p>
            <p> </p>
            </div>
        </div>
        
        `
        videosContainer.append(card);
    })
}

// create display categories 
const displayCategories = (categories) => {

    const categoryContainer = document.getElementById('categories');

    categories.forEach((item) => {
        console.log(item);
        // create a button

        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = `
        <button id="btn-${item.category_id}" onclick ="loadCategoryVideos(${item.category_id})" class="btn category-btn">
          ${item.category}
        </button>
        `;

        // add button to category container 

        categoryContainer.append(buttonContainer);

    })
}

document.getElementById('search-input').addEventListener('keyup', (e) =>{
    loadVideos(e.target.value);
})
loadCategories();
loadVideos();
