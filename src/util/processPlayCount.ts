export default function processPlayCount(data: number): string {
    let bit = '';
    if (data >= 10000) {
      data /= 10000;
      bit = '万';
      if (data >= 10000) {
        data /= 10000;
        bit = '亿';
      }
    }
    const text = bit == '' ? `${data}` : `${data?.toFixed(1)}` + bit;
    return text;
  }