import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import * as maxmind from 'maxmind';
import { Reader } from 'maxmind';
import * as path from 'path';

@Injectable()
export class GeoService implements OnModuleInit {
    private countryReader: Reader<any>;
    private cityReader: Reader<any>;
    private asnReader: Reader<any>;

    async onModuleInit() {
        const basePath = path.join(process.cwd(), 'assets', 'maxmind');

        this.countryReader = await maxmind.open(
            path.join(basePath, 'GeoLite2-Country.mmdb'),
        );

        this.cityReader = await maxmind.open(
            path.join(basePath, 'GeoLite2-City.mmdb'),
        );

        this.asnReader = await maxmind.open(
            path.join(basePath, 'GeoLite2-ASN.mmdb'),
        );
    }

    getCountry(ip: string) {
        return this.countryReader?.get(ip);
    }

    getCity(ip: string) {
        return this.cityReader?.get(ip);
    }

    getASN(ip: string) {
        return this.asnReader?.get(ip);
    }

    getFullGeo(ip: string) {
        const country = this.getCountry(ip);
        const city = this.getCity(ip);
        const asn = this.getASN(ip);

        return {
            country: country?.country?.iso_code,
            continent: city?.continent?.names?.en,
            state: city?.subdivisions[0].iso_code,
            city: city?.city?.names?.en,
            latitude: city?.location?.latitude,
            longitude: city?.location?.longitude,
            postal_code: city?.postal?.code,
            asn: asn?.autonomous_system_number,
            organization: asn?.autonomous_system_organization,
        };
    }
}
