export default function processSingerArray(singer_list: Array<any>): string[] {
    const singers: Array<string> = [];
    singer_list.forEach((singer: any) => {
        singers.push(singer.name);
    });
    return singers;
  }