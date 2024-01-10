

setUpUi();

// Get the id of user from url
function getCurrentUserId() {
    const urlParms = new URLSearchParams(window.location.search)
    const id = urlParms.get("userid")
    return id ;
}

function getUser() {

    const id = getCurrentUserId();
    
    toggleLoader(true)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then(response => {

        const user = response.data.data

        document.getElementById("userEmail").innerHTML = user.email ? user.email : "";
        document.getElementById("nameOfUser").innerHTML = user.name;
        document.getElementById("userName").innerHTML = user.username;
        document.getElementById("username-posts").innerHTML = user.username;
        document.getElementById("postsCount").innerHTML = user.posts_count;
        document.getElementById("commentsCounts").innerHTML = user.comments_count;
        document.getElementById("main-info-image").src = user.profile_image;
        console.log(user)

    })
    .finally(() => {
        toggleLoader(false)
    })

}

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    alertBootstrap('Logout Successfully' , 'danger' )
    setUpUi()
    getPosts()
}

getUser()
getPosts()

async function getPosts() {
    toggleLoader(true)
    const id = getCurrentUserId();
    let response = await fetch(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
    let json = await response.json()
    toggleLoader(false)

    console.log(json.data)
    document.getElementById("user-posts").innerHTML = ""

    // Loop on Posts Data //
    json.data.forEach(element => {

    // Check if title null 
    let title = element.title;
    if(title == null) {
        title = ""
    }

    // Show or Hide edit button
    let user = getCurrentUser()
    let isMyPost = user != null && element.author.id == user.id
    let editBtnContent = ``

    if(isMyPost) {
        editBtnContent = ` 
            <svg data-bs-toggle="dropdown"  aria-expanded="false" xmlns="http://www.w3.org/2000/svg"  style = "float:right; margin-top:13px; cursor: pointer;" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
            </svg>
            <ul class="dropdown-menu dropdown-menu-end" style = "width: 250px !important">
                <li><a onclick = "editPostBtnClicked('${encodeURIComponent(JSON.stringify(element))}')" class="dropdown-item" href="#">Edit Post</a></li>
                <li><a onclick = "deletePostBtnClicked('${encodeURIComponent(JSON.stringify(element))}')" class="dropdown-item  link-danger" href="#">Delete Post </a></li>
            </ul>
        `
    }

    // Check if profile image Not Empty
    let profileImage = element.author.profile_image
    if(typeof profileImage === "object" && profileImage !== null) {
        profileImage = "./Profile-pics/profile-icon-design.jpg"
    }

    let content = ` 
    <div class = "card shadow my-4" >                  
        <div class="card-header">
            <img src="${profileImage}" alt="" id="profile-image" class="rounded-circle" style="width: 40px; height: 40px;">
            <span id="username" class="fw-bold">@${element.author.username}</span>
            ${editBtnContent}
        </div>
        <div class="card-body " onclick="postClicked(${element.id})" style = "cursor: pointer;">
        <div style = "max-width: 100%;  margin: auto; text-align:center;" >
            <img src="${element.image}">
        </div>
            <h6 style="color: rgb(156, 156, 156);" id="created-time" class="mt-1"> ${element.created_at}</h6>

            <h5 id="title">${title}</h5>
            <p id="body"> ${element.body}
            </p>
            <hr>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg>
                <span id="comments">(${element.comments_count}) Comments</span>
                <div id="post-tags-${element.id}" class="mx-2" style="display: inline-block;">
                    <span class="badge rounded-pill text-bg-secondary" data-bs-toggle="tooltip" data-bs-title="The last tip!">Policy</span>
                </div>
            </div>
        </div>
    </div> `

    document.getElementById("user-posts").innerHTML += content

    // Add Tags to every post
    const currentPostTagsId = `post-tags-${element.id}`
    document.getElementById(currentPostTagsId).innerHTML = ""
    for (tag of element.tags) {
        let tagsContent = `
        <span class="badge rounded-pill text-bg-secondary" data-bs-toggle="tooltip" data-bs-title="${tag.description}">${tag.name}</span>
        `
        document.getElementById(currentPostTagsId).innerHTML += tagsContent
    }

    });
}



profileClicked()

