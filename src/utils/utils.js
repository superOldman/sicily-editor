function myGetTime(time) {
    let myTime = new Date(time);
    return `${myTime.getFullYear()}-${addZero(myTime.getMonth() + 1)}-${addZero(myTime.getDate())}  ${addZero(myTime.getHours())}:${addZero(myTime.getMinutes())}:${addZero(myTime.getSeconds())}`
}
function addZero(num) {
    return num >= 10 ? num : `0${num}`;
}


export { myGetTime }
