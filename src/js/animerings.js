var aktiv = 0;

document.getElementById('animeringsknapp').addEventListener('click',function(){

console.log("startar animering");

var knappensanimering = document.getElementById('animeringsknapp');



if(aktiv == 1)
{
    knappensanimering.style.animation='none';
    console.log("här");
    knappensanimering.innerHTML = "tryck för att starta igen";
    aktiv = 0;
}
else
{
    knappensanimering.style.animation='forflyttaknapp 1s 0s infinite';
    knappensanimering.innerHTML = "Catch me if you can";
    aktiv = 1;
}

});