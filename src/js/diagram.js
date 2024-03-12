
//https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=51.5&lon=0


//konstanter och variabler

const breaklineindex = 5;
let label_time = [];
let tempdata = [];
let eldata = [];
let forbrukning =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let temperatur_data =[];
//DOM-event 
window.onload =init_data();
let btnlaggtill = document.getElementById('laggtill');
btnlaggtill.addEventListener('click', laggtilltabell);



async function init_data()
{
    try
    {    
        
        //hämtar data från URL
        let urlelomrade = new URLSearchParams(window.location.search).get('elomrade');
        let lat = new URLSearchParams(window.location.search).get('lat');
        let lng = new URLSearchParams(window.location.search).get('lng');
        let smhidata = await get_data("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat="+lat+"&lon="+lng);
       console.log("smhi",smhidata);

       temperatur_data = array_dataset_24hours(smhidata.properties.timeseries);
       console.log("testar",temperatur_data);
        //plockar ur unikadatum för att veta vad jag ska hämta för elpriser. om det skulle gå över fler eller två dagar
        let unikadatum = [];
       
        temperatur_data.forEach(element => {
            if(!unikadatum.includes(element.time.split("T")[0]))
            {
                unikadatum.push(element.time.split("T")[0]);
            }
            label_time.push(element.time.split("T")[1].slice(0, 5));
            tempdata.push(element.data.instant.details.air_temperature);
        });
        
        //hämtar eldata för de berörda datum
        let all_eldata = [];
        unikadatum.forEach(async element => {
            let tempdatael = ( await get_data("https://www.elprisetjustnu.se/api/v1/prices/"+element.slice(0, 4)+"/"+element.slice(5, 10)+"_"+urlelomrade+".json"));
            tempdatael.forEach(elementtempdatael => {
                temperatur_data.forEach(elementtemperatur_data => {
                    //jämför tidpunkter från temperatur för att matcha med eldata. 
                    if(elementtempdatael.time_start.slice(0,15).includes(elementtemperatur_data.time.slice(0,15)))
                    {
                        console.log("fungerar");
                        eldata.push(elementtempdatael.SEK_per_kWh)
                    }
                });
                
             
            });

            console.log("tidebn",element.time);
        });

        console.log("label_time",label_time);


        
        console.log("eldata",eldata);

        chart_draw(eldata,tempdata,label_time);
        
        
    }
    //Fångar upp eventuella fel som kan uppstå vid hämtning av data. 
    catch(error)
    {
        console.error('nåt gick fel',error);
    }   
}


//tar dataarray
function array_dataset_24hours(indata)
{
    let restemp = [];


    for(let i=0; i<24 ;i++)
    {
        restemp.push(indata[i]);
    }

    return restemp;
}




//delar upp label i lämpligt format för att klara av långa label string
function format_labels(input_array, size_string)
{
    let array_name = [];
    //går ignenom letje namn i array
    input_array.forEach(item => {
        let str_antal = 0;
        //splittar strängen till en tillfällig array per ord
        let str = item.name.split(" ");
        let temptext ="";
        let array_temp = [];
        
        //kollar letje string hur lång den är och bryter där input säger
        str.forEach(text => {
            str_antal=str_antal+text.length;
            temptext = temptext+" "+text;
            if(str_antal>size_string)
            {
                str_antal=0;
                array_temp.push(temptext);
                temptext = "";
            }
        });
       
        array_name.push(array_temp);
        array_temp = []; 
        item=temptext;
    });
    return array_name;
}

// denna funktion ritar charts beroende på inputdata och 
function chart_draw(hotspot_array,temp_array,labels)
{

    
    const data = [
        {
            label:'Hotspot pris kr/kwh',
            data: hotspot_array,
            bordercolor:'red',
            yAxisID: 'y1'
        },
        {
            label:'Temperatur',
            data: temp_array,
            bordercolor:'blue',
            yAxisID: 'y2'            
        }
    ];

    const chart_config = {
     type: 'line',
        data: {
            labels: labels,
            datasets: data
        },
        options: {
            // Ange önskade options här
        }
    };
    
    const canvas = document.getElementById('hotspot_chart');
    const charten = new Chart(canvas,chart_config);



}











// sorterar data i storleksordning baserat på det nyckelord som väljs i JSON string samt sorterat ut på ett valt ord
function sort_and_biggest_first(input_array,filterord,type_input,antal)
{
    input_array = input_array.filter(item => item.type.includes(type_input));
    input_array = input_array.sort((a,b) => (b[filterord]-a[filterord]));
    return input_array.slice(0,antal);
}

//hämtar data asynkront baserat på input url
async function get_data(url_IN)
{
        const response = await fetch(url_IN);
        const data = await response.json();
        return data;
}




//lägger till input data till tabel. 
function laggtilltabell()
{
    let beteckning = document.getElementById("beteckning").value;
    let forbrukningkw = document.getElementById("forbrukning").value;
    let starttid = document.getElementById("starttid").value;
    let sluttid = document.getElementById("sluttid").value;
    
    let newrow = document.createElement("tr");
    let newdata1 = document.createElement("td");
    let newdata2 = document.createElement("td");
    let newdata3 = document.createElement("td");


    newdata1.textContent = beteckning;
    newrow.appendChild(newdata1);

    newdata2.textContent = forbrukningkw;
    newrow.appendChild(newdata2);

    newdata3.textContent = 2;
    newrow.appendChild(newdata3);

    document.getElementById("tabellen").appendChild(newrow);

    //tar bort värden från fält. 
    document.getElementById("form_apparat").reset();
    console.log("fungerar!!!",tempdata);
    let i = 0;
    //beräknar förbrukning per timme
    label_time.forEach(element => {
        if(element.slice(0, 2).includes(starttid.slice(0,2)))
        {
            forbrukning[i]=forbrukning[i]+parseFloat(forbrukningkw);
        }
        i++;
    });

    
    
    console.log("fungerar!!!",forbrukning);

}
















