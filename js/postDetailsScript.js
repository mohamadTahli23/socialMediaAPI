

// Get the id of post from url
const urlParms = new URLSearchParams(window.location.search)
const id = urlParms.get("postId")
console.log(id)

async function getPost() {
    toggleLoader(true)
    let response = await fetch(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    let json = await response.json()
    toggleLoader(false)
    const post = json.data
    const comments = json.data.comments
    const author = post.author

    document.getElementById("userNameSpan").innerHTML = author.username

    // Check if profile image Not Empty
    let profileImage = author.profile_image
    if(typeof profileImage === "object" && profileImage !== null) {
        profileImage = "./Profile-pics/profile-icon-design.jpg"
    }

    // Check if title null 
    let title = post.title;
    if(title == null) {
        title = ""
    }


    let commentContent = ``

    // Loop on comments
    comments.forEach(element => {
    // Check if profile image Not Empty
    let profileImageForComment = element.author.profile_image
    if(typeof profileImageForComment === "object" && profileImageForComment !== null) {
        profileImageForComment = "./Profile-pics/profile-icon-design.jpg"
    }
        
        // Make comment content as HTML and add Data in field
        commentContent += `
            <!-- Comments -->
        <div class=" p-3  rounded shadow-sm pb-5 my-2">

            <div>   
                <img src="${profileImageForComment}" alt="" class="rounded-circle" style="width: 40px; height: 40px;">
                <h5 id="commentUserName">@${element.author.username}</h5>
            </div>

            <div class="my-2" id="commentBody">
                ${element.body}
            </div>
            

        </div>
        
        <!--// Comments //-->
            `
    });


    // Make post content as HTML and add Data in field
    const postContent = `
    <div class="card shadow my-4 ">
        <div class="card-header">
            <img src="${profileImage}" alt="" id="profile-image" class="rounded-circle" style="width: 40px; height: 40px;">
            <span id="username" class="fw-bold">@${author.username}</span>
        </div>
        <div class="card-body" style =  >
            <div style = "max-width: 100%;  margin: auto; text-align:center;" >
                <img src="${post.image}" alt="" id="post-image" ">
            </div>
            <h6 style="color: rgb(156, 156, 156);" id="created-time" class="mt-1"> ${post.created_at}</h6>
    
            <h5 id="title">${title}</h5>
            <p id="body">
                ${post.body}
            </p>
            <hr>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg>
                <span id="comments">(${post.comments_count}) Comments</span>
                <div id="post-tags-${id}" class="mx-2" style="display: inline-block;">
                    <span class="badge rounded-pill text-bg-secondary" data-bs-toggle="tooltip" data-bs-title="The last tip!">Policy</span>
                </div>
            </div>
            <hr>
            <div id =  "comments">
                ${commentContent}
            </div>
            <div class="input-group my-2" >
                <input id = "commentInput" type="text" class="form-control" placeholder="Add Your Comment Here.." aria-label="Recipient's username" aria-describedby="button-addon2">
                <button  class="btn btn-outline-secondary " onclick = "commentAddClicked()" type="button" id="commentButton">Send</button>
            </div>
            <div id="commentHelper" class="form-text text-danger">
            </div>
        </div>
    </div>
    
    <br>
    `
    document.getElementById("post").innerHTML = postContent

    // Add Tags to every post
    const currentPostTagsId = `post-tags-${id}`
    document.getElementById(currentPostTagsId).innerHTML = ""
    for (tag of post.tags) {
        let tagsContent = `
        <span class="badge rounded-pill text-bg-secondary" data-bs-toggle="tooltip" data-bs-title="${tag.description}">${tag.name}</span>
        `
        document.getElementById(currentPostTagsId).innerHTML += tagsContent
    }
    setUpUi()

    console.log(post)

}

function commentAddClicked() {
    let commentBody = document.getElementById("commentInput").value
    let params = {
        "body": commentBody
    }
    let token = localStorage.getItem("token")
    toggleLoader(true)
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments` , params ,{
        headers: {
            "authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        toggleLoader(false)
        alertBootstrap("The Comment has been created Successfully" , 'success')
        getPost()
    }).catch(error => {
        const errorMessage = error.response.data.message
        alertBootstrap(errorMessage , 'danger')
    })
    
}


themSwitcher()

getPost()
