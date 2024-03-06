const url = "https://www.elprisetjustnu.se/api/v1/prices/2024/03-03_SE3.json";

const map = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
            "name": "Södra Mellansverige (SE3)",
            "id": "SE3"
        },
        "geometry": {
            "coordinates": [[[[17.251, 60.7009], [17.9559, 60.5897], [18.5573, 60.2537], [18.9706, 59.7572], [17.876, 59.2709], [17.4569, 58.8585], [16.6522, 58.4344], [16.70408538281985, 57.74874495840136], [16.6007718227674, 57.3601131854727], [13.529466760375527, 57.42384871432118], [11.907447188936596, 57.53779460132084], [11.4493, 58.1183], [11.147, 58.9886], [11.3885, 59.0365], [11.7982, 59.29], [11.6806, 59.5923], [12.4862, 60.1067], [12.5888, 60.4508], [12.294, 61.0027], [12.8809, 61.3523], [12.1555, 61.7207], [12.3034, 62.2856], [14.753490409046073, 61.09678082255889], [16.4042030126332, 60.72230903453508], [17.251, 60.7009]]], [[[19.341621111168433, 57.98553484351426], [18.844189552905505, 57.64048846692212], [18.72319042996306, 57.253682024679534], [18.487080466232136, 57.140187007282684], [18.194207544194814, 56.92474825228571], [18.1365, 57.5566], [18.5374, 57.8305], [19.341621111168433, 57.98553484351426]]]],
            "type": "MultiPolygon"
        },
        "id": "SE3"
    }, {
        "type": "Feature",
        "properties": {
            "name": "Norra Mellansverige (SE2)",
            "id": "SE2"
        },
        "geometry": {
            "coordinates": [[[[18.975452309256195, 65.13621633926405], [20.28849011184901, 64.73696694018851], [21.33885261541254, 64.56472955478115], [21.4653, 64.3796], [20.7626, 63.8678], [19.0345, 63.2377], [18.4632, 62.8959], [17.8955, 62.8305], [17.4174, 61.7407], [17.1307, 61.5758], [17.251, 60.7009], [16.404208444071774, 60.72248082014322], [14.753695920149777, 61.096974777137724], [12.3034, 62.2856], [12.2181, 63.0007], [11.9997, 63.2917], [12.6625, 63.9404], [13.9604, 64.0141], [14.0776, 64.464], [13.6501, 64.5816], [14.4798, 65.3014], [14.5432, 66.1292], [18.028885778709622, 65.372668422023], [18.551884713283034, 65.40476897427345], [18.975452309256195, 65.13621633926405]]]],
            "type": "MultiPolygon"
        },
        "id": "SE2"
    }, {
        "type": "Feature",
        "properties": {
            "name": "Norra Sverige (SE1)",
            "id": "SE1"
        },
        "geometry": {
            "coordinates": [[[[24.1557, 65.8052], [22.615778650521303, 65.80909105867374], [21.5656, 65.4081], [21.1381, 64.8087], [21.343229501431907, 64.56450496235355], [20.288978815480142, 64.73672120693796], [18.973858264460812, 65.13653835589221], [18.551825584965393, 65.40473810611907], [18.028738929093223, 65.37253065183671], [14.5432, 66.1292], [15.423, 66.4899], [16.4036, 67.055], [16.1275, 67.4259], [17.3247, 68.1039], [17.9168, 67.965], [18.3785, 68.5624], [19.9698, 68.3565], [20.6223, 69.037], [21.9975, 68.5207], [22.7823, 68.3911], [23.639, 67.9543], [23.4681, 67.45], [23.9884, 66.8106], [23.7012, 66.4808], [24.1557, 65.8052]]]],
            "type": "MultiPolygon"
        },
        "id": "SE1"
    }, {
        "type": "Feature",
        "properties": {
            "name": "Södra Sverige (SE4)",
            "id": "SE4"
        },
        "geometry": {
            "coordinates": [[[[16.600525295762317, 57.36005841100631], [16.5279, 57.0681], [16.32037209986978, 56.67087279234061], [15.853115120338403, 56.12187510928118], [14.783991402098781, 56.152338775497725], [14.2152, 55.8325], [14.3417, 55.5278], [13.460780646742387, 55.35520152800298], [12.932285383420407, 55.394767955908506], [13.040786705464146, 55.70892821426308], [12.575752341927005, 56.183777698340414], [12.8835, 56.6178], [12.4214, 56.9063], [11.908477631064335, 57.53769453974075], [13.528908731620257, 57.424058440834905], [16.600525295762317, 57.36005841100631]]]],
            "type": "MultiPolygon"
        },
        "id": "SE4"
    }]
};

function findArea(point) {
    // Loopa igenom varje geo-feature i map
    for (let feature of map.features) {
        // Loopa igenom varje polygon i geometrin för det aktuella området
        for (let polygon of feature.geometry.coordinates) {
            // Om punkten ligger inom polygonen, returnera områdets egenskaper
            if (isPointInsidePolygon(point, polygon)) {
                return feature.properties;
            }
        }
    }
    // Returnera null om punkten inte finns i något område
    return null;
}
function isPointInsidePolygon(point, polygon) {
    let x = point[0];
    let y = point[1];
    let inside = false;
    // Loopa igenom varje kant i polygonen
    for (let i = 0, j = polygon[0].length - 1; i < polygon[0].length; j = i++) {
        let xi = polygon[0][i][0];
        let yi = polygon[0][i][1];
        let xj = polygon[0][j][0];
        let yj = polygon[0][j][1];
        // Kolla om punkten ligger på en kant eller mellan två hörn av polygonen
        let intersect = ((yi > y) != (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        // Om punkten är precis på kanten, betrakta den som utanför polygonen
        if (intersect) return true;
        // Ändra inside om skärningen är ojämn
        if ((yi > y) != (yj > y) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
            inside = !inside;
        }
    }
    // Returnera true om punkten är inuti polygonen, annars false
    return inside;
}


// Exempel på användning
let point = [13.003822, 55.604981]; // Testpunktens koordinater
let area = findArea(point); // Hitta området för punkten

if (area) {
    console.log("Punkten är i området:", area.name);
} else {
    console.log("Punkten är inte i något av de definierade områdena.");
}