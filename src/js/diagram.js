
//konstanter och variabler
const data_lank = 'https://studenter.miun.se/~mallar/dt211g/';
const breaklineindex = 5;
let antagningsdata=null;

//DOM-event
window.onload =init_data();

async function init_data()
{
    try
    {       
        antagningsdata= await get_data(data_lank);
        //skapar ett nytt objekt avorginaldata för att inte förstöra den. 
        let course_sorted = sort_and_biggest_first(JSON.parse(JSON.stringify(antagningsdata)),'applicantsTotal','Kurs',6);
        let program_sorted = sort_and_biggest_first(JSON.parse(JSON.stringify(antagningsdata)),'applicantsTotal','Program',5);
        
        chart_draw(course_sorted,'applicantsTotal','most_apply_course','Antal ansökande','bar');
        chart_draw(program_sorted,'applicantsTotal','most_apply_program','Antal ansökande','pie');
    }
    //Fångar upp eventuella fel som kan uppstå vid hämtning av data. 
    catch(error)
    {
        console.error('nåt gick fel',error);
    }   
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
function chart_draw(input_array,filterord,canvasid,label_name,charttype)
{

   let array_name = format_labels(input_array,5);
   const ctx = document.getElementById(canvasid);
   let manuellval = 0;

    //Sätter options beroende på vilen chart type
    if(charttype=='bar')
    {
        manuellval = {
            scales: {
                x: {
                    ticks: {
                        color:'black',    
                        font: {
                            size: 8
                        }
                    }
                },
                y: {
                    ticks: {
                        color:'black', 
                        font: {
                            size: 18
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color:'black', 
                        font: {
                            size: 10
                        }
                    }
                }
            }
        };
    }

    if(charttype=='pie')
    {
        manuellval = {
            plugins: {
                legend: {
                    position: 'left',
                    labels: {
                        color:'black', 
                        font: {
                            size:12
                        }
                    }
                }
            },
            legend: {               
        }
        };

    }
    
    //ritar karta(uppdaterar)
    new Chart(ctx, {
      type: charttype,
      data: {
        labels: array_name,
        datasets: [{
          label: label_name,
          data: input_array.map(item => item[filterord]),
          borderWidth: 1
        }]
      },
      options:manuellval
    });
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