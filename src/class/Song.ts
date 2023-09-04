export default class Song{ 
    id: number;
    br: number;  // 播放音质等级
    url: string | undefined;
    [key: string]: any; // 索引签名

    constructor(id: number, br: number, url?: string){
        this.id = id;
        this.br = br;
        this.url = url;
    }
}