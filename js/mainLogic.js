

// initialize tooltips from bootstrap
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


// This Function is check if object empty or not , it return true or false 
//or return either null or undefined if it is not an empty object
const isObjectEmpty = (objectName) => {
    return (
        objectName &&
        Object.keys(objectName).length === 0 &&
        objectName.constructor === Object
    );
};


// It control in Nav Ui shape
function setUpUi() {
    const token = localStorage.getItem("token")

    let loginDiv = document.getElementById("loginContainer")
    let logoutDiv = document.getElementById("logoutContainer")
    const user = getCurrentUser()
    // Add Button
    let addBtn = document.getElementById("addBtn")
    // Comment on post Field 
    let comment = document.getElementById("commentInput")
    let commentButton = document.getElementById("commentButton")
    let commentText = `You Have To Login To be Able To Comment`

    if(token == null) { // user is login  
        if(addBtn != null)  {    
            addBtn.style.setProperty("display" , "none", "important")
        }
        // Check If comment is null because not exist in that page
        if(comment != null) {
            comment.setAttribute("disabled", "")
            commentButton.classList.add("remove-click")
            document.getElementById("commentHelper").innerHTML = commentText
        }
        loginDiv.style.setProperty("display" , "flex", "important")
        logoutDiv.style.setProperty("display" , "none" , "important")
    } else {
        if(addBtn != null ) {    
            addBtn.style.setProperty("display" , "block", "important")
        }
        // Check If comment is null because not exist in that page
        if(comment != null) {
            comment.removeAttribute("disabled")
            commentButton.classList.remove("remove-click")
            document.getElementById("commentHelper").innerHTML = ""
        }
        loginDiv.style.setProperty("display" , "none", "important")
        logoutDiv.style.setProperty("display" , "flex" , "important")
        document.getElementById("usernameAtNavbar").innerHTML = user.username;
        let profileImage  = isObjectEmpty(user.profile_image)// check if profile image empty or not
        document.getElementById("profile-image").src = profileImage ? "./Profile-pics/profile-icon-design.jpg": user.profile_image

    }
}



function getCurrentUser() {
    let user = null 
    const storageUser = localStorage.getItem("user")

    if(storageUser != null) {
        user = JSON.parse(storageUser)
    }

    return user

}


function loginBtnClicked() {

    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value
    // todo: user Name
    let usernameAtNavbar = document.getElementById("usernameAtNavbar")
    usernameAtNavbar.innerText = username
    loginUser = username
    const parms = {
        "username" : username,
        "password" : password
    }

    toggleLoader(true)
    axios.post("https://tarmeezacademy.com/api/v1/login" , parms)
    .then(response => {
        // Save Token Response And User in Local Storage
        localStorage.setItem("token" , response.data.token)
        localStorage.setItem("user" , JSON.stringify(response.data.user))
        // Hide Modal after login Success
        let modal = document.getElementById("loginModel")
        let modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        // Function to make alert when login success
        alertBootstrap('Login Successfully' , 'success')
        setUpUi()
        getPosts()
    })
    .catch(error => {
        const message = error.response.data.message
        alertBootstrap(message , 'danger' )
        console.log(message)
    })
    .finally(() => {
        toggleLoader(false)
    })

}


function registerBtnClicked() {

    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const profileImage = document.getElementById("register-Image-input").files[0]

    
    let formData = new FormData()
    formData.append("name" , name)
    formData.append("username" , username)
    formData.append("password" , password)
    formData.append("image" , profileImage)

    toggleLoader(true)
    axios.post("https://tarmeezacademy.com/api/v1/register" , formData)
    .then(response => {
        // Save Token Response And User in Local Storage
        localStorage.setItem("token" , response.data.token)
        localStorage.setItem("user" , JSON.stringify(response.data.user))
        // Hide Modal after login Success
        let modal = document.getElementById("registerModel")
        let modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        // Function to make alert when login success
        alertBootstrap('New User Register Successfully ' , 'success' )
        setUpUi()
    })
    .catch(error => {
        const message = error.response.data.message
        alertBootstrap(message , 'danger' )
        console.log(message)
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
    getPost()
}

function alertBootstrap(message , type ) {
    // Add main div alert in body 
    let makeAlertDiv = document.createElement("div")
    makeAlertDiv.className = "fade show"
    makeAlertDiv.id = "alert"
    makeAlertDiv.style = "position: fixed; z-index: 9999; right: 10px; bottom: 0; width: 35%;"
    document.body.prepend(makeAlertDiv)

    // Call alert id
    const alertPlaceholder = document.getElementById("alert")
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)

        // hide the alert
        setTimeout(() => {
            const alertToHide = bootstrap.Alert.getOrCreateInstance(`#alert`)
            alertToHide.close()
        },3000)
    
}


function addBtnClicked() {
    document.getElementById("post-modal-submit-btn").innerHTML = "Create"
    document.getElementById("post-id-input").value = ""
    document.getElementById("postModalTitle").innerHTML = "Create A New Post"
    document.getElementById("post-title-input").value = ""
    document.getElementById("post-body-input").value = ""
    let postModal = new bootstrap.Modal(document.getElementById("createPostModel"),{})
    postModal.toggle()
}


function createNewPostClicked() {

    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""

    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const token = localStorage.getItem("token")
    const image = document.getElementById("post-image-input").files[0]

    let url = ``
    let formData = new FormData()
    formData.append("title" , title)
    formData.append("body" , body)
    formData.append("image" , image)

    const headers = {
        "authorization": `Bearer ${token}` 
    }

    if(isCreate) {
        url = `https://tarmeezacademy.com/api/v1/posts`

    } else {
        url = `https://tarmeezacademy.com/api/v1/posts/${postId}`
        formData.append("_method" , "put")
    }

    toggleLoader(true)
    axios.post(`${url}` , formData , {
        headers: headers
    })
    .then(response => {
        // Hide Modal after post Success
        let modal = document.getElementById("createPostModel")
        let modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        alertBootstrap('New Post Has Been Created ' , 'success' )
        getPosts() 
        
    })
    .catch(error => {
        const message = error.response.data.message
        alertBootstrap(message , 'danger' )
    })
    .finally(() => {
        toggleLoader(false)
    })



}


function editPostBtnClicked(postObject) {  
    let post = JSON.parse(decodeURIComponent(postObject))

    document.getElementById("post-modal-submit-btn").innerHTML = "Update"
    document.getElementById("post-id-input").value = post.id
    document.getElementById("postModalTitle").innerHTML = "Edit Post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("createPostModel"),{})
    postModal.toggle()

}

function deletePostBtnClicked(postObject) {  
    let post = JSON.parse(decodeURIComponent(postObject))

    document.getElementById("delete-post-id-input").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("deletePostModel"),{})
    postModal.toggle()

}

// Confirm Delete from Modal
function confirmDelete() {
    
    let postId = document.getElementById("delete-post-id-input").value
    let url = `https://tarmeezacademy.com/api/v1/posts/${postId}`
    let token = localStorage.getItem("token")

    const header = {
        "authorization": `Bearer ${token}` 
    }

    toggleLoader(true)
    axios.delete(`${url}` , {
        headers: header
    })
    .then(response => {
        // Hide Modal after post Success
        let modal = document.getElementById("deletePostModel")
        let modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        alertBootstrap('Post Deleted Successfully ' , 'success' )
        getPosts() 
        
    })
    .catch(error => {
        const message = error.response.data.message
        alertBootstrap(message , 'danger' )
    })
    .finally(() => {
        toggleLoader(false)
    })
    
}

function profileClicked() {
    let profile = document.getElementById("profileLink"); 
    profile.addEventListener("click" , () => {
        const user = getCurrentUser()
        const userId = user.id
        window.location = `./profile.html?userid=${userId}`
    })
}

function toggleLoader(show = true) {
    let loader = document.getElementById("loader")
    if(show == true && loader != null) {
        loader.style.visibility = "visible"

    }else if(show == false && loader != null) {
        loader.style.visibility = "hidden"
    }
}

// Dark And Light Mode
function themSwitcher() {

    const moon = `        
    <svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon" viewBox="0 0 16 16">
        <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/>
    </svg>`;
    const sun = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
        <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
    </svg>`

    const root = document.querySelector(":root");

    let theme = "dark";
    const container = document.getElementsByClassName("theme-container")[0];
    const themeIcon = document.getElementById("theme-icon");
    

    if(localStorage.getItem("theme") != null && localStorage.getItem("theme") == "light" ) {
        theme = localStorage.getItem("theme")
        setLight()
        console.log("hi light")
    }else {
        localStorage.setItem("theme", theme)
        theme = localStorage.getItem("theme")
        setDark()
        console.log("hi dark")
    }

    container.addEventListener("click", setTheme);

    function setTheme() {
        switch (theme) {
        case "dark":
            setLight();
            localStorage.setItem("theme" , "light") ;
            theme = "light"
            break;
        case "light":
            setDark();
            localStorage.setItem("theme" , "dark") ;
            theme = "dark"
            break;
        }
    }
    function setLight() {
        root.setAttribute("data-bs-theme" , "light")
        container.classList.remove("shadow-dark");
        setTimeout(() => {
        container.classList.add("shadow-light");
        themeIcon.classList.remove("change");
        }, 300);
        themeIcon.classList.add("change");
        themeIcon.innerHTML = sun;
    }
    function setDark() {
        root.setAttribute("data-bs-theme" , "dark")
        container.classList.remove("shadow-light");
        setTimeout(() => {
        container.classList.add("shadow-dark");
        themeIcon.classList.remove("change");
        }, 300);
        themeIcon.classList.add("change");
        themeIcon.innerHTML = moon;
    }

}

themSwitcher()