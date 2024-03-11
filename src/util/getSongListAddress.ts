// 根据资源类型， 决定获取数据的地址
// 只要调整limit就可以控制每次请求的歌曲数量，offset会根据列表项的渲染，所引起的current_song_id的自增，自动变化
export const address = (type: string, target_id: string, limit?: number, offset?: number): string => {
    let addr = '';
    switch (type) {
      case 'playlist':
        {
          if(limit && offset) {
            addr = `/playlist/track/all?id=${target_id}&limit=${limit}&offset=${offset}`;
          }
          else {
            addr = `/playlist/track/all?id=${target_id}`;
          }
          break;
        }
        
      case 'album':
        {
          if(limit && offset) {
            addr = `/album?id=${target_id}&limit=${limit}&offset=${offset}`;
          }
          else {
            addr = `/album?id=${target_id}`;
          }
          break;
        }
    }
    return addr;
};