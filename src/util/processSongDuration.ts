export default function processSongDuration(data: number): string {
    const time = data / 1000;
    const minute = Math.floor(time / 60);
    const second = Math.floor(time % 60);
    const text = (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second);
    return text;
  }