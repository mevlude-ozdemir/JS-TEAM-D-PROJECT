

function navMenu() {
 
    let menuButton = document.querySelector(".burger");
    let openMenu = document.querySelector(".nav-links");

    menuButton.addEventListener("click", function(){

        this.classList.toggle("active");
        openMenu.classList.toggle("active");
    });

}


function toggleMenu()
{   
    let toggleButton = document.querySelector(".toggle-switch")
    let body = document.querySelector("body")
    let writeColor = document.querySelector(".header, .logo");
    let navToggle = document.querySelector(".navbar")
    let logo = document.querySelector(".logo")

    toggleButton.addEventListener("click", function(){
        
        this.classList.toggle("active");
        
        if (body.style.backgroundColor === "white") {
            body.style.backgroundColor = "black";
            navToggle.style.backgroundColor = "black";
            writeColor.style.color = "white";
            logo.style.color = "white";
            
           
          } else {
            body.style.backgroundColor = "white";
            writeColor.style.color = "#282828";
            navToggle.style.backgroundColor = "white";
            logo.style.color = "#282828";
          }
          

    })


}

navMenu();
toggleMenu();
