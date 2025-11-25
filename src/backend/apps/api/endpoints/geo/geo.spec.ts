import { COORD } from './geo.d';
import { getReverseGeoData, updateCoordCache } from './geo';
import { spyOnCMD } from '../../_shared/utils/utils';
import * as geo from './geo';

describe('getReverseGeoData()', () => {
    const FN = getReverseGeoData;
    const CORRECT_RESULT = {
        place_id: '6175609',
        licence:
            'Data © OpenStreetMap contributors, ODbL 1.0. https:\\/\\/osm.org\\/copyright',
        osm_type: 'way',
        osm_id: '9659760',
        lat: '52.3864838069139',
        lon: '13.063328647394',
        display_name:
            'Am Havelblick, Südliche Innenstadt, Innenstadt, Potsdam, Brandenburg, 14473, Deutschland',
        address: {
            road: 'Am Havelblick',
            suburb: 'Südliche Innenstadt',
            city: 'Potsdam',
            state: 'Brandenburg',
            postcode: '14473',
            country: 'Deutschland',
            country_code: 'de',
        },
        boundingbox: ['52.3863855', '52.3865235', '13.0631972', '13.0636542'],
    };
    const INCORRECT_RESULT = { error: 'Unable to geocode' };

    it('should get reverse geo data for correct corrds', () => {
        const coord: COORD = {
            latitude: 52.3864838069139,
            longitude: 13.063328647394,
        };
        const mockResult = JSON.stringify(CORRECT_RESULT);
        const mockCommand = spyOnCMD(mockResult, '200');
        expect(FN(coord)).toEqual({
            id: '52.3864838069139-13.063328647394',
            address: CORRECT_RESULT,
            count: 1,
        });
        mockCommand.mockRestore();
    });
    it('should get no reverse geo data for wrong input', () => {
        const coord: COORD = {
            latitude: 1,
            longitude: 2,
        };
        const mockResult = JSON.stringify(INCORRECT_RESULT);
        const mockCommand = spyOnCMD(mockResult, '200');
        expect(FN(coord)).toEqual({ id: '-1', address: null, count: 1 });
        mockCommand.mockRestore();
    });
    it('should get no reverse geo data for wrong input', () => {
        const coord: COORD = {
            latitude: 52.3864838069139,
            longitude: 13.063328647394,
        };
        const mockResult = JSON.stringify('some error');
        const mockCommand = spyOnCMD(mockResult, '404');
        expect(FN(coord)).toEqual({ id: '-1', address: null, count: 1 });
        mockCommand.mockRestore();
    });
});
describe('getGeoID()', () => {
    const FN = getReverseGeoData;
    it('should get geo ID from coords', () => {
        const coord: COORD = {
            latitude: 52.3864838069139,
            longitude: 13.063328647394,
        };
        expect(FN(coord).id).toEqual('52.3864838069139-13.063328647394');
    });
});
describe('updateCoordCache()', () => {
    const FN = updateCoordCache;
    let spy: jest.SpyInstance;
    beforeEach(() => {
        spy = jest
            .spyOn(geo, 'getReverseGeoData')
            .mockImplementation((coord: COORD) => {
                if (coord.latitude > 10) {
                    console.log('called');
                    console.log(coord);
                    return {
                        id: `${coord.latitude}-${coord.longitude}`,
                        address: {
                            place_id: '00000', // check if mocked
                        } as any,
                        count: 1,
                    };
                } else {
                    return {
                        id: `-1`,
                        address: null,
                        count: 1,
                    };
                }
            });
    });
    afterEach(() => {
        spy.mockRestore();
        expect(spy.mock.calls.length).toEqual(0);
        console.log(spy.mock.calls);
    });
    it('should update coord cache with new coord', () => {
        const coord: COORD = {
            latitude: 52.3864838069139,
            longitude: 13.063328647394,
        };
        const foundCoords: any = {};
        const result = FN(coord, foundCoords);
        expect(result.state).toEqual('found');
        expect(result.request).toEqual(1);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(foundCoords['52.3864838069139-13.063328647394']).toEqual({
            id: '52.3864838069139-13.063328647394',
            address: {
                place_id: '00000',
            },
            count: 1,
        });
    });
    it('should update coord cache with new coord', () => {
        const coord: COORD = {
            latitude: 5.3864838069139,
            longitude: 1.063328647394,
        };
        const foundCoords: any = {};
        const result = FN(coord, foundCoords);
        expect(result.state).toEqual('not_found');
        expect(result.request).toEqual(1);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(foundCoords['52.3864838069139-13.063328647394']).toEqual(
            undefined
        );
        expect(foundCoords['-1']).toEqual({
            id: '-1',
            address: null,
            count: 1,
        });
    });
    it('should update coord cache with cached coord', () => {
        const coord: COORD = {
            latitude: 42.3864838069139,
            longitude: 13.063328647394,
        };
        const foundCoords: any = {
            '42.3864838069139-13.063328647394': {
                address: {
                    place_id: '-0000000',
                },
                id: '42.3864838069139-13.063328647394',
                count: 1,
            },
        };
        const result = FN(coord, foundCoords);
        expect(result.state).toEqual('cached');
        expect(result.request).toEqual(0);
        expect(foundCoords['42.3864838069139-13.063328647394'].count).toEqual(
            2
        );
        expect(spy).toHaveBeenCalledTimes(0);
    });
});
