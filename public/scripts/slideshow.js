let slideIndex = 0;
showSlides();





function showSlides() {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;

    if (slideIndex > slides.length) {
        slideIndex = 1
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    setTimeout(showSlides, 4000); // Change the image every 4 seconds
}


function dark_mode() {
    let btn = document.getElementById("btn");

    if(btn.checked){
        document.body.style.background = "#404040";
        document.body.style.transition = "1s ease";
        localStorage.setItem("checked","true");
    }
    else{
        document.body.style.background = "#f3ecf1";
        localStorage.setItem("checked","false");
    }

}
//dark mode
let result = localStorage.getItem("checked");
let btn = document.getElementById("btn");

if(result == "true"){
    btn.checked = true;

    document.body.style.background = "#404040";
    document.body.style.transition = "1s ease";
}
else{
    btn.checked = false;
    document.body.style.background = "#f2e7f3";
}

