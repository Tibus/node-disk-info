import {execSync} from 'child_process';
import {Constants} from '../utils/constants';

import Drive from '../classes/drive';

/**
 * Class with Linux specific logic to get disk info.
 */
export class Linux {

    /**
     * Execute specific Linux command to get disk info.
     *
     * @return {Drive[]} List of drives and their info.
     */
    public static run(): Drive[] {

        const drives: Drive[] = [];
        const buffer = execSync(Constants.LINUX_COMMAND).toString();
        const lines = buffer.split('\n');

        lines.forEach((value) => {

            if (value !== '') {

                const line: string = value.replace(/ +(?= )/g, '');
                const tokens = line.split(' ');
                const usbMountPath = "/media/"+process.env.USER+"/";
                const mount = tokens.slice(5).join(' ');
                const isUSB = mount.startsWith(usbMountPath);
                const usbName = mount.replace(usbMountPath, "");

                const d = new Drive(
                    tokens[0],
                    isNaN(parseFloat(tokens[1])) ? 0 : +tokens[1],
                    isNaN(parseFloat(tokens[2])) ? 0 : +tokens[2],
                    isNaN(parseFloat(tokens[3])) ? 0 : +tokens[3],
                    tokens[4],
                    mount,
                    isUSB,
                    usbName);

                drives.push(d);
            }

        });

        return drives;
    }

}
