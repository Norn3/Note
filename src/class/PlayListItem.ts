export default class PlayListItem{ 
    id: number;
    name: string;  // 播放音质等级
    coverImgUrl: string;
    playCount: number;
    userId: number;
    [key: string]: any; // 索引签名

    constructor(id: number, name: string, coverImgUrl: string, playCount: number, userId: number){
        this.id = id;
        this.name = name;
        this.coverImgUrl = coverImgUrl;
        this.playCount = playCount;
        this.userId = userId;
    }
}