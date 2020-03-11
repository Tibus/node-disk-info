import {execSync} from 'child_process';
import {Constants} from '../utils/constants';

import Drive from '../classes/drive';

/**
 * Class with OSX specific logic to get disk info.
 */
export class Darwin {

    /**
     * Execute specific OSX command to get disk info.
     *
     * @return {Drive[]} List of drives and their info.
     */
    public static run(): Drive[] {

        const drives: Drive[] = [];
        const buffer = execSync(Constants.DARWIN_COMMAND).toString();
        const lines = buffer.split('\n');

        lines.forEach((value, index, array) => {

            if (value !== '') {

                const line: string = value.replace(/ +(?= )/g, '');
                const tokens = line.split(' ');
                const usbMountPath = "/Volumes/";
                const mount = tokens.slice(5).join(' ');
                const isUSB = mount.startsWith(usbMountPath) && !tokens[0].startsWith("//");
                const name = mount.replace(usbMountPath, "");

                const d = new Drive(
                    tokens[0],
                    isNaN(parseFloat(tokens[1])) ? 0 : +tokens[1],
                    isNaN(parseFloat(tokens[2])) ? 0 : +tokens[2],
                    isNaN(parseFloat(tokens[3])) ? 0 : +tokens[3],
                    tokens[4],
                    mount,
                    isUSB,
                    name);

                drives.push(d);

            }

        });

        return drives;
    }

}
