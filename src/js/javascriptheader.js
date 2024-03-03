
const imageUrl_cancel = new URL(
    '../img/cancel.png',
    import.meta.url
  );

  const imageUrl_open = new URL(
    '../img/menu.png',
    import.meta.url
  );



 var bild_menu = document.getElementById("menu_knappen");

 bild_menu.addEventListener("click", function() {

  var nuvisas = document.getElementById("bilden_menu").srcset


    if(nuvisas==imageUrl_cancel.pathname)
    {
        
        document.getElementById("menu_innehall").style.display="none";
        document.getElementById("bilden_menu").srcset=imageUrl_open.pathname;
        console.log("öppnar");
    }

    else
    {
        document.getElementById("menu_innehall").style.display="block";
        document.getElementById("bilden_menu").srcset =imageUrl_cancel.pathname;
        console.log("stänger")
        
    }
  
    

});