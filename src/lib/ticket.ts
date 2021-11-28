import timestring from 'timestring';
import humanizeDuration from 'humanize-duration';

export const mapIntToStatus = (num: number) => {
    switch (num) {
        case 0:
            return 'Todo';
        case 1:
            return 'In progress';
        case 2:
            return 'Waiting for review';
        case 3:
            return 'Done';
        default:
            return 'Todo';
    }
}

export const mapIntToPriority = (num: number) => {
    switch (num) {
        case 0:
            return 'Critical';
        case 1:
            return 'High';
        case 2:
            return 'Medium';
        case 3:
            return 'Low';
        default:
            return 'Medium'
    }
}

const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: "shortEn",
    languages: {
      shortEn: {
        y: () => "y",
        mo: () => "mth",
        w: () => "w",
        d: () => "d",
        h: () => "h",
        m: () => "m",
        s: () => "s",
        ms: () => "ms",
      },
    },
  });

export const validateTime = (rawTime: string) => {
    try {
        const time = timestring(rawTime, null, {
            hoursPerDay: 8,
            daysPerWeek: 5
        });
        if (!time) {
            return null;
        }
        return shortEnglishHumanizer(time * 1000).replaceAll(' ', '');
    } catch (err) {
        return null;
    }
}