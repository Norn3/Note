export default class PlaylistItemClass{ 
    name: string;  // 播放音质等级
    coverImgUrl: string;
    id: number | undefined;
    userId: number | undefined;
    playCount: number | undefined;
    trackCount: number | undefined;
    trackIds: Array<number> | undefined;

    [key: string]: any; // 索引签名

    constructor( name: string, coverImgUrl: string, id?: number, userId?: number, playCount?: number, trackCount?: number, trackIds?: Array<number>){
        this.name = name;
        this.coverImgUrl = coverImgUrl;
        this.id = id;
        this.userId = userId;
        this.playCount = playCount;
        this.trackCount = trackCount;
        this.trackIds = trackIds;
    }
}