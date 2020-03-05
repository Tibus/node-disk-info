import {execSync} from 'child_process';
import {Constants} from '../utils/constants';

import Drive from '../classes/drive';

/**
 * Class with Windows specific logic to get disk info.
 */
export class Windows {

    /**
     * Execute specific Windows command to get disk info.
     *
     * @return {Drive[]} List of drives and their info.
     */
    public static run(): Drive[] {

        const drives: Drive[] = [];
        const buffer = execSync(Constants.WINDOWS_COMMAND).toString();
        const lines = buffer.split('\r\r\n');

        let newDiskIteration = false;

        let caption: string = '';
        let description: string = '';
        let freeSpace: number = 0;
        let size: number = 0;
        let driveType: number = 0;
        let volumeName: string = '';

        lines.forEach((value) => {

            if (value !== '') {

                const tokens = value.split('=');
                const section = tokens[0];
                const data = tokens[1];

                switch (section) {
                    case 'Caption':
                        caption = data;
                        newDiskIteration = true;
                        break;
                    case 'Description':
                        description = data;
                        break;
                    case 'FreeSpace':
                        freeSpace = isNaN(parseFloat(data)) ? 0 : +data;
                        break;
                    case 'Size':
                        size = isNaN(parseFloat(data)) ? 0 : +data;
                        break;
                    case 'DriveType':
                        driveType = isNaN(parseFloat(data)) ? 0 : +data;
                        break;
                    case 'VolumeName':
                        volumeName = data;
                        break;
                }

            } else {

                if (newDiskIteration) {

                    const used: number = (size - freeSpace);

                    let percent = '0%';

                    if (size > 0) {
                        percent = Math.round((used / size) * 100) + '%';
                    }

                    const d = new Drive(
                        description,
                        size,
                        used,
                        freeSpace,
                        percent,
                        caption,
                        driveType == 2,
                        volumeName);

                    drives.push(d);

                    newDiskIteration = false;
                    caption = '';
                    description = '';
                    freeSpace = 0;
                    size = 0;
                    driveType = 0;
                    volumeName = '';
                }

            }

        });

        return drives;
    }

}
