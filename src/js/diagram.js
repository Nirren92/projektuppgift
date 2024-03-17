

//DOM-event 
window.onload =init_data();
let btnlaggtill = document.getElementById('laggtill');
btnlaggtill.addEventListener('click', laggtilltabell);

//konstanter och variabler
const breaklineindex = 5;
let label_time = [];
let tempdata = [];
let eldata = [];
let forbrukning =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let temperatur_data =[];
let charten;

//initierar sida med graf och data. 
async function init_data()
{
    try
    {    
        //hämtar data från URL
        let urlelomrade = new URLSearchParams(window.location.search).get('elomrade');
        let lat = new URLSearchParams(window.location.search).get('lat');
        let lng = new URLSearchParams(window.location.search).get('lng');
        let smhidata = await get_data("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat="+lat+"&lon="+lng);
        temperatur_data = array_dataset_24hours(smhidata.properties.timeseries);
       
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
        unikadatum.forEach(async element => {
            let tempdatael = ( await get_data("https://www.elprisetjustnu.se/api/v1/prices/"+element.slice(0, 4)+"/"+element.slice(5, 10)+"_"+urlelomrade+".json"));
            tempdatael.forEach(elementtempdatael => {
                temperatur_data.forEach(elementtemperatur_data => {
                    //jämför tidpunkter från temperatur för att matcha med eldata. 
                    if(elementtempdatael.time_start.slice(0,15).includes(elementtemperatur_data.time.slice(0,15)))
                    {
                        eldata.push(elementtempdatael.SEK_per_kWh)
                    }
                });
            });
        });
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
    //kollar om init har gått eller inte
    if (charten) {
        charten.destroy();
    }
    
    const data = [
        {
            label:'Hotspot pris kr/kwh',
            data: hotspot_array,
            bordercolor:'red',
            yAxisID: 'y1',
            type:'line'
        },
        {
            label:'Temperatur',
            data: temp_array,
            bordercolor:'blue',
            yAxisID: 'y2',
            type:'line'            
        },
        {
            label:'Förbrukning',
            data: forbrukning,
            bordercolor:'purple',
            yAxisID: 'y3',
            type:'bar'            
        }
    ];

    const chart_config = {
     type: 'line',
        data: {
            labels: labels,
            datasets: data
        }
    };
    
    const canvas = document.getElementById('hotspot_chart');
    charten = new Chart(canvas,chart_config);
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
    let forbrukningkw = parseFloat(document.getElementById("forbrukning").value);
    let starttid = document.getElementById("starttid").value;
    let timmaraktiv = parseFloat(document.getElementById("timmaraktiv").value);
    
    let newrow = document.createElement("tr");
    let newdata1 = document.createElement("td");
    let newdata2 = document.createElement("td");
    let newdata3 = document.createElement("td");
    let newdata4 = document.createElement("td");

    newdata1.textContent = beteckning;
    newrow.appendChild(newdata1);
    newdata2.textContent = forbrukningkw;
    newrow.appendChild(newdata2);
    newdata3.textContent = starttid;
    newrow.appendChild(newdata3);
    newdata4.textContent = timmaraktiv;
    newrow.appendChild(newdata4);

    document.getElementById("tabellen").appendChild(newrow);

    //tar bort värden från fält. 
    document.getElementById("form_apparat").reset();
    console.log("fungerar!!!",tempdata);
    let i = 0;
    //beräknar förbrukning per timme
    label_time.forEach(element => {
        if(element.slice(0, 2).includes(starttid.slice(0,2)))
        {
            for(let k=0;k<timmaraktiv;k++)
            {
                forbrukning[i+k]=forbrukning[i+k]+parseFloat(forbrukningkw);
            }
            chart_draw(eldata,tempdata,label_time);
            return;
        }
        i++;
    });
}





