const DEFAULT_TIME_LABEL = '--:--';

export function formatTime(timeInSecond: number) {
  if (isNaN(timeInSecond)) {
    return DEFAULT_TIME_LABEL;
  }

  const roundedTimeInSecond = Math.round(timeInSecond);
  const hours = Math.floor(roundedTimeInSecond / 3600);
  const minutes = Math.floor((roundedTimeInSecond - hours * 3600) / 60);
  const seconds = roundedTimeInSecond - hours * 3600 - minutes * 60;

  const textHours = hours.toString().padStart(2, '0');
  const textMinutes = minutes.toString().padStart(2, '0');
  const textSeconds = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${textHours}:${textMinutes}:${textSeconds}`;
  } else {
    return `${textMinutes}:${textSeconds}`;
  }
}
