import { FS } from '../../_shared/fs/fs';
import { getCivicIssuesData } from './civic_issues/civic_issues';

export const makeStreetID = (strn: string): string => {
    let result = strn.toLowerCase();
    result = result.replace(/ä/g, 'ae');
    result = result.replace(/ö/g, 'oe');
    result = result.replace(/ü/g, 'ue');
    result = result.replace(/ß/g, 'ss');
    result = result.replace(/[^a-z0-9]/g, '_');
    result = result.replace(/_+/g, '_');
    result = result.replace(/^_/, '');
    result = result.replace(/_$/, '');
    return result;
}

export const getStreets = () => {
    const result: any = {};
    const data = FS.readFile('src/_data/streets_raw.json') as any;
    for (const item of data) {
        // console.log(
        //     `${item.strn} => ${makeStreetID(item.strn)}`
        // );
        const streetID = makeStreetID(item.strn);
        if (!result[streetID]) {
            result[streetID] = {
                strn: item.strn,
                id: streetID,
                synonyms: [item.strn],
                // plz: item.plz,
                // ort: item.ort,
                // count: 0,
            };
        }
    }
    FS.writeFile('src/_data/streets.json', {
        data: Object.values(result),
    });
    // console.log(result);
    return result;
}
const streets = getStreets();

const allData: any = {}
// console.log(streets[0]);
// console.log(streets.length);
const civicIssue = getCivicIssuesData(streets);
console.log(civicIssue.items[0]);
for (const item of civicIssue.items) {
    const streetID = item.streetID;
    const streetName = item.streetName;
    const streetItem = streets[streetID];
    if(streetID && streetName){
        allData[streetID] = {
            dataSet: ['streets', 'civic_issues'],
            streetID,
            streetName,
        };
    } else {
        // allData[streetID] = {
        //     dataSet: ['streets'],
        //     streetID,
        //     streetName,
        // };

    }
    if (streetItem) {
        if(!streetItem.synonyms.includes(streetName)) {
            streetItem.synonyms.push(streetName);
        }
    }
    // console.log(streetID, streetName);
}
FS.writeFile('src/_data/repos/all.json', allData)
FS.writeFile('src/_data/streets.json', streets);



