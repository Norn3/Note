import $ from 'jquery';

export default function createLiTag($ul: JQuery<HTMLElement>, className?: string): HTMLElement {
    const $li = $('<li>');
    if(className){
        $li.addClass(className);
    }
    const li = $li[0];
    $ul.append(li);
    return li;
}